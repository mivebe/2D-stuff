import { useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { getProject, projects } from './projects.js'

function Home() {
  const categories = useMemo(() => {
    const counts = projects.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {})
    return ['All', ...Object.keys(counts)]
  }, [])

  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>2D Portfolio</h1>
        <p style={styles.subtitle}>
          Pixi.js and raw WebGL experiments. Each runs as its own independent build, embedded here.
        </p>
        <div style={styles.filters}>
          {categories.map((category) => {
            const count =
              category === 'All' ? projects.length : projects.filter((p) => p.category === category).length
            const active = filter === category
            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                style={{ ...styles.filterButton, ...(active ? styles.filterButtonActive : null) }}
              >
                {category} <span style={styles.filterCount}>{count}</span>
              </button>
            )
          })}
        </div>
      </header>

      <main style={styles.grid}>
        {shown.map((project) => (
          <Link key={project.id} to={`/view/${project.id}`} style={styles.card}>
            <div style={styles.thumbWrap}>
              <img
                src={`${import.meta.env.BASE_URL}thumbnails/${project.id}.jpg`}
                alt={project.title}
                style={styles.thumb}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div style={styles.cardBody}>
              <div style={styles.cardHead}>
                <h2 style={styles.cardTitle}>{project.title}</h2>
                <span style={styles.badge}>{project.category}</span>
              </div>
              <p style={styles.blurb}>{project.blurb}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}

function View() {
  const { id } = useParams()
  const project = getProject(id)
  if (!project) return <Navigate to="/" replace />

  return (
    <div style={styles.viewer}>
      <Link to="/" style={styles.back}>
        &larr; back
      </Link>
      <iframe
        title={project.title}
        src={`${import.meta.env.BASE_URL}projects/${project.id}/index.html`}
        style={styles.iframe}
        allow="fullscreen; autoplay; xr-spatial-tracking"
        allowFullScreen
      />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/view/:id" element={<View />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '48px 24px 64px' },
  header: { marginBottom: 32 },
  title: { margin: '0 0 8px', fontSize: 34, letterSpacing: -0.5 },
  subtitle: { margin: '0 0 20px', color: 'var(--muted)', maxWidth: 640, lineHeight: 1.5 },
  filters: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  filterButton: {
    background: 'var(--panel)',
    color: 'var(--text)',
    border: '1px solid #2a2a36',
    borderRadius: 999,
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: 14,
  },
  filterButtonActive: { borderColor: 'var(--accent)', color: 'var(--accent)' },
  filterCount: { color: 'var(--muted)', fontSize: 12, marginLeft: 4 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 18,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--panel)',
    border: '1px solid #23232e',
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumbWrap: { aspectRatio: '8 / 5', background: '#0a0a0e', overflow: 'hidden' },
  thumb: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  cardBody: { padding: 16 },
  cardHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  cardTitle: { margin: 0, fontSize: 18 },
  badge: {
    fontSize: 11,
    color: 'var(--accent)',
    border: '1px solid #2a3a40',
    borderRadius: 999,
    padding: '2px 8px',
    whiteSpace: 'nowrap',
  },
  blurb: { margin: '8px 0 0', color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 },
  viewer: { position: 'fixed', inset: 0 },
  back: {
    position: 'fixed',
    bottom: 14,
    left: 14,
    zIndex: 10,
    background: 'rgba(20,20,28,0.8)',
    border: '1px solid #2a2a36',
    borderRadius: 999,
    padding: '6px 14px',
    fontSize: 14,
    backdropFilter: 'blur(6px)',
  },
  iframe: { width: '100%', height: '100%', border: 'none', display: 'block' },
}
