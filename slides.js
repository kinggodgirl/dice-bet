/* 수업 슬라이드 (교사 화면 📽 수업 모드)
   kind: title(표지) · goal(학습목표) · join(접속 안내) · ask(학생 생각 모으기) · text(글) · live(실시간 게임 화면)
   live: chip(반 전체 칩 예측) · sim(모의실험) · many(많이 굴려 보기) · duel(1:1 대결 현황) · table(합 표)
   set: 이 슬라이드로 오면 맞춰 줄 단계·횟수 {st, n(칩 예측 횟수), dn(대결 횟수)}
   글 속 <b>…</b> 는 주황 강조, <span class="blank">답</span> 은 빈칸(누르면 답이 보임)
   교사 화면에서 ✏ 로 고친 글은 그 브라우저에 따로 저장되고, 이 파일은 기본값입니다. */
window.DEFAULT_SLIDES = [
  { id:'cover', kind:'title', kicker:'Ⅷ. 확률', title:'02. 확률 1차시', sub:'확률의 뜻' },
  { id:'goal', kind:'goal', title:'학습목표', tag:'PPT<br>학습목표',
    prev:'<b>곱셈</b>을 <b>이용</b>해서 <b>경우의 수</b>를 <b>구할 수 있다</b>.',
    now:'<b>확률</b>의 <b>뜻</b>을 <b>이해</b>하고 <b>확률</b>을 <b>구할 수 있다</b>.' },
  { id:'join', kind:'join', title:'수업에 들어와요', tag:'준비',
    body:'패드로 QR 코드를 찍거나 주소를 열고, <b>번호와 이름</b>, <b>수업 코드</b>를 넣으세요.' },
  { id:'think', kind:'ask', title:'확률은 무슨 뜻일까?', tag:'생각열기',
    q:'동전 한 개를 던질 때 앞면이 나올 가능성은 얼마일까요? 그 말은 무슨 뜻일까요?',
    hint:'초등학교 때 배운 ‘가능성’을 떠올려 “○번 중에 ○번은 …” 처럼 써 보세요.' },
  { id:'one', kind:'live', live:'chip', set:{st:1,n:1}, title:'주사위를 1번 굴리면?', tag:'활동 1<br>생각열기',
    prompt:'칩 <b>1개</b>를 나올 것 같은 눈에 놓으세요. 누가 맞힐까요?' },
  { id:'six', kind:'live', live:'chip', set:{st:1,n:6}, title:'주사위를 6번 굴리면?', tag:'활동 1<br>생각열기',
    prompt:'칩 <b>6개</b>. 1부터 6까지 한 번씩 나올까요? <b>고르게</b> 놓은 친구가 1등일까요?' },
  { id:'sixty', kind:'live', live:'chip', set:{st:1,n:60}, title:'주사위를 60번 굴리면?', tag:'활동 1<br>생각열기',
    prompt:'칩 <b>60개</b>. 이번에는 어떻게 놓을까요?' },
  { id:'big', kind:'live', live:'chip', set:{st:1,n:600}, ns:[600,6000], title:'600번, 6000번 굴리면?', tag:'활동 1<br>큰 수의 법칙',
    prompt:'칩 <b>600개</b>는 <b>10개씩</b>, <b>6000개</b>는 <b>50개씩</b> 놓아요. 많이 굴릴수록 누가 이길까요?' },
  { id:'sim', kind:'live', live:'sim', set:{st:1,n:60}, title:'한 판은 운! 100판이면?', tag:'활동 1<br>실험',
    prompt:'여러 전략이 <b>똑같은 굴림</b>으로 100판 겨루면 어떤 전략이 가장 많이 이길까요?' },
  { id:'many', kind:'live', live:'many', set:{st:1}, title:'아주 많이 굴려 보기', tag:'활동 1<br>실험',
    prompt:'굴린 횟수가 많아질수록 각 눈이 나오는 <b>비율</b>은 어떤 값에 가까워질까요?' },
  { id:'def', kind:'text', title:'확률의 뜻', tag:'학습지<br>주요개념',
    body:'<p>같은 조건에서 실험이나 관찰을 여러 번 반복할 때, 어떤 사건이 일어나는 <span class="blank">상대도수</span>가 일정한 값에 가까워지면 이 일정한 값을 그 사건이 일어날 <span class="blank">확률</span>이라고 한다.</p>'
      +'<p style="margin-top:36px">어떤 실험이나 관찰에서 각 경우가 일어날 가능성이 같을 때, 일어날 수 있는 모든 경우의 수를 <i>n</i>, 사건 A가 일어나는 경우의 수를 <i>a</i>라고 하면</p>'
      +'<p class="center big">(사건 A가 일어날 확률) = <span class="blank">a / n</span></p>'
      +'<p class="note">예) 주사위 한 개를 던질 때 3의 눈이 나올 확률 = <span class="blank">1/6</span></p>' },
  { id:'duel1rule', kind:'join', title:'1:1 칩 대결 ① 주사위 한 개', tag:'활동 2<br>대결', set:{st:1,dn:12},
    body:'① 친구와 <b>방</b>을 만들어 들어가요.<br>② 빈 표에 칩 <b>12개</b>를 놓아요. (상대 표는 비밀!)<br>③ 번갈아 <b>12번</b> 굴려요. 누가 굴려도 <b>두 사람 표에 모두</b> 적용돼요.<br>④ 나온 눈에 내 칩이 있으면 ✔. <b>✔가 더 많은 사람이 승리!</b>' },
  { id:'duel1', kind:'live', live:'duel', set:{st:1,dn:12}, title:'대결 ① 현황', tag:'활동 2<br>대결',
    prompt:'이긴 사람들은 칩을 <b>어떻게</b> 놓았을까요?' },
  { id:'duel2rule', kind:'join', title:'1:1 칩 대결 ② 두 주사위의 합', tag:'활동 3<br>대결', set:{st:2,dn:33},
    body:'이번에는 주사위 <b>두 개</b>를 함께 굴려 <b>두 눈의 합</b>(1~12)에 칩을 놓아요.<br>칩 <b>33개</b>, 번갈아 <b>33번</b> 굴려요.<br><br>🤔 이번에도 <b>고르게</b> 놓는 게 유리할까요?' },
  { id:'duel2', kind:'live', live:'duel', set:{st:2,dn:33}, title:'대결 ② 현황', tag:'활동 3<br>대결',
    prompt:'이긴 사람과 진 사람의 칩 모양을 비교해 보세요. <b>어떤 합</b>이 많이 나왔나요?' },
  { id:'table', kind:'live', live:'table', set:{st:2}, title:'왜 7이 많이 나올까?', tag:'활동 3<br>정리',
    prompt:'합이 같은 칸을 세어 보세요. 모든 경우는 <b>36가지</b>예요.' },
  { id:'sum', kind:'text', title:'두 주사위의 합의 확률', tag:'학습지<br>연습하기',
    body:'<p>서로 다른 두 주사위를 동시에 던질 때</p>'
      +'<p class="big">① 두 눈의 합이 7일 확률 = <span class="blank">6/36 = 1/6</span></p>'
      +'<p class="big">② 두 눈의 합이 2일 확률 = <span class="blank">1/36</span></p>'
      +'<p class="big">③ 두 눈의 합이 10일 확률 = <span class="blank">3/36 = 1/12</span></p>'
      +'<p class="note">그래서 대결 ②에서는 7 근처에 칩을 많이 놓을수록 유리했어요.</p>' },
  { id:'end', kind:'text', title:'정리', tag:'정리',
    body:'<p>• 한두 번 굴리는 결과는 <b>운</b>이지만, 많이 반복하면 일어나는 비율이 <b>일정한 값</b>에 가까워진다. 이 값이 <b>확률</b>이다.</p>'
      +'<p>• 각 경우가 일어날 가능성이 같으면 (확률) = (사건이 일어나는 경우의 수) ÷ (모든 경우의 수)</p>'
      +'<p>• 주사위 한 개: 모든 눈의 확률이 <b>같다</b> → 고르게. 두 주사위의 합: <b>7</b>의 확률이 가장 크다.</p>'
      +'<p class="note" style="margin-top:40px">다음 시간: 확률의 성질</p>' },
];
