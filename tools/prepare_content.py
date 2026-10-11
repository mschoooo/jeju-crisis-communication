"""Extract user-provided data, speaker notes and tables; never publish the source PDF."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = (root.parent / 'jeju_seal.md').read_text(encoding='utf-8')
data = json.loads(re.search(r'```json\s*([\s\S]*?)```', source).group(1))
blocks = re.split(r'\n# Slide ', source)[1:]
slides = []
for block in blocks:
    block = block.split('\n## C.')[0]
    title = block.splitlines()[0].split(' — ', 1)[1]
    notes = re.search(r'\*\*발표자 노트:\*\*\s*([\s\S]*?)(?=\n\*\*근거:)', block).group(1).strip()
    evidence = re.search(r'\*\*근거:\*\*\s*([^\n]+)', block).group(1).strip()
    tables = re.findall(r'(?:^\|.*\n)+', block, re.M)
    slides.append({'title': title, 'notes': notes, 'evidence': evidence, 'tables': tables})
assert len(slides) == 15
overrides = root / 'revision-meta.json'
if overrides.exists():
    for number, fields in json.loads(overrides.read_text(encoding='utf-8')).items():
        index = int(number) - 1
        if index == len(slides):
            slides.append(fields)
        else:
            slides[index].update(fields)
(root / 'content.js').write_text('window.RESEARCH_DATA = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\nwindow.SLIDE_META = ' + json.dumps(slides, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print(f'Prepared {len(slides)} speaker notes and all original table data.')
