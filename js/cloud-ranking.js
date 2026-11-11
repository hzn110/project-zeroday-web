// PROJECT: ZERO-DAY — shared realtime leaderboard (Firebase Realtime Database).
// Public data only. Contact phone numbers, admin credentials and local QA records NEVER go here.
const eventName='pzd-cloud-state';
const firebaseVersion='10.14.1';
const state={status:'unconfigured',error:'',entries:{easy:[],hard:[]}};
let databaseApi=null,db=null,user=null,connected=false,connectionKnown=false;
const loaded={easy:false,hard:false};
function snapshot(){return {status:state.status,error:state.error,entries:{easy:state.entries.easy.slice(),hard:state.entries.hard.slice()}}}
function emit(){window.dispatchEvent(new CustomEvent(eventName,{detail:snapshot()}))}
function status(value,error=''){if(state.status===value&&state.error===error)return;state.status=value;state.error=error;emit()}
function updateStatus(){
 if(state.status==='error'||state.status==='unconfigured')return;
 status(connected&&user&&loaded.easy&&loaded.hard?'online':connectionKnown&&!connected?'offline':'connecting');
}
function isConfigValid(c){
 return !!(c&&typeof c==='object'&&['apiKey','authDomain','databaseURL','projectId','appId'].every(k=>typeof c[k]==='string'&&c[k].trim()&&!/PASTE_|YOUR_PROJECT|YOUR_DATABASE/.test(c[k]))&&/^https:\/\//.test(c.databaseURL));
}
function cleanEntry(raw,id){
 if(!raw||typeof raw!=='object'||!['easy','hard'].includes(raw.diff))return null;
 const nickname=String(raw.nickname??'');
 if(!/^[가-힣A-Za-z0-9_.-]{1,12}$/.test(nickname))return null;
 const score=Number(raw.score),time=Number(raw.time),trace=Number(raw.trace);
 if(!Number.isFinite(score)||score<0||score>10000000||!Number.isFinite(time)||time<0||time>3600||!Number.isFinite(trace)||trace<0||trace>100)return null;
 if(!['S','A','B','C'].includes(raw.grade))return null;
 return {id:String(id),nickname,diff:raw.diff,score:Math.round(score),time:Math.round(time*100)/100,trace:Math.round(trace*10)/10,grade:raw.grade,date:String(raw.date||'—').slice(0,32)};
}
function sanitizeForUpload(raw){
 const entry=cleanEntry(raw,raw?.id);
 if(!entry||!/^r[a-zA-Z0-9_-]{20,79}$/.test(entry.id))throw Error('랭킹 기록 형식이 올바르지 않습니다.');
 return entry;
}
async function submit(raw){
 if(state.status!=='online'||!user||!db||!databaseApi)throw Error('서버 연결이 완료되지 않았습니다.');
 const entry=sanitizeForUpload(raw);
 const dest=databaseApi.ref(db,'rankings/v1/'+entry.diff+'/'+entry.id);
 const payload={...entry,createdAt:databaseApi.serverTimestamp()};
 try{
  await databaseApi.set(dest,payload);
 }catch(error){
  // If the acknowledgement was lost, a retry must not create a second score.
  // Existing IDs are immutable in the database rules.
  try{
   const previous=(await databaseApi.get(dest)).val();
   const saved=cleanEntry(previous,entry.id);
   if(saved&&Object.keys(entry).every(k=>saved[k]===entry[k]))return {id:entry.id,alreadySaved:true};
  }catch{}
  throw error;
 }
 return {id:entry.id,alreadySaved:false};
}
window.PZD_CLOUD_RANKING={snapshot,submit};
async function start(){
 const config=window.PZD_FIREBASE_CONFIG;
 if(!isConfigValid(config)){status('unconfigured',config?'Firebase 웹 설정값을 확인하세요.':'Firebase 프로젝트 연결이 필요합니다.');return}
 status('connecting');
 try{
  const [appApi,authApi,dataApi]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/'+firebaseVersion+'/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/'+firebaseVersion+'/firebase-auth.js'),
   import('https://www.gstatic.com/firebasejs/'+firebaseVersion+'/firebase-database.js')
  ]);
  databaseApi=dataApi;
  const app=appApi.initializeApp(config,'pzd-global-leaderboard');
  db=dataApi.getDatabase(app);
  dataApi.onValue(dataApi.ref(db,'.info/connected'),snap=>{connected=!!snap.val();connectionKnown=true;updateStatus()},error=>status('error','연결 상태 확인 실패: '+(error.code||error.message)));
  const credential=await authApi.signInAnonymously(authApi.getAuth(app));
  user=credential.user;
  for(const diff of ['easy','hard']){
   dataApi.onValue(dataApi.ref(db,'rankings/v1/'+diff),snap=>{
    const raw=snap.val()||{};
    state.entries[diff]=Object.entries(raw).map(([id,entry])=>cleanEntry(entry,id)).filter(Boolean);
    loaded[diff]=true;
    emit();
    updateStatus();
   },error=>status('error','랭킹 읽기 권한 오류: '+(error.code||error.message)));
  }
  updateStatus();
 }catch(error){
  console.warn('PZD leaderboard unavailable:',error?.code||error?.message||error);
  status('error',error?.code==='auth/operation-not-allowed'?'Firebase 익명 인증을 활성화하세요.':'Firebase 연결 실패: '+(error?.code||error?.message||'unknown'));
 }
}
start();
