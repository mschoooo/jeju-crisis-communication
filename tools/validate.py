"""Browser QA: content integrity, all slides, interactions, responsive and offline."""
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
QA=ROOT/'qa'
QA.mkdir(exist_ok=True)
report={'desktop':[],'mobile':[],'checks':[],'errors':[]}

with sync_playwright() as p:
    browser=p.chromium.launch()
    context=browser.new_context(viewport={'width':1920,'height':1138},device_scale_factor=1,reduced_motion='reduce')
    page=context.new_page()
    page.on('pageerror',lambda e:report['errors'].append(str(e)))
    response=page.goto('http://127.0.0.1:8765',wait_until='networkidle')
    assert response.status==200
    page.evaluate('document.fonts.ready')
    assert page.locator('.slide').count()==15
    assert page.evaluate('typeof window.anime')=='function'
    assert page.evaluate('document.fonts.check("30px Pretendard")')
    assert page.evaluate('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
    report['checks'].extend(['15 slides','anime.js loaded locally','local Korean font loaded','both historical photos loaded'])
    # Check every source-data transcription against the user-provided master JSON.
    import re
    master=(ROOT.parent/'jeju_seal.md').read_text(encoding='utf-8')
    expected=json.loads(re.search(r'```json\s*([\s\S]*?)```',master).group(1))
    assert page.evaluate('window.RESEARCH_DATA')==expected
    report['checks'].append('All table 5–11 values equal master JSON, including n and statistical tests')
    for i in range(15):
        page.evaluate('(i)=>window.deck.go(i,false)',i)
        page.wait_for_timeout(60)
        # Visible content must stay above takeaway and footer; inspect leaves for clipping.
        result=page.evaluate('''() => {
          const s=document.querySelector('.slide.active'), r=s.getBoundingClientRect();
          const leaves=[...s.querySelectorAll('h1,h2,h3,p,td,th,.segment,.event,.rq,.cross-focus,.formula')];
          const out=leaves.filter(e=>{const b=e.getBoundingClientRect();return b.left<r.left-2||b.right>r.right+2||b.top<r.top-2||b.bottom>r.bottom+2}).map(e=>e.textContent.slice(0,100));
          const takeaway=s.querySelector('.takeaway'), foot=s.querySelector('.foot');
          const content=s.querySelector('.body');
          let collision=[];
          if(content&&takeaway){const bottom=takeaway.getBoundingClientRect().top;collision=[...content.children].filter(e=>e.getBoundingClientRect().bottom>bottom+3).map(e=>e.textContent.slice(0,100));}
          if(takeaway&&takeaway.getBoundingClientRect().bottom>foot.getBoundingClientRect().top)collision.push('takeaway/footer overlap');
          return {slide:window.deck.index()+1,outOfBounds:out,collisions:collision};
        }''')
        report['desktop'].append(result)
        page.locator('#stage').screenshot(path=str(QA/f'slide-{i+1:02}.png'))
    # Interaction tests: navigation, anchors, dialogs, focus, source tables, keyboard boundaries.
    page.keyboard.press('Home'); assert page.evaluate('deck.index()')==0
    page.keyboard.press('ArrowRight'); assert page.evaluate('deck.index()')==1
    page.keyboard.press('End'); assert page.evaluate('deck.index()')==14
    page.keyboard.press('ArrowRight'); assert page.evaluate('deck.index()')==14
    page.keyboard.press('g'); assert page.locator('#panel').evaluate('(d)=>d.open')
    page.locator('[data-goto="11"]').click(); assert page.evaluate('deck.index()')==11
    page.keyboard.press('d'); assert page.locator('#panel-body table').count()==2
    assert '45 (86.5%)' in page.locator('#panel-body').inner_text()
    page.keyboard.press('Escape'); assert not page.locator('#panel').evaluate('(d)=>d.open')
    page.keyboard.press('n'); assert 'n=52' in page.locator('#panel-body').inner_text()
    page.keyboard.press('Escape')
    report['checks'].append('Keyboard, navigation boundaries, TOC, source tables, notes and Escape dialogs')
    page.set_viewport_size({'width':1366,'height':768})
    page.evaluate('deck.go(9,false)')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path=str(QA/'laptop.png'))
    report['checks'].append('1366×768 laptop fits')
    page.set_viewport_size({'width':390,'height':844})
    for i in range(15):
        page.evaluate('(i)=>deck.go(i,false)',i)
        page.wait_for_timeout(30)
        result=page.evaluate('''() => ({slide:deck.index()+1,width:document.documentElement.scrollWidth,viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1})''')
        report['mobile'].append(result)
        if i in [0,1,4,8,11,12,14]:page.screenshot(path=str(QA/f'mobile-{i+1:02}.png'),full_page=True)
    page.keyboard.press('d');page.screenshot(path=str(QA/'mobile-panel.png'));page.keyboard.press('Escape')
    # Landscape mobile is a fitted 16:9 presentation.
    page.set_viewport_size({'width':844,'height':390})
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    report['checks'].append('844×390 landscape fits')
    # File mode + network disabled ensures assets work without a CDN or a server.
    offline=browser.new_context(viewport={'width':1920,'height':1138},offline=True,reduced_motion='reduce')
    op=offline.new_page();op.goto((ROOT/'index.html').as_uri());op.evaluate('document.fonts.ready')
    assert op.locator('.slide').count()==15
    assert op.evaluate('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
    assert op.evaluate('typeof window.anime')=='function'
    op.keyboard.press('End');assert op.evaluate('deck.index()')==14
    report['checks'].append('file:// offline: local scripts, font, photos and navigation')
    # Animation enabled: final geometry and visibility after a real transition.
    animated=browser.new_context(viewport={'width':1920,'height':1138})
    ap=animated.new_page();ap.goto('http://127.0.0.1:8765/#10',wait_until='networkidle')
    ap.evaluate('deck.go(12,true)');ap.wait_for_timeout(1800)
    assert ap.evaluate('Array.from(document.querySelectorAll(".active .data-bar")).every(e=>getComputedStyle(e).opacity==="1")')
    ap.locator('#stage').screenshot(path=str(QA/'animation-final.png'))
    report['checks'].append('anime.js bar animation settles visibly; reduced-motion supported')
    browser.close()

# Contact sheet for human visual inspection. Source photos are not modified.
thumbs=[]
for i in range(1,16):
    im=Image.open(QA/f'slide-{i:02}.png').convert('RGB');im.thumbnail((576,324))
    tile=Image.new('RGB',(600,360),'#dce2e8');tile.paste(im,((600-im.width)//2,12))
    ImageDraw.Draw(tile).text((16,340),f'{i:02} / 15',fill='#142b46');thumbs.append(tile)
sheet=Image.new('RGB',(1800,1800),'#dce2e8')
for i,t in enumerate(thumbs):sheet.paste(t,((i%3)*600,(i//3)*360))
sheet.save(QA/'contact-sheet.jpg',quality=93)
(QA/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=True,indent=2))
assert not report['errors'],report['errors']
assert not any(d['outOfBounds'] or d['collisions'] for d in report['desktop']),'Desktop layout failures'
assert not any(d['overflow'] for d in report['mobile']),'Mobile overflow'
print('ALL AUTOMATED CHECKS PASSED')

