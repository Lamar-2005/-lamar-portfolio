import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useContent from '../lib/useContent';

const IMG = process.env.PUBLIC_URL + '/images/';

// Local copy of the Home text. The same keys can live in Supabase (table page_content, page = 'home').
const HOME = {
  welcome: 'Welcome to my',
  script: 'Portfolio',
  reelTitle: 'Pick a reel',
  reelHint: 'Hover a ticket to preview it on the TV. Each one opens its own page of projects.',
  btsTitle: 'Behind the scenes',
  btsLead: 'A former gymnast turned UX/UI designer, event planner, and creative. I love turning ideas into experiences and stories into something people can feel.',
  btsBody: 'Before screens there was the gym floor. I grew up in rhythmic gymnastics and still coach it at Wadi Degla Club. Every routine is a story with a beginning, a middle and a landing, and I design the same way.',
  kitTitle: 'The kit',
  kitLead: 'The software I design, build and edit with.',
  creditsTitle: 'End Credits.',
  producedBy: 'Lamar Shehab',
  location: 'Cairo, Egypt',
  thanks: 'Lorem ipsum dolor sit amet',
  email: 'Lamarshehab01@gmail.com',
};

const CHANNELS = [
  { ch: '1', name: 'UI/UX design', list: 'Falcon CPM website, Cairo Governorate Portal redesign', screen: 'UI/UX', img: 'falcon-hero.jpg' },
  { ch: '2', name: 'Photography', list: 'Two photo series, coming to the reel soon', screen: 'Photography', img: null },
  { ch: '3', name: 'Event planning', list: 'Artistic Gymnastics World Cup, TEDx, a film screening for seniors', screen: 'Events', img: null },
];

const TOOLS = [
  { key: 'figma', tag: 'DESIGN', name: 'Figma', use: 'Interface design and prototyping' },
  { key: 'illustrator', tag: 'DESIGN', name: 'Adobe Illustrator', use: 'Logos, icons and vector graphics' },
  { key: 'canva', tag: 'DESIGN', name: 'Canva', use: 'Social posts and quick layouts' },
  { key: 'vscode', tag: 'BUILD', name: 'Visual Studio Code', use: 'Coding websites (HTML, CSS, JavaScript)' },
  { key: 'capcut', tag: 'EDIT', name: 'CapCut', use: 'Video editing and reels' },
];

const CHAPTERS = [
  { id: 'lamar', label: 'Lamar' },
  { id: 'bts', label: 'Behind the scenes' },
  { id: 'projects', label: 'Projects' },
  { id: 'credits', label: 'Credits' },
];

