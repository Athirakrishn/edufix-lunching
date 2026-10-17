import { useCallback, useEffect, useState } from 'react'
import './App.css'

// How long each scene stays on screen (ms). The last scene stays.
const SCENE_DURATIONS = [3000, 3200, 4500, 5500, 3200]
const EXIT_MS = 600

function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  const [exiting, setExiting] = useState(false)
  useEffect(() => {
    const start = performance.now()
    const duration = 2000
    let raf
    let timer
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 2))))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setExiting(true)
        onDone()
        timer = setTimeout(() => setCount(-1), 1400)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [onDone])
  if (count === -1) return null
  const letters = 'EDUFIXLEARNING'.split('')
  return (
    <div className={`pl ${exiting ? 'is-exiting' : ''}`} aria-hidden="true">
      <div className="pl__curtain pl__curtain--top" />
      <div className="pl__curtain pl__curtain--bottom" />
      <div className="pl__content">
        <div className="pl__word">
          {letters.map((ch, i) => (
            <span className="pl__mask" key={i}>
              <span className={`pl__char ${i > 5 ? 'pl__char--accent' : ''}`} style={{ '--i': i }}>{ch}</span>
            </span>
          ))}
        </div>
        <div className="pl__line"><span style={{ transform: `scaleX(${count / 100})` }} /></div>
        <div className="pl__meta"><span>Learning Academy</span><span>Calicut — Kerala</span></div>
      </div>
      <div className="pl__counter"><span>{String(count).padStart(3, '0')}</span></div>
    </div>
  )
}

// A line of big text that rises out of a mask, like the preloader letters.
function Rise({ children, i = 0, className = '' }) {
  return (
    <span className="rise">
      <span className={`rise__inner ${className}`} style={{ '--i': i }}>{children}</span>
    </span>
  )
}

const scenes = [
  () => (
    <h1 className="sc-title">
      <Rise i={0}>Creative</Rise>
      <Rise i={1} className="text-yellow">Mastery</Rise>
      <Rise i={2}>Class</Rise>
    </h1>
  ),
  () => (
    <div className="sc-stats">
      {[['3', 'Courses'], ['25', 'Modules'], ['1', 'Month']].map(([n, l], i) => (
        <div className="sc-stats__group" key={l}>
          {i > 0 && <span className="sc-dot pop" style={{ '--i': i * 2 - 1 }}>•</span>}
          <div className="sc-stat pop" style={{ '--i': i * 2 }}>
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        </div>
      ))}
    </div>
  ),
  () => (
    <div className="sc-block">
      <h2 className="sc-heading">
        <Rise i={0}>Master <span className="text-yellow">3</span> Creative Skills</Rise>
      </h2>
      <div className="sc-skills">
        {[['🎬', 'Mobile Video Editing'], ['🎨', 'Mobile Poster Designing'], ['🤖', 'Master AI']].map(([icon, name], i) => (
          <div className="sc-skill glass pop" key={name} style={{ '--i': i + 2 }}>
            <span className="sc-skill__icon">{icon}</span>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  () => (
    <div className="sc-block">
      <h2 className="sc-heading">
        <Rise i={0}>Why Choose <span className="text-yellow">Edufix?</span></Rise>
      </h2>
      <ul className="sc-checks">
        {['25 Structured Modules', 'Pre-Recorded Video Lessons', 'Personal Doubt Support', 'Learn Anytime, Anywhere', 'Flexible Online Learning', '1-Month Online Course'].map((t, i) => (
          <li className="pop" key={t} style={{ '--i': i + 2 }}>
            <span className="sc-check">✓</span>{t}
          </li>
        ))}
      </ul>
    </div>
  ),
  () => (
    <div className="sc-fee">
      <span className="sc-fee__label pop" style={{ '--i': 0 }}>Course Fee</span>
      <Rise i={2} className="sc-fee__price">₹499/-</Rise>
    </div>
  ),
  ({ onReplay }) => (
    <div className="sc-final">
      <h2 className="sc-tagline">
        <Rise i={0}>One Course.</Rise>
        <Rise i={1} className="text-yellow">Three Skills.</Rise>
        <Rise i={2}>Endless Possibilities.</Rise>
      </h2>
      <p className="sc-motto pop" style={{ '--i': 6 }}>✨ Learn • Create • Grow</p>
      <a className="sc-cta pop" style={{ '--i': 8 }} href="https://wa.me/917034893345" target="_blank" rel="noreferrer">
        📲 Enroll Now with Edufix Learning
      </a>
      <button className="sc-replay pop" style={{ '--i': 10 }} onClick={onReplay}>↻ Replay</button>
    </div>
  ),
]

function App() {
  const [loaded, setLoaded] = useState(false)
  const [scene, setScene] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const handleLoaded = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    if (!loaded || scene >= SCENE_DURATIONS.length) return
    const duration = SCENE_DURATIONS[scene]
    const exitTimer = setTimeout(() => setLeaving(true), duration - EXIT_MS)
    const nextTimer = setTimeout(() => {
      setLeaving(false)
      setScene((s) => s + 1)
    }, duration)
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(nextTimer)
    }
  }, [loaded, scene])

  const Scene = scenes[scene]
  return (
    <div className={loaded ? 'is-loaded' : 'is-loading'}>
      <Preloader onDone={handleLoaded} />
      <main>
        <section className="hh-hero">
          <div key={scene} className={`scene ${leaving ? 'is-leaving' : ''}`}>
            <Scene onReplay={() => setScene(0)} />
          </div>
          <div className="sc-progress" aria-hidden="true">
            {scenes.map((_, i) => (
              <span key={i} className={i < scene ? 'done' : i === scene ? 'active' : ''}
                style={{ '--dur': `${SCENE_DURATIONS[i] ?? 0}ms` }} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
