(() => {
  'use strict';
  const slides=[...document.querySelectorAll('.slide')];
  const panel=document.getElementById('panel'), body=document.getElementById('panel-body');
  let current=0, opener=null, touchStart=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:800px) and (orientation:portrait)');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
  function resize(){document.documentElement.style.setProperty('--scale',Math.min(innerWidth/1920,(innerHeight-58)/1080));}
  function go(index,animate=true){
    index=Math.max(0,Math.min(slides.length-1,index));
    slides.forEach((slide,i)=>{slide.classList.toggle('active',i===index);slide.setAttribute('aria-hidden',i!==index);slide.inert=i!==index;});
    current=index;
    document.getElementById('counter').textContent=`${String(index+1).padStart(2,'0')} / ${slides.length}`;
    document.getElementById('prev').disabled=index===0;
    document.getElementById('next').disabled=index===slides.length-1;
    document.getElementById('progress-fill').style.width=`${(index+1)/slides.length*100}%`;
    document.title=`${index+1}/${slides.length} · ${window.SLIDE_META[index].title} | 조민성`;
    if(location.hash!==`#${index+1}`)history.replaceState(null,'',`#${index+1}`);
    if(mobile.matches)scrollTo({top:0,behavior:'instant'});
    // Content remains readable if animation library is unavailable.
    if(window.anime){
      const bars=slides[index].querySelectorAll('.data-bar');
      anime.remove(bars);
      bars.forEach(el=>{el.style.transform='';el.style.opacity='1';});
      if(animate&&!reduced.matches&&!mobile.matches){
        anime({targets:slides[index].querySelector('h2,.cover-copy'),opacity:[0,1],translateY:[14,0],duration:470,easing:'easeOutCubic'});
        anime({targets:bars,scaleY:[0,1],duration:800,delay:anime.stagger(45),easing:'easeOutQuart'});
      }
    }
  }
  function mdTable(md){const lines=md.trim().split('\n').filter(l=>!/^\|\s*:?-/.test(l));return `<table><thead><tr>${lines[0].split('|').slice(1,-1).map(c=>`<th>${inline(c.trim())}</th>`).join('')}</tr></thead><tbody>${lines.slice(1).map(l=>`<tr>${l.split('|').slice(1,-1).map(c=>`<td>${inline(c.trim())}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}
  const sources=`<h3>출처</h3><ul class="source-list">
    <li>남성주·황성욱 (2013). 「웹페이지와 트위터 메시지에 나타난 이미지 회복 전략 비교연구: 제주 해군기지 건설 사례를 중심으로」. <i>방송과 커뮤니케이션</i>, 14(2), 5–40. 사용자가 제공한 「7주차 조민성 발제_황성욱, 남성주 논문.pdf」와 원논문 대조. 인쇄 쪽수를 기준으로 인용.</li>
    <li>[E1] 고경민 (2012). 「국책사업 갈등에서 지방정부의 역할: 제주해군기지 갈등 사례」. <i>분쟁해결연구</i>, 10(1), 5–36. <a href="https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001655122" target="_blank" rel="noopener">KCI 서지·초록</a></li>
    <li>[E2] 임정빈 (2012). 「국책사업 갈등관리에 관한 연구: 제주해군기지 건설사업 사례를 중심으로」. <i>한국정책연구</i>, 12(4), 519–543. <a href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE02154033" target="_blank" rel="noopener">DBpia</a> · 외부 연구는 사례 맥락 보강용이며 결과 수치의 근거가 아니다.</li>
    <li>[E3] 경향신문 (2016.02.26). <a href="https://www.khan.co.kr/article/201602261741191" target="_blank" rel="noopener">제주해군기지, 그리고 강정마을의 지난한 9년</a>. 연혁 확인에 사용. 2016년 사건을 연구 결과의 근거로 사용하지 않음.</li>
    <li>사진: OneTheHuman, <a href="https://commons.wikimedia.org/wiki/File:Gangjeong_in_2012.jpg" target="_blank" rel="noopener">강정 해안 (2012.05.02)</a>, <a href="https://commons.wikimedia.org/wiki/File:Gangjeong_Protest_at_Jeju_CCI_in_2012.jpg" target="_blank" rel="noopener">제주상공회의소 앞 반대 시위 (2012.05.01)</a>. Wikimedia Commons / Flickr. <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a>. 화면 비율에 맞춘 크롭. 역사적 사진이며 생성 이미지가 아님.</li>
  </ul><h3>로컬 실행과 라이선스</h3><p>폰트·사진·스크립트는 덱에 포함되어 오프라인 실행이 가능하다. anime.js 3.2.2(MIT), Pretendard(SIL OFL 1.1). 라이선스 전문은 assets 폴더에 수록.</p>`;
  const expoSources=`<h3>부산 엑스포 · 응용 토론 출처</h3><p>2013년 주논문의 실증 결과가 아닌 현대 사례에 대한 응용 토론이다.</p><ul><li><a href="https://archive.bie-paris.org/site/en/news-announcements/world-expo/saudi-arabia-elected-host-country-of-world-expo-2030" target="_blank" rel="noopener">BIE (2023.11.28) 공식 개최지 투표 결과</a> · 리야드119표, 부산29표, 로마17표.</li><li><a href="https://www.khan.co.kr/article/202311291703001" target="_blank" rel="noopener">경향신문 (2023.11.29), 부산엑스포 무산과 정부 예측 실패</a> · 낙관적 전망 및 책임론 맥락.</li></ul>`;
  const audits={
    7:'방법 절(p.24)의 트위터 주제 수는 197개다. 그러나 표6·8·9·10·11에는 198개가 사용된다. 각 표의 값을 그대로 유지한다. 76/117은 게시글 수이며, 153/197/198은 주제 단위 수다.',
    8:'표6의 트위터 공격성 감소는 67.2%, 전략 부재는 17.7%다. 인접 본문에는 67.5%, 27.8%로 쓰여 있다. 이 장에서는 표6을 따른다. 표5의 웹 n=153과 표6의 트위터 n=198은 수집 기간이 다른 전체 분포다. 표시 퍼센트의 반올림 합이 100.1%가 될 수 있다.',
    9:'표7의 매체별 행은 웹 [1,17,5,26], 트위터 [35,17,12,133]이다. 합산하면 전략 부재는 36건이지만 원문 합계행은 39(14.6%)로 인쇄되어 있다. 차트에는 매체별 행만 사용했다. 36은 산술 합산값이며 원문 합계행의 정정값으로 제시하지 않는다. 수정행위를 제외한 표본: 웹49, 트위터197. 검정치는 원문을 그대로 옮겼으며 재추정하지 않았다.',
    10:'본문 n=122와 링크 n=76은 주제 단위다. 링크의 원문 비율 합은 반올림 때문에 99.9%다. 클릭 경로 도식은 메시지 구조의 설명이며 이용자가 실제로 클릭했다는 관찰은 아니다.',
    11:'표9의 웹 n=52는 표5의 전체 웹 n=153과 다르다. 표10의 트위터 본문 감성 비율은 64.8%이며, 본문 p.30의 64.7%와 불일치한다. 이 덱은 표10을 따른다. 표9·10의 모든 빈도와 합계는 아래 표에 보존한다.',
    12:'표11의 97(86.6%)는 트위터 감성 112건 중 공격성 감소 97건이라는 행 비중이다. 이 덱의 97/133≈72.9%는 공격성 감소 133건 중 감성 비중으로, 별도 계산한 파생 지표다. 분모가 다르다. 차트 단위는 백분율이 아닌 코딩된 주제 수(건)다.',
    13:'저자의 매체 특성에 관한 설명은 해석 및 제언이다. 내용분석만으로 매체 유형의 독립적 인과효과를 확정할 수 없다는 점은 발제자의 비평으로 표시했다.',
    14:'원문의 한계: 단일 사례, 이미지·영상 제외, 공중의 인지·태도·행동 변화에 관한 효과 검증 부재. 상대적 순응을 정책 수용으로 해석하지 않는다.'
  };
  function openPanel(kind){
    opener=document.activeElement;
    let title='',content='';
    const meta=window.SLIDE_META[current];
    if(kind==='notes'){
      title=`${String(current+1).padStart(2,'0')} · 발표자 노트`;
      // Keep presentation instructions out of spoken content.
      const clean=meta.notes.replace('이 슬라이드 이후 별도의 방법론 슬라이드는 만들지 말 것. ','').replace('상세는 검증 메모.','').replace('그 비교는 다음 장.','');
      content=`<h3>${esc(meta.title)}</h3><p>${inline(clean)}</p><p class="small">근거 · ${esc(meta.evidence)}</p>${audits[current]?`<div class="audit"><b>수치·해석 주의사항</b><br>${esc(audits[current])}</div>`:''}`;
      if(current===10)content+='<h3>전략별 건수·비중 · 원문 표8</h3>'+meta.tables.map(mdTable).join('');
    }else if(kind==='data'){
      title=`${String(current+1).padStart(2,'0')} · 원자료와 출처`;
      content=`${current===15?expoSources:''}<p><b>해당 슬라이드 근거</b> · ${esc(meta.evidence)}</p>${audits[current]?`<div class="audit">${esc(audits[current])}</div>`:''}${meta.tables.length?'<h3>원고에 수록된 표</h3>'+meta.tables.map(mdTable).join(''):'<p>이 슬라이드는 개념·맥락·논의를 요약한다. 수치가 있는 원표는 결과 슬라이드의 원자료 패널에서 확인할 수 있다.</p>'}${sources}`;
    }else if(kind==='contents'){
      title=`발표 목차 · ${slides.length}장`;
      content=`<div class="toc">${window.SLIDE_META.map((m,i)=>`<button data-goto="${i}" aria-current="${i===current}"><span>${String(i+1).padStart(2,'0')}</span>${esc(m.title)}</button>`).join('')}</div>`;
    }else{
      title='발표 도구 사용법';
      content=`<div class="help-grid"><kbd>← / →</kbd><span>이전 / 다음 슬라이드</span><kbd>Space</kbd><span>다음 슬라이드 · Shift+Space는 이전</span><kbd>Home / End</kbd><span>첫 장 / 마지막 장</span><kbd>G</kbd><span>목차</span><kbd>N</kbd><span>발표자 노트</span><kbd>D</kbd><span>원자료·수치 주의사항·출처</span><kbd>F</kbd><span>전체 화면</span><kbd>Esc</kbd><span>열린 패널 닫기</span><kbd>좌우 스와이프</kbd><span>터치 화면에서 슬라이드 이동</span></div><h3>인쇄 · 오프라인</h3><p>브라우저의 인쇄 기능에서 배경 그래픽을 켜면 16:9 슬라이드 16장을 인쇄할 수 있습니다. 인터넷 없이 폴더의 index.html을 열어 사용할 수 있습니다. 세로 모바일 화면에서는 읽기 편한 문서형 배치로 전환됩니다.</p><p>움직임 줄이기 설정을 존중하며, 발표 노트와 원자료 패널은 인쇄되지 않습니다.</p>`;
    }
    document.getElementById('panel-title').textContent=title;body.innerHTML=content;panel.showModal();panel.scrollTop=0;document.getElementById('close-panel').focus();
  }
  function closePanel(){panel.close();opener?.focus();}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{openPanel('help');}}
  document.getElementById('prev').onclick=()=>go(current-1);
  document.getElementById('next').onclick=()=>go(current+1);
  ['notes','data','contents','help'].forEach(id=>document.getElementById(id).onclick=()=>openPanel(id));
  document.getElementById('fullscreen').onclick=fullscreen;
  document.getElementById('close-panel').onclick=closePanel;
  panel.addEventListener('click',e=>{const button=e.target.closest('[data-goto]');if(button){closePanel();go(Number(button.dataset.goto));}if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePanel();}});
  document.addEventListener('keydown',e=>{
    if(panel.open)return;
    if(e.altKey||e.ctrlKey||e.metaKey||e.target.matches('input,textarea,select'))return;
    if(e.key===' '&&e.target.closest('button,a'))return;
    const key=e.key.toLowerCase();
    if(['arrowright','pagedown',' '].includes(key)){e.preventDefault();go(current+(e.shiftKey?-1:1));}
    else if(['arrowleft','pageup'].includes(key)){e.preventDefault();go(current-1);}
    else if(key==='home'){e.preventDefault();go(0);}else if(key==='end'){e.preventDefault();go(slides.length-1);}
    else if(key==='g')openPanel('contents');else if(key==='n')openPanel('notes');else if(key==='d')openPanel('data');else if(key==='f')fullscreen();else if(key==='?')openPanel('help');
  });
  document.getElementById('viewport').addEventListener('touchstart',e=>{touchStart=[e.changedTouches[0].clientX,e.changedTouches[0].clientY];},{passive:true});
  document.getElementById('viewport').addEventListener('touchend',e=>{if(!touchStart||panel.open)return;let dx=e.changedTouches[0].clientX-touchStart[0],dy=e.changedTouches[0].clientY-touchStart[1];if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.6)go(current+(dx<0?1:-1));touchStart=null;},{passive:true});
  window.addEventListener('resize',resize);
  window.addEventListener('hashchange',()=>{const n=Number(location.hash.slice(1));if(Number.isInteger(n)&&n>=1&&n<=slides.length)go(n-1);});
  window.addEventListener('beforeprint',()=>{document.querySelectorAll('.slide').forEach(s=>s.inert=false);document.querySelectorAll('.data-bar').forEach(el=>{if(window.anime)anime.remove(el);el.style.transform='none';});});
  window.addEventListener('afterprint',()=>go(current,false));
  resize();const initial=Number(location.hash.slice(1));go(Number.isInteger(initial)&&initial>=1&&initial<=slides.length?initial-1:0,false);
  window.deck={go,index:()=>current,total:slides.length};
})();
