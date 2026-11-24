import { useEffect, useState } from 'react';

// Full-screen clapperboard: counts to 100, the stick snaps shut, then the board lifts away.
export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState('count'); // count -> snap -> out

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { onDone(); return; }
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(100, Math.round(((t - start) / 1600) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else {
        setPhase('snap');
        setTimeout(() => setPhase('out'), 450);
        setTimeout(onDone, 1150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className={`preloader is-${phase}`} role="status" aria-label={`Loading, ${pct} percent`}>
      <div className="clap">
        <div className="clap-stick" aria-hidden="true" />
        <div className="clap-board">
          <div className="clap-row">
            <span>PROD.</span><b>LAMAR · PORTFOLIO</b>
          </div>
          <div className="clap-grid">
            <div><span>SCENE</span><b>01</b></div>
            <div><span>TAKE</span><b>{phase === 'count' ? '01' : '02'}</b></div>
            <div><span>ROLL</span><b>A</b></div>
          </div>
          <div className="clap-pct">{phase === 'count' ? `${pct}%` : 'ACTION!'}</div>
          <div className="clap-row clap-foot"><span>DIR.</span><b>LAMAR SHEHAB</b><span>CAIRO · 2026</span></div>
        </div>
      </div>
    </div>
  );
}
