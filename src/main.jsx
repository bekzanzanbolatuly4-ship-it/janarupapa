import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { site } from './data/site.js';

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const terminalLines = ['Жүйе іске қосылуда...','','Жеке хабарлама модулі жүктелуде...','Естеліктер архиві тексерілуде...','Туған күн протоколы анықталды...','','Пайдаланушы анықталды: ӘКЕ','','Мәртебе: РҰҚСАТ БЕРІЛДІ','','> ЖЕКЕ ХАБАРЛАМА ТАБЫЛДЫ','','Әке...','','Бүгін — сіздің туған күніңіз.','','Сондықтан сізге','кішкентай ғана бір сый дайындадым.'];

function useTyping(lines, active, speed = 24) {
  const [shown, setShown] = useState([]); const [partial, setPartial] = useState('');
  useEffect(() => { if (!active) return; let line = 0, char = 0; const tick = () => {
    if (line >= lines.length) return; const text = lines[line];
    if (char < text.length) { setPartial(text.slice(0, ++char)); timer = setTimeout(tick, speed); }
    else { setShown(x => [...x, text]); setPartial(''); line++; char = 0; timer = setTimeout(tick, text ? 150 : 420); }
  }; let timer = setTimeout(tick, 350); return () => clearTimeout(timer); }, [active, lines, speed]);
  return [shown, partial];
}

function SoundButton({ muted, onToggle }) { return <button className="sound" onClick={onToggle} aria-label="Дыбыс"><span>{muted ? '◌' : '◉'}</span> {muted ? 'ДЫБЫС ӨШІК' : 'ДЫБЫС ҚОСУЛЫ'}</button> }
function Particles({ finale = false, calm = false }) { const dots = useMemo(() => Array.from({length: finale ? 130 : calm ? 15 : 60}, (_,i)=>({x:Math.random()*100,y:Math.random()*100,s:Math.random()*4+1,d:Math.random()*8, hue: i%7===0?340:42})),[finale,calm]); return <div className={'particles '+(finale?'celebrate':'')}>{dots.map((p,i)=><i key={i} style={{'--x':p.x+'%','--y':p.y+'%','--s':p.s+'px','--d':p.d+'s','--h':p.hue}} />)}</div> }

function Terminal({ onLaunch }) {
  const [shown, partial] = useTyping(terminalLines, true); const ready = shown.length === terminalLines.length;
  return <main className="terminal-stage"><div className="crt"/><div className="terminal"><div className="terminal-top"><span className="orb"/> ҚОРҒАЛҒАН ЖЕКЕ ЖҮЙЕ <span>01.01</span></div><div className="terminal-body">{shown.map((x,i)=><p key={i} className={x.startsWith('>')?'accent':''}>{x||'\u00a0'}</p>)}<p>{partial}<b className="cursor">▋</b></p>{ready&&<div className="launch-wrap"><p className="accent">&gt; ТУҒАН КҮН ПРОТОКОЛЫН ІСКЕ ҚОСУ КЕРЕК ПЕ?</p><button className="terminal-button" onClick={onLaunch}>[ ІСКЕ ҚОСУ ]</button></div>}</div></div></main>
}

function Boot({ onDone }) { const [p,setP]=useState(0); useEffect(()=>{let id; let start=performance.now(); const f=t=>{let n=clamp(Math.round((t-start)/35),0,100);setP(n); if(n<100)id=requestAnimationFrame(f);else setTimeout(onDone,850)};id=requestAnimationFrame(f);return()=>cancelAnimationFrame(id)},[onDone]); const blocks='█'.repeat(Math.round(p/10))+'░'.repeat(10-Math.round(p/10)); return <main className="terminal-stage boot"><div className="terminal"><div className="terminal-top"><span className="orb"/> EXECUTION ENGINE <span>ЖҮРГІЗІЛУДЕ</span></div><div className="terminal-body"><p>Протокол іске қосылуда...</p><p className="progress">[{blocks}] {String(p).padStart(2,'0')}%</p><p className={p===100?'accent':''}>{p===100?'Дайын.':'Жеке әлем дайындалуда...'}</p></div></div></main> }

function Cake({ onComplete }) { const [out,setOut]=useState([]); const candles=[0,1,2,3,4]; const blow=i=>{if(out.includes(i))return; const next=[...out,i];setOut(next);if(next.length===5)setTimeout(onComplete,700)}; return <section className={'cake-section '+(out.length?'candle-dim':'')}><div className="section-kicker">{site.sections.cake} / ТІЛЕК МОМЕНТІ</div><h2>Бір тілек тілеңіз...</h2><p className="subtle">Әр шамды басып, тілегіңізді іштей айтыңыз</p><div className={'cake '+(out.length===5?'wish-complete':'')}><div className="cake-glow"/><div className="cake-crumbs"/>{candles.map((c)=><button key={c} onClick={()=>blow(c)} className={'candle c'+c+(out.includes(c)?' out':'')} aria-label="Шамды өшіру"><i className="flame"/><i className="wick"/>{out.includes(c)&&<><i className="smoke"/><i className="smoke smoke-2"/></>}</button>)}<div className="cream crown"/><div className="icing"/><div className="cake-top"/><div className="cake-body"><span/><span/><span/></div><div className="cake-plate"/></div>{out.length===5&&<div className="wish-message">Тілегіңіз орындалсын, әке.</div>}</section> }

