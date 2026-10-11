"""Export the current HTML deck to a vector/text PDF and render all pages for QA."""
from pathlib import Path
import pymupdf
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
out=root.parent/'output/pdf'
out.mkdir(parents=True,exist_ok=True)
qa=root/'qa/pdf-revised'
qa.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={'width':1920,'height':1138},reduced_motion='reduce')
    page.goto((root/'index.html').as_uri(),wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    count=page.locator('.slide').count()
    assert count==16
    assert page.evaluate('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
    path=out/f'jeju-crisis-communication-{count}-slides.pdf'
    page.pdf(path=str(path),print_background=True,prefer_css_page_size=True,display_header_footer=False)
    browser.close()
doc=pymupdf.open(path)
assert len(doc)==count
sheet=Image.new('RGB',(1800,2160),'#dce2e8')
for i,page in enumerate(doc):
    assert abs(page.rect.width/page.rect.height-16/9)<.001
    assert len(page.get_text().strip())>100
    assert f'{i+1:02} / 16' in page.get_text()
    pix=page.get_pixmap(matrix=pymupdf.Matrix(.4,.4),alpha=False)
    im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
    tile=Image.new('RGB',(600,360),'#dce2e8')
    tile.paste(im,((600-im.width)//2,5))
    ImageDraw.Draw(tile).text((15,340),str(i+1),fill='#142b46')
    sheet.paste(tile,((i%3)*600,(i//3)*360))
    if i in [4,7,10,13,14,15]:
        page.get_pixmap(matrix=pymupdf.Matrix(1,1),alpha=False).save(str(qa/f'page-{i+1}.png'))
sheet.save(qa/'contact-sheet.jpg',quality=94)
assert '부산' in doc[15].get_text()
assert 'Q1' not in doc[14].get_text()
print(f'PDF verified: {count} pages, 16:9, selectable text, numbered correctly. {path.stat().st_size} bytes')
