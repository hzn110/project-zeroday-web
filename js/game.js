// PROJECT ZERO-DAY V4.3 — Node guide and tutorial (original behavior preserved).
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pick=a=>a[Math.floor(Math.random()*a.length)];const shuffle=a=>{let z=[...a];for(let i=z.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[z[i],z[j]]=[z[j],z[i]]}return z};
const rnd=(lo,hi)=>Math.floor(Math.random()*(hi-lo+1))+lo;
const fmt=n=>Math.round(n).toLocaleString('ko-KR');const mmss=n=>{let t=Math.max(0,Math.ceil(n));return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};
const TYPES=['normal','data','security','blocker'];
const META={normal:{name:'연결 노드',short:'연결',color:'#39ecf1',icon:'◉',desc:'통신 경로를 관리하는 장치입니다. 확보하면 다른 노드의 퍼즐 정보를 미리 살펴볼 수 있습니다.',reward:'미공략 노드의 퍼즐 종류 공개'},data:{name:'데이터 노드',short:'데이터',color:'#ff6478',icon:'▣',desc:'암호화된 정보를 보관하는 장치입니다. 중앙 서버 공략에 도움이 될 정보와 추가 점수를 얻습니다.',reward:'중앙 서버 단서 및 추가 점수'},security:{name:'보안 노드',short:'보안',color:'#ff3aae',icon:'◆',desc:'접속 흔적을 감시하고 사용자를 검증합니다. 확보하면 추적도를 낮출 수 있습니다.',reward:'추적도 12% 감소'},blocker:{name:'차단 노드',short:'차단',color:'#79acff',icon:'◇',desc:'외부 침입을 직접 차단하는 장치입니다. 확보하면 한 번의 실수에 대비할 보호 기회를 얻습니다.',reward:'실패 시 추적도 상승 완화 1회'}};
const PUZZLES={
 n1:{type:'normal',name:'패킷 분류',rank:1,rule:'표시된 두 조건을 모두 만족하는 통신 기록 2개를 찾으세요.',hints:['우선 통신 방식과 지연 수치를 확인하세요.','정상 기록은 보안 연결이며 지연 수치가 60 이상입니다.','조건이 다른 기록 2개는 선택하지 마세요.']},
 n2:{type:'normal',name:'경로 연결',rank:2,rule:'출발지에서 목적지까지 안내된 통신 경유 지점을 순서대로 누르세요.',hints:['화면 위의 경유 순서를 먼저 읽으세요.','각 단계에서 안내된 장치 이름을 클릭하면 됩니다.','먼저 표시된 장치부터 차례로 눌러 주세요.']},
 n3:{type:'normal',name:'신호 동기화',rank:2,rule:'주어진 목표 주파수와 일치하도록 수치를 조정하고 동기화하세요.',hints:['목표 주파수는 화면 위쪽에 표시됩니다.','슬라이더를 움직이면 현재 주파수가 변합니다.','목표와 현재 값이 같을 때 동기화 버튼을 누르세요.']},
 n4:{type:'normal',name:'통신 포트 연결',rank:3,rule:'서비스를 선택한 뒤 같은 통신 포트의 수신 장치를 연결하세요.',hints:['서비스와 포트 번호의 짝을 확인하세요.','왼쪽 서비스를 한 번, 오른쪽 수신 포트를 한 번 클릭하세요.','화면의 표기 숫자가 같은 항목끼리 연결하면 됩니다.']},
 d1:{type:'data',name:'침투 코드 배열',rank:4,rule:'맨 위 행에서 시작해 같은 열 → 같은 행을 번갈아 이동하며 목표 코드를 완성하세요.',hints:['가장 먼저 선택할 코드는 첫 번째 행에 있습니다.','선택 가능한 다음 칸은 테두리가 강조됩니다.','목표 코드를 왼쪽부터 순서대로 찾으세요.']},
 d2:{type:'data',name:'암호 패턴 해독',rank:2,rule:'숫자 사이의 규칙을 찾아 다음에 올 값을 선택하세요.',hints:['인접한 숫자의 차이를 비교하세요.','매번 같은 수만큼 증가하거나 감소합니다.','마지막 숫자에도 같은 차이를 적용하세요.']},
 d3:{type:'data',name:'데이터 조각 복구',rank:3,rule:'순서가 뒤섞인 데이터 조각을 올바른 위치 순으로 선택해 복구하세요.',hints:['각 조각에는 전송 순번이 표시되어 있습니다.','맨 앞의 조각부터 마지막 조각까지 연결하세요.','순번 1 → 2 → 3 → 4로 클릭하면 됩니다.']},
 d4:{type:'data',name:'데이터 오류 검사',rank:2,rule:'기준 데이터와 비교해서 손상된 복사본을 찾아 선택하세요.',hints:['기준 데이터와 네 개의 복사본을 비교하세요.','대부분은 같고 하나만 다릅니다.','한 글자라도 다르면 손상된 복사본입니다.']},
 s1:{type:'security',name:'수상한 기록 탐지',rank:3,rule:'접속 실패이면서 지연 시간이 40 이상인 기록 2개를 선택하세요.',hints:['접속 결과와 지연 시간을 동시에 확인하세요.','실패 상태만으로는 충분하지 않습니다.','조건은 실패 AND 지연 40 이상입니다.']},
 s2:{type:'security',name:'인증 순서 복원',rank:2,rule:'인증 과정의 단계를 올바른 순서로 누르세요.',hints:['요청 이후 확인이 이뤄지고, 검증 후 승인이 이어집니다.','시작 단계는 접속 요청입니다.','접속 요청 → 신원 확인 → 암호 검증 → 접근 승인.']},
 s3:{type:'security',name:'접근 권한 검사',rank:4,rule:'권한 등급이 파일의 보안 등급 이상인 사용자 2명을 선택하세요.',hints:['각 사용자의 권한과 파일 등급을 비교하세요.','권한이 파일 등급과 같아도 접근 가능합니다.','파일 등급 이상인 두 사용자만 골라 주세요.']},
 s4:{type:'security',name:'반복 접속 탐지',rank:2,rule:'짧은 시간 동안 가장 많이 반복된 접속 주소를 고르세요.',hints:['각 접속 주소의 등장 횟수를 세어 보세요.','같은 주소가 여러 번 나오는지 확인하세요.','가장 많이 등장한 주소 하나를 선택하면 됩니다.']},
 b1:{type:'blocker',name:'경로 기억',rank:3,rule:'3×3 문자 패널에서 코랄색 테두리가 점등되는 네 칸의 순서를 기억한 뒤 같은 순서로 누르세요.',hints:['코랄색 테두리가 한 번에 한 칸씩 점등됩니다.','숫자와 문자는 위치를 구분하기 위한 표식이며, 점등된 위치의 순서가 정답입니다.','점등이 끝난 뒤 처음 빛난 칸부터 네 칸을 순서대로 누르세요.']},
 b2:{type:'blocker',name:'방어 패턴 회피',rank:2,rule:'위험 표시가 없는 안전 통로를 3회 연속 선택하세요.',hints:['빨간색은 방어 장치가 작동 중인 통로입니다.','현재 안전한 통로 하나만 누르면 됩니다.','안전한 통로는 청록색으로 표시됩니다.']},
 b3:{type:'blocker',name:'방어 장치 해제',rank:3,rule:'장치의 전력 단계를 눌러 목표 설정과 같게 맞추세요.',hints:['장치를 누르면 전력값이 0 → 1 → 2 → 0으로 바뀝니다.','각 열 위의 목표 수치와 실제 수치를 비교하세요.','세 장치의 실제 값이 목표와 모두 같으면 확인을 누르세요.']},
 b4:{type:'blocker',name:'보안벽 통과',rank:4,rule:'움직이는 신호가 노란 안전 구역에 들어왔을 때 통과 버튼을 누르세요.',hints:['신호가 좌우로 움직이고 있습니다.','노란 영역 내부에서 버튼을 누르면 성공합니다.','기회는 충분합니다. 안전 구역 안에 들어오기를 기다리세요.']}
};
const NODE_GUIDE=[
 {type:'normal',name:'연결 노드',role:'정보 확인형',benefit:'다른 노드의 퍼즐 종류를 미리 확인',drawback:'즉시 추적도를 낮추거나 추가 점수를 주지는 않음',recommend:'다음 공략 대상을 고르기 어려울 때'},
 {type:'data',name:'데이터 노드',role:'고득점·단서 확보형',benefit:'클리어 시 추가 250점과 중앙 서버 단서 확보',drawback:'추적도를 직접 낮추지 못함',recommend:'고득점을 노리거나 중앙 서버를 대비할 때'},
 {type:'security',name:'보안 노드',role:'추적 위험 관리형',benefit:'클리어 시 추적도 12%p 감소',drawback:'추가 점수 보상은 없고, 감소량은 현재 추적도에 따라 제한됨',recommend:'추적도가 높아졌을 때'},
 {type:'blocker',name:'차단 노드',role:'실패 대비·방어형',benefit:'실패 시 추적도 상승량을 줄이는 보호 1회',drawback:'클리어 즉시 추적도가 감소하는 효과는 없음',recommend:'중앙 서버의 연속 퍼즐이 걱정될 때'}
];
function nodeGuideCards(){return NODE_GUIDE.map((info,i)=>{const color={normal:'#77b8d6',data:'#ff9c91',security:'#ee83b7',blocker:'#9caff0'}[info.type];return `<article class="node-guide-card" style="--guide-accent:${color}"><span class="ng-num">NODE 0${i+1} / ${info.role}</span><h3>${info.name}</h3><div class="ng-role">${info.role}</div><div class="ng-row"><span class="ng-key">장점</span><div><span class="ng-main">${info.benefit}</span></div></div><div class="ng-row"><span class="ng-key">단점</span><span>${info.drawback}</span></div><p class="ng-recommend">추천 상황 · ${info.recommend}</p></article>`}).join('')}
const MIN_CORE_NODES=4;
const STORAGE='pzd_v32_rankings';const SETTINGS='pzd_v32_settings';
const sessionFallback={};
const read=(key,fallback)=>{try{let x=JSON.parse(localStorage.getItem(key));return x??sessionFallback[key]??fallback}catch{return sessionFallback[key]??fallback}};
const store=(key,v)=>{sessionFallback[key]=v;try{localStorage.setItem(key,JSON.stringify(v))}catch{}};
const settings=Object.assign({sound:true,volume:45,parallax:true,motion:true,largeText:false},read(SETTINGS,{}));
// Legacy visual choices were removed. Always use the original console appearance.
delete settings.theme;
delete settings.visibility;
document.body.removeAttribute('data-theme');
document.body.removeAttribute('data-visibility');

/* Developer puzzle balance overrides: per-browser, validated, and never mixed with player settings. */
const PUZZLE_TUNING_STORAGE='pzd_v32_puzzle_balance';
const TUNE_BASE_FIELDS=[
 {key:'reward',label:'성공 점수',unit:'점',min:0,max:20000,step:50},
 {key:'traceEasy',label:'오답 TRACE / Easy',unit:'%',min:0,max:100,step:1},
 {key:'traceHard',label:'오답 TRACE / Hard',unit:'%',min:0,max:100,step:1},
 {key:'missScore',label:'오답 점수 차감',unit:'점',min:0,max:2000,step:10}
];
const TUNE_SPECIAL_FIELDS={
 b1:[
  {key:'firstCueEasy',label:'최초 점등 / Easy',unit:'ms',min:80,max:2000,step:10},
  {key:'firstGapEasy',label:'최초 점등 간격 / Easy',unit:'ms',min:0,max:1000,step:5},
  {key:'firstCueHard',label:'최초 점등 / Hard',unit:'ms',min:80,max:2000,step:10},
  {key:'firstGapHard',label:'최초 점등 간격 / Hard',unit:'ms',min:0,max:1000,step:5},
  {key:'replayCueEasy',label:'재생 점등 / Easy',unit:'ms',min:80,max:3000,step:10},
  {key:'replayGapEasy',label:'재생 점등 간격 / Easy',unit:'ms',min:0,max:1500,step:10},
  {key:'replayCueHard',label:'재생 점등 / Hard',unit:'ms',min:80,max:3000,step:10},
  {key:'replayGapHard',label:'재생 점등 간격 / Hard',unit:'ms',min:0,max:1500,step:10},
  {key:'replayCost',label:'다시 보기 점수 차감',unit:'점',min:0,max:2000,step:10}
 ],
 b2:[{key:'nextDelay',label:'다음 통로 표시 지연',unit:'ms',min:50,max:3000,step:10}],
 b4:[
  {key:'cycleEasy',label:'신호 왕복 시간 / Easy',unit:'ms',min:1000,max:20000,step:100},
  {key:'cycleHard',label:'신호 왕복 시간 / Hard',unit:'ms',min:1000,max:20000,step:100}
 ]
};
function tuneFields(key){return [...TUNE_BASE_FIELDS,...(TUNE_SPECIAL_FIELDS[key]||[])]}
function tuneDefaults(key){
 const rank=PUZZLES[key]?.rank??2;
 const defaults={reward:[0,700,1100,1550,2100][rank],traceEasy:3+rank*2,traceHard:6+rank*2,missScore:90};
 if(key==='b1')Object.assign(defaults,{
  firstCueEasy:1050,firstGapEasy:330,firstCueHard:720,firstGapHard:210,
  replayCueEasy:1450,replayGapEasy:410,replayCueHard:1150,replayGapHard:320,replayCost:100
 });
 if(key==='b2')defaults.nextDelay=450;
 if(key==='b4')Object.assign(defaults,{cycleEasy:6000,cycleHard:4000});
 return defaults;
}
const puzzleTuning=Object.create(null);
const storedTuning=read(PUZZLE_TUNING_STORAGE,{});
if(storedTuning&&typeof storedTuning==='object'&&!Array.isArray(storedTuning)){
 for(const key of [...Object.keys(PUZZLES),'xor']){
  const raw=storedTuning[key];if(!raw||typeof raw!=='object'||Array.isArray(raw))continue;
  const cleaned={};
  for(const field of tuneFields(key)){
   const value=raw[field.key];
   if(typeof value==='number'&&Number.isInteger(value)&&value>=field.min&&value<=field.max)cleaned[field.key]=value;
  }
  if(Object.keys(cleaned).length)puzzleTuning[key]=cleaned;
 }
}
function puzzleTune(key){return {...tuneDefaults(key),...(puzzleTuning[key]||{})}}
function persistPuzzleTune(){store(PUZZLE_TUNING_STORAGE,puzzleTuning)}

