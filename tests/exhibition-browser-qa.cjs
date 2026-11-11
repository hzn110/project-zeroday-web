'use strict';
const {chromium}=require('playwright'),fs=require('fs');
const checks=[],failures=[];
const SITE='https://hzn110.github.io/project-zeroday-web/?exhibition_qa=4.26.2';
let browser;
function ok(a,m){if(!a)throw Error(m)}
async function check(name,fn){try{const detail=await fn();checks.push({name,status:'PASS',detail:detail??''});console.log('PASS',name,detail??'')}catch(e){const err=String(e.stack||e);failures.push({name,error:err});checks.push({name,status:'FAIL',error:String(e.message||e)});console.error('FAIL',name,err)}}
async function run(){
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
 const publicPage=await context.newPage(),publicErrors=[];
 publicPage.on('pageerror',e=>publicErrors.push(e.message));
 await check('Live GitHub Pages is deployed, starts without JavaScript errors',async()=>{
  let response,src='';
  for(let i=0;i<5;i++){
   response=await publicPage.goto(SITE+'&attempt='+i,{waitUntil:'domcontentloaded',timeout:60000});
   src=await publicPage.locator('script[src*="game.js"]').getAttribute('src');
   if(src&&src.includes('4.26.2'))break;
   await publicPage.waitForTimeout(10000);
  }
  ok(response?.status()===200,'HTTP '+response?.status());
  ok(src&&src.includes('4.26.2'),'stale public script '+src);
  await publicPage.waitForFunction(()=>typeof window.ZERO_DAY_STATUS==='function',null,{timeout:15000});
  ok(publicErrors.length===0,publicErrors.join('; '));
  return src;
 });
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/js/game.js*',async route=>{
  const response=await route.fetch(),original=await response.text();
  console.log('LIVE_SOURCE_PROBE',JSON.stringify({bytes:original.length,forcedCue:original.includes("tile.style.setProperty('background-color','#ff8c70','important')"),expectedVersion:'4.26.2'}));
  const altered=original.replace(/\}\)\(\);\s*$/,";window.__EX_QA={\n open:(key,mode='easy')=>{clearPuzzleTimers();if(puzzle)closeOverlay();const m=PUZZLES[key];if(!m)throw Error('Unknown '+key);const n={id:'QA_'+key,codename:'QA',type:m.type,key,cleared:false,x:0,y:0};game=makeDevGame(n);game.diff=mode;game.paused=false;devTest=true;devTestKey=key;displayPuzzle(key,n,false);return puzzle.key},\n state:()=>({key:puzzle?.key,solved:puzzle?.solved,phase:game?.phase,mode:game?.diff,trace:game?.trace}),\n pass:()=>solvePuzzle(),\n start:mode=>{clearPuzzleTimers();if(puzzle)closeOverlay();devTest=false;game=null;puzzle=null;diff=mode;startGame();return window.ZERO_DAY_STATUS()},\n toCore:()=>{game.cleared=4;game.lastNodeId='entry';game.edges.push({a:'entry',b:'core'});renderMap();updateHud();openCoreIntel()},\n coreBits:()=>game?.coreBits,\n win:mode=>{clearPuzzleTimers();if(puzzle)closeOverlay();devTest=false;devGameplay=false;game=makeDevGame({id:'QA',type:'normal'});game.diff=mode;game.paused=false;game.duration=mode==='hard'?180:300;game.remaining=80;game.phase='map';endGame(true)},\n rankings:()=>read(STORAGE,[]),\n threshold:()=>MIN_CORE_NODES\n};"+'})();');
  ok(altered!==original,'QA instrument hook not attached');
  await route.fulfill({response,body:altered});
 });
 await check('Chromium QA browser loads current game',async()=>{
  const res=await page.goto(SITE+'&interactive=1',{waitUntil:'domcontentloaded',timeout:60000});
  ok(res.status()===200,'HTTP '+res.status());
  await page.waitForFunction(()=>!!window.__EX_QA,null,{timeout:15000});
  ok(await page.evaluate(()=>window.__EX_QA.threshold())===4,'four cleared nodes minimum missing');
 });
 const keys=['n1','n2','n3','n4','d1','d2','d3','d4','s1','s2','s3','s4','b1','b2','b3','b4'];
 for(const mode of ['easy','hard']){
  for(const key of keys)await check(key+' '+mode+' initializes cleanly',async()=>{
   const n=errors.length,opened=await page.evaluate(([k,m])=>window.__EX_QA.open(k,m),[key,mode]);
   ok(opened===key,'wrong puzzle');
   ok((await page.locator('#puzzleMount').innerText()).trim().length>20,'missing puzzle UI');
   ok(errors.length===n,'JavaScript error: '+errors.slice(n).join('; '));
  });
 }
 await check('Memory automatically illuminates then enables input (Easy)',async()=>{
  await page.evaluate(()=>window.__EX_QA.open('b1','easy'));
  await page.waitForFunction(()=>document.querySelector('.memory-tile.is-cued')!==null,null,{timeout:4500});
  const bg=await page.locator('.memory-tile.is-cued').evaluate(e=>getComputedStyle(e).backgroundColor);
  const cueDiag=await page.locator('.memory-tile.is-cued').evaluate(e=>({computed:getComputedStyle(e).backgroundColor,inline:e.style.cssText,cls:e.className}));
  console.log('CUE_DIAG',JSON.stringify(cueDiag));
  ok(bg!=='rgba(0, 0, 0, 0)','invisible cue '+JSON.stringify(cueDiag));
  await page.waitForFunction(()=>document.querySelector('#memoryState')?.textContent==='INPUT READY',null,{timeout:14000});
  ok(await page.locator('#memoryStart').isEnabled(),'replay disabled');
  return bg;
 });
 await check('Memory autoplays five cues in Hard',async()=>{
  await page.evaluate(()=>window.__EX_QA.open('b1','hard'));
  await page.waitForFunction(()=>document.querySelector('#memoryState')?.textContent==='INPUT READY',null,{timeout:14000});
  ok((await page.locator('#memoryProgress').innerText()).includes('/ 5'),'expected five cues');
 });
 for(const mode of ['easy','hard']){
  await check('Defense paths briefly show then conceal solution '+mode,async()=>{
   await page.evaluate(m=>window.__EX_QA.open('b2',m),mode);
   ok((await page.locator('#safePaths').innerText()).includes('안전'),'preview not shown');
   await page.waitForFunction(()=>document.querySelector('#safeNotice')?.textContent.includes('스캔 종료'),null,{timeout:4500});
   ok(!(await page.locator('#safePaths').innerText()).includes('안전'),'answer still shown after preview');
  });
  await check('Data fragment checksum can be fully solved '+mode,async()=>{
   await page.evaluate(m=>window.__EX_QA.open('d3',m),mode);
   const total=mode==='easy'?4:5;
   for(let id=1;id<=total;id++){
    const btn=page.locator('#fragmentGrid button').filter({hasText:'PACKET '+String(id).padStart(2,'0')});
    const match=(await btn.innerText()).match(/A:(\d+)\s+B:(\d+)\s+KEY:(\d+)/);
    ok(match,'malformed packet');
    const checksum=(+match[1]*3+ +match[2]*2+ +match[3])%10;
    await btn.click();await page.locator('#fragmentDigits button').filter({hasText:new RegExp('^'+checksum+'$')}).click();
   }
   ok((await page.evaluate(()=>window.__EX_QA.state())).solved,'correct packets did not solve');
  });
 }
 await check('Security log problem values vary between runs',async()=>{
  let variants=new Set();
  for(let i=0;i<6;i++){await page.evaluate(()=>window.__EX_QA.open('s1','easy'));variants.add(await page.locator('#puzzleMount').innerText())}
  ok(variants.size>=4,'repeated identical logs');return variants.size;
 });
 await check('Easy and Hard game sessions start normally',async()=>{
  for(const mode of ['easy','hard']){let s=await page.evaluate(m=>window.__EX_QA.start(m),mode);ok(s.phase==='map'&&s.difficulty===mode,'incorrect game state');ok(s.nodes.length>=8,'missing generated network nodes')}
 });
 await check('Four nodes enable five-stage core and winning result',async()=>{
  await page.evaluate(()=>window.__EX_QA.start('easy'));
  await page.evaluate(()=>window.__EX_QA.toCore());
  await page.locator('#coreConfirm').click();
  ok((await page.evaluate(()=>window.ZERO_DAY_STATUS())).phase==='core','not in core');
  for(let step=0;step<4;step++){await page.evaluate(()=>window.__EX_QA.pass());await page.locator('#coreContinue').waitFor({timeout:5000});await page.locator('#coreContinue').click()}
  await page.locator('#xorCheck').waitFor({timeout:5000});
  const bits=await page.evaluate(()=>window.__EX_QA.coreBits());ok(bits.length===4,'no core bits');
  for(let i=0;i<4;i++)if((bits[i].cipher^bits[i].key)===1)await page.locator('#xorBit'+i).click();
  await page.locator('#xorCheck').click();
  await page.waitForFunction(()=>window.ZERO_DAY_STATUS()?.phase==='won',null,{timeout:5000});
 });
 await check('Hard ranking optional contact stored but not publicly displayed',async()=>{
  await page.evaluate(()=>window.__EX_QA.win('hard'));
  await page.locator('#nicknameInput').fill('QA_HARD');
  await page.locator('#hardContactPhone').fill('010-1234-5678');
  await page.locator('#nicknameSave').click();
  ok((await page.evaluate(()=>window.__EX_QA.rankings())).some(x=>x.nickname==='QA_HARD'&&x.contactPhone==='01012345678'),'phone not stored');
  ok(!(await page.locator('#result').innerText()).includes('010-1234-5678'),'phone leaked on public screen');
 });
 await check('Easy ranking saves without requesting contact',async()=>{
  await page.evaluate(()=>window.__EX_QA.win('easy'));
  ok(await page.locator('#hardContactField').evaluate(e=>e.classList.contains('hidden')),'phone visible on Easy');
  await page.locator('#nicknameInput').fill('QA_EASY');await page.locator('#nicknameSave').click();
  ok((await page.evaluate(()=>window.__EX_QA.rankings())).some(x=>x.nickname==='QA_EASY'),'easy entry missing');
 });
 await check('No runtime JavaScript exceptions during QA',async()=>ok(errors.length===0,errors.join('; ')));
 await context.close();
}
(async()=>{try{await run()}catch(e){failures.push({name:'HARNESS',error:String(e.stack||e)});console.error(e)}
 finally{if(browser)await browser.close();const report={testedAt:new Date().toISOString(),site:SITE,engine:'Chromium / Playwright',checks,failures,passed:checks.filter(x=>x.status==='PASS').length,total:checks.length,verdict:failures.length?'FAIL':'PASS'};fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/exhibition-browser-report.json',JSON.stringify(report,null,2)+'\n');console.log('QA VERDICT',report.verdict,report.passed+'/'+report.total);process.exitCode=failures.length?1:0}})();