function DadExe(){return <section className="dadexe"><div><div className="section-kicker">{site.sections.profile} / ЖҮЙЕ ЕСЕБІ</div><h2>ӘКЕ<span>.exe</span></h2><div className="status">STATUS: <b>LEGENDARY</b></div></div><div className="stats">{site.stats.map((s,i)=><div className="stat" key={s.label}><div><span>{s.label}</span><b>{s.value}</b></div><i style={{'--w':`${100-i*2}%`}} /></div>)}<p>Әкелік деңгейі: <strong>∞</strong></p></div></section>}

function Emotion({ onFinish }) { const [started,setStarted]=useState(false); const [shown,partial]=useTyping(site.personalMessage,started,42); useEffect(()=>{if(started&&shown.length===site.personalMessage.length)setTimeout(onFinish,1600)},[started,shown,onFinish]); return <section id="message" className="emotion"><Particles calm/><div className="section-kicker">{site.sections.message} / ЖЕКЕ ХАБАРЛАМА</div><h2>Әке, сізге бір нәрсе айтқым келеді...</h2>{!started?<button className="quiet-button" onClick={()=>setStarted(true)}>ТЫҢДАУ</button>:<div className="letter">{shown.map((x,i)=><p key={i}>{x}</p>)}<p>{partial}<b className="cursor">▋</b></p></div>}</section> }

function Final({restart}){return <main className="final"><Particles finale/><div className="rays"/><div className="final-copy"><div className="final-protocol">{site.sections.final} / СОҢҒЫ ПРОТОКОЛ<br/><br/>Соңғы протокол іске қосылуда...<br/><br/>Естеліктер: <b>САҚТАЛДЫ</b><br/>Сөздер: <b>ЖЕТКІЗІЛДІ</b><br/>Миссия: <b>ОРЫНДАЛДЫ</b><br/><br/>100% COMPLETE<br/><br/>&gt; FINAL_MESSAGE.exe</div><h1>ТУҒАН КҮНІҢІЗБЕН,<br/>ӘКЕ! <em>♥</em></h1><p>«Мен сізді жақсы көремін.»</p><button onClick={restart}>ҚАЙТА БАСТАУ ↺</button></div></main>}

function World({onFinal}) { const [cakeDone,setCakeDone]=useState(false); const [stage,setStage]=useState(0); const ref=useRef(); useEffect(()=>{const f=e=>{if(ref.current){ref.current.style.setProperty('--mx',`${e.clientX/window.innerWidth}`);ref.current.style.setProperty('--my',`${e.clientY/window.innerHeight}`)}};window.addEventListener('pointermove',f);return()=>window.removeEventListener('pointermove',f)},[]); return <main className="world" ref={ref}><Particles/><header><div className="brand"><span/> СІЗ ҮШІН / {site.sections.hero}</div><a href="#message">ХАБАР ↓</a></header><section className="hero"><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/><div className="eyebrow">{site.sections.hero} / ЖЕКЕ ТУҒАН КҮН ХАБАРЛАМАСЫ</div><h1>ТУҒАН КҮНІҢІЗБЕН,<br/><strong>ӘКЕ!</strong> <em>♥</em></h1><p>Бұл шағын әлем сіз үшін, жүректен жасалды.</p><button className="scroll-cue" onClick={()=>document.querySelector('.cake-section').scrollIntoView({behavior:'smooth'})}>ЖОЛДЫ ЖАЛҒАСТЫРУ <i>↓</i></button></section><Cake onComplete={()=>setCakeDone(true)}/>{cakeDone&&<DadExe/>}{cakeDone&&<Emotion onFinish={onFinal}/>}<button className="secret" aria-label="Құпия жүйе" onClick={()=>setStage(stage+1)}>{stage<5?'◈':<span>ҚҰПИЯ ЖҮЙЕ ТАБЫЛДЫ.<br/><b>LEVEL: LEGENDARY ӘКЕ</b></span>}</button></main>}

function App(){
  const [scene,setScene]=useState('terminal'); const [muted,setMuted]=useState(true); const soundRef=useRef();
  const toggleSound=useCallback(()=>{ if(!muted){ soundRef.current?.ctx?.close(); soundRef.current=undefined; setMuted(true); return; } const ctx=new (window.AudioContext||window.webkitAudioContext)(); const gain=ctx.createGain(); gain.gain.value=.018; gain.connect(ctx.destination); const a=ctx.createOscillator(), b=ctx.createOscillator(); a.type='sine'; b.type='sine'; a.frequency.value=110; b.frequency.value=164.8; const pulse=ctx.createGain(); pulse.gain.value=.45; pulse.connect(gain); a.connect(pulse); b.connect(pulse); a.start(); b.start(); soundRef.current={ctx,a,b}; setMuted(false); },[muted]);
  useEffect(()=>()=>soundRef.current?.ctx?.close(),[]);
  const launch=useCallback(()=>setScene('boot'),[]); const enter=useCallback(()=>setScene('world'),[]); const finish=useCallback(()=>setScene('final'),[]); const restart=useCallback(()=>setScene('terminal'),[]);
  return <><SoundButton muted={muted} onToggle={toggleSound}/>{scene==='terminal'&&<Terminal onLaunch={launch}/>} {scene==='boot'&&<Boot onDone={enter}/>} {scene==='world'&&<World onFinal={finish}/>} {scene==='final'&&<Final restart={restart}/>}</>
}
createRoot(document.getElementById('root')).render(<App/>);
