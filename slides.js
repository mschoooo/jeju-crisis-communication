/* Editable figures are drawn directly from the transcribed source data. */
(() => {
  const D = window.RESEARCH_DATA;
  const navy = '#142b46', orange = '#cf653d';
  const strategyColors = ['#dce2e8',navy,'#81909f',orange,'#b7bec7'];
  const cats = D.categories;
  const credit = (kind) => kind === 'coast'
    ? `<a href="https://commons.wikimedia.org/wiki/File:Gangjeong_in_2012.jpg" target="_blank" rel="noopener">OneTheHuman · 강정 해안 · 2012.05.02</a><br><a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a> · 화면 비율에 맞춰 크롭`
    : `<a href="https://commons.wikimedia.org/wiki/File:Gangjeong_Protest_at_Jeju_CCI_in_2012.jpg" target="_blank" rel="noopener">OneTheHuman · 제주상공회의소 앞 반대 시위 · 2012.05.01</a><br><a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a> · 화면 비율에 맞춰 크롭`;
  const legend = (labels, colors) => `<div class="legend">${labels.map((l,i)=>`<span><i class="swatch" style="--c:${colors[i]}"></i>${l}</span>`).join('')}</div>`;
  const table = (head, rows, cls='') => `<table class="data-table ${cls}"><thead><tr>${head.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i===0?`<td>${c}</td>`:`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const stack = (name,n,pct,labels,colors) => `<div class="stack-row"><div class="stack-name">${name}<small>n = ${n} 주제</small></div><div class="stack" role="img" aria-label="${name}, ${labels.map((l,i)=>l+' '+pct[i]+'%').join(', ')}">${pct.map((p,i)=>`<div class="segment ${i===0&&colors.length>2?'light':''}" style="--c:${colors[i]};width:${p}%" title="${labels[i]} ${p.toFixed(1)}%">${p>=8?`${p.toFixed(1)}%`:''}</div>`).join('')}</div></div>`;
  const scale = () => `<div class="stack-scale" aria-hidden="true"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>`;
  function grouped(labels, a, b, names, max=100, pct=true, compact=false) {
    const w=compact?795:1140,h=compact?385:525,left=65,right=25,top=45,bottom=65;
    const ph=h-top-bottom,pw=w-left-right,step=pw/labels.length,bw=compact?35:65;
    let s=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${labels.map((l,i)=>`${l}: ${names[0]} ${a[i]}${pct?'%':'건'}, ${names[1]} ${b[i]}${pct?'%':'건'}`).join('; ')}"><title>${names.join(' / ')} 비교</title>`;
    for(let v=0;v<=max;v+=max/4){let y=top+ph*(1-v/max);s+=`<line class="gridline" x1="${left}" x2="${w-right}" y1="${y}" y2="${y}"/><text class="tick" x="${left-13}" y="${y+8}" font-size="${compact?20:24}" text-anchor="end">${v}${pct?'%':''}</text>`;}
    labels.forEach((l,i)=>{let cx=left+step*(i+.5);[a,b].forEach((arr,j)=>{let v=arr[i],bh=ph*v/max,x=cx+(j===0?-bw-4:4),y=top+ph-bh;s+=`<rect class="data-bar" x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${j===0?navy:orange}"/><text class='value-label' x="${x+bw/2}" y="${y-11}" font-size="${compact?23:27}" font-weight="650" text-anchor="middle">${pct?v.toFixed(1):v}</text>`;});s+=`<text x="${cx}" y="${h-25}" font-size="${compact?21:26}" text-anchor="middle">${l}</text>`;});
    return s+'</svg>';
  }
  function slide(n,section,title,subtitle,body,takeaway,cls='') {
    return `<section class="slide ${cls}" id="slide-${n}" aria-label="${n} / 16 ${title.replace(/<[^>]*>/g,'')}" data-title="${window.SLIDE_META[n-1].title}">
      <div class="eyebrow"><span>${section}</span><span>JEJU NAVAL BASE · CRISIS COMMUNICATION</span></div>
      <h2>${title}</h2>${subtitle?`<p class="subtitle">${subtitle}</p>`:''}<div class="body">${body}</div>
      <p class="takeaway">${takeaway}</p><footer class="foot"><span>${window.SLIDE_META[n-1].evidence}</span><span class="num">${String(n).padStart(2,'0')} / 16</span></footer></section>`;
  }
  const html=[];
  html.push(`<section class="slide cover" id="slide-1" aria-label="1 / 16 표지" data-title="표지">
    <div class="eyebrow"><span>위기 커뮤니케이션 · 논문 발제</span><span>2013 RESEARCH</span></div>
    <div class="cover-copy"><h1><span>웹페이지와 트위터 메시지에 나타난</span>이미지 회복 전략<br>비교연구</h1><p class="cover-sub">제주 해군기지 건설 사례를 중심으로</p>
    <p class="cover-meta">남성주·황성욱 (2013)<br>『방송과 커뮤니케이션』 14권 2호<br>발제 · 조민성</p>
    <p class="cover-question">같은 위기에서도 매체가 달라지면<br>조직의 대응 메시지는 달라지는가?</p></div>
    <img class="cover-image" src="assets/gangjeong-2012.jpg" alt="2012년 5월 2일 제주 해군기지 완공 이전 강정 해안의 풍경"><div class="image-shade"></div><div class="photo-credit">${credit('coast')}</div>
    <footer class="foot"><span>주논문 표지·초록 · 메시지 내용분석 연구</span><span class="num">01 / 16</span></footer></section>`);
  html.push(slide(2,'01 / 사건 맥락','제주 해군기지 건설을 둘러싼 갈등','안보 · 의사결정 절차 · 환경 · 평화 정체성이 교차한 공공갈등',`
    <div class="case-grid"><div><img class="case-photo" src="assets/protest-2012.jpg" alt="2012년 5월 1일 제주상공회의소 앞 제주 해군기지 건설 반대 시위"><p class="note">${credit('protest')}</p></div><div><div class="case-arguments"><div class="rule-top"><h3>사업 추진 측</h3><p>남방 해역 해양안보<br>군항 확보<br>민군복합형 관광미항을 통한 지역발전 기대</p></div><div class="rule-top orange-rule"><h3>반대 측</h3><p>주민 의견 수렴·절차 문제<br>환경 훼손 우려<br>제주의 평화 정체성과 긴장</p></div></div><p class="stakeholders"><b>갈등 주체</b> 해군·국방부·정부 ↔ 반대 주민·시민사회<br><b>메시지 수용자</b> 일반 국민·독자<br><span class="small">외부 연구: 중앙정부·주민 사이 지방정부의 역할에도 주목 [E1·E2].</span></p></div></div>
    <div class="timeline">${[['1993','해군기지 소요 제기'],['2007','강정 후보지 선정<br>주민 갈등 본격화'],['2010','항만 공사 착수'],['2012.03','구럼비 발파<br>충돌 확대'],['2012.07','건설 승인 적법 판단<br><small>메시지 수집 이후</small>'],['2016.02','준공식<br><small>연구 이후 참고</small>']].map((e,i)=>`<div class="event ${i>=4?'after':''}"><strong>${e[0]}</strong><p>${e[1]}</p></div>`).join('')}</div>`,
    '분석한 메시지는 <em>2012년 6월까지</em>다. 법적 판단을 사회적 갈등의 종료와 동일시할 수 없다.'));
  html.push(slide(3,'02 / 문제 제기','왜 매체를 비교하는가?','동일한 위기에서 이미지 회복 전략과 소구유형을 함께 비교',`
    <div class="research-flow"><div class="flow-old"><div class="label">기존 연구의 주된 접근</div><h3>특정 조직과 위기사례</h3><p>사용한 이미지 회복 전략을 주로 분석</p><p class="research-gap">온라인 매체는 정보량, 상호작용 속도,<br>확산 방식과 이용 목적이 다르다.</p></div><div class="flow-new"><div class="label">이 연구의 비교 설계</div><h3>동일 위기 · 제주 해군기지</h3><div class="flow-pair"><div class="flow-node navy">공식 웹페이지</div><div class="flow-node orange">트위터</div></div><div class="flow-arrow">↓</div><div class="flow-bottom">이미지 회복 전략 <span class="orange">×</span> 소구유형</div><p class="small" style="margin-top:18px">서로 다른 매체의 전략과 소구유형을 함께 비교</p></div></div>
    <p class="stat">연구 공백 · 같은 사건에서 두 매체의 전략과 소구를 결합해 비교한 연구가 부족했다.</p>`,
    '위기 대응에서는 <em>무슨 말을 하는가</em>와 함께 <em>어떤 매체에서 말하는가</em>를 살펴야 한다.'));
  html.push(slide(4,'03 / 매체의 특성','공식 웹페이지와 2012년의 트위터','원문 표1 재구성 · 선행연구가 제시한 상대적 특성',`
    ${table(['비교 차원','공식 웹페이지','2012년 트위터'],[
      ['정보량','텍스트·이미지·오디오·동영상 등<br>다양한 형식','당시 <b class="orange">140자</b> 텍스트 중심<br>링크로 정보 확장'],
      ['상호작용','기능 구현은 가능하나<br>상대적으로 느리고 빈도가 낮음','멘션·리트윗·DM 등<br>빠르고 빈번한 상호작용'],
      ['정보 확산','이용자의 능동적 방문 중심<br>상대적으로 제한적','팔로잉·리트윗의<br>네트워크를 따라 확산'],
      ['PR 활용 목적','공식 정보 제공과 입장 표명<br>조직 PR의 중심 채널','소통·관계관리 중심<br>상대적으로 보조 채널']])}
    <div class="two" style="margin-top:27px"><p><b>웹페이지</b> · 공식성 / 설명 / 이성</p><p class="orange"><b>트위터</b> · 즉시성 / 확산 / 감성</p></div><p class="note">140자는 연구 당시 기술적 조건이다. 현재의 X 환경에 그대로 적용하지 않는다.</p>`,
    '웹페이지는 <em>공식 정보 제공</em>, 트위터는 <em>빠른 상호작용과 관계관리</em>의 채널로 개념화됐다.'));
  html.push(slide(5,'04 / 이론 ①','베노이트의 이미지 회복 전략','5대전략 · 14하위전략과 실제 메시지의 코딩 사례',`
    <div class="theory-intro"><p>조직은 실제 사실뿐 아니라 <b>공중이 믿는 책임과 평가</b>에도 대응한다.</p></div>
    <div class="theory-with-examples"><div>${table(['대전략','하위 전략','핵심 대응'],[
      ['부인 · 2','단순 부인 · 책임 전가','행위·책임을 부인'],
      ['책임성의 회피 · 4','도발 · 불가피성<br>사고 · 좋은 의도','책임 정도를 줄임'],
      ['공격성의 감소 · 6','강화 · 최소화 · 차별화<br>초월 · 비난자 공격 · 보상','부정적 평가를 완화'],
      ['수정행위 · 1','수정행위','해결·재발 방지 계획'],
      ['굴욕 · 1','굴욕 / 사과','잘못·책임 인정, 사과']],'theory-table')}</div>
      <aside class="coding-examples" aria-label="전략별 코딩 사례"><h3>전략별 코딩 사례<br><span>논문 표3 · 의미 요약</span></h3>
        <p><b>부인</b>해군은 공사를 일시 중단하겠다고 언급한 사실이 없다고 밝힘.</p>
        <p><b>공격성 감소</b>붉은발말똥게 이식에 관한 반대 측 주장을 ‘허위’라고 반박.</p>
        <p><b>수정행위</b>국방부는 검토 결과 보완할 사항이 있다면 적극 반영할 방침이라고 밝힘.</p>
      </aside></div>`,
    '‘공격성 감소’는 <em>비난·부정적 인식을 완화하는 수사</em>다. 사례는 발신자의 주장을 요약한 것이다.'));
  html.push(slide(6,'05 / 이론 ②','소구유형: 이성과 감성','이미지 회복 전략과 별도로 코딩하는 설득의 표현 방식',`
    <div class="two"><div class="appeal-def rule-top"><div class="label">RATIONAL APPEAL</div><h3>이성적 소구</h3><p class="definition">구체적인 정보와 인과관계로 설명</p><p>사실 · 절차 · 수치 · 논거</p><div class="example"><span class="small">논문 표4 예시의 의미 요약</span><br>환경영향평가서에 보존·저감책이 있음을 들어 사실관계를 반박</div></div><div class="appeal-def rule-top orange-rule"><div class="label">EMOTIONAL APPEAL</div><h3 class="orange">감성적 소구</h3><p class="definition">이미지와 정서로 연민·공감을 환기</p><p>미래 이미지 · 정서적 공감 · 기대</p><div class="example"><span class="small">논문 표4 예시의 의미 요약</span><br>벚꽃·유채꽃과 어우러진 해군기지의 아름다운 미래를 기대하도록 묘사</div></div></div>
    <div class="formula"><span>매체 유형</span><span>→</span><b>주장 내용 <span class="orange">×</span> 설득 표현</b><span class="small">전략 × 소구</span></div>`,
    '같은 이미지 회복 전략도 <em>이성적 또는 감성적 소구</em>로 표현할 수 있다.'));
  html.push(slide(7,'06 / 연구문제','무엇을 비교했는가?','탐색적 내용분석을 이끄는 네 가지 연구문제',`
    <div class="rq-list">${[
      ['RQ1','전략 사용 실태','RQ1-1 웹페이지 / RQ1-2 트위터<br>각 매체에서 주로 사용한 전략은 무엇인가?','9','결과 09'],
      ['RQ2','전략 분포의 차이','RQ2-1 동일 기간 웹페이지 ↔ 트위터<br>RQ2-2 트위터 본문 ↔ 링크 내부','10','결과 10–11'],
      ['RQ3','소구유형의 차이','RQ3-1 웹페이지 ↔ 트위터<br>RQ3-2 트위터 본문 ↔ 링크 내부','12','결과 12'],
      ['RQ4','전략 × 소구유형','각 매체의 이미지 회복 전략은<br>어떤 소구유형과 결합하는가?','13','결과 13']
    ].map(r=>`<div class="rq"><div class="rq-number">${r[0]}</div><a class="jump" href="#${r[3]}">${r[4]} ↗</a><h3>${r[1]}</h3><p>${r[2]}</p></div>`).join('')}</div>`,
    '분포를 살핀 뒤 <em>매체 간 차이 → 링크의 역할 → 전략과 소구의 결합</em>을 분석한다.'));
  html.push(slide(8,'07 / 연구방법','게시글이 아닌 ‘주제’를 분석 단위로','양적 내용분석 · 웹페이지 ‘사실은 이렇습니다’ / 트위터 @thejejuNbase',`
    <div class="method-pipeline"><div><h3><strong>76</strong> 웹 게시글<br><strong class="orange">117</strong> 트위터 포스팅</h3><p>원자료 수집</p></div><span class="arrow">→</span><div><h3>주제 추출</h3><p>의미가 일관된<br>메시지 부분 · theme</p></div><span class="arrow">→</span><div><h3>전략 · 소구 코딩</h3><p>5대전략 + 전략 부재<br>14하위전략 / 이성·감성<br>매체 / 본문·링크 구분</p></div><span class="arrow">→</span><div><h3>매체 간 비교</h3><p>교차분석<br>카이제곱 검정<br>SPSS 18.0</p></div></div>
    <p class="theme-explanation">하나의 게시글에 서로 다른 주장이 포함되면 <b>각각을 별도 주제로 코딩</b>할 수 있다.</p><div class="method-details"><div><h3>자료 수집 기간</h3><p><b>웹페이지</b><br>2010.03.20–2012.06.12<br><b>트위터</b><br>2012.03.12–2012.06.12</p></div><div><h3>코딩 단위와 표본</h3><p>방법 절: 웹 153 · 트위터 197 주제<br>여러 결과 표: 트위터 198 주제<br><b>각 표의 n을 개별적으로 유지</b></p></div><div><h3>Cohen’s κ</h3><div class="kappa">.98 <span class="small">전략</span><br>.85 <span class="small">소구</span></div><p class="note">전체의 10%로 공동 코딩 훈련</p></div></div>`,
    '이후 차트의 ‘건’과 n은 <em>코딩된 주제·메시지 단위</em>이며 게시글 수가 아니다.'));
  const allWeb=D.table5_web_all, allTw=D.table6_twitter_all;
  html.push(slide(9,'08 / 관찰 결과 · RQ1','두 매체 모두 ‘공격성 감소’가 가장 많았다','각 매체 전체 분포 · 웹페이지와 트위터의 수집 기간은 서로 다름',`
    ${legend(cats,strategyColors)}${stack('웹페이지 전체',153,allWeb.pct,cats,strategyColors)}${stack('트위터 전체',198,allTw.pct,cats,strategyColors)}${scale()}
    ${table(['구분',...cats,'굴욕 / 사과'],[['웹 · n=153',...allWeb.counts.map((c,i)=>`${c}건<br>(${allWeb.pct[i].toFixed(1)}%)`),'0건<br>(0%)'],['트위터 · n=198',...allTw.counts.map((c,i)=>`${c}건<br>(${allTw.pct[i].toFixed(1)}%)`),'0건<br>(0%)']],'compact distribution-table')}
    <p class="note">표6 기준 67.2%·17.7%를 사용. 방법 절의 n=197 및 본문의 67.5%·27.8%와 불일치한다.</p>`,
    '공격성 감소는 웹 <em>49.0%</em>, 트위터 <em>67.2%</em>. 웹은 부인·책임회피에 상대적으로 더 의존했다.'));
  const same=D.table7_same_period;
  html.push(slide(10,'09 / 관찰 결과 · RQ2-1','같은 기간에도 전략 분포는 달랐다','동일 기간 비교 · 수정행위를 제외한 웹 n=49 / 트위터 n=197',`
    <div class="chart-layout"><div>${legend(['웹페이지','트위터'],[navy,orange])}${grouped(['전략 부재','부인','책임성 회피','공격성 감소'],same.web.pct,same.twitter.pct,['웹페이지','트위터'])}</div><aside class="chart-aside"><div class="label">부인 전략의 비중</div><div class="metric-line"><span class="big">34.7<small>%</small></span></div><p class="small">웹페이지 · 트위터는 8.6%</p><h3>트위터의 공격성 감소</h3><div class="metric-line" style="margin-top:15px"><span class="big orange">67.5<small>%</small></span></div><p class="small">웹페이지는 53.1%</p><p class="test-label">χ²(3) = 28.15<br>p &lt; .001</p></aside></div>
    <p class="note">원문 검정치. 수정행위는 낮은 빈도로 제외. 표7의 불일치한 합계행은 차트에 사용하지 않았다.</p>`,
    '매체별 <em>전략 분포의 유의한 차이</em>가 관찰됐다. 절대 건수가 아닌 매체 내부 비중의 비교다.'));
  const link=D.table8_twitter_text_vs_link;
  html.push(slide(11,'10 / 관찰 결과 · RQ2-2','링크 내부에는 방어적 논리가 더 많았다','트위터 본문 n=122 / 링크 내부 n=76 · 원문 표8',`
    <div class="tweet-link"><div class="message-sheet"><div class="label">직접 메시지 · 트위터 본문</div><h3>짧은 첫 접점</h3><p>부인 4.1% · 책임성 회피 2.5%</p></div><div class="arrow">→</div><div class="message-sheet"><div class="label">클릭 이후 · 링크 내부</div><h3>상세한 입장 설명</h3><p>부인 <b class="orange">15.8%</b> · 책임성 회피 <b class="orange">11.8%</b></p></div></div>
    ${legend(cats,strategyColors)}${stack('트위터 본문',122,link.text.pct,cats,strategyColors)}${stack('링크 내부',76,link.link.pct,cats,strategyColors)}${scale()}
    <div class="link-totals" style="margin-top:20px"><span>χ²(4) = 31.69, p &lt; .001</span><span>수정행위: 본문 0% / 링크 1.3%</span></div><p class="note">실제 링크 클릭·수용 효과는 측정하지 않았다.</p>`,
    '<em>저자 해석</em> · 링크 메시지는 직접 트윗보다 웹페이지적인 성격을 나타낸다.'));
  const appeal=D.table9_appeal_web_twitter, appealLink=D.table10_appeal_twitter_text_link;
  html.push(slide(12,'11 / 관찰 결과 · RQ3','웹페이지는 이성, 트위터 본문은 감성이 우세','위기 정점 이후 비교 자료 · 매체 간 비교와 트위터 내부 비교 · 표9·10',`
    ${legend(['이성적 소구','감성적 소구'],[navy,orange])}
    <div class="appeal-group"><div class="appeal-heading"><h3>RQ3-1 · 매체 간 비교</h3><span>χ²(1) = 30.68, p &lt; .001</span></div>${stack('웹페이지',52,appeal.web.pct,['이성','감성'],[navy,orange])}${stack('트위터 전체',198,appeal.twitter.pct,['이성','감성'],[navy,orange])}</div>
    <div class="appeal-group"><div class="appeal-heading"><h3>RQ3-2 · 트위터 내부 비교</h3><span>χ²(1) = 8.674, p &lt; .01</span></div>${stack('트위터 본문',122,appealLink.text.pct,['이성','감성'],[navy,orange])}${stack('링크 메시지',76,appealLink.link.pct,['이성','감성'],[navy,orange])}</div>${scale()}
    <p class="note">웹 전체 전략 분석: <b>153개 주제</b> (표5) / 웹 소구유형 비교: <b>52개 주제</b> (표9)</p>`,
    '트위터 안에서도 <em>본문의 감성적 접근</em>과 <em>링크의 이성적 설명</em>은 구분된다.'));
  const cross=D.table11_strategy_by_appeal;
  html.push(slide(13,'12 / 관찰 결과 · RQ4','트위터 ‘공격성 감소 × 감성’의 강한 결합','전략별 이성·감성 건수 · 비교를 위해 두 패널 모두 0–100건 축 사용',`
    ${legend(['이성적 소구','감성적 소구'],[navy,orange])}<div class="two"><div class="chart-panel"><h3>웹페이지 · n=52 주제</h3>${grouped(['전략 부재','부인','책임 회피','공격성 감소','수정행위'],cross.web_rational,cross.web_emotional,['이성','감성'],100,false,true)}</div><div class="chart-panel"><h3>트위터 · n=198 주제</h3>${grouped(['전략 부재','부인','책임 회피','공격성 감소','수정행위'],cross.twitter_rational,cross.twitter_emotional,['이성','감성'],100,false,true)}</div></div>
    <div class="cross-focus"><span class="big"><span class="orange">97</span> <small>감성</small> / 36 <small>이성</small></span><p>트위터의 공격성 감소 133건 중 감성 97건<br><b>72.9%</b> = 97/133 · 별도 계산한 파생 지표</p></div><p class="note">원문 표11의 86.6%는 ‘트위터 감성 112건 중 공격성 감소 97건’의 비중이다. 분모가 다르다.</p>`,
    '트위터는 대부분의 전략에서 이성이 우세하지만, <em>공격성 감소는 감성 97건 대 이성 36건</em>이다.'));
  html.push(slide(14,'13 / 해석과 함의','수사적 완화와 실질적 공중 수용의 구별','관찰 결과 / 연구자 해석 / 발제자 비평',`
    <div class="interpret"><div class="interpret-column"><div class="label">01 · 관찰 결과</div><h3>매체별 분포 차이</h3>
      <p><b>웹페이지</b><br>상대적으로 부인·책임 회피가 많음<br>이성적 소구 우세</p>
      <p><b>트위터</b><br>공격성 감소·감성적 소구 두드러짐</p>
      <p><b>링크 내부</b><br>상대적으로 이성적·방어적</p></div>
    <div class="interpret-column"><div class="label">02 · 연구자의 해석</div><h3>상대적 공중 순응</h3>
      <ul class="interpret-points"><li>트위터: 웹보다 <b>상대적 공중 순응</b></li><li>분포 차이: 정책 철회 제약·매체 특성<br><span class="small">웹의 공식성 / 트위터의 상호작용·확산</span></li><li>링크: 단문의 제약 보완</li></ul></div>
    <div class="interpret-column"><div class="label">03 · 발제자의 비평</div><h3>수사 ≠ 정책·행동 변화</h3>
      <p><b>공격성 감소</b><br>부정적 평가·비난 완화<br>비난자 공격·최소화·초월 등<br><b>조직 옹호 전략도 포함</b></p>
      <p><b>실질적 공중 수용</b><br>공중의 요구를 반영한<br>정책·행동 변화</p>
      </div></div>
    <div class="caution"><b>실무 제언</b> · 매체별 차별화 / 링크로 균형 / 위기 이전 관계관리<br><b>인과 추론의 경계</b> · 매체·전략의 연관성 ≠ 매체 자체의 인과효과</div>`,
    '공격성 감소의 높은 비중을 <em>실제 주민 요구의 수용이나 정책 변화</em>로 해석해서는 안 된다.'));
  html.push(slide(15,'14 / 결론과 연구의 한계','매체별 메시지의 차이와 남은 질문','관찰한 것은 전략·소구의 분포 차이이며, 이미지 회복 효과는 직접 검증하지 않았다.',`
    <div class="conclusions"><div><span>01 · 웹페이지</span><p>부인·책임 회피와 이성적 소구가 상대적으로 많이 관찰됐다.</p></div><div><span>02 · 트위터와 링크</span><p>트위터는 공격성 감소·감성적 소구, 링크는 상대적으로 이성적·방어적인 메시지가 두드러졌다.</p></div><div><span>03 · 메시지 조합</span><p>위기 커뮤니케이션은 매체에 따른 전략과 소구 방식의 조합을 고려해야 한다.</p></div></div>
    <div class="limit-columns"><div><h3>단일 사례</h3><p>해군·제주 해군기지 사례로<br>일반화의 범위가 제한된다.</p></div><div><h3>텍스트 중심 분석</h3><p>이미지·영상의 메시지는<br>분석에 포함하지 않았다.</p></div><div><h3>수용자 효과 미검증</h3><p>인지·태도·행동 변화와<br>실제 이미지 회복을 검증하지 않았다.</p></div></div>`,
    '메시지는 달랐다. <em>이미지는 실제로 회복되었는가?</em>','closing'));
  html.push(slide(16,'15 / 응용 토론 · 논문의 실증 결과와 구별','매체의 특성에 따른 이미지 회복 전략','사례 · 2030 부산 엑스포 유치 실패',`
    <p class="expo-context">2023년 부산은 2030 세계박람회 유치에 실패했다. 낙관적 전망과 달리 큰 표 차로 탈락하면서<br>유치 전략과 기대 관리에 대한 책임론이 제기되었다. <b>부산 29표 · 리야드 119표</b></p>
    <div class="expo-role"><b>상황 설정</b> · 여러분은 유치 실패 직후 <b>부산시 위기관리 PR팀</b>이다.<br>부산시의 책임 범위와 통제하기 어려웠던 요인을 구분하며, 시민 신뢰를 회복할 전략을 수립하시오.</div>
    <div class="discussion-columns"><div class="rule-top"><div class="label">토론 1</div><h3>매체 2개 선정<br>및 특성 분석</h3><p>위기 대응에 적합한 <b>매체 2개</b>를 선정하고, 각 매체의 <b>특성과 선정 이유</b>를 논의하시오.</p></div>
    <div class="rule-top orange-rule"><div class="label">토론 2</div><h3>베노이트의 이미지 회복<br>전략 수립</h3><p>매체에 따라 <b>전략 자체</b>를 달리할 것인가?<br>동일한 전략 아래 <b>형식·소구유형</b>만 달리할 것인가?</p><p>선택 근거와 <b>매체별 핵심 메시지</b>를 제시하시오.</p></div></div>`,
    '매체의 선택, 전략의 선택, 표현의 선택을 구분해 <em>시민의 신뢰를 회복할 방안</em>을 논의한다.','discussion'));
  document.getElementById('stage').innerHTML=html.join('');
})();