function useHorizontalReel() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('lamar');
  const isHorizontal = () => ref.current && window.matchMedia('(min-width: 901px)').matches;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e) => {
      if (!isHorizontal()) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    const onScroll = () => {
      const horiz = isHorizontal();
      const max = horiz ? el.scrollWidth - el.clientWidth : document.documentElement.scrollHeight - window.innerHeight;
      const pos = horiz ? el.scrollLeft : window.scrollY;
      setProgress(max > 0 ? pos / max : 0);
      el.style.setProperty('--holes-shift', `${-pos * 0.5}px`);
      let current = 'lamar';
      CHAPTERS.forEach((c) => {
        const s = document.getElementById(c.id);
        if (!s) return;
        const r = s.getBoundingClientRect();
        if ((horiz ? r.left : r.top) < (horiz ? window.innerWidth : window.innerHeight) * 0.5) current = c.id;
      });
      setActive(current);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTo = useCallback((id) => {
    const s = document.getElementById(id);
    if (!s) return;
    if (isHorizontal()) ref.current.scrollTo({ left: s.offsetLeft - 24, behavior: 'smooth' });
    else s.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return { ref, progress, active, goTo };
}

function Timecode({ progress }) {
  const total = Math.round(progress * 180);
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return <span className="timecode">00:{mm}:{ss}</span>;
}

export default function Home() {
  const { content: c } = useContent('home', HOME);
  const { ref, progress, active, goTo } = useHorizontalReel();
  const [channel, setChannel] = useState(null);
  const [flick, setFlick] = useState(0);
  const tune = (i) => { setChannel(i); setFlick((n) => n + 1); };
  const ch = channel === null ? null : CHANNELS[channel];

  return (
    <div className="home">
      <div className="reel" ref={ref}>
        <div className="holes holes-top" aria-hidden="true" />
        <div className="holes holes-bottom" aria-hidden="true" />

        <main className="track">
          {/* 1 · HERO */}
          <section id="lamar" className="frame frame-hero" aria-label="Welcome">
            <h1 className="hero-title">
              <span className="hero-welcome">{c.welcome}</span>
              <span className="hero-script">{c.script}</span>
            </h1>
          </section>

          {/* 2 · PICK A REEL */}
          <section id="projects" className="frame frame-reel" aria-labelledby="reel-title">
            <div className="reel-left">
              <h2 id="reel-title" className="title-bodoni">{c.reelTitle}</h2>
              <div className="tv" aria-live="polite">
                <div className="tv-body">
                  <div className={`tv-screen ${ch ? 'is-on' : ''}`} key={flick}>
                    {ch && ch.img && <img src={IMG + ch.img} alt="" className="tv-img" />}
                    <div className="tv-top"><span>CH {ch ? '0' + ch.ch : '04'}</span><span>PLAY</span></div>
                    <div className="tv-name">{ch ? ch.screen : 'Lili'}</div>
                    <div className="tv-sub">{ch ? 'open reel to watch' : 'three channels, pick one'}</div>
                    <div className="tv-static" aria-hidden="true" />
                  </div>
                  <div className="tv-side">
                    <div className="tv-grille" aria-hidden="true" />
                    <button type="button" className="tv-btn tv-menu" onClick={() => tune(null)} aria-label="Back to the menu">MENU</button>
                    {CHANNELS.map((x, i) => (
                      <button type="button" key={x.ch} className={`tv-btn ${channel === i ? 'is-active' : ''}`} onClick={() => tune(i)} aria-label={`Channel ${x.ch}, ${x.name}`}>{x.ch}</button>
                    ))}
                    <span className="tv-on"><i aria-hidden="true" />ON</span>
                  </div>
                </div>
                <div className="tv-stand" aria-hidden="true" />
              </div>
            </div>
            <div className="reel-right">
              <p className="reel-hint">{c.reelHint}</p>
              {CHANNELS.map((x, i) => (
                <Link key={x.ch} to={`/categories?ch=${x.ch}`} className="ticket" onMouseEnter={() => tune(i)} onFocus={() => tune(i)}>
                  <span className="ticket-stub">CH {x.ch}</span>
                  <span className="ticket-body">
                    <span className="ticket-name">{x.name}</span>
                    <span className="ticket-list">{x.list}</span>
                  </span>
                  <span className="ticket-open">Open reel</span>
                </Link>
              ))}
            </div>
          </section>

          {/* 3 · LAMAR */}
          <section className="frame frame-collage" aria-label="Lamar">
            <img src={IMG + 'lamar-collage.jpg'} alt="Lamar in front of photos of her work: her TEDx talk, rhythmic gymnastics and an event she organised" />
          </section>

          {/* 4 · BEHIND THE SCENES */}
          <section id="bts" className="frame frame-bts" aria-labelledby="bts-title">
            <div className="bts-strip" role="img" aria-label="Photos: on stage at TEDx, rhythmic gymnastics, and an event I organised">
              <span className="bts-photo bts-p1" style={{ backgroundImage: `url(${IMG}bts-1.jpg)` }} />
              <span className="bts-photo bts-p2" style={{ backgroundImage: `url(${IMG}bts-2.jpg)` }} />
              <span className="bts-photo bts-p3" style={{ backgroundImage: `url(${IMG}bts-3.jpg)` }} />
            </div>
            <div className="bts-text">
              <h2 id="bts-title" className="title-bodoni">{c.btsTitle}</h2>
              <p className="bts-lead">{c.btsLead}</p>
              <p className="bts-lead">{c.btsBody}</p>
            </div>
          </section>

          {/* 5 · THE KIT */}
          <section className="frame frame-kit" aria-labelledby="kit-title">
            <h2 id="kit-title" className="title-bodoni kit-title">{c.kitTitle}</h2>
            <p className="kit-lead">{c.kitLead}</p>
            <ul className="tins">
              {TOOLS.map((t) => (
                <li key={t.key} className="tin">
                  <span className="tin-tag">{t.tag}</span>
                  <img src={`${IMG}tin-${t.key}.png`} alt="" className="tin-img" />
                  <span className="tin-label"><b>{t.name}</b>{t.use}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 6 · END CREDITS */}
          <section id="credits" className="frame frame-credits" aria-labelledby="credits-title">
            <div className="canister-wrap">
              <svg className="film-tail" viewBox="0 0 400 832" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 0 H160 C 240 0, 260 300, 400 330 V 500 C 260 530, 240 832, 160 832 H0 Z" fill="#1E1718" />
                <path className="film-dash" d="M150 26 C 230 30, 250 300, 390 320 M150 806 C 230 802, 250 530, 390 510" fill="none" stroke="#EFE6D6" strokeWidth="8" strokeDasharray="12 22" />
              </svg>
              <img src={IMG + 'canister.png'} alt="A film canister labelled Lamar 400, portfolio, Cairo 2026" className="canister" />
            </div>
            <div className="credits">
              <h2 id="credits-title" className="title-bodoni credits-title">{c.creditsTitle}</h2>
              <dl className="credit-list">
                <div><dt>Produced by</dt><dd>{c.producedBy}</dd></div>
                <div><dt>Filmed on location in</dt><dd>{c.location}</dd></div>
                <div><dt>Special thanks</dt><dd>{c.thanks}</dd></div>
              </dl>
              <div className="credit-links">
                <a href={`mailto:${c.email}`}>{c.email}</a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://www.behance.net/" target="_blank" rel="noreferrer">Behance</a>
              </div>
              <Link to="/contact" className="pill pill-cream">Book a screening</Link>
              <p className="copyright">© 2026 Lamar Shehab El Din Hamed. No part of this broadcast may be reproduced.</p>
            </div>
          </section>
        </main>
      </div>

      {/* PLAYER BAR */}
      <nav className="player" aria-label="Home chapters">
        <span className="player-play">
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M1.5 1.5 L10.5 7 L1.5 12.5 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          <Timecode progress={progress} />
        </span>
        {CHAPTERS.map((k) => (
          <button key={k.id} type="button" className={`chap ${active === k.id ? 'is-active' : ''}`} aria-current={active === k.id ? 'true' : undefined} onClick={() => goTo(k.id)}>{k.label}</button>
        ))}
        <span className="player-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></span>
      </nav>
    </div>
  );
}