let screen='menu',previousScreen='menu',diff='easy',tutorialStage=0,tutorialSolved=false,game=null,puzzle=null,overlayMode='',pauseActive=false,toastTimer=0,audioCtx=null,frameTime=performance.now(),lastHud=0,activeTimers=[];
let rankSort='overall',rankDiff='easy';
let devAuthenticated=false,devAttempts=0,devLockUntil=0,devTest=false,devTestKey='',devResults={},devGameplay=false;
const DEV_PASSWORD_HASH='51c31039';
function sound(name='click') {if(!settings.sound||settings.volume<=0)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});let notes={click:[[620,.035],[890,.025]],ok:[[660,.055],[970,.09]],bad:[[270,.095],[190,.1]],alert:[[680,.13],[430,.13]],complete:[[520,.1],[740,.13],[1040,.18]]}[name]||[[650,.03]];let when=audioCtx.currentTime+.004;for(let [freq,dur] of notes){let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=name==='bad'?'sawtooth':'square';o.frequency.setValueAtTime(freq,when);o.frequency.exponentialRampToValueAtTime(freq*.88,when+dur);let vol=settings.volume/100*(name==='click'?.034:.050);g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(vol,when+.008);g.gain.exponentialRampToValueAtTime(.0001,when+dur);o.connect(g).connect(audioCtx.destination);o.start(when);o.stop(when+dur+.004);when+=dur*.75}}catch{}}
document.addEventListener('pointerdown',e=>{if(e.target.closest('button'))sound('click')});
function toast(message,warn=false){let t=$('#toast');t.textContent=message;t.className='toast visible'+(warn?' warn':'');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2400)}
function go(id){if(id==='developer'&&!devAuthenticated)id='menu';screen=id;$$('.screen').forEach(e=>e.classList.toggle('active',e.id===id));window.scrollTo(0,0);if(id==='ranking')renderRanking();if(id==='game')updateHud();}
function openOverlay(eyebrow,title,body,footer='',mode='intel'){
 overlayMode=mode;
 $('#overlay').dataset.mode=mode;
 $('#overlayEyebrow').textContent=eyebrow;
 $('#overlayTitle').textContent=title;
 $('#overlayBody').innerHTML=body;
 $('#overlayFooter').innerHTML=footer;
 $('#overlay').classList.remove('hidden');
 const gameMenuVisible=screen==='game'&&!!game&&!devTest&&['map','core'].includes(game.phase);
 $('#overlayGameMenu').classList.toggle('hidden',!gameMenuVisible);
 $('#overlayClose').classList.toggle('hidden',gameMenuVisible&&mode==='core');
 $('#overlayClose').textContent='✕ 닫기';
}
function closeOverlay(){
 clearPuzzleTimers();
 $('#overlay').classList.add('hidden');
 delete $('#overlay').dataset.pauseHidden;
 $('#overlayGameMenu').classList.add('hidden');
 $('#overlayClose').classList.remove('hidden');
 overlayMode='';
 puzzle=null;
}
function clearPuzzleTimers(){if(puzzle?.memoryStop)puzzle.memoryStop();activeTimers.forEach(timer=>{if(timer.kind==='i')clearInterval(timer.id);else clearTimeout(timer.id)});activeTimers=[]}
function puzzleTimersBlocked(){return guideOpen||!!game?.paused}
function suspendPuzzleTimers(){
 const now=performance.now();
 activeTimers.forEach(timer=>{
  if(timer.kind==='t'&&!timer.suspended){
   clearTimeout(timer.id);
   timer.remaining=Math.max(0,timer.deadline-now);
   timer.suspended=true;
  }
 });
}
function resumePuzzleTimers(){
 if(puzzleTimersBlocked())return;
 const now=performance.now();
 activeTimers.forEach(timer=>{
  if(timer.kind==='t'&&timer.suspended){
   timer.deadline=now+timer.remaining;
   timer.id=setTimeout(timer.run,timer.remaining);
   timer.suspended=false;
  }
 });
}
function later(fn,ms){
 const blocked=puzzleTimersBlocked();
 const timer={kind:'t',id:null,fn,remaining:ms,deadline:performance.now()+ms,suspended:blocked,run:null};
 timer.run=()=>{activeTimers=activeTimers.filter(x=>x!==timer);fn()};
 if(!blocked)timer.id=setTimeout(timer.run,ms);
 activeTimers.push(timer);
 return timer.id;
}
function recurring(fn,ms){
 const timer={kind:'i',id:null};
 timer.id=setInterval(()=>{if(!puzzleTimersBlocked())fn()},ms);
 activeTimers.push(timer);
 return timer.id;
}
let guideOpen=false, guideRestoreFocus=null;
function openNodeGuide(){
 if(guideOpen)return;
 guideRestoreFocus=document.activeElement;
 guideOpen=true;
 const dlg=$('#nodeGuideDialog');
 $('#nodeGuideCards').innerHTML=nodeGuideCards();
 dlg.classList.remove('hidden');
 document.body.classList.add('node-guide-open');
 suspendPuzzleTimers();
 $('#nodeGuideClose').focus();
}
function closeNodeGuide(){
 if(!guideOpen)return;
 guideOpen=false;
 $('#nodeGuideDialog').classList.add('hidden');
 document.body.classList.remove('node-guide-open');
 resumePuzzleTimers();
 frameTime=performance.now();
 if(guideRestoreFocus&&guideRestoreFocus.isConnected)guideRestoreFocus.focus();
 guideRestoreFocus=null;
}
$('#nodeGuideToggle').onclick=openNodeGuide;
$('#nodeGuideClose').onclick=closeNodeGuide;
$('#nodeGuideDone').onclick=closeNodeGuide;
$('#nodeGuideDialog').addEventListener('pointerdown',e=>{if(e.target.id==='nodeGuideDialog')closeNodeGuide()});
document.addEventListener('keydown',e=>{if(!guideOpen)return;if(e.key==='Escape'){e.preventDefault();closeNodeGuide()}else if(e.key==='Tab'){const controls=[...$$('#nodeGuideDialog button')].filter(el=>!el.disabled);if(!controls.length)return;const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
function log(message,kind=''){if(!game)return;let div=document.createElement('div');div.textContent=message;div.className=kind;$('#gameLog').prepend(div);while($('#gameLog').children.length>28)$('#gameLog').lastElementChild.remove()}

function devPasswordHash(value){
 let s='PZD::'+String(value)+'::413',h=2166136261;
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
}
function openDevAuth(){
 if(screen!=='menu'||!$('#devAuth').classList.contains('hidden'))return;
 let wait=Math.ceil((devLockUntil-Date.now())/1000);
 $('#devPassword').value='';
 $('#devAuthFeedback').className='dev-auth-feedback';
 $('#devAuthFeedback').textContent=wait>0?`LOCKED // ${wait}초 후 다시 시도`:'AUTHORIZED PERSONNEL ONLY';
 $('#devAuth').classList.remove('hidden');
 setTimeout(()=>$('#devPassword').focus(),30);
}
function closeDevAuth(){
 $('#devAuth').classList.add('hidden');
 $('#devPassword').value='';
}
async function submitDevAuth(){
 let now=Date.now();
 if(now<devLockUntil){
  let wait=Math.ceil((devLockUntil-now)/1000);
  $('#devAuthFeedback').className='dev-auth-feedback bad';
  $('#devAuthFeedback').textContent=`ACCESS LOCKED // ${wait}초`;
  return;
 }
 let value=$('#devPassword').value;
 let hash=devPasswordHash(value);
 if(hash===DEV_PASSWORD_HASH){
  devAuthenticated=true;devAttempts=0;
  $('#devAuthFeedback').className='dev-auth-feedback good';
  $('#devAuthFeedback').textContent='ACCESS GRANTED';
  sound('ok');
  setTimeout(()=>{
   closeDevAuth();
   go('developer');
   try{renderDevDashboard()}
   catch(err){
    console.error('[DEV DASHBOARD ERROR]',err);
    devOutput('DEV CONSOLE ERROR // 퍼즐 목록 로딩 중 오류가 발생했습니다. 새로고침 후 다시 시도하세요.','bad');
   }
  },180);
 }else{
  devAttempts++;
  $('#devPassword').value='';
  $('#devAuthFeedback').className='dev-auth-feedback bad';
  if(devAttempts>=5){
   devAttempts=0;devLockUntil=Date.now()+30000;
   $('#devAuthFeedback').textContent='5회 실패 // 30초 잠금';
  }else $('#devAuthFeedback').textContent=`ACCESS DENIED // 남은 시도 ${5-devAttempts}`;
  sound('bad');
 }
}
function devPuzzleEntries(){
 const normal=Object.entries(PUZZLES).map(([key,meta])=>({key,meta}));
 const xorMeta={type:'core',name:'최종 XOR',rank:2,rule:'암호문 비트와 키 비트를 XOR하여 4비트 결과를 완성하세요.',hints:['같은 비트는 0입니다.','다른 비트는 1입니다.','왼쪽부터 한 자리씩 비교하세요.']};
 return [...normal,{key:'xor',meta:xorMeta}];
}
function devTypeLabel(type){return {normal:'연결 노드 / NETWORK',data:'데이터 노드 / DATA',security:'보안 노드 / SECURITY',blocker:'차단 노드 / BLOCKER',core:'CORE / FINAL'}[type]||type}
function devTypeColor(type){return {normal:'#77b8d6',data:'#ff776e',security:'#ee83b7',blocker:'#9caff0',core:'#f2d36b'}[type]||'#79acff'}
function devBuilderReady(key){return key==='xor'||typeof PUZZLE_BUILDERS?.[key]==='function'}
let devTuneSelectedKey='b1';
function renderDevTuneEditor(){
 if(!devAuthenticated)return;
 const select=$('#devTunePuzzle');
 if(!select)return;
 const entries=devPuzzleEntries();
 if(!entries.some(item=>item.key===devTuneSelectedKey))devTuneSelectedKey='b1';
 select.innerHTML=entries.map(({key,meta})=>`<option value="${key}">${key.toUpperCase()} · ${esc(meta.name)}</option>`).join('');
 select.value=devTuneSelectedKey;
 const balance=puzzleTune(devTuneSelectedKey);
 const fields=items=>items.map(field=>`<label class="dev-tune-field"><span>${esc(field.label)}</span><div class="dev-tune-input"><input type="number" inputmode="numeric" data-tune-field="${field.key}" value="${balance[field.key]}" min="${field.min}" max="${field.max}" step="${field.step}" required><em>${field.unit}</em></div></label>`).join('');
 const special=TUNE_SPECIAL_FIELDS[devTuneSelectedKey]||[];
 $('#devTuneFields').innerHTML=`<div class="dev-tune-fieldset"><h4>성공 보상 / 오답 페널티</h4><div class="dev-tune-grid">${fields(TUNE_BASE_FIELDS)}</div></div>${special.length?`<div class="dev-tune-fieldset"><h4>속도 / 타이밍 / 추가 비용</h4><div class="dev-tune-grid">${fields(special)}</div></div>`:''}`;
 const changed=Object.keys(puzzleTuning[devTuneSelectedKey]||{}).length;
 $('#devTuneStatus').textContent=changed?`사용자 설정 ${changed}개`:'기본 설정';
 $('#devTuneStatus').classList.toggle('custom',changed>0);
 $('#devTuneFeedback').className='dev-tuning-feedback';
 $('#devTuneFeedback').textContent='변경값을 입력한 후 저장하세요. 다음 퍼즐 실행부터 적용됩니다.';
}
function saveDevTune(){
 if(!devAuthenticated)return;
 const key=devTuneSelectedKey,defaults=tuneDefaults(key),overrides={};
 for(const field of tuneFields(key)){
  const input=$('#devTuneFields').querySelector(`[data-tune-field="${field.key}"]`);
  if(!input)return;
  const raw=input.value.trim(),value=Number(raw);
  if(!raw||!Number.isInteger(value)||value<field.min||value>field.max){
   $('#devTuneFeedback').className='dev-tuning-feedback error';
   $('#devTuneFeedback').textContent=`${field.label}: ${field.min}~${field.max} 사이의 정수를 입력하세요.`;
   input.focus();return;
  }
  if(value!==defaults[field.key])overrides[field.key]=value;
 }
 if(Object.keys(overrides).length)puzzleTuning[key]=overrides;
 else delete puzzleTuning[key];
 persistPuzzleTune();
 renderDevDashboard();
 $('#devTuneFeedback').className='dev-tuning-feedback success';
 $('#devTuneFeedback').textContent=`${key.toUpperCase()} 밸런스 저장 완료. 다음 퍼즐 실행부터 적용됩니다.`;
 devOutput(`BALANCE SAVED // ${key.toUpperCase()} · 변경 항목 ${Object.keys(overrides).length}개`,'good');
}
function resetDevTuneOne(){
 if(!devAuthenticated)return;
 const key=devTuneSelectedKey;
 delete puzzleTuning[key];
 persistPuzzleTune();renderDevDashboard();
 $('#devTuneFeedback').className='dev-tuning-feedback success';
 $('#devTuneFeedback').textContent=`${key.toUpperCase()} 퍼즐의 기본값을 복구했습니다.`;
}
function resetDevTuneAll(){
 if(!devAuthenticated||!confirm('17개 퍼즐의 사용자 지정 점수와 속도를 모두 기본값으로 되돌릴까요?'))return;
 for(const key of Object.keys(puzzleTuning))delete puzzleTuning[key];
 persistPuzzleTune();renderDevDashboard();
 $('#devTuneFeedback').className='dev-tuning-feedback success';
 $('#devTuneFeedback').textContent='전체 퍼즐 밸런스를 기본값으로 복구했습니다.';
 devOutput('BALANCE RESET // 모든 퍼즐 설정이 기본값으로 복구되었습니다.','good');
}
function renderDevDashboard(){
 if(!devAuthenticated)return;
 const entries=devPuzzleEntries(),types=['normal','data','security','blocker','core'];
 let ready=entries.filter(x=>devBuilderReady(x.key)).length;
 let passed=entries.filter(x=>devResults[x.key]==='pass').length;
 let errors=entries.filter(x=>devResults[x.key]==='error').length;
 $('#devPuzzleCount').textContent=entries.length;
 $('#devReadyCount').textContent=ready;
 $('#devPassCount').textContent=passed;
 $('#devErrorCount').textContent=errors;
 $('#devPuzzleGroups').innerHTML=types.map(type=>{
  let items=entries.filter(x=>x.meta.type===type);
  return `<section class="dev-group"><div class="dev-group-title">${devTypeLabel(type)} <span>${items.length} TESTS</span></div><div class="dev-grid">${items.map(({key,meta})=>{
   let state=devResults[key]||'ready',label=state==='pass'?'PASS':state==='error'?'ERROR':state==='running'?'TESTING':'READY';
   return `<article class="dev-card ${state}" style="--dev-accent:${devTypeColor(type)}">
    <div class="dev-card-top"><span class="dev-key">${key.toUpperCase()} // RANK ${meta.rank}</span><span class="dev-state">${label}</span></div>
    <h3>${esc(meta.name)}</h3><p>${esc(meta.rule)}</p>
    <div class="dev-meta"><span>${'★'.repeat(meta.rank)}${'☆'.repeat(4-meta.rank)}</span><span>${Object.keys(puzzleTuning[key]||{}).length?'CUSTOM BALANCE':devBuilderReady(key)?'BUILDER OK':'BUILDER MISSING'}</span></div>
    <div class="dev-card-actions"><button class="outline small" data-dev-puzzle="${key}">${state==='pass'?'다시 테스트':'퍼즐 실행'} →</button><button class="outline small" data-dev-tune="${key}">밸런스 조정</button></div>
   </article>`;
  }).join('')}</div></section>`;
 }).join('');
 $$('[data-dev-puzzle]').forEach(btn=>btn.onclick=()=>openDevPuzzle(btn.dataset.devPuzzle));
 $$('[data-dev-tune]').forEach(btn=>btn.onclick=()=>{
  devTuneSelectedKey=btn.dataset.devTune;
  renderDevTuneEditor();
  $('#devTuningPanel').scrollIntoView({behavior:'smooth',block:'start'});
 });
 renderDevTuneEditor();
 renderDevRankPreview();
 renderDevHardContacts();
}

function devOutput(message,kind=''){
 const el=$('#devToolOutput');if(!el)return;
 el.className='dev-tool-output'+(kind?' '+kind:'');el.textContent=message;
}
function devLaunchGame(mode){
 if(!devAuthenticated)return;
 diff=mode;devGameplay=true;
 document.body.classList.add('dev-gameplay');
 $('#devGameBar').classList.remove('hidden');
 startGame();
 log('DEV SANDBOX 활성화 // 이 세션의 결과는 운영 테스트용입니다.','warn');
 updateDevGameBar();
}
function updateDevGameBar(){
 if(!devGameplay||!devAuthenticated||!game)return;
 $('#devGameBar').classList.remove('hidden');
}
function devReturnConsole(){
 clearPuzzleTimers();
 const pauseShade=$('#pauseShade');if(pauseShade)pauseShade.remove();
 pauseActive=false;puzzle=null;overlayMode='';game=null;devGameplay=false;
 $('#overlay').classList.add('hidden');$('#devGameBar').classList.add('hidden');
 document.body.classList.remove('dev-gameplay');
 renderDevDashboard();go('developer');
}
function devValidateNetworks(){
 if(!devAuthenticated)return;
 let failures=[],minEntry=99,maxEntry=0,minBranch=99,maxBranch=0,minHosts=99,maxHosts=0;
 for(let run=1;run<=250;run++){
  const net=makeIrregularNetwork();
  minHosts=Math.min(minHosts,net.total);maxHosts=Math.max(maxHosts,net.total);
  const entryTargets=net.edges.filter(e=>e.a==='entry').map(e=>e.b);
  minEntry=Math.min(minEntry,entryTargets.length);maxEntry=Math.max(maxEntry,entryTargets.length);
  if(entryTargets.length<2||entryTargets.length>3)failures.push(`#${run} ENTRY=${entryTargets.length}`);
  const lastLayer=net.layerCount-1;
  for(const node of net.nodes.filter(n=>n.layer<lastLayer)){
   const branches=net.edges.filter(e=>e.a===node.id&&e.b!=='core').length;
   minBranch=Math.min(minBranch,branches);maxBranch=Math.max(maxBranch,branches);
   if(branches<2)failures.push(`#${run} ${node.id} branch=${branches}`);
  }
  const reachable=new Set(['entry']);let changed=true;
  while(changed){changed=false;for(const e of net.edges){if(reachable.has(e.a)&&!reachable.has(e.b)){reachable.add(e.b);changed=true}}}
  if(!reachable.has('core'))failures.push(`#${run} CORE unreachable`);
  if(net.nodes.some(n=>!reachable.has(n.id)))failures.push(`#${run} unreachable host`);
  if(failures.length>8)break;
 }
 if(failures.length){
  devOutput(`NETWORK QA FAIL // ${failures.join(' | ')}`,'bad');
 }else{
  devOutput(`NETWORK QA PASS // 250회 생성 · ENTRY ${minEntry}~${maxEntry}개 · 중간 분기 ${minBranch}~${maxBranch}개 · HOST ${minHosts}~${maxHosts} · CORE 도달 100%`,'good');
 }
}
function devSeedRankings(){
 if(!devAuthenticated)return;
 let records=read(STORAGE,[]);if(!Array.isArray(records))records=[];
 const today=new Date().toLocaleDateString('ko-KR');
 // Each QA profile intentionally leads a different metric so sort controls visibly reorder rows.
 const samples=[
  {nickname:'QA_SCORE_E',diff:'easy',score:9000,time:240,trace:65,grade:'B',date:today},
  {nickname:'QA_SPEED_E',diff:'easy',score:6200,time:70,trace:50,grade:'A',date:today},
  {nickname:'QA_STEALTH_E',diff:'easy',score:5000,time:190,trace:5,grade:'S',date:today},
  {nickname:'QA_SCORE_H',diff:'hard',score:10000,time:170,trace:68,grade:'B',date:today},
  {nickname:'QA_SPEED_H',diff:'hard',score:7000,time:105,trace:57,grade:'A',date:today},
  {nickname:'QA_STEALTH_H',diff:'hard',score:5800,time:142,trace:4,grade:'S',date:today}
 ];
 store(STORAGE,[...records,...samples].slice(-150));
 renderDevHardContacts();
 devOutput('RANKING QA // 정렬 검증용 샘플 6개 추가: 점수·시간·추적도 탭마다 순서가 달라집니다.','good');
}

function renderDevRankPreview(){
 const recent=$('#devRankRecent');
 if(!recent)return;
 const raw=read(STORAGE,[]);
 const records=(Array.isArray(raw)?raw:[]).filter(r=>r&&r.manualEntry===true).slice(-5).reverse();
 recent.innerHTML=records.length?records.map(r=>{
  const record=normalizeRankingRecord(r,0);
  if(!record)return '';
  return `<div class="dev-ranking-entry"><strong>${esc(record.nickname)}</strong><span>${record.diff==='hard'?'HARD':'EASY'}</span><span>${fmt(record.score)} PT</span><span>${formatRankingTime(record.time)}</span><span>TRACE ${record.trace===null?'—':record.trace+'%'}</span><span>GRADE ${esc(record.grade)}</span></div>`;
 }).join(''):'등록된 기록이 없습니다.';
}
function renderDevHardContacts(){
 const el=$('#devHardContacts');if(!el)return;
 if(!devAuthenticated){el.textContent='개발자 인증 후 확인할 수 있습니다.';return}
 const raw=read(STORAGE,[]);
 const records=(Array.isArray(raw)?raw:[]).filter(r=>r&&r.diff==='hard'&&normalizeContactPhone(r.contactPhone)).slice().reverse();
 el.innerHTML=records.length?records.map(r=>`<div class="dev-ranking-entry"><strong>${esc(String(r.nickname||'ANON'))}</strong><span>${esc(formatContactPhone(r.contactPhone))}</span><span>${esc(String(r.date||'—'))}</span></div>`).join(''):'전화번호를 등록한 하드모드 기록이 없습니다.';
}
function devRegisterRanking(event){
 event?.preventDefault();
 if(!devAuthenticated||screen!=='developer')return;
 const feedback=$('#devRankFeedback');
 const fail=(message,field)=>{
  feedback.className='dev-ranking-feedback error';
  feedback.textContent=message;
  if(field)$('#'+field).focus();
 };
 const nickname=$('#devRankName').value.trim();
 if(!nickname||nickname.length>12||!/^[가-힣A-Za-z0-9_.-]+$/.test(nickname)){
  fail('닉네임은 한글·영문·숫자·_ . - 만 사용하여 1~12자로 입력하세요.','devRankName');return;
 }
 const difficulty=$('#devRankDiff').value,grade=$('#devRankGrade').value;
 if(!['easy','hard'].includes(difficulty)||!['S','A','B','C'].includes(grade)){
  fail('난이도와 등급을 선택하세요.');return;
 }
 const numeric=id=>{const raw=$('#'+id).value.trim();return raw===''?NaN:Number(raw)};
 const score=numeric('devRankScore'),minutes=numeric('devRankMinutes'),seconds=numeric('devRankSeconds'),trace=numeric('devRankTrace');
 if(!Number.isInteger(score)||score<0||score>10000000){fail('점수는 0~10,000,000 사이의 정수여야 합니다.','devRankScore');return}
 if(!Number.isInteger(minutes)||minutes<0||minutes>99){fail('시간의 분은 0~99 사이의 정수여야 합니다.','devRankMinutes');return}
 if(!Number.isInteger(seconds)||seconds<0||seconds>59){fail('시간의 초는 0~59 사이의 정수여야 합니다.','devRankSeconds');return}
 if(!Number.isFinite(trace)||trace<0||trace>100||Math.abs(trace*10-Math.round(trace*10))>1e-7){
  fail('추적도는 0~100% 사이에서 소수 첫째 자리까지 입력하세요.','devRankTrace');return;
 }
 const record={nickname,diff:difficulty,score,time:minutes*60+seconds,trace:Math.round(trace*10)/10,grade,date:new Date().toLocaleDateString('ko-KR'),manualEntry:true};
 const existing=read(STORAGE,[]);
 const records=Array.isArray(existing)?existing:[];
 store(STORAGE,[...records,record].slice(-150));
 feedback.className='dev-ranking-feedback success';
 feedback.textContent=`등록 완료 // ${nickname} · ${difficulty==='hard'?'어려움':'쉬움'} · ${fmt(score)}점 · ${formatRankingTime(record.time)} · TRACE ${record.trace}% · ${grade}등급`;
 devOutput(`RANKING MANUAL ENTRY // ${nickname} 기록이 현재 브라우저 랭킹에 추가되었습니다.`,'good');
 renderDevRankPreview();
 renderDevHardContacts();
 sound('ok');
}

function devClearRankings(){
 if(!devAuthenticated)return;
 if(confirm('DEV ADMIN // 현재 브라우저의 모든 플레이어 랭킹 기록을 삭제할까요?')){
  store(STORAGE,[]);
  devOutput('ADMIN DATA // 랭킹 기록을 모두 삭제했습니다.','good');
  renderDevRankPreview();
  renderDevHardContacts();
  toast('DEV: 랭킹 기록 전체 삭제 완료');
 }
}
function devResetSettings(){
 if(!devAuthenticated)return;
 Object.assign(settings,{sound:true,volume:45,parallax:true,motion:true,largeText:false});
 store(SETTINGS,settings);syncSettings();
 devOutput('ADMIN CONFIG // 일반 설정을 기본값으로 복구했습니다.','good');
}

function makeDevGame(fakeNode){
 return {
  diff:'easy',phase:'map',duration:9999,remaining:9999,elapsed:0,trace:0,score:0,misses:0,hints:0,
  cleared:0,shield:0,intel:0,reveal:false,coreClue:0,nodes:[fakeNode],edges:[],entry:{x:0,y:0},core:{x:0,y:0},
  totalNodes:1,layerCount:1,entryChoiceCount:1,reserved:{normal:'n1',data:'d1',security:'s1',blocker:'b1'},
  coreStage:4,coreBits:[],paused:false,seed:413000,saved:false,lastNodeId:'entry'
 };
}
function openDevPuzzle(key){
 if(!devAuthenticated||screen!=='developer')return;
 const meta=key==='xor'?{type:'core',name:'최종 XOR',rank:2,rule:'암호문 비트와 키 비트를 XOR하여 4비트 결과를 완성하세요.',hints:['같은 비트는 0입니다.','다른 비트는 1입니다.','왼쪽부터 한 자리씩 비교하세요.']}:PUZZLES[key];
 if(!meta){devResults[key]='error';renderDevDashboard();return}
 const fakeType=meta.type==='core'?'data':meta.type;
 const fakeNode={id:'DEV_'+key.toUpperCase(),codename:'QA_SANDBOX',type:fakeType,key,cleared:false,x:0,y:0,layer:0};
 clearPuzzleTimers();game=makeDevGame(fakeNode);devTest=true;devTestKey=key;devResults[key]='running';
 document.body.classList.add('dev-test-active');
 try{
  displayPuzzle(key,fakeNode,key==='xor');
  $('#overlayEyebrow').textContent='DEV QA / SANDBOX TEST';
  const pause=$('#puzzlePause');if(pause)pause.remove();
  const back=$('#puzzleBack');if(back){back.textContent='테스트 종료';back.onclick=closeDevPuzzle}
  $('#overlayClose').textContent='✕ 테스트 종료';
 }catch(err){
  console.error('[DEV PUZZLE ERROR]',key,err);
  devResults[key]='error';devTest=false;devTestKey='';game=null;document.body.classList.remove('dev-test-active');
  closeOverlay();renderDevDashboard();toast(`${key.toUpperCase()} 실행 오류가 감지되었습니다.`,true);
 }
}
function closeDevPuzzle(){
 clearPuzzleTimers();
 $('#overlay').classList.add('hidden');
 overlayMode='';puzzle=null;game=null;devTest=false;devTestKey='';
 document.body.classList.remove('dev-test-active');
 renderDevDashboard();
}
function exitDeveloper(){
 if(devTest)closeDevPuzzle();
 clearPuzzleTimers();game=null;puzzle=null;devTest=false;devTestKey='';devGameplay=false;devAuthenticated=false;
 $('#devGameBar').classList.add('hidden');
 document.body.classList.remove('dev-test-active','dev-gameplay');go('menu');
}
$('#devAuthCancel').onclick=closeDevAuth;
$('#devAuthSubmit').onclick=submitDevAuth;
$('#devPassword').addEventListener('keydown',e=>{if(e.key==='Enter')submitDevAuth();if(e.key==='Escape')closeDevAuth()});
$('#devAuth').addEventListener('pointerdown',e=>{if(e.target.id==='devAuth')closeDevAuth()});
$('#devExit').onclick=exitDeveloper;
$('#devResetTests').onclick=()=>{devResults={};renderDevDashboard();toast('개발자 테스트 기록을 초기화했습니다.')};
$('#devLaunchEasy').onclick=()=>devLaunchGame('easy');
$('#devLaunchHard').onclick=()=>devLaunchGame('hard');
$('#devNetworkScan').onclick=devValidateNetworks;
$('#devSeedRanking').onclick=devSeedRankings;
$('#devClearRanking').onclick=devClearRankings;
$('#devRankForm').addEventListener('submit',devRegisterRanking);
$('#devResetSettings').onclick=devResetSettings;
$('#devTunePuzzle').onchange=()=>{devTuneSelectedKey=$('#devTunePuzzle').value;renderDevTuneEditor()};
$('#devTuneSave').onclick=saveDevTune;
$('#devTuneResetOne').onclick=resetDevTuneOne;
$('#devTuneResetAll').onclick=resetDevTuneAll;
$('#devAddTime').onclick=()=>{if(devGameplay&&game){game.remaining=Math.min(game.duration+600,game.remaining+60);updateHud();toast('DEV: 제한시간 +60초')}};
$('#devZeroTrace').onclick=()=>{if(devGameplay&&game){game.trace=0;updateHud();toast('DEV: TRACE 0%')}};
$('#devAddScore').onclick=()=>{if(devGameplay&&game){game.score+=1000;updateHud();toast('DEV: SCORE +1000')}};
$('#devUnlockCore').onclick=()=>{if(devGameplay&&game&&game.phase==='map'){game.cleared=Math.max(MIN_CORE_NODES,game.cleared);if(!game.edges.some(e=>e.a===game.lastNodeId&&e.b==='core'))game.edges.push({a:game.lastNodeId,b:'core'});updateHud();renderMap();toast('DEV: CORE 직접 경로 해제')}};
$('#devRegenMap').onclick=()=>{if(devGameplay&&devAuthenticated){startGame();document.body.classList.add('dev-gameplay');$('#devGameBar').classList.remove('hidden');toast('DEV: 네트워크 재생성')}};
$('#devBackConsole').onclick=devReturnConsole;
document.addEventListener('keydown',e=>{
 // v4.16: simple cross-platform developer shortcut.
 // Works the same on Windows and MacBook: Shift + D.
 if(e.shiftKey&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&e.code==='KeyD'){
  e.preventDefault();
  if(screen==='menu')openDevAuth();
 }
});

function syncSettings(){
 document.body.classList.toggle('large-text',settings.largeText);
 document.body.classList.toggle('motion-on',settings.motion);
 $('#setSound').checked=settings.sound;
 $('#setVolume').value=settings.volume;
 $('#volumeText').textContent=settings.volume+'%';
 $('#setParallax').checked=settings.parallax;
 $('#setMotion').checked=settings.motion;
 $('#setLargeText').checked=settings.largeText;
}
syncSettings();
$('#menuStart').onclick=()=>{tutorialStage=0;tutorialSolved=false;renderTutorial();go('tutorial')};
$('#menuSettings').onclick=()=>{previousScreen='menu';syncSettings();go('settings')};$('#menuRank').onclick=()=>go('ranking');
function returnToMain(){
 clearPuzzleTimers();
 const pauseShade=$('#pauseShade');if(pauseShade)pauseShade.remove();
 const guide=$('#nodeGuideDialog');if(guide)guide.classList.add('hidden');
 guideOpen=false;pauseActive=false;
 if(game){game.paused=false;if(['map','core'].includes(game.phase))game.phase='abandoned'}
 puzzle=null;overlayMode='';
 const overlay=$('#overlay');if(overlay)overlay.classList.add('hidden');
 game=null;
 devTest=false;devTestKey='';devGameplay=false;devAuthenticated=false;$('#devGameBar').classList.add('hidden');document.body.classList.remove('dev-test-active','dev-gameplay');
 frameTime=performance.now();
 syncSettings();
 go('menu');
}
$$('[data-home]').forEach(b=>b.onclick=returnToMain);
function returnFromSettings(){
 if(previousScreen==='game'&&game?.paused&&pauseActive){
  go('game');
  const overlay=$('#overlay');
  if(overlay.dataset.pauseHidden==='true'){
   overlay.classList.remove('hidden');
   delete overlay.dataset.pauseHidden;
  }
  const shade=$('#pauseShade');
  if(shade){shade.classList.remove('hidden');$('#pauseResume').focus()}
 }else{
  go(previousScreen);
 }
}
$('#settingsBack').onclick=()=>{syncSettings();returnFromSettings()};
$('#saveSettings').onclick=()=>{
 settings.sound=$('#setSound').checked;
 settings.volume=Number($('#setVolume').value);
 settings.parallax=$('#setParallax').checked;
 settings.motion=$('#setMotion').checked;
 settings.largeText=$('#setLargeText').checked;
 store(SETTINGS,settings);
 syncSettings();
 toast('설정이 저장되었습니다.');
 returnFromSettings();
};
$('#settings').addEventListener('keydown',e=>{
 if(e.key==='Escape'&&previousScreen==='game'&&game?.paused){e.preventDefault();syncSettings();returnFromSettings()}
});
$('#setVolume').oninput=()=>$('#volumeText').textContent=$('#setVolume').value+'%';
function updateClock(){const t=new Date();$('#menuClock').textContent=[t.getHours(),t.getMinutes(),t.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':')}updateClock();setInterval(updateClock,1000);
const zone=$('#parallaxZone');let paraX=0,paraY=0,paraRaf=0;zone.addEventListener('pointermove',e=>{if(!settings.parallax||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=zone.getBoundingClientRect();paraX=((e.clientX-r.left)/r.width-.5)*2;paraY=((e.clientY-r.top)/r.height-.5)*2;if(!paraRaf)paraRaf=requestAnimationFrame(moveParallax)});zone.addEventListener('pointerleave',()=>{paraX=0;paraY=0;if(!paraRaf)paraRaf=requestAnimationFrame(moveParallax)});function moveParallax(){paraRaf=0;$$('#parallaxZone .depth').forEach(el=>{const layer=el.classList.contains('v5-back-depth')?.65:el.classList.contains('v5-mid-depth')?1.0:1.42;const base=window.innerWidth<700?8.5:16;const tx=(paraX*base*layer).toFixed(1);const ty=(paraY*(base*.78)*layer).toFixed(1);const scale=(1+layer*0.012).toFixed(3);el.style.transform=`translate3d(${tx}px,${ty}px,0) scale(${scale})`})}

/* V3.3 main console — fictional real-time telemetry only; no network calls. */
const menuDesc=$('#menuHoverHint'),menuCode=$('#menuHoverCode');
$$('.v4-menu-action').forEach(button=>{
 const enter=()=>{menuDesc.textContent=button.dataset.hint;menuCode.textContent=button.dataset.code;};
 const exit=()=>{menuDesc.textContent='메뉴를 선택해 작업을 진행하세요.';menuCode.textContent='STANDBY / AWAITING COMMAND';};
 button.addEventListener('pointerenter',enter);button.addEventListener('focus',enter);
 button.addEventListener('pointerleave',exit);button.addEventListener('blur',exit);
});
function boxifyMenuNodes(){
 const ns='http://www.w3.org/2000/svg';
 $$('#menu .v5-node').forEach(node=>{
   if(node.querySelector('.v6-node-chip')) return;
   const outer=node.querySelector('.v5-node-outer');
   const inner=node.querySelector('.v5-node-inner');
   const r=outer?Number(outer.getAttribute('r')||12):12;
   const name=(node.dataset.name||'').toUpperCase();
   const isMajor=r>=20 || /LOCAL HOST|GOV|CORE|FINANCIAL|DARKNET/.test(name);
   const isMedium=!isMajor && r>=11;
   if(isMajor) node.classList.add('v6-major');
   else if(isMedium) node.classList.add('v6-medium');
   if(isMajor){
     const rect=document.createElementNS(ns,'rect');
     rect.setAttribute('class','v6-panel-node');
     rect.setAttribute('x',String(-(r+7.5)));
     rect.setAttribute('y',String(-(r+7.5)));
     rect.setAttribute('width',String((r+7.5)*2));
     rect.setAttribute('height',String((r+7.5)*2));
     rect.setAttribute('rx','4'); rect.setAttribute('ry','4');
     const detail=document.createElementNS(ns,'path');
     detail.setAttribute('class','v6-panel-detail');
     const d=r+4;
     detail.setAttribute('d',`M${-d} ${-d}H${-d+8} M${d} ${-d}H${d-8} M${-d} ${d}H${-d+8} M${d} ${d}H${d-8} M${-d} ${-d}V${-d+8} M${d} ${-d}V${-d+8} M${-d} ${d}V${d-8} M${d} ${d}V${d-8}`);
     node.insertBefore(rect,node.firstChild);
     node.insertBefore(detail,node.children[1]);
   } else if(isMedium){
     const corners=document.createElementNS(ns,'path');
     corners.setAttribute('class','v6-mini-brackets');
     const d=r+3;
     corners.setAttribute('d',`M${-d} ${-d}H${-d+5} M${d} ${-d}H${d-5} M${-d} ${d}H${-d+5} M${d} ${d}H${d-5} M${-d} ${-d}V${-d+5} M${d} ${-d}V${-d+5} M${-d} ${d}V${d-5} M${d} ${d}V${d-5}`);
     node.insertBefore(corners,node.firstChild);
   }
   const chip=document.createElementNS(ns,'rect');
   chip.setAttribute('class','v6-node-chip');
   const ir=inner?Number(inner.getAttribute('r')||3):3;
   chip.setAttribute('x',String(-(ir+1.6)));
   chip.setAttribute('y',String(-(ir+1.6)));
   chip.setAttribute('width',String((ir+1.6)*2));
   chip.setAttribute('height',String((ir+1.6)*2));
   chip.setAttribute('rx','1.2'); chip.setAttribute('ry','1.2');
   node.insertBefore(chip,node.children[isMajor?2:1]||null);
 });
}
function pulseMenuNodeGlitch(){
 const pool=[...$$('#menu .v5-node.v6-major, #menu .v5-node.v6-medium')];
 if(!pool.length || screen!=='menu' || document.hidden || !settings.motion) return;
 const node=pool[Math.floor(Math.random()*pool.length)];
 node.classList.add('v6-glitch');
 setTimeout(()=>node.classList.remove('v6-glitch'), 180+Math.random()*260);
}
boxifyMenuNodes();
setInterval(pulseMenuNodeGlitch, 1200);
const menuLogo=$('#menu .v4-glitch-logo');
let glitchTimer=null;
function triggerMenuGlitch(){
 if(screen!=='menu'||!settings.motion||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 menuLogo.classList.remove('v4-glitching');void menuLogo.offsetWidth;menuLogo.classList.add('v4-glitching');
 setTimeout(()=>menuLogo.classList.remove('v4-glitching'),570);
}
function scheduleMenuGlitch(){
 glitchTimer=setTimeout(()=>{if(screen==='menu')triggerMenuGlitch();scheduleMenuGlitch();},650+Math.random()*1050);
}
scheduleMenuGlitch();
const menuEvents=[
 ['INFO','gateway handshake established'],['OK','route table synchronized'],['INFO','packet header parsed / 0xA7'],
 ['OK','AES channel verified'],['INFO','node scan completed: 07 active'],['INFO','port 443 / TLS session open'],
 ['WARN','anomalous latency on relay-09'],['OK','connection path rerouted'],['INFO','packet integrity check passed'],
 ['INFO','auth token cache updated'],['OK','signal stabilized / 18 ms'],['INFO','trace engine monitoring'],
 ['WARN','duplicate request signature'],['OK','routing checksum matched'],['INFO','queue flushed: 128 frames'],
 ['INFO','decrypt simulation phase 02'],['INFO','core gateway responding'],['WARN','firewall signature changed / segment 04'],['OK','multi-hop tunnel validated'],['INFO','topology delta: 2 routes unstable'],['OK','host heartbeat received']
];
const menuLogElement=$('#menuFeed');
function menuLog(){
 if(screen!=='menu'||document.hidden)return;
 const [severity, message]=menuEvents[Math.floor(Math.random()*menuEvents.length)];
 const row=document.createElement('div');row.className=severity==='OK'?'v4-log-ok':severity==='WARN'?'v4-log-warn':'';
 const t=document.createElement('span');t.className='v4-log-time';t.textContent='['+new Date().toTimeString().slice(0,8)+']';
 row.append(t,document.createTextNode(' '+severity+' > '+message));menuLogElement.appendChild(row);
 while(menuLogElement.children.length>48)menuLogElement.firstElementChild.remove();
 menuLogElement.scrollTop=menuLogElement.scrollHeight;
}
for(let i=0;i<8;i++)menuLog();
setInterval(menuLog,690);
const trafficBuffer=Array.from({length:64},(_,i)=>150+35*Math.sin(i*.22)+Math.random()*70);
const traceBuffer=Array.from({length:64},(_,i)=>11+1.5*Math.sin(i*.12)+Math.random()*1.5);
let activityBuffer=[.45,.65,.8,.38,.58,.91,.51,.67,.44,.72,.34,.59];
let fakeTrace=12.4,lastFakeGraphTime=0;
function drawConsoleLine(canvas,data,stroke,fill){
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
 ctx.strokeStyle='rgba(118,132,178,.13)';ctx.lineWidth=1;
 for(let i=1;i<4;i++){let y=i*h/4;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 for(let i=1;i<8;i++){let x=i*w/8;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
 const lo=Math.min(...data)-8, hi=Math.max(...data)+8;const pts=data.map((v,i)=>[i*w/(data.length-1),h-5-(v-lo)/(hi-lo)*(h-15)]);
 const gradient=ctx.createLinearGradient(0,0,0,h);gradient.addColorStop(0,fill);gradient.addColorStop(1,'rgba(0,0,0,0)');
 ctx.beginPath();ctx.moveTo(pts[0][0],h);pts.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(w,h);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();
 ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=stroke;ctx.lineWidth=2.7;ctx.shadowColor=stroke;ctx.shadowBlur=9;ctx.stroke();ctx.shadowBlur=0;
 const end=pts[pts.length-1];ctx.beginPath();ctx.arc(end[0],end[1],4.1,0,Math.PI*2);ctx.fillStyle=stroke;ctx.fill();
}
function drawConsoleActivity(){
 const canvas=$('#v4NodeChart'),ctx=canvas.getContext('2d');if(!ctx)return;const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
 const barW=w/activityBuffer.length;
 activityBuffer.forEach((v,i)=>{const ht=7+v*(h-16);ctx.fillStyle=i%3===0?'#bdbaa6':i%4===0?'#a58ba9':'#8098c1';ctx.globalAlpha=.25+v*.7;ctx.fillRect(i*barW+3,h-ht,barW-9,ht)});ctx.globalAlpha=1;
}
function advanceConsoleGraphs(){
 if(screen!=='menu'||document.hidden)return;
 const prev=trafficBuffer[trafficBuffer.length-1];
 const next=Math.max(80,Math.min(515,prev+(Math.random()-.46)*105));trafficBuffer.shift();trafficBuffer.push(next);
 fakeTrace=Math.max(3,Math.min(64,fakeTrace+(Math.random()-.5)*2.8));traceBuffer.shift();traceBuffer.push(fakeTrace);
 activityBuffer=activityBuffer.map(v=>Math.max(.18,Math.min(.98,v+(Math.random()-.5)*.36)));
 $('#v4TrafficNumber').innerHTML=Math.round(next)+' <small>PKT/S</small>';
 $('#v4TraceNumber').innerHTML=fakeTrace.toFixed(1)+' <small>%</small>';
 $('#v4NodeNumber').innerHTML=(6+(Math.random()>.48?1:2)).toString().padStart(2,'0')+' <small>ACTIVE</small>';
 drawConsoleLine($('#v4TrafficChart'),trafficBuffer,'#a3b6dc','rgba(119,141,194,.18)');
 drawConsoleLine($('#v4TraceChart'),traceBuffer,'#c5bc95','rgba(182,174,134,.11)');
 drawConsoleActivity();
 // The monitor is simulated. Keep the selected endpoint long enough to read.
 if(!advanceConsoleGraphs.lastSelection || performance.now()-advanceConsoleGraphs.lastSelection>2100){
 advanceConsoleGraphs.lastSelection=performance.now();
 const nodes=$$('#v4Topology .v5-node');nodes.forEach(n=>n.classList.remove('v4-flash','v5-targeted'));
 const pool=nodes.filter(n=>!n.classList.contains('v5-off')&&!n.classList.contains('v5-red'));
 const active=pool[Math.floor(Math.random()*pool.length)];
 active.classList.add('v4-flash','v5-targeted');
 $('#v5Target').textContent=active.dataset.name;
 $('#v5TargetDetails').textContent=pick(['BUFFER 0x17 / HOLD','HANDSHAKE PARTIAL','SEGMENT STATE / DIRTY','PTR MATCH / 0x1A','AUTH CACHE / READY']);
 $('#v4ScanMessage').textContent=pick(['CHECKING MEMORY MAP...','FAULT TABLE / VERIFY...','REBUILDING ROUTE INDEX...','VERIFYING SESSION CACHE...','SCANNING BROKEN POINTERS...']);
 $('#v4NodesFound').textContent=24+' NODES DISCOVERED';
 $('#v5HostCount').textContent=17+rnd(0,3);
 $('#v5Route').textContent=pick(['EDGE → RELAY → CORE','GATEWAY → DATA / 05','LOCAL → EDGE → RELAY','RELAY / 08 → FIREWALL']);

 }
}
advanceConsoleGraphs();setInterval(advanceConsoleGraphs,300);
setInterval(()=>{if(screen==='menu'&&!document.hidden){const el=$('#v5DiagBytes');if(el)el.textContent='0x'+rnd(4096,65535).toString(16).toUpperCase().padStart(4,'0')}},1150);
zone.addEventListener('pointermove',e=>{const r=zone.getBoundingClientRect();$('#v4CoordX').textContent=((e.clientX-r.left)/r.width*2-1).toFixed(3);$('#v4CoordY').textContent=((e.clientY-r.top)/r.height*2-1).toFixed(3)});

const mapCanvas=$('.map-canvas');
mapCanvas.addEventListener('pointermove',e=>{if(!settings.parallax||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=mapCanvas.getBoundingClientRect();mapCanvas.style.setProperty('--map-x',((e.clientX-r.left)/r.width-.5)*15+'px');mapCanvas.style.setProperty('--map-y',((e.clientY-r.top)/r.height-.5)*11+'px')});
mapCanvas.addEventListener('pointerleave',()=>{mapCanvas.style.setProperty('--map-x','0px');mapCanvas.style.setProperty('--map-y','0px')});

function renderTutorial(){
 const steps=[
  ['네트워크를 살펴보세요','노드를 선택하면 해당 장치의 정보를 확인할 수 있습니다. 노드를 4개 확보하면 중앙 서버 진입이 가능하며, 최대 6개까지 공략할 수 있습니다.',`<div class="training-flow"><span class="train-chip">네트워크 지도</span><span class="train-arrow">→</span><span class="train-chip highlight">노드 선택</span><span class="train-arrow">→</span><span class="train-chip">문제 해결</span></div>`],
  ['노드마다 특성이 달라요','연결은 정보, 데이터는 점수, 보안은 추적도, 차단은 보호 효과를 제공합니다. 더 자세한 내용은 언제든 화면 오른쪽 아래 ? 버튼으로 확인할 수 있습니다.',`<div class="node-guide-training"><div class="node-guide-cards">${nodeGuideCards()}</div></div>`],
  ['시간과 추적도를 관리하세요','퍼즐을 틀리면 추적도가 올라갑니다. 남은 시간이 0이 되거나 추적도가 100%가 되면 작전이 실패합니다. 보안 노드는 추적도를 낮추는 데 유리합니다.',`<div class="training-flow"><span class="train-chip">남은 시간 <b style="color:var(--yellow)">12:00</b></span><span class="train-chip">추적도 <b style="color:var(--pink)">28%</b></span><span class="train-chip highlight">보상 확보</span></div>`],
  ['간단한 연습 문제','다음 조건을 만족하는 연결을 선택해 보세요. 실제 게임에서는 퍼즐마다 규칙과 힌트를 확인할 수 있습니다.',`<div class="training-message">조건: <b style="color:var(--yellow)">보안 연결 / 포트 번호 443</b></div><div class="training-choices"><button class="outline" data-trainanswer="wrong">포트 80 · 일반 연결</button><button class="outline" data-trainanswer="right">포트 443 · 보안 연결</button><button class="outline" data-trainanswer="wrong">포트 22 · 원격 접속</button></div><div id="trainFeedback" class="feedback" style="text-align:center;margin-top:18px"></div>`]
 ];
 const last=steps.length-1,s=steps[tutorialStage];
 $('#tutorialStepLabel').textContent=`기본 훈련 ${String(tutorialStage+1).padStart(2,'0')} / 0${steps.length}`;
 $('#tutorialTitle').textContent=s[0];$('#tutorialDescription').textContent=s[1];$('#tutorialVisual').innerHTML=s[2];
 $('#tutorialBack').style.visibility=tutorialStage?'visible':'hidden';
 $('#tutorialNext').textContent=tutorialStage===last?'난이도 선택 →':'다음 단계 →';
 $('#tutorialNext').disabled=tutorialStage===last&&!tutorialSolved;
 $('#tutorialSkip').style.display='';
 $$('[data-trainanswer]').forEach(b=>b.onclick=()=>{if(b.dataset.trainanswer==='right'){tutorialSolved=true;$('#trainFeedback').textContent='접근 승인! 조건을 올바르게 확인했습니다.';$('#trainFeedback').className='feedback';b.classList.add('selected');$('#tutorialNext').disabled=false;sound('ok')}else{$('#trainFeedback').textContent='조건을 다시 확인하세요. 두 조건을 모두 만족해야 합니다.';$('#trainFeedback').className='feedback warn';sound('bad')}});
}
$('#tutorialNext').onclick=()=>{if(tutorialStage<3){tutorialStage++;renderTutorial()}else if(tutorialSolved){store('pzd_v32_tutorial',true);go('difficulty')}};$('#tutorialBack').onclick=()=>{tutorialStage=Math.max(0,tutorialStage-1);renderTutorial()};$('#tutorialSkip').onclick=()=>{tutorialSolved=false;go('difficulty')};$('#diffBack').onclick=()=>{tutorialStage=3;renderTutorial();go('tutorial')};
$$('[data-difficulty]').forEach(b=>b.onclick=()=>{diff=b.dataset.difficulty;$$('[data-difficulty]').forEach(x=>{let selected=x.dataset.difficulty===diff;x.classList.toggle('selected',selected);x.querySelector('.card-select').textContent=selected?'선택됨 ✓':'선택하기 →'})});$('#launchGame').onclick=startGame;
const NODE_NAMES={
 normal:['PROXY','MAIL','RELAY','GATEWAY','VPN_EDGE','DNS_HUB','REMOTE','UPLINK','BRIDGE','SOCKET'],
 data:['ARCHIVE','CACHE','DEV_DB','VAULT','BACKUP','RECORDS','MIRROR','STORAGE','LEDGER','DUMP'],
 security:['FIREWALL','AUTH','IDS','WAF','SENTINEL','WATCHDOG','ACL_GATE','MONITOR','GUARD','FILTER'],
 blocker:['ICE_CORE','COLD_GATE','SANDBOX','BLACKLIST','QUARANTINE','DEADLOCK','TRAP','LOCKBOX','NULL_GATE','CIPHER_WALL']
};
function makeIrregularNetwork(){
 // Six decision layers are kept because the player may clear up to six regular nodes.
 // Every layer contains 2~3 nodes, so a chosen route never collapses into a single forced path.
 const layerCount=6;
 const counts=Array.from({length:layerCount},()=>rnd(2,3)); // 2 or 3 nodes per layer
 const total=counts.reduce((a,b)=>a+b,0); // 12~18 regular nodes
 const xStart=175,xEnd=835,step=(xEnd-xStart)/(layerCount-1);
 let positions=[],idx=0;
 counts.forEach((count,layer)=>{
  let baseYs=Array.from({length:count},(_,i)=>(i+1)*600/(count+1));
  baseYs=baseYs.map(y=>Math.max(72,Math.min(535,y+rnd(-52,53)))).sort((a,b)=>a-b);
  baseYs.forEach(y=>positions.push({
   layer,
   x:Math.round(xStart+layer*step+rnd(-28,29)),
   y:Math.round(y),
   order:idx++
  }));
 });
 // Guarantee all four node categories while randomizing the remaining hosts.
 let types=shuffle([...TYPES,...Array.from({length:total-4},()=>pick(TYPES))]);
 const usedNames={normal:[],data:[],security:[],blocker:[]};
 const nodes=positions.map((pos,i)=>{
  let type=types[i],pool=NODE_NAMES[type].filter(x=>!usedNames[type].includes(x));
  let codename=pool.length?pick(pool):NODE_NAMES[type][i%NODE_NAMES[type].length]+'_'+String(i+1).padStart(2,'0');
  usedNames[type].push(codename);
  return {id:'n'+String(i+1).padStart(2,'0'),codename,type,key:null,x:pos.x,y:pos.y,layer:pos.layer,cleared:false};
 });
 const layers=Array.from({length:layerCount},(_,l)=>nodes.filter(n=>n.layer===l).sort((a,b)=>a.y-b.y));
 const edgeSet=new Set(),edges=[];
 const addEdge=(a,b)=>{
  const aid=typeof a==='string'?a:a.id,bid=typeof b==='string'?b:b.id;
  const key=aid+'>'+bid;
  if(aid!==bid&&!edgeSet.has(key)){edgeSet.add(key);edges.push({a:aid,b:bid})}
 };
 // First layer itself contains 2~3 hosts, and every one is reachable from ENTRY.
 // This prevents decorative dead hosts that can never be selected.
 const entryChoiceCount=layers[0].length;
 layers[0].forEach(n=>addEdge('entry',n));

 // Every node in layers 0~4 gets at least two different choices in the next layer.
 // When the next layer has three hosts, some nodes expose all three to keep runs varied.
 for(let l=0;l<layerCount-1;l++){
  layers[l].forEach(n=>{
   let next=[...layers[l+1]].sort((a,b)=>Math.abs(a.y-n.y)-Math.abs(b.y-n.y));
   let choiceCount=next.length>=3&&Math.random()<.48?3:2;
   next.slice(0,choiceCount).forEach(target=>addEdge(n,target));
  });
  // Make sure every host in the next layer is reachable by at least one previous host.
  layers[l+1].forEach(target=>{
   if(!edges.some(e=>e.b===target.id&&layers[l].some(prev=>prev.id===e.a))){
    let prev=[...layers[l]].sort((a,b)=>Math.abs(a.y-target.y)-Math.abs(b.y-target.y))[0];
    addEdge(prev,target);
   }
  });
 }

 // After four regular nodes have been cleared, CORE becomes an additional route choice.
 // The player can enter immediately or keep taking one of the 2~3 regular branches for rewards.
 for(let l=MIN_CORE_NODES-1;l<layerCount;l++)layers[l].forEach(n=>addEdge(n,'core'));

 return {
  nodes,edges,total,layerCount,
  entry:{x:48,y:rnd(250,351)},
  core:{x:970,y:rnd(250,351)},
  entryChoiceCount
 };
}
function startGame(){
 closeOverlay();pauseActive=false;
 const reserved={};
 TYPES.forEach(type=>{let keys=Object.keys(PUZZLES).filter(k=>PUZZLES[k].type===type);reserved[type]=shuffle(keys)[0]});
 const net=makeIrregularNetwork();
 game={diff,phase:'map',duration:diff==='easy'?300:180,remaining:diff==='easy'?300:180,elapsed:0,trace:0,score:0,misses:0,hints:0,cleared:0,shield:0,intel:0,reveal:false,coreClue:0,nodes:net.nodes,edges:net.edges,entry:net.entry,core:net.core,totalNodes:net.total,layerCount:net.layerCount,entryChoiceCount:net.entryChoiceCount,reserved,coreStage:0,coreBits:[],paused:false,seed:rnd(100000,999999),saved:false,lastNodeId:'entry'};
 $('#gameLog').innerHTML='';
 log(`모의 네트워크 접속 완료. ${game.totalNodes}개 일반 노드 검색됨.`,'good');
 log(`분기형 망 생성: ENTRY 선택지 ${net.entryChoiceCount}개 / 각 침투 단계 최소 2개 경로.`,'warn');
 log('연결된 경로 중 하나를 선택해 전진합니다. 4개 확보 후 CORE 진입 또는 추가 분기 탐색 가능.');
 renderMap();updateHud();go('game')
}
function routeTargets(fromId=game?.lastNodeId){
 if(!game||!fromId)return[];
 return (game.edges||[]).filter(e=>e.a===fromId).map(e=>e.b);
}
function isNodeAccessible(n){
 if(!game||!n||n.cleared||game.phase!=='map'||game.cleared>=6)return false;
 return routeTargets().includes(n.id);
}
function isCoreAccessible(){
 return !!(game&&game.phase==='map'&&game.cleared>=MIN_CORE_NODES&&routeTargets().includes('core'));
}

function updateEdgeGlitch(){
 if(!game)return;
 const effect=$('#edgeGlitch');
 if(!effect)return;
 // Mission elapsed time (not wall time) drives the escalation. Pauses freeze it.
 const progress=Math.max(0,Math.min(1,(game.elapsed||0)/Math.max(1,game.duration||1)));
 const intensity=.36+.64*Math.pow(progress,1.05);
 effect.style.setProperty('--edge-opacity',(0.37+0.59*intensity).toFixed(3));
 effect.style.setProperty('--edge-speed',(2.9-2.42*intensity).toFixed(2)+'s');
 effect.style.setProperty('--edge-width',Math.round(145+150*intensity)+'px');
 effect.style.setProperty('--edge-height',Math.round(130+130*intensity)+'px');
 effect.style.setProperty('--edge-shift',Math.round(7+21*intensity)+'px');
 effect.style.setProperty('--edge-static',(0.23+0.67*intensity).toFixed(3));
 effect.dataset.intensity=progress<.35?'low':progress<.7?'medium':'high';
}

function updateHud(){
 if(!game)return;
 updateEdgeGlitch();
 $('#hudTime').textContent=mmss(game.remaining);
 $('#hudTrace').textContent=Math.floor(game.trace)+'%';
 $('#hudTraceBar').style.width=game.trace+'%';
 $('#hudScore').textContent=fmt(game.score);
 $('#hudMisses').textContent=game.misses;
 $('#hudCleared').textContent=game.cleared;
 $('#hudShield').textContent=game.shield+'회';
 $('#hudIntel').textContent=game.intel+'개';
 $('#networkSeed').textContent='망 ID: '+game.seed+' / '+game.totalNodes+' HOSTS';
 $('#goalPips').innerHTML=Array.from({length:6},(_,i)=>`<span class="${i<game.cleared?'done':i<MIN_CORE_NODES?'required':''}"></span>`).join('');
 let coreReady=isCoreAccessible(),enough=game.cleared>=MIN_CORE_NODES,next=routeTargets().filter(id=>id!=='core'&&game.nodes.some(n=>n.id===id&&!n.cleared));
 $('#coreEnterSide').disabled=!coreReady;
 $('#hudObjective').textContent=game.phase==='core'?'중앙 서버 '+(game.coreStage+1)+'/5 단계':coreReady?'중앙 서버 진입 가능':enough?'연결 경로를 따라 CORE 탐색':'일반 노드 '+(MIN_CORE_NODES-game.cleared)+'개 추가 확보';
 $('#missionHeadline').textContent=game.phase==='core'?'중앙 서버 보안 해제':coreReady?'중앙 서버 진입 가능':'연결된 다음 노드 침투';
 $('#missionDescription').textContent=game.phase==='core'
  ?'서로 다른 네 유형의 보안을 해제한 다음 최종 XOR 잠금을 풉니다.'
  :coreReady
   ?'현재 확보한 노드가 중앙 서버와 직접 연결되어 있습니다. CORE로 진입할 수 있습니다.'
   :next.length
    ?`현재 위치에서 ${next.length}개의 직접 연결 경로가 열려 있습니다. 원하는 노드를 골라 다음 침투 경로를 결정하세요.`
    :'현재 경로에서 추가 일반 노드를 찾을 수 없습니다.';
 $('#mapGuide').textContent=coreReady
  ?'현재 노드 → CORE 연결 확인. 중앙 서버 진입이 가능합니다.'
  :`현재 침투 지점: ${game.lastNodeId==='entry'?'ENTRY':(game.nodes.find(n=>n.id===game.lastNodeId)?.codename||game.lastNodeId)} // 다음 선택지 ${next.length}개 // 코랄 경로만 접근 가능`;
 let danger=game.trace>=85;document.body.classList.toggle('danger-active',danger);
}
function renderMap(){
 if(!game)return;
 const svg=$('#mapSvg'),g=game,entry=g.entry||{x:66,y:300},center=g.core||{x:950,y:300};
 const availableIds=routeTargets(),coreReady=isCoreAccessible();
 let regularChoices=availableIds.filter(id=>id!=='core'&&g.nodes.some(n=>n.id===id&&!n.cleared)).length;$('#mapTitle').textContent=coreReady?`CORE + ${regularChoices}개 분기 선택 가능`:`침투 경로 탐색 // ${regularChoices} BRANCHES`;
 svg.setAttribute('aria-label',`${g.totalNodes}개 일반 노드와 중앙 서버를 표시한 무작위 네트워크 지도`);
 let lines=[],nodes=[];
 const getPoint=id=>{
  if(id==='entry')return entry;
  if(id==='core')return center;
  return g.nodes.find(n=>n.id===id);
 };
 (g.edges||[]).forEach((e,i)=>{
  let a=getPoint(e.a),b=getPoint(e.b);if(!a||!b)return;
  let ac=e.a==='entry'||e.a==='core'?false:a.cleared,bc=e.b==='entry'||e.b==='core'?false:b.cleared;
  let traversed=(ac&&bc)||(e.a==='entry'&&bc)||(e.b==='core'&&ac);
  let available=e.a===g.lastNodeId&&((e.b==='core'&&coreReady)||(e.b!=='core'&&availableIds.includes(e.b)&&!g.nodes.find(n=>n.id===e.b)?.cleared));
  let cls=traversed?' cleared':available?' available':' dormant';
  let mx=(a.x+b.x)/2+((i*37)%25-12),my=(a.y+b.y)/2+((i*19)%19-9);
  lines.push(`<path class="map-edge${cls}" d="M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}" data-route="${i}"/>`);
 });
 g.nodes.forEach(n=>{
  let m=META[n.type],accessible=isNodeAccessible(n),current=n.id===g.lastNodeId;
  let locked=!n.cleared&&!accessible,icon=n.cleared?'✓':m.icon;
  nodes.push(`<g class="map-node${n.cleared?' cleared':''}${accessible?' accessible':''}${current?' current':''}${locked?' locked':''}" data-node="${n.id}" data-type="${n.type}" transform="translate(${n.x},${n.y})" tabindex="${accessible?0:-1}" role="button" aria-disabled="${locked?'true':'false'}" aria-label="${n.codename}, ${m.name}, ${n.cleared?'확보됨':accessible?'다음 침투 가능':'현재 경로에서 접근 불가'}"><circle class="outer" r="25"/><text class="glyph" text-anchor="middle" dy="7">${icon}</text><text class="n-label" y="46">${n.codename}</text><text class="n-sub" y="61">${n.cleared?(current?'CURRENT ROUTE':(PUZZLES[n.key]?.name||'확보 완료')):(accessible?'LINK AVAILABLE':g.reveal?m.name+' / LOCKED':'ROUTE LOCKED')}</text></g>`)
 });
 nodes.push(`<g class="map-node ${coreReady?'node-pulse accessible':'locked'}" data-node="core" data-type="core" transform="translate(${center.x},${center.y})" tabindex="${coreReady?0:-1}" role="button" aria-disabled="${coreReady?'false':'true'}" aria-label="중앙 서버"><circle class="outer" r="37"/><rect x="-25" y="-25" width="50" height="50" fill="none" stroke="rgba(255,119,110,.28)" stroke-dasharray="4 5" transform="rotate(45)"/><text class="glyph" text-anchor="middle" dy="7">${coreReady?'◎':'×'}</text><text class="n-label" y="58">CORE</text><text class="n-sub" y="73">${coreReady?'DIRECT LINK':'ROUTE LOCKED'}</text></g>`);
 const entryCurrent=g.lastNodeId==='entry';
 const entryMarkup=`<g class="map-entry${entryCurrent?' current':''}" transform="translate(${entry.x},${entry.y})"><rect x="-13" y="-13" width="26" height="26" fill="#101724" stroke="${entryCurrent?'#ff776e':'#596b7d'}" stroke-width="1.5" transform="rotate(45)"/><text x="0" y="5" text-anchor="middle" font-size="11" fill="${entryCurrent?'#ff9187':'#778898'}">▶</text><text x="0" y="35" font-size="12" text-anchor="middle" fill="#d8dfe2">ENTRY</text><text x="0" y="49" font-size="9" text-anchor="middle" fill="#65798c">${entryCurrent?'CURRENT':'ORIGIN'}</text></g>`;
 svg.innerHTML=`${lines.join('')}${entryMarkup}${nodes.join('')}`;
 $$('[data-node]').forEach(el=>{
  const open=()=>{
   let id=el.dataset.node;
   if(id==='core'){
    if(isCoreAccessible())openCoreIntel();
    else toast(game.cleared<MIN_CORE_NODES?'일반 노드 4개 이상을 확보하고 CORE와 직접 연결된 경로까지 이동하세요.':'현재 노드에서 CORE로 직접 연결된 선이 없습니다.',true);
    return;
   }
   let n=game.nodes.find(n=>n.id===id);
   if(n?.cleared){toast(n.id===game.lastNodeId?'현재 침투 지점입니다.':'이미 지나온 노드입니다.');return}
   if(!isNodeAccessible(n)){toast('현재 침투 지점과 직접 연결된 노드만 선택할 수 있습니다.',true);return}
   openNodeIntel(n);
  };
  el.addEventListener('click',open);
  el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!el.classList.contains('locked')){e.preventDefault();open()}})
 })
}
$('#coreEnterSide').onclick=()=>{if(isCoreAccessible())openCoreIntel();else if(game?.phase==='map')toast('현재 노드와 CORE가 직접 연결되어야 진입할 수 있습니다.',true)};
function openNodeIntel(n){
 if(!game||game.phase!=='map'||!n)return;
 if(n.cleared){toast('이미 확보한 노드입니다.');return}
 if(!isNodeAccessible(n)){toast('현재 침투 지점과 직접 연결된 노드만 선택할 수 있습니다.',true);return}
 if(game.cleared>=6){toast('일반 노드는 최대 6개까지 공략할 수 있습니다.',true);return}
 let m=META[n.type], keys=Object.keys(PUZZLES).filter(k=>PUZZLES[k].type===n.type);
 let ranks=keys.map(k=>PUZZLES[k].rank), minRank=Math.min(...ranks), maxRank=Math.max(...ranks);
 openOverlay('노드 분석 / 진입 전 정보',(n.codename||n.id.toUpperCase())+' — '+m.name,
 `<div class="intel-overview"><div class="intel-icon" style="color:${m.color};border-color:${m.color}">${m.icon}</div><div><div class="intel-title">${m.name}</div><p class="intel-text">${m.desc}</p></div></div>
 <div class="intel-stats">
   <div><small>선택 가능 프로토콜</small><b>4개</b></div>
   <div><small>난이도 범위</small><b>${['','쉬움','보통','어려움','매우 어려움'][minRank]} ~ ${['','쉬움','보통','어려움','매우 어려움'][maxRank]}</b></div>
   <div><small>노드 보상</small><b>${m.reward}</b></div>
   <div><small>선택 방식</small><b>직접 선택</b></div>
 </div>
 <div class="information"><b>진입 방식:</b> 침투 시작 후 이 노드에 연결된 4개 퍼즐을 비교하고 하나를 선택합니다.<br><span class="micro">퍼즐을 선택하기 전에는 문제 풀이가 시작되지 않습니다.</span></div>`,
 `<button class="outline" id="intelCancel">돌아가기</button><button class="bright" id="intelGo">프로토콜 선택 ▶</button>`,'intel');
 $('#intelCancel').onclick=closeOverlay;
 $('#intelGo').onclick=()=>openPuzzleSelect(n);
}
function puzzleChoiceProfile(key){
 const p=PUZZLES[key];
 const profiles={
  n1:['빠른 판별','낮은 난이도와 짧은 풀이','점수 배점이 낮음'],
  n2:['경로 분석','안정적인 점수와 규칙성','순서를 놓치면 재판단 필요'],
  n3:['정밀 조정','조작이 직관적이고 안정적','수치 확인에 시간이 필요'],
  n4:['포트 매칭','높은 배점과 명확한 규칙','오연결 시 추적 위험이 큼'],
  d1:['고위험 고득점','데이터 계열 최고 배점','선택 제약이 강하고 난도가 높음'],
  d2:['안정형','규칙 파악이 빠르면 신속 해결','추가적인 전략 보상은 적음'],
  d3:['복구형','높은 점수와 순서 추론','비교할 정보가 많아 시간이 걸림'],
  d4:['검증형','낮은 위험으로 빠르게 해결','데이터 계열 중 배점이 낮음'],
  s1:['로그 분석','추적 관리에 어울리는 분석형','조건을 동시에 비교해야 함'],
  s2:['순서 복원','낮은 난이도로 안정적','점수 기대값이 낮음'],
  s3:['권한 판정','보안 계열 최고 배점','오판 시 실패 페널티가 큼'],
  s4:['반복 탐지','빠른 빈도 분석','단순한 대신 배점이 낮음'],
  b1:['기억형','패턴 기억에 강하면 빠름','순간 기억 실수에 취약'],
  b2:['회피형','직관적인 실시간 판단','연속 성공이 필요함'],
  b3:['조정형','논리적으로 상태를 맞출 수 있음','조작 횟수가 늘어날 수 있음'],
  b4:['타이밍형','차단 계열 최고 배점','타이밍 실패 위험이 가장 큼']
 };
 return profiles[key]||['표준형','규칙이 명확함','실패 시 추적도 증가'];
}
function openPuzzleSelect(n){
 if(!game||game.phase!=='map'||!n||n.cleared)return;
 let m=META[n.type],keys=Object.keys(PUZZLES).filter(k=>PUZZLES[k].type===n.type);
 let cards=keys.map((key,i)=>{
  let p=PUZZLES[key], prof=puzzleChoiceProfile(key), pen=failPenalty(p.rank,key);
  return `<button class="protocol-card" data-protocol="${key}" style="--protocol-accent:${m.color}" aria-label="${p.name} 선택">
   <span class="protocol-index">PROTOCOL 0${i+1}</span>
   <span class="protocol-name">${p.name}</span>
   <span class="protocol-role">${prof[0]}</span>
   <span class="protocol-rule">${p.rule}</span>
   <span class="protocol-metrics"><span>난이도 <b>${'★'.repeat(p.rank)}${'☆'.repeat(4-p.rank)}</b></span><span>성공 <b>+${fmt(pointValue(p.rank,key))}</b></span><span>실패 <b>TRACE +${pen}%</b></span></span>
   <span class="protocol-pro"><em>+</em> ${prof[1]}</span>
   <span class="protocol-con"><em>−</em> ${prof[2]}</span>
   <span class="protocol-cta">이 프로토콜 선택 →</span>
  </button>`;
 }).join('');
 openOverlay('침투 프로토콜 / 4개 중 1개 선택',(n.codename||n.id.toUpperCase())+' — '+m.name+' 프로토콜',
 `<div class="protocol-select-head"><div><span class="protocol-kicker">SELECT ONE OF FOUR</span><p>${m.name}에 사용할 퍼즐을 직접 선택하세요. 난이도·점수·실패 위험이 서로 다릅니다.</p></div><div class="protocol-node-reward"><small>노드 확보 보상</small><b>${m.reward}</b></div></div><div class="protocol-grid">${cards}</div><div class="protocol-help">카드에 표시된 장단점을 비교한 뒤 하나를 선택하세요. <b>카드를 누르는 순간 해당 퍼즐이 시작됩니다.</b></div>`,
 `<button class="outline" id="protocolBack">노드 정보로 돌아가기</button>`,'select');
 $('#protocolBack').onclick=()=>openNodeIntel(n);
 $$('[data-protocol]').forEach(card=>card.onclick=()=>{let key=card.dataset.protocol;n.key=key;startPuzzle(n,key,false)});
}
function openCoreIntel(){if(!isCoreAccessible())return;let more=Math.max(0,6-game.cleared);openOverlay('중앙 서버 / 최종 진입 확인','중앙 서버 진입 준비',`<p class="intel-text">일반 노드 <b style="color:var(--yellow)">${game.cleared}개</b> 확보 완료. 중앙 서버에 들어가면 일반 노드로 돌아올 수 없습니다.</p><div class="intel-stats"><div><small>남은 시간</small><b>${mmss(game.remaining)}</b></div><div><small>추적도</small><b>${Math.floor(game.trace)}%</b></div><div><small>보호 효과</small><b>${game.shield}회</b></div><div><small>추가 공략 가능</small><b>${more}개</b></div></div><div class="core-preview"><div>01<strong>데이터</strong></div><div>02<strong>연결</strong></div><div>03<strong>보안</strong></div><div>04<strong>차단</strong></div><div>05<strong>최종 XOR</strong></div></div><div class="information">각 유형에서 <b>일반 노드에 나오지 않은 퍼즐</b>이 1개씩 등장합니다. 다섯 단계를 연속으로 완료해야 성공합니다.</div>`,`<button class="outline" id="coreBack">추가 노드 공략</button><button class="bright" id="coreConfirm">중앙 서버 진입 ▶</button>`,'intel');$('#coreBack').onclick=closeOverlay;$('#coreConfirm').onclick=()=>{game.phase='core';game.coreStage=0;game.coreBits=[];log('중앙 서버 진입. 철수 불가. 5단계 보안 해제 시작.','warn');renderCorePuzzle()}}
function pointValue(rank,key){return key?puzzleTune(key).reward:[0,700,1100,1550,2100][rank]}
function failPenalty(rank,key){return key?puzzleTune(key)[game?.diff==='hard'?'traceHard':'traceEasy']:(game?.diff==='hard'?6:3)+rank*2}
function failPuzzle(msg){if(!game||!puzzle||puzzle.solved)return;game.misses++;let pen=failPenalty(puzzle.meta.rank,puzzle.key);if(game.shield>0){game.shield--;pen=Math.max(0,pen-7);toast('차단 노드 보호 효과 적용! 추적도 페널티 감소.')}game.trace=Math.min(100,game.trace+pen);game.score=Math.max(0,game.score-puzzleTune(puzzle.key).missScore);setFeedback(`오답: ${msg} · 추적도 +${pen}%`,'warn');sound('bad');log(`${puzzle.meta.name}: 오류 발생, 추적도 +${pen}%`,'warn');updateHud();if(game.trace>=100)endGame(false,'추적도가 100%에 도달했습니다.')}
function setFeedback(msg,kind=''){let el=$('#puzzleFeedback');if(el){el.textContent=msg;el.className='feedback'+(kind?' '+kind:'')}}
function setPuzzleContent(html){$('#puzzleMount').innerHTML=html}
function pButton(text,handler,opts={}){let b=document.createElement('button');b.textContent=text;if(opts.className)b.className=opts.className;if(opts.small)b.style.fontSize='12px';b.onclick=handler;return b}
function puzzleArea(){return $('#puzzleMount')}
function puzzleGrid(buttons,columns=4){const grid=document.createElement('div');grid.className=`puzzle-grid cols${columns}`;buttons.forEach(x=>grid.appendChild(x));return grid}
function targetHTML(label,codes){return `<div class="target-line"><span class="label">${esc(label)}</span>${codes.map(c=>`<span class="code-chip">${esc(c)}</span>`).join('')}</div>`}
function displayPuzzle(key,node,isCore){clearPuzzleTimers();const meta=PUZZLES[key]||{type:'core',name:'최종 암호 해제',rank:2,rule:'서로 다른 두 비트는 1, 같은 두 비트는 0입니다.',hints:['왼쪽에서 오른쪽으로 한 자리씩 비교하세요.','1과 0은 서로 다르므로 1입니다.','같은 수는 0, 다른 수는 1입니다.']};let uid=Math.random();puzzle={key,node,isCore,meta,uid,solved:false,hintLevel:0};let stage=isCore?`<div class="core-progress">${Array.from({length:5},(_,i)=>`<span class="${i<game.coreStage?'done':i===game.coreStage?'now':''}"></span>`).join('')}</div>`:'';let subtitle=isCore?'중앙 서버 보안 '+(game.coreStage+1)+' / 5':'장치 '+node.id+' / '+META[node.type].name;openOverlay(isCore?'중앙 서버 / 단계별 보안 해제':'노드 공략 / 퍼즐',meta.name,`${stage}<div class="puzzle-header"><div class="puzzle-number">${subtitle}</div><h3>${meta.name}</h3><p>${meta.rule}</p></div><div class="puzzle-area" id="puzzleMount"></div><div class="hint-panel hidden" id="puzzleHint"></div><div id="puzzleFeedback" class="feedback" style="margin-top:12px">화면의 규칙을 읽고 조작을 시작하세요.</div>`,`<span class="puzzle-risk">오답: 추적도 +${failPenalty(meta.rank,key)}%</span><span class="puzzle-reward">성공 +${fmt(pointValue(meta.rank,key))}점</span><div class="grow"></div><button class="outline" id="hintBtn">힌트 보기 (0/3)</button><button class="outline" id="puzzlePause">Ⅱ 일시정지</button>${isCore?'':'<button class="outline" id="puzzleBack">지도 복귀</button>'}`,isCore?'core':'puzzle');$('#hintBtn').onclick=showHint;$('#puzzlePause').onclick=openPause;if(!isCore)$('#puzzleBack').onclick=()=>{closeOverlay();log('선택한 노드의 공략을 잠시 중단했습니다.')};if(!PUZZLE_BUILDERS[key]&&key!=='xor'){setPuzzleContent('<p>퍼즐을 불러올 수 없습니다.</p>');return} (PUZZLE_BUILDERS[key]||buildXor)(puzzle)}
function startPuzzle(node,key,isCore){if(!game||!['map','core'].includes(game.phase))return;displayPuzzle(key,node,isCore)}
function showHint(){if(!puzzle||puzzle.solved)return;if(puzzle.hintLevel>=3){toast('모든 힌트를 확인했습니다.');return}let lv=++puzzle.hintLevel,pen=lv===1?0:lv===2?100:200;game.hints++;game.score=Math.max(0,game.score-pen);$('#hintBtn').textContent=`힌트 보기 (${lv}/3)`;let el=$('#puzzleHint');el.classList.remove('hidden');el.innerHTML=`<b>힌트 ${lv}/3</b> · ${esc(puzzle.meta.hints[lv-1])}${pen?` <span style="color:var(--red)">(-${pen}점)</span>`:' (무료)'}`;updateHud()}
function solvePuzzle(){if(!puzzle||puzzle.solved)return;puzzle.solved=true;let solved=puzzle;game.score+=pointValue(solved.meta.rank,solved.key);setFeedback(devTest?'DEV TEST PASS // 퍼즐 정상 완료':'정답입니다! 보안 장치 접근이 승인되었습니다.');sound('ok');$$('#puzzleMount button').forEach(x=>x.disabled=true);if(devTest){devResults[devTestKey]='pass';$('#overlayFooter').innerHTML=`<span class="puzzle-reward">QA RESULT: PASS</span><div class="grow"></div><button class="bright" id="devTestDone">테스트 완료 → 목록</button>`;$('#devTestDone').onclick=closeDevPuzzle;return}later(()=>{if(puzzle!==solved||!game||game.phase==='failed')return;if(solved.isCore){let pos=game.coreStage;if(pos<4){game.coreBits.push({cipher:rnd(0,1),key:rnd(0,1)});game.score+=380;game.coreStage++;log(`중앙 서버 ${pos+1}단계 완료. 다음 보안 구간 개방.`,'good');renderCoreStageDone(pos)}else{game.score+=1800;endGame(true)}}else{const n=solved.node;n.cleared=true;game.cleared++;game.lastNodeId=n.id;applyNodeReward(n);log(`${META[n.type].name} 확보 · ${solved.meta.name} 해결!`,'good');closeOverlay();updateHud();renderMap();toast(`${META[n.type].name} 확보! +${fmt(pointValue(solved.meta.rank,solved.key))}점`);if(game.cleared===MIN_CORE_NODES)later(()=>{if(game?.phase==='map')toast(isCoreAccessible()?'CORE 직결 경로 확보! 중앙 서버 진입 가능.':'CORE 권한 확보. 연결 경로를 따라 중앙 서버까지 이동하세요.')},500)}},520)}
function applyNodeReward(n){switch(n.type){case 'normal':game.reveal=true;break;case 'data':game.intel++;game.coreClue++;game.score+=250;break;case 'security':game.trace=Math.max(0,game.trace-12);break;case 'blocker':game.shield++;break}}
function renderCoreStageDone(stage){clearPuzzleTimers();let lines=['데이터 서버에서 암호 정보 확보','통신 경로를 재설정했습니다','인증 시스템을 통과했습니다','방어 장치의 차단을 해제했습니다'];let stageNames=['데이터','연결','보안','차단','최종 XOR'];openOverlay('중앙 서버 / 보안 계층 완료',`${stage+1}단계 해제 완료`,`<div class="core-progress">${Array.from({length:5},(_,i)=>`<span class="${i<game.coreStage?'done':i===game.coreStage?'now':''}"></span>`).join('')}</div><div class="finish-card"><div class="symbol">✓</div><h3>${lines[stage]}</h3><p>이전 단계의 보안 정보가 최종 암호 해제에 사용됩니다.</p><p style="color:var(--cyan);margin-top:14px">다음 단계: ${stageNames[stage+1]}</p></div>`,`<button class="outline" id="coreHold">Ⅱ 일시정지</button><button class="bright" id="coreContinue">${stage===3?'최종 암호 해제':'다음 보안 단계'} →</button>`,'core');$('#coreHold').onclick=openPause;$('#coreContinue').onclick=renderCorePuzzle}
function renderCorePuzzle(){if(!game||game.phase!=='core')return;let keys=['data','normal','security','blocker'];let key=game.coreStage===4?'xor':game.reserved[keys[game.coreStage]];let fakeNode={id:'중앙 서버',type:keys[game.coreStage]||'core'};displayPuzzle(key,fakeNode,true)}
function endGame(won,reason=''){if(!game||['won','failed','abandoned'].includes(game.phase))return;game.phase=won?'won':'failed';clearPuzzleTimers();closeOverlay();pauseActive=false;let elapsed=game.duration-game.remaining,trace=Math.floor(game.trace),timeBonus=0,stealthBonus=0,speedTier='';if(won){let remainRatio=game.duration>0?game.remaining/game.duration:0,baseTimeBonus=Math.floor(game.remaining*2),speedBonus=remainRatio>=.6?1500:remainRatio>=.4?900:remainRatio>=.2?400:0;speedTier=remainRatio>=.6?'SPEED GHOST':remainRatio>=.4?'FAST BREACH':remainRatio>=.2?'QUICK EXIT':'';timeBonus=baseTimeBonus+speedBonus;stealthBonus=Math.floor((100-game.trace)*20);game.score+=timeBonus+stealthBonus;game.timeBonus=timeBonus;game.speedBonus=speedBonus;game.speedTier=speedTier;game.stealthBonus=stealthBonus;let grade=trace<30&&game.misses<=2?'S':trace<55?'A':trace<78?'B':'C';game.grade=grade;game.ending=trace<30?'완벽한 침투':trace<70?'침투 성공':'위험한 성공';game.saved=false;game.nickname='';game.pendingRecord={diff:game.diff,score:game.score,time:elapsed,trace,grade,date:new Date().toLocaleDateString('ko-KR')};sound('complete')}else{game.grade='—';game.ending='침투 실패';game.pendingRecord=null;sound('bad')}$('#resultIcon').textContent=won?'◈':'✕';$('#resultEyebrow').textContent=won?'최종 보안 해제 / 완료':'작전 중단 / 경고';$('#resultTitle').textContent=game.ending;$('#resultDescription').textContent=won?(trace<30?'추적 흔적을 거의 남기지 않고 중앙 서버에 접근했습니다.':trace<70?'중앙 서버의 보안을 모두 돌파했습니다.':'위험한 추적 상태에서도 마지막 암호를 해제했습니다.'):(reason||'제한 시간이 지나거나 위치가 노출되어 작전이 종료되었습니다.');$('#resultGrade').textContent=game.grade;$('#resultScore').textContent=fmt(game.score);$('#resultTime').textContent=mmss(elapsed);$('#resultTrace').textContent=trace+'%';$('#resultNodes').textContent=game.cleared+'/6';$('#resultMisses').textContent=game.misses+'회';$('#resultHints').textContent=game.hints+'회';$('#resultTimeBonus').textContent=won?'+'+fmt(timeBonus):'+0';$('#resultStealthBonus').textContent=won?'+'+fmt(stealthBonus):'+0';$('#resultTip').innerHTML=won?(speedTier?`<b>${speedTier}</b> // 제한시간을 크게 남겨 추가 시간 보너스를 확보했습니다. <span>최종 TIME BONUS +${fmt(timeBonus)}</span>`:`남은 시간에 따라 <b>TIME BONUS +${fmt(timeBonus)}</b>가 반영되었습니다. 더 빠르게 침투하면 추가 보너스 구간에 진입합니다.`):'일반 노드의 보상과 힌트를 적절히 사용하면 다음 작전에서 유리합니다.';$('#resultRank').style.display=won?'':'none';$('#nicknameRegister').classList.toggle('hidden',!won||devGameplay);$('#hardContactField').classList.toggle('hidden',!won||devGameplay||game.diff!=='hard');$('#hardContactPhone').value='';$('#nicknameInput').value='';$('#hardContactPhone').disabled=false;$('#nicknameInput').disabled=false;$('#nicknameSave').disabled=false;$('#nicknameSave').textContent='기록 등록';$('#nicknameFeedback').className='nickname-feedback';$('#nicknameFeedback').textContent=won&&!devGameplay?'클리어 기록은 닉네임을 등록한 뒤 랭킹에 저장됩니다.':'';go('result');if(won)setTimeout(()=>$('#nicknameInput')?.focus(),180)}
function normalizeNickname(value){return String(value??'').trim()}
function normalizeContactPhone(value){const digits=String(value??'').replace(/[^0-9]/g,'');return /^01[016789][0-9]{7,8}$/.test(digits)?digits:''}
function formatContactPhone(value){const s=normalizeContactPhone(value);return !s?'—':s.slice(0,3)+'-'+s.slice(3,-4)+'-'+s.slice(-4)}
function registerNickname(){if(devGameplay){toast('DEV SANDBOX 기록은 랭킹에 저장되지 않습니다.',true);return}if(!game||game.phase!=='won'||game.saved||!game.pendingRecord)return;let nickname=normalizeNickname($('#nicknameInput').value);let feedback=$('#nicknameFeedback');if(!nickname){feedback.className='nickname-feedback bad';feedback.textContent='닉네임을 입력하세요.';$('#nicknameInput').focus();return}if(nickname.length>12||!/^[가-힣A-Za-z0-9_.-]+$/.test(nickname)){feedback.className='nickname-feedback bad';feedback.textContent='한글·영문·숫자·_ . - 만 사용해 12자 이내로 입력하세요.';$('#nicknameInput').focus();return}let phone='';if(game.diff==='hard'){const rawPhone=$('#hardContactPhone').value.trim();phone=normalizeContactPhone(rawPhone);if(rawPhone&&!phone){feedback.className='nickname-feedback bad';feedback.textContent='전화번호 형식을 확인하세요 (예: 010-1234-5678).';$('#hardContactPhone').focus();return}}let records=read(STORAGE,[]);if(!Array.isArray(records))records=[];records.push({...game.pendingRecord,nickname,...(phone?{contactPhone:phone}:{})});store(STORAGE,records.slice(-150));game.nickname=nickname;game.saved=true;feedback.className='nickname-feedback good';feedback.textContent=`REGISTERED // ${nickname} 이름으로 랭킹 기록이 저장되었습니다.`;$('#nicknameInput').disabled=true;$('#hardContactPhone').disabled=true;$('#nicknameSave').disabled=true;$('#nicknameSave').textContent='등록 완료 ✓';sound('ok')}
$('#nicknameSave').onclick=registerNickname;
$('#nicknameInput').addEventListener('keydown',e=>{if(e.key==='Enter')registerNickname()});
function openPause(){
 if(screen!=='game'||!game||game.paused||!['map','core'].includes(game.phase))return;
 game.paused=true;
 pauseActive=true;
 suspendPuzzleTimers();
 const returnFocus=document.activeElement;
 const shade=document.createElement('div');
 shade.className='overlay game-pause-overlay';
 shade.id='pauseShade';
 shade.setAttribute('role','dialog');
 shade.setAttribute('aria-modal','true');
 shade.setAttribute('aria-labelledby','pauseMenuTitle');
 shade.innerHTML=`<div class="game-pause-shell">
  <div class="game-pause-heading">
   <div class="section-brow">SESSION / SYSTEM MENU</div>
   <h2 id="pauseMenuTitle">게임 메뉴</h2>
   <p>작전이 일시정지되었습니다.<br>메뉴를 닫기 전까지 시간과 추적도는 증가하지 않습니다.</p>
  </div>
  <div id="pauseOptions" class="game-pause-options">
   <button type="button" id="pauseResume" class="game-pause-option primary">
    <span class="game-pause-icon" aria-hidden="true">▶</span><span><b>계속하기</b><small>현재 작전으로 돌아갑니다</small></span><span class="game-pause-chevron" aria-hidden="true">›</span>
   </button>
   <button type="button" id="pauseSettings" class="game-pause-option">
    <span class="game-pause-icon" aria-hidden="true">⚙</span><span><b>설정</b><small>효과음 · 움직임 · 글자 크기 변경</small></span><span class="game-pause-chevron" aria-hidden="true">›</span>
   </button>
   <button type="button" id="pauseExit" class="game-pause-option danger">
    <span class="game-pause-icon" aria-hidden="true">✕</span><span><b>종료</b><small>진행 중인 작전을 종료합니다</small></span><span class="game-pause-chevron" aria-hidden="true">›</span>
   </button>
  </div>
  <div id="pauseExitPrompt" class="game-pause-confirm hidden" role="group" aria-label="작전 종료 확인">
   <strong>작전을 종료할까요?</strong>
   <p>진행 중인 작전은 저장되지 않으며 메인 메뉴로 돌아갑니다.</p>
   <div class="game-pause-confirm-actions">
    <button type="button" id="pauseExitCancel" class="outline">취소</button>
    <button type="button" id="pauseExitConfirm" class="outline danger">종료하기</button>
   </div>
  </div>
  <div class="game-pause-footer">PROJECT: ZERO-DAY // SESSION PAUSED</div>
 </div>`;
 document.body.appendChild(shade);
 const resume=()=>{
  if(!game)return;
  game.paused=false;
  pauseActive=false;
  resumePuzzleTimers();
  shade.remove();
  frameTime=performance.now();
  if(returnFocus&&returnFocus.isConnected)returnFocus.focus();
  else $('#pauseBtn').focus();
 };
 const cancelExit=()=>{
  $('#pauseExitPrompt').classList.add('hidden');
  $('#pauseOptions').classList.remove('hidden');
  $('#pauseExit').focus();
 };
 $('#pauseResume').onclick=resume;
 $('#pauseSettings').onclick=()=>{
  previousScreen='game';
  syncSettings();
  const overlay=$('#overlay');
  if(!overlay.classList.contains('hidden')){
   overlay.dataset.pauseHidden='true';
   overlay.classList.add('hidden');
  }
  shade.classList.add('hidden');
  go('settings');
  $('#settingsBack').focus();
 };
 $('#pauseExit').onclick=()=>{
  $('#pauseOptions').classList.add('hidden');
  $('#pauseExitPrompt').classList.remove('hidden');
  $('#pauseExitCancel').focus();
 };
 $('#pauseExitCancel').onclick=cancelExit;
 $('#pauseExitConfirm').onclick=()=>{
  if(devGameplay&&devAuthenticated)devReturnConsole();
  else returnToMain();
 };
 shade.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
   e.preventDefault();
   if(!$('#pauseExitPrompt').classList.contains('hidden'))cancelExit();
   else resume();
  }else if(e.key==='Tab'){
   const controls=[...shade.querySelectorAll('button')].filter(b=>!b.disabled&&b.offsetParent!==null);
   if(!controls.length)return;
   const first=controls[0],last=controls[controls.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 });
 $('#pauseResume').focus();
}
$('#pauseBtn').onclick=openPause;$('#overlayGameMenu').onclick=openPause;$('#overlayClose').onclick=()=>{if(devTest){closeDevPuzzle()}else if(overlayMode==='intel'||overlayMode==='puzzle'){closeOverlay()}else if(overlayMode==='core')openPause()};$('#resultRetry').onclick=()=>go('difficulty');$('#resultRank').onclick=()=>{if(game?.phase==='won'&&!game.saved){$('#nicknameFeedback').className='nickname-feedback bad';$('#nicknameFeedback').textContent='현재 클리어 기록을 랭킹에 남기려면 먼저 닉네임을 등록하세요.';$('#nicknameInput').focus();return}rankDiff=game?.diff||'easy';renderRanking();go('ranking')};
function parseRankNumber(value,percent=false){
 if(typeof value!=='number'&&typeof value!=='string')return null;
 let raw=String(value).trim().replace(/,/g,'');
 if(percent)raw=raw.replace(/%$/,'').trim();
 if(!raw)return null;
 const n=Number(raw);
 return Number.isFinite(n)?n:null;
}
function normalizeRankingRecord(record,index){
 if(!record||typeof record!=='object'||!['easy','hard'].includes(record.diff))return null;
 const score=parseRankNumber(record.score),time=parseRankNumber(record.time),trace=parseRankNumber(record.trace,true);
 if(score===null||score<0||time===null||time<0)return null;
 return {
  nickname:String(record.nickname||'ANON'),
  diff:record.diff,
  score:Math.round(score),
  time:Math.round(time*100)/100,
  trace:trace!==null&&trace>=0&&trace<=100?Math.round(trace*10)/10:null,
  grade:String(record.grade||'—'),
  date:String(record.date||'—'),
  index
 };
}
function compareRankingRecords(a,b,metric){
 const traceOrder=a.trace===null?(b.trace===null?0:1):b.trace===null?-1:a.trace-b.trace;
 if(metric==='overall')return b.overall-a.overall||b.score-a.score||a.time-b.time||traceOrder||b.index-a.index;
 if(metric==='time')return a.time-b.time||b.score-a.score||traceOrder||b.index-a.index;
 if(metric==='trace')return traceOrder||b.score-a.score||a.time-b.time||b.index-a.index;
 return b.score-a.score||a.time-b.time||traceOrder||b.index-a.index;
}
// Overall index is a 0–100 weighted percentile across valid records in the selected difficulty.
// Equal raw metric values receive equal percentile credit; missing trace earns no trace credit.
function assignOverallRankingScores(records){
 const count=records.length;
 records.forEach(r=>{r.overall=0});
 if(!count)return records;
 const metrics=[{key:'score',weight:.5,ascending:false},{key:'time',weight:.3,ascending:true},{key:'trace',weight:.2,ascending:true}];
 metrics.forEach(({key,weight,ascending})=>{
  const ordered=records.filter(r=>r[key]!==null).sort((a,b)=>ascending?a[key]-b[key]:b[key]-a[key]);
  let firstAt=0;
  ordered.forEach((record,i)=>{
   if(i>0&&record[key]!==ordered[i-1][key])firstAt=i;
   const percentile=count===1?100:100*(count-1-firstAt)/(count-1);
   record.overall+=weight*percentile;
  });
 });
 records.forEach(r=>{r.overall=Math.round(r.overall*10)/10});
 return records;
}
function formatRankingTime(seconds){
 const centis=Math.round(seconds*100);
 return `${String(Math.floor(centis/6000)).padStart(2,'0')}:${String(Math.floor(centis/100)%60).padStart(2,'0')}.${String(centis%100).padStart(2,'0')}`;
}
function renderRanking(){
 const raw=read(STORAGE,[]);
 const records=(Array.isArray(raw)?raw:[]).map(normalizeRankingRecord).filter(Boolean).filter(r=>r.diff===rankDiff);
 assignOverallRankingScores(records);
 records.sort((a,b)=>compareRankingRecords(a,b,rankSort));
 const visible=records.slice(0,20);
 $('#rankingRows').innerHTML=visible.length?visible.map((r,i)=>`<tr>
  <td class="rank-number">${i+1}</td>
  <td>${esc(r.nickname)}</td>
  <td>${esc(r.grade)}</td>
  <td class="${rankSort==='overall'?'rank-primary rank-overall':'rank-overall'}">${r.overall.toFixed(1)}</td>
  <td class="${rankSort==='score'?'rank-primary':''}">${fmt(r.score)}</td>
  <td class="${rankSort==='time'?'rank-primary':''} rank-time">${formatRankingTime(r.time)}</td>
  <td class="${rankSort==='trace'?'rank-primary':''}">${r.trace===null?'—':r.trace+'%'}</td>
  <td>${esc(r.date)}</td>
 </tr>`).join(''):'<tr><td colspan="8" class="rank-empty">해당 난이도에 저장된 기록이 없습니다. 먼저 게임을 클리어하고 닉네임을 등록하세요.</td></tr>';
 const labels={overall:'종합 지수순',score:'최고 점수순',time:'최단 시간순',trace:'최저 추적도순'};
 const rules={overall:'점수 50% · 시간 30% · 추적도 20% | 동률: 점수 → 시간 → 추적도',score:'동점: 소요 시간 → 추적도 → 최신 기록',time:'동률: 점수 → 추적도 → 최신 기록',trace:'동률: 점수 → 소요 시간 → 최신 기록'};
 $('#rankingSummary').textContent=`${rankDiff==='hard'?'어려움':'쉬움'} · ${labels[rankSort]} · ${records.length}개 기록${records.length>20?' (상위 20개 표시)':''}`;
 $('#rankingRule').textContent=rules[rankSort];
 $$('[data-sort]').forEach(b=>{
  const selected=b.dataset.sort===rankSort;
  b.classList.toggle('selected',selected);
  b.setAttribute('aria-pressed',String(selected));
 });
 $$('[data-rankdiff]').forEach(b=>{
  const selected=b.dataset.rankdiff===rankDiff;
  b.classList.toggle('selected',selected);
  b.setAttribute('aria-pressed',String(selected));
 });
 $$('[data-rank-column]').forEach(th=>{
  th.setAttribute('aria-sort',th.dataset.rankColumn===rankSort?(rankSort==='score'||rankSort==='overall'?'descending':'ascending'):'none');
 });
}
$$('[data-sort]').forEach(b=>b.onclick=()=>{rankSort=b.dataset.sort;renderRanking()});$$('[data-rankdiff]').forEach(b=>b.onclick=()=>{rankDiff=b.dataset.rankdiff;renderRanking()});
function tick(now){let delta=Math.max(0,(now-frameTime)/1000);frameTime=now;if(game&&!game.paused&&!guideOpen&&['map','core'].includes(game.phase)){game.remaining=Math.max(0,game.remaining-delta);game.elapsed+=delta;game.trace=Math.min(100,game.trace+delta*(game.diff==='easy'?.047:.081));if(game.remaining<=0)endGame(false,'제한 시간이 모두 지났습니다.');else if(game.trace>=100)endGame(false,'추적도가 100%에 도달했습니다.');if(now-lastHud>150){lastHud=now;updateHud()}}requestAnimationFrame(tick)}requestAnimationFrame(tick);
const PUZZLE_BUILDERS={};
// 01 연결: 통신 조건에 따라 둘만 분류한다.
PUZZLE_BUILDERS.n1=p=>{const target=['보안 연결','지연 60 이상'];const good=[{p:'443',t:'보안',lat:76},{p:'443',t:'보안',lat:92}];const bad=[{p:'80',t:'일반',lat:82},{p:'443',t:'보안',lat:37}];let choices=shuffle([...good,...bad]);setPuzzleContent(targetHTML('통과 조건',target)+'<div class="quiz-instruction">두 조건에 맞는 <strong>기록 2개</strong>를 선택한 뒤 확인하세요.</div><div id="packetChoices" class="puzzle-grid cols2"></div><div class="quiz-actions"><span class="micro" id="packetCount">0 / 2 선택</span><button id="packetCheck">선택 확인</button></div>');let chosen=new Set();const holder=$('#packetChoices');choices.forEach((x,i)=>{let b=pButton(`포트 ${x.p}  |  ${x.t} 연결  |  지연 ${x.lat}`,()=>{if(chosen.has(i)){chosen.delete(i);b.classList.remove('selected')}else if(chosen.size<2){chosen.add(i);b.classList.add('selected')}$('#packetCount').textContent=chosen.size+' / 2 선택'});holder.appendChild(b)});$('#packetCheck').onclick=()=>{if(chosen.size!==2){setFeedback('기록을 정확히 2개 선택하세요.','warn');return}if([...chosen].every(i=>choices[i].p==='443'&&choices[i].lat>=60)){solvePuzzle()}else{failPuzzle('통과 조건을 모두 만족하지 않는 기록이 있습니다.');chosen.clear();$$('#packetChoices button').forEach(b=>b.classList.remove('selected'));$('#packetCount').textContent='0 / 2 선택'}}};
// 02 연결: 중계 장치 순서 복원.
PUZZLE_BUILDERS.n2=p=>{const seq=shuffle(['중계기','게이트','전송기','수신기']);let idx=0;setPuzzleContent(targetHTML('통신 순서',seq)+`<div class="quiz-instruction">다음으로 연결할 장치: <strong id="routeNext">${seq[0]}</strong></div><div id="routeChoices" class="puzzle-grid"></div><div class="target-line"><span class="label">연결한 장치</span><strong id="routeProgress" style="color:var(--yellow)">0 / 4</strong></div>`);const holder=$('#routeChoices');shuffle(seq).forEach(t=>{let b=pButton(t,()=>{if(t!==seq[idx]){failPuzzle('올바른 경유 지점을 확인하세요.');return}b.classList.add('success');b.disabled=true;idx++;$('#routeProgress').textContent=idx+' / 4';if(idx===4)solvePuzzle();else{$('#routeNext').textContent=seq[idx];setFeedback('연결 성공. 다음 지점으로 이동하세요.')}});holder.appendChild(b)})};
// 03 연결: 슬라이더로 목표 신호 동기화.
PUZZLE_BUILDERS.n3=p=>{let target=rnd(14,26)*5;setPuzzleContent(`${targetHTML('목표 주파수',[target+' Hz'])}<div class="slider-field"><label for="frequencyRange">현재 주파수</label><input id="frequencyRange" aria-label="주파수 조절" type="range" min="50" max="150" step="5" value="80"><b id="frequencyValue">80 Hz</b></div><div class="quiz-actions"><span class="quiz-instruction">좌우로 움직여 같은 값에 맞추세요.</span><button id="syncBtn">신호 동기화</button></div>`);$('#frequencyRange').oninput=e=>$('#frequencyValue').textContent=e.target.value+' Hz';$('#syncBtn').onclick=()=>{if(+$('input#frequencyRange').value===target)solvePuzzle();else failPuzzle('목표 주파수와 현재 주파수가 다릅니다.')}};
// 04 연결: 서비스 → 수신 포트 쌍 매칭.
PUZZLE_BUILDERS.n4=p=>{let ports=shuffle([{label:'보안 웹',port:443},{label:'이름 검색',port:53},{label:'메일 전송',port:25}]);let waiting=null,paired=new Set();setPuzzleContent(`<div class="quiz-instruction">왼쪽에서 서비스를 선택하고, 오른쪽에서 같은 번호의 수신 포트를 클릭하세요.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div><div class="section-brow" style="margin-bottom:8px">서비스 / 송신</div><div id="portSources" class="puzzle-grid cols2" style="grid-template-columns:1fr"></div></div><div><div class="section-brow" style="margin-bottom:8px">수신 포트</div><div id="portTargets" class="puzzle-grid cols2" style="grid-template-columns:1fr"></div></div></div><div class="target-line">연결 완료: <b id="portProgress" style="color:var(--yellow)">0 / 3</b></div>`);ports.forEach((port,i)=>{let b=pButton(`${port.label}  ·  ${port.port}`,()=>{if(paired.has(port.port))return;waiting={port:port.port,element:b};$$('#portSources button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');setFeedback('수신 포트를 선택하세요.');});b.dataset.port=port.port;$('#portSources').appendChild(b)});shuffle(ports).forEach(port=>{let b=pButton('수신 '+port.port,()=>{if(paired.has(port.port))return;if(!waiting){setFeedback('왼쪽 서비스를 먼저 선택하세요.','warn');return}if(waiting.port!==port.port){failPuzzle('서비스와 수신 포트 번호가 다릅니다.');return}paired.add(port.port);b.classList.add('success');b.disabled=true;waiting.element.classList.add('success');waiting.element.disabled=true;waiting=null;$('#portProgress').textContent=paired.size+' / 3';if(paired.size===3)solvePuzzle();else setFeedback('한 쌍을 연결했습니다.')});$('#portTargets').appendChild(b)})};
// 05 데이터: 사이버펑크 2077의 행·열 교대 구조에서 착안한 독자 코드 배열 퍼즐.
PUZZLE_BUILDERS.d1=p=>{const size=5,codes=['1C','55','7A','BD','E9','FF'];let len=game.diff==='easy'?3:4;let path=[],row=0,col=rnd(0,4);path.push([row,col]);for(let i=1;i<len;i++){if(i%2===1){let x=rnd(0,3);row=x>=row?x+1:x}else{let x=rnd(0,3);col=x>=col?x+1:x}path.push([row,col])}let target=Array.from({length:len},()=>pick(codes));let matrix=Array.from({length:size},()=>Array.from({length:size},()=>pick(codes)));path.forEach(([r,c],i)=>{matrix[r][c]=target[i]});let pos=[],used=new Set();setPuzzleContent(`${targetHTML('목표 배열',target)}<div class="target-line"><span class="label">입력 버퍼</span><div id="bufferTokens" style="display:flex;gap:7px;flex-wrap:wrap"></div></div><div class="quiz-instruction">처음은 <strong>가장 위 행</strong>입니다. 다음 위치는 열과 행을 번갈아 선택하세요. 올바른 숫자를 골랐어도 경로가 막히면 버퍼를 초기화해 다른 위치에서 다시 시작할 수 있습니다.</div><div id="hexGrid" class="puzzle-grid cols5"></div><div class="quiz-actions"><span class="micro">막힌 경로는 페널티 없이 다시 선택할 수 있습니다.</span><button class="outline" id="hexReset">버퍼 초기화 ↻</button></div><div class="quiz-instruction" id="hexInstruction"></div>`);let grid=$('#hexGrid');let cells=[];for(let r=0;r<size;r++)for(let c=0;c<size;c++){let i=r*size+c;let b=pButton(matrix[r][c],()=>select(r,c));b.className='tile';grid.appendChild(b);cells.push(b)}function allowed(r,c){if(!pos.length)return r===0;let [a,b]=pos[pos.length-1];return pos.length%2===1?c===b:r===a}function refresh(){cells.forEach((b,i)=>{let r=Math.floor(i/size),c=i%size,was=used.has(i);b.disabled=was||!allowed(r,c);b.classList.toggle('active',!was&&allowed(r,c));b.classList.toggle('unavailable',!was&&!allowed(r,c));b.classList.toggle('success',was)});$('#bufferTokens').innerHTML=Array.from({length:len},(_,i)=>`<span class="code-chip ${pos[i]?'':'empty'}">${pos[i]?target[i]:'—'}</span>`).join('');$('#hexInstruction').textContent=pos.length===0?`첫 번째 목표 ${target[0]}를 맨 위 행에서 찾으세요.`:`다음 목표 ${target[pos.length]} · ${pos.length%2===1?'같은 열':'같은 행'}에서 선택하세요.`}function select(r,c){let i=r*size+c;if(used.has(i)||!allowed(r,c))return;let wanted=target[pos.length];if(matrix[r][c]!==wanted){failPuzzle('목표 코드 순서와 맞지 않습니다. 다시 확인하세요.');return}pos.push([r,c]);used.add(i);if(pos.length===len){solvePuzzle();return}refresh()}$('#hexReset').onclick=()=>{if(puzzle?.solved)return;pos=[];used.clear();setFeedback('입력 버퍼를 초기화했습니다. 첫 번째 코드부터 다른 경로를 선택하세요.');refresh()};refresh()};
// 06 데이터: 일정 간격의 규칙을 찾아 숫자 해독.
PUZZLE_BUILDERS.d2=p=>{let start=rnd(6,24),delta=pick([3,4,5,6,-2,-3]);let nums=Array.from({length:5},(_,i)=>start+delta*i),answer=start+delta*5;let options=shuffle([answer,answer+2,answer+delta,answer-2]);setPuzzleContent(targetHTML('암호 데이터',nums)+`<div class="quiz-instruction">빈칸에 들어갈 여섯 번째 수를 누르세요.</div><div id="patternAnswers" class="puzzle-grid"></div>`);options.forEach(x=>$('#patternAnswers').appendChild(pButton(String(x),()=>x===answer?solvePuzzle():failPuzzle('숫자 사이의 일정한 차이를 다시 확인하세요.'))))};
// 07 데이터: 데이터 조각의 체크섬을 계산하고 순서대로 복구.
PUZZLE_BUILDERS.d3=p=>{
 const hard=game.diff==='hard',total=hard?5:4;
 const chunks=Array.from({length:total},(_,i)=>{
  const id=i+1,a=rnd(2,9),b=rnd(2,9),salt=rnd(1,5);
  return {id,a,b,salt,checksum:(a*3+b*2+salt)%10};
 });
 let pos=0,selected=null;
 setPuzzleContent(`<div class="quiz-instruction">패킷 순서를 복원하고 각 조각의 <strong>검증값(CHECK)</strong>을 계산하세요. 계산 규칙: <strong>(A × 3 + B × 2 + KEY) 의 일의 자리</strong>. ${hard?'HARD: 5개 패킷을 순서대로 검증해야 합니다.':'EASY: 4개 패킷을 검증합니다.'}</div>
 <div class="target-line"><span class="label">복원 진행</span><strong id="fragmentProgress" style="color:var(--yellow)">0 / ${total}</strong></div>
 <div id="fragmentGrid" class="puzzle-grid cols2 fragment-grid"></div>
 <div class="quiz-instruction" id="fragmentPrompt">먼저 패킷 01을 선택하세요.</div>
 <div class="quiz-actions" style="align-items:center;flex-wrap:wrap"><span class="micro">CHECK 값</span><div id="fragmentDigits" style="display:flex;gap:5px;flex-wrap:wrap"></div></div>`);
 const grid=$('#fragmentGrid'),digits=$('#fragmentDigits');
 const buttons=new Map();
 function drawDigits(){
  digits.innerHTML='';
  for(let i=0;i<=9;i++){
   const b=pButton(String(i),()=>{
    if(puzzle!==p||p.solved||!selected)return;
    if(i!==selected.checksum){failPuzzle('검증값 불일치. A×3 + B×2 + KEY의 일의 자리를 계산하세요.');return}
    const done=selected;buttons.get(done.id).disabled=true;buttons.get(done.id).classList.add('success');
    selected=null;pos++;$('#fragmentProgress').textContent=pos+' / '+total;
    if(pos===total){solvePuzzle();return}
    $('#fragmentPrompt').textContent='검증 성공. 다음 패킷 '+String(pos+1).padStart(2,'0')+'을 선택하세요.';
    digits.innerHTML='';
   },{small:true});b.style.minWidth='36px';digits.appendChild(b);
  }
 }
 shuffle(chunks).forEach(chunk=>{
  const b=pButton(`PACKET ${String(chunk.id).padStart(2,'0')}\\nA:${chunk.a}  B:${chunk.b}  KEY:${chunk.salt}`,()=>{
   if(puzzle!==p||p.solved||selected)return;
   if(chunk.id!==pos+1){failPuzzle('전송 순서가 올바르지 않습니다. 다음 패킷 번호를 확인하세요.');return}
   selected=chunk;
   $('#fragmentPrompt').textContent='PACKET '+String(chunk.id).padStart(2,'0')+' 검증값을 계산하여 아래 숫자를 선택하세요.';
   drawDigits();
  },{className:'fragment-packet'});
  b.style.whiteSpace='pre-line';buttons.set(chunk.id,b);grid.appendChild(b);
 });
};
// 08 데이터: 주 데이터와 복제본 차이 찾기.
PUZZLE_BUILDERS.d4=p=>{let base=Array.from({length:8},()=>String(rnd(0,1))).join('');let badAt=rnd(0,3),broken=base.split('');let at=rnd(0,7);broken[at]=broken[at]==='0'?'1':'0';let arr=Array.from({length:4},(_,i)=>i===badAt?broken.join(''):base);setPuzzleContent(`${targetHTML('기준 데이터',[base])}<div class="quiz-instruction">기준과 <strong>다른</strong> 복사본을 하나 선택하세요.</div><div id="copies" class="puzzle-grid cols2"></div>`);arr.forEach((code,i)=>$('#copies').appendChild(pButton(`복사본 ${i+1}\n${code}`,()=>i===badAt?solvePuzzle():failPuzzle('기준 데이터와 같은 정상 복사본입니다.'))))};
// 09 보안: 조건 2개를 만족하는 이상 로그 탐지.
PUZZLE_BUILDERS.s1=p=>{let items=shuffle([{state:'실패',lat:46,good:true},{state:'실패',lat:73,good:true},{state:'실패',lat:19,good:false},{state:'성공',lat:58,good:false},{state:'성공',lat:14,good:false},{state:'실패',lat:32,good:false}]);let picked=new Set();setPuzzleContent(`${targetHTML('경고 조건',['접속 실패','지연 ≥ 40'])}<div class="quiz-instruction">두 조건을 모두 만족하는 <strong>2개의 기록</strong>을 선택하세요.</div><div id="securityLogs" class="puzzle-grid cols2"></div><div class="quiz-actions"><span id="logCount" class="micro">0 / 2 선택</span><button id="logSubmit">검사 완료</button></div>`);items.forEach((x,i)=>{let b=pButton(`접속 ${x.state}\n지연 ${x.lat}ms`,()=>{if(picked.has(i)){picked.delete(i);b.classList.remove('selected')}else if(picked.size<2){picked.add(i);b.classList.add('selected')}$('#logCount').textContent=picked.size+' / 2 선택'});$('#securityLogs').appendChild(b)});$('#logSubmit').onclick=()=>{if(picked.size!==2){setFeedback('기록을 2개 선택하세요.','warn');return}if([...picked].every(i=>items[i].good))solvePuzzle();else{failPuzzle('접속 상태와 지연 수치가 모두 일치해야 합니다.');picked.clear();$$('#securityLogs button').forEach(b=>b.classList.remove('selected'));$('#logCount').textContent='0 / 2 선택'}}};
// 10 보안: 네 인증 단계의 선후관계.
PUZZLE_BUILDERS.s2=p=>{let seq=['접속 요청','신원 확인','암호 검증','접근 승인'],count=0;setPuzzleContent(`<div class="quiz-instruction">접속 요청부터 최종 접근 승인까지 진행 순서를 복원하세요.</div><div id="authSteps" class="puzzle-grid cols2"></div><div class="target-line"><span class="label">완료한 단계</span><strong id="authProgress" style="color:var(--yellow)">0 / 4</strong></div>`);shuffle(seq).forEach(t=>{let b=pButton(t,()=>{if(t!==seq[count]){failPuzzle('인증 단계의 순서를 다시 생각하세요.');return}count++;b.classList.add('success');b.disabled=true;$('#authProgress').textContent=count+' / 4';if(count===4)solvePuzzle();else setFeedback('다음 인증 단계를 선택하세요.')});$('#authSteps').appendChild(b)})};
// 11 보안: 권한 등급과 파일 등급 비교.
PUZZLE_BUILDERS.s3=p=>{let lvl=rnd(3,5),users=shuffle([{name:'분석가',level:lvl},{name:'관리자',level:lvl+1},{name:'방문자',level:lvl-2},{name:'실습생',level:lvl-1}]);let chosen=new Set();setPuzzleContent(`${targetHTML('파일 보안 등급',['등급 '+lvl])}<div class="quiz-instruction">접근 가능한 사용자 <strong>2명</strong>을 선택하세요. 사용자 권한 ≥ 파일 등급</div><div id="accessUsers" class="puzzle-grid cols2"></div><div class="quiz-actions"><span id="accessCount" class="micro">0 / 2 선택</span><button id="accessSubmit">권한 검사</button></div>`);users.forEach((u,i)=>{let b=pButton(`${u.name}\n권한 등급 ${u.level}`,()=>{if(chosen.has(i)){chosen.delete(i);b.classList.remove('selected')}else if(chosen.size<2){chosen.add(i);b.classList.add('selected')}$('#accessCount').textContent=chosen.size+' / 2 선택'});$('#accessUsers').appendChild(b)});$('#accessSubmit').onclick=()=>{if(chosen.size!==2){setFeedback('2명을 선택하세요.','warn');return}if([...chosen].every(i=>users[i].level>=lvl))solvePuzzle();else{failPuzzle('파일 등급보다 권한이 낮은 사용자가 포함되었습니다.');chosen.clear();$$('#accessUsers button').forEach(b=>b.classList.remove('selected'));$('#accessCount').textContent='0 / 2 선택'}}};
// 12 보안: 주소별 접속 횟수 빈도 분석.
PUZZLE_BUILDERS.s4=p=>{let ips=shuffle(['10.0.0.8','10.0.0.21','172.16.1.4','192.168.0.7']);let logs=shuffle([ips[0],ips[0],ips[0],ips[0],ips[1],ips[1],ips[2],ips[3]]);setPuzzleContent(`<div class="quiz-instruction">아래 기록에서 <strong>가장 여러 번 등장한 접속 주소</strong>를 찾으세요.</div><div class="target-line" style="justify-content:center;flex-wrap:wrap">${logs.map(x=>`<span class="code-chip" style="font-size:13px">${x}</span>`).join('')}</div><div id="ipChoices" class="puzzle-grid cols2"></div>`);shuffle(ips).forEach(ip=>$('#ipChoices').appendChild(pButton(ip,()=>ip===ips[0]?solvePuzzle():failPuzzle('접속 주소의 반복 횟수를 다시 세어 보세요.'))))};
// 13 차단: 랜덤 3×3 문자 패널의 코랄색 점등 순서를 기억하는 4단계 퍼즐.
PUZZLE_BUILDERS.b1=p=>{
 const symbols=shuffle(['1','2','3','4','5','A','B','C','D']);
 const path=shuffle(Array.from({length:9},(_,i)=>i)).slice(0,game.diff==='hard'?5:4);
 const balance=puzzleTune('b1');
 let cueMs=game.diff==='hard'?balance.firstCueHard:balance.firstCueEasy;
 let gapMs=game.diff==='hard'?balance.firstGapHard:balance.firstGapEasy;
 let pos=0,ready=false,plays=0,sequenceId=0;
 const memoryTimers=new Set();
 function memoryLater(fn,ms){const timer=setTimeout(()=>{memoryTimers.delete(timer);if(puzzle===p&&!p.solved)fn()},ms);memoryTimers.add(timer);return timer}
 function stopMemoryTimers(){memoryTimers.forEach(clearTimeout);memoryTimers.clear()}
 p.memoryStop=stopMemoryTimers;
 setPuzzleContent(`<div class="memory-sequence">
  <div class="memory-sequence-top"><span class="memory-kicker">MEMORY TRACE / ${path.length} SIGNALS</span><span id="memoryProgress" class="memory-count" aria-live="polite">0 / ${path.length}</span></div>
  <div class="quiz-instruction" id="memoryMessage" aria-live="polite">퍼즐 진입 시 패턴이 자동 재생됩니다. 점등 순서를 기억하세요. 각 칸은 밝은 코랄색으로 충분히 점등되며, 다시 보기는 ${fmt(balance.replayCost)}점을 사용해 느리게 볼 수 있습니다.</div>
  <div id="memoryGrid" class="puzzle-grid cols3 narrow-grid memory-grid" role="group" aria-label="3행 3열 기억 패널"></div>
  <div class="quiz-actions memory-actions"><span id="memoryState" class="micro">SIGNAL READY</span><button id="memoryStart" type="button" disabled>자동 점등 준비 중...</button></div>
 </div>`);
 const grid=$('#memoryGrid'),startBtn=$('#memoryStart'),message=$('#memoryMessage'),progress=$('#memoryProgress'),state=$('#memoryState');
 const bs=symbols.map((symbol,i)=>{
  const b=pButton(symbol,()=>{
   if(!ready||puzzle!==p||p.solved)return;
   if(path[pos]!==i){
    ready=false;
    pos=0;
    bs.forEach(tile=>tile.classList.remove('is-correct','is-wrong'));
    b.classList.add('is-wrong');
    progress.textContent='0 / '+path.length;
    state.textContent='SIGNAL MISMATCH';
    message.textContent='순서가 다릅니다. 첫 번째 칸부터 다시 선택하세요.';
    failPuzzle('점등된 '+path.length+'칸의 순서와 다릅니다.');
    const wrongSequenceId=sequenceId;
    memoryLater(()=>{
     if(!alive(wrongSequenceId))return;
     b.classList.remove('is-wrong');
     ready=true;
     state.textContent='INPUT READY';
    },550);
    return;
   }
   b.classList.add('is-correct');
   pos++;
   progress.textContent=pos+' / '+path.length;
   state.textContent='SIGNAL MATCH '+pos+' / '+path.length;
   if(pos===path.length){ready=false;solvePuzzle()}
  },{className:'memory-tile'});
  b.type='button';
  b.setAttribute('aria-label',symbol+' 위치 선택');
  grid.appendChild(b);
  return b;
 });
 function alive(id){return id===sequenceId&&puzzle===p&&!p.solved&&game&&game.phase!=='failed'}
 function flashNext(step,id){
  if(!alive(id))return;
  if(step>=path.length){
   ready=true;
   progress.textContent='0 / '+path.length;
   state.textContent='INPUT READY';
   message.textContent='방금 점등된 '+path.length+'칸을 처음부터 순서대로 누르세요.';
   startBtn.disabled=false;
   startBtn.textContent='느리게 다시 보기 (-'+fmt(balance.replayCost)+'점)';
   return;
  }
  const tile=bs[path[step]];
  tile.classList.add('is-cued');
  tile.setAttribute('aria-label',symbols[path[step]]+' 위치 점등 중');
  message.textContent=(step+1)+'번째 신호 점등 중 — 밝은 코랄색 칸의 위치를 기억하세요.';
  state.textContent='SIGNAL '+(step+1)+' / '+path.length;
  memoryLater(()=>{
   if(!alive(id))return;
   tile.classList.remove('is-cued');
   tile.setAttribute('aria-label',symbols[path[step]]+' 위치 선택');
   memoryLater(()=>flashNext(step+1,id),gapMs);
  },cueMs);
 }
 function playMemoryPattern(){
  if(!game||puzzle!==p||p.solved||!['map','core'].includes(game.phase))return;
  const replay=plays>0;
  if(replay){
   game.score=Math.max(0,game.score-balance.replayCost);
   updateHud();
  }
  cueMs=Math.max(replay?650:580,replay?(game.diff==='hard'?balance.replayCueHard:balance.replayCueEasy):(game.diff==='hard'?balance.firstCueHard:balance.firstCueEasy));
  gapMs=Math.max(140,replay?(game.diff==='hard'?balance.replayGapHard:balance.replayGapEasy):(game.diff==='hard'?balance.firstGapHard:balance.firstGapEasy));
  plays++;
  const id=++sequenceId;
  stopMemoryTimers();
  ready=false;
  pos=0;
  bs.forEach(tile=>tile.classList.remove('is-cued','is-correct','is-wrong'));
  progress.textContent=Array(path.length).fill('●').join(' ');
  state.textContent=replay?'SLOW REPLAY / -'+balance.replayCost+' PT':'SEQUENCE PLAYBACK';
  message.textContent=replay?'느린 속도로 다시 점등합니다. 코랄색 테두리가 켜지는 위치를 기억하세요.':'빠른 속도로 점등합니다. 코랄색 테두리가 켜지는 위치를 기억하세요.';
  startBtn.disabled=true;
  startBtn.textContent='점등 중...';
  memoryLater(()=>flashNext(0,id),replay?400:250);
 }
 startBtn.onclick=playMemoryPattern;
 // Start automatically after the puzzle grid has been inserted into the DOM.
 memoryLater(()=>{if(puzzle===p&&!p.solved)playMemoryPattern()},300);
};
// 14 차단: 방화벽이 잠시 공개하는 안전 경로를 기억하고 라운드별로 통과.
PUZZLE_BUILDERS.b2=p=>{
 const hard=game.diff==='hard',total=hard?5:4;
 let round=0,locked=true,showing=false;
 const delay=hard?1050:1600;
 setPuzzleContent(`<div class="target-line"><span class="label">방어 패턴 분석</span><strong id="safeProgress" style="color:var(--yellow)">1 / ${total}</strong></div>
 <div class="quiz-instruction">각 구간에서 <strong>청록색 안전 경로가 잠깐 공개</strong>됩니다. 이후 모든 경로가 차단 상태로 바뀌면 방금 확인한 안전 경로를 선택하세요. ${hard?'HARD: 공개 시간이 더 짧고, 구간이 5개입니다.':'EASY: 공개 시간이 넉넉하며, 구간이 4개입니다.'}</div>
 <div id="safeNotice" class="micro" style="margin:12px 0;color:var(--cyan)">보안 패턴 스캔 중...</div>
 <div id="safePaths" class="puzzle-grid cols3 safe-path-grid" role="group" aria-label="세 통로 중 안전 경로를 기억하고 선택"></div>`);
 const holder=$('#safePaths');
 function roundStart(){
  if(puzzle!==p||p.solved)return;
  locked=true;showing=true;const good=rnd(0,2);
  holder.innerHTML='';$('#safeProgress').textContent=(round+1)+' / '+total;
  $('#safeNotice').textContent='안전 경로 탐지 중 — 청록색 위치를 기억하세요!';
  const buttons=[];
  for(let i=0;i<3;i++){
   const ok=i===good;
   const b=pButton('경로 '+(i+1)+'\\n'+(ok?'◈ 안전 신호':'× 위험 신호'),()=>{
    if(locked||p.solved||puzzle!==p)return;
    if(!ok){failPuzzle('안전 경로를 잘못 기억했습니다. 해당 구간을 다시 분석하세요.');roundStart();return}
    locked=true;b.classList.add('success');round++;
    if(round===total){solvePuzzle();return}
    $('#safeNotice').textContent='우회 성공! 다음 방화벽을 분석합니다.';
    later(roundStart,puzzleTune('b2').nextDelay);
   },{className:'safe-path-tile'});
   b.style.whiteSpace='pre-line';
   b.style.borderColor=ok?'#39ecf1':'#ff476b';
   b.style.color=ok?'#39ecf1':'#ff9cad';
   b.style.background=ok?'rgba(57,236,241,.23)':'rgba(255,71,107,.09)';
   holder.appendChild(b);buttons.push(b);
  }
  later(()=>{
   if(puzzle!==p||p.solved||!showing)return;
   showing=false;locked=false;
   $('#safeNotice').textContent='스캔 종료 — 기억한 안전 경로를 선택하세요.';
   buttons.forEach((b,i)=>{b.textContent='경로 '+(i+1)+'\\n신호 차단';b.style.color='';b.style.borderColor='';b.style.background='';});
  },delay);
 }
 roundStart();
};
// 15 차단: 연결된 장치의 연쇄 반응을 역산하여 목표 전력 맞춤.
PUZZLE_BUILDERS.b3=p=>{
 const hard=game.diff==='hard',count=hard?4:3;
 const solution=Array.from({length:count},()=>rnd(0,2));
 const target=Array.from({length:count},(_,i)=>(solution[i]+solution[(i-1+count)%count])%3);
 const actual=Array(count).fill(0);
 const rules=Array.from({length:count},(_,i)=>hard?[i,(i+1)%count]:[i,(i+1)%count]);
 const clicks=Array(count).fill(0);
 setPuzzleContent(`<div class="quiz-instruction">보안 장치는 <strong>서로 연결</strong>되어 있습니다. 버튼을 누르면 해당 장치와 <strong>오른쪽 장치가 동시에 1단계 상승</strong>합니다(2 다음은 0). 목표 전력을 만들려면 연쇄 작동을 계산해야 합니다. ${hard?'HARD: 4개 장치':'EASY: 3개 장치'}</div>
 <div class="target-line"><span class="label">목표 전력</span>${target.map((x,i)=>`<span class="code-chip">D${i+1}: ${x}</span>`).join('')}</div>
 <div id="powerDevices" class="puzzle-grid cols${hard?4:3}"></div>
 <div class="quiz-actions"><span class="micro" id="powerHint">누를 때마다 두 장치가 함께 변합니다.</span><button id="powerReset" class="outline">초기화</button><button id="powerSubmit">설정 확인</button></div>`);
 const holder=$('#powerDevices'),buttons=[];
 function render(){buttons.forEach((b,i)=>{b.textContent='장치 '+(i+1)+'\\n현재 '+actual[i]+'단계';b.classList.toggle('selected',actual[i]===target[i])})}
 for(let i=0;i<count;i++){
  const b=pButton('',()=>{rules[i].forEach(idx=>actual[idx]=(actual[idx]+1)%3);clicks[i]++;render()});
  b.style.whiteSpace='pre-line';buttons.push(b);holder.appendChild(b);
 }
 render();
 $('#powerReset').onclick=()=>{actual.fill(0);clicks.fill(0);render()};
 $('#powerSubmit').onclick=()=>actual.every((n,i)=>n===target[i])?solvePuzzle():failPuzzle('일부 장치의 전력이 목표와 다릅니다. 연결된 두 장치를 함께 고려하세요.');
};
// 16 차단: 실제로 이동하는 게이지를 안전 구역에서 멈춘다.
PUZZLE_BUILDERS.b4=p=>{let total=game.diff==='easy'?2:3,hits=0,phase=rnd(0,100)/100,dir=1,safeLeft=game.diff==='easy'?36:42,safeRight=game.diff==='easy'?64:58;setPuzzleContent(`<div class="target-line"><span class="label">보안벽 통과</span><strong id="timingHits" style="color:var(--yellow)">0 / ${total}</strong></div><div class="quiz-instruction">신호 점이 노란 영역 안에 들어오는 순간 버튼을 누르세요.</div><div style="position:relative;height:52px;background:#132434;border:1px solid #365263;margin:20px 3px"><div style="position:absolute;top:0;bottom:0;left:${safeLeft}%;width:${safeRight-safeLeft}%;background:rgba(234,255,0,.18);border-left:2px solid var(--yellow);border-right:2px solid var(--yellow)"></div><div id="timingDot" style="position:absolute;top:0;bottom:0;width:5px;background:var(--cyan);box-shadow:0 0 14px var(--cyan);left:5%"></div></div><div class="quiz-actions"><span class="micro">현재 위치 <strong id="timingPosition">0%</strong></span><button id="timingPress">안전 구간 통과</button></div>`);recurring(()=>{phase+=dir*(72/(game.diff==='easy'?puzzleTune('b4').cycleEasy:puzzleTune('b4').cycleHard));if(phase>=1){phase=1;dir=-1}else if(phase<=0){phase=0;dir=1}let x=phase*100;$('#timingDot')?.style.setProperty('left',x+'%');if($('#timingPosition'))$('#timingPosition').textContent=Math.round(x)+'%'},36);$('#timingPress').onclick=()=>{let current=phase*100;if(current<safeLeft||current>safeRight){failPuzzle('안전 영역에 신호가 있을 때 통과해야 합니다.');return}hits++;$('#timingHits').textContent=hits+' / '+total;if(hits>=total)solvePuzzle();else setFeedback(`안전 통과 성공! ${total-hits}번 남았습니다.`)}};
// 17 중앙 서버 전용: 유일하게 XOR 연산을 사용하는 4비트 최종 퍼즐.
function buildXor(p){let bits=game.coreBits;if(bits.length!==4){setPuzzleContent('<p>이전 보안 단계의 키 정보가 부족합니다.</p>');return}let answers=[0,0,0,0],cipher=bits.map(x=>x.cipher),keys=bits.map(x=>x.key);setPuzzleContent(`<div class="quiz-instruction"><b style="color:var(--yellow)">XOR 규칙:</b> 두 숫자가 같으면 <b>0</b>, 다르면 <b>1</b>입니다. 네 칸의 결과를 직접 눌러 완성하세요.</div><div class="target-line" style="justify-content:center">0 ⊕ 0 = 0　 /　 0 ⊕ 1 = 1　 /　 1 ⊕ 0 = 1　 /　 1 ⊕ 1 = 0</div><div class="bit-row"><b>암호 데이터</b>${cipher.map(x=>`<div class="bit-box">${x}</div>`).join('')}<b>해독 열쇠</b>${keys.map(x=>`<div class="bit-box">${x}</div>`).join('')}<b>내 해독 결과</b>${answers.map((x,i)=>`<button class="bit-box output" id="xorBit${i}" aria-label="${i+1}번째 결과 비트">${x}</button>`).join('')}</div><div class="quiz-actions" style="justify-content:center;margin-top:16px"><span class="micro">각 칸을 클릭하면 0과 1이 바뀝니다.</span><button id="xorCheck">최종 암호 확인</button></div>`);for(let i=0;i<4;i++)$('#xorBit'+i).onclick=()=>{answers[i]=1-answers[i];$('#xorBit'+i).textContent=answers[i]};$('#xorCheck').onclick=()=>{if(answers.every((n,i)=>n===(cipher[i]^keys[i])))solvePuzzle();else failPuzzle('XOR 결과가 맞지 않습니다. 같은 비트는 0, 다른 비트는 1입니다.')}}
window.ZERO_DAY_STATUS=()=>game?{phase:game.phase,difficulty:game.diff,cleared:game.cleared,coreStage:game.coreStage,trace:+game.trace.toFixed(1),remaining:Math.ceil(game.remaining),score:game.score,currentNode:game.lastNodeId,routeTargets:routeTargets(),overlay:overlayMode,puzzle:puzzle?.key??null,reserved:{...game.reserved},nodes:game.nodes.map(n=>({id:n.id,type:n.type,key:n.key,cleared:n.cleared}))}:null;
})();
