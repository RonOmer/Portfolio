import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { caseStudies, projects, skillGroups } from './data'

const nav = [
  ['Home', '/'],
  ['Projects', '/projects'],
  ['Experience', '/experience'],
  ['About', '/about'],
]

function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    setOpen(false)
    const frame = window.requestAnimationFrame(() => {
      const section = hash && document.getElementById(hash.slice(1))
      if (section) {
        section.scrollIntoView({ block: 'start' })
      } else {
        window.scrollTo(0, 0)
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash, key])
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])
  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="header">
        <div className="shell nav">
          <Link className="logo" to="/">
            <span>RO</span>Ron Omer
          </Link>
          <button
            className="menu"
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
          >
            ☰
          </button>
          <nav
            id="primary-navigation"
            className={open ? 'navlinks open' : 'navlinks'}
          >
            {nav.map(([n, p]) => (
              <NavLink key={p} to={p} end={p === '/' ? true : undefined}>
                {n}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="content">{children}</main>
      <Footer />
    </>
  )
}

function Footer() {
  const { pathname } = useLocation()
  return (
    <footer
      className={`band ${pathname === '/experience' ? 'band-light' : 'band-blue'}`}
    >
      <div className="shell foot">
        <span>© {new Date().getFullYear()} Ron Omer · Holon, Israel</span>
        <div className="footlinks">
          <a href="mailto:ronomer4@gmail.com">Email</a>
          <a href="https://github.com/RonOmer" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href="https://il.linkedin.com/in/ron-omer"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
const Arrow = () => <span aria-hidden="true">↗</span>
function Button({ to, children, ghost = false }) {
  return (
    <Link className={ghost ? 'btn ghost' : 'btn'} to={to}>
      {children}
    </Link>
  )
}

function ProjectCard({ p }) {
  return (
    <article className="pcard">
      <div className="cardtop">
        <span>{p.kicker}</span>
        {!p.github.toLowerCase().includes('ronomer') && (
          <span>Team project</span>
        )}
      </div>
      <div className="cardbody">
        <h3>{p.name}</h3>
        <p>{p.summary}</p>
        <ul className="chips">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div className="cardfoot">
        {p.detail ? (
          <Link to={`/projects/${p.slug}`}>
            Case study <Arrow />
          </Link>
        ) : (
          <a href={p.github} target="_blank" rel="noreferrer">
            Repository <Arrow />
          </a>
        )}
      </div>
    </article>
  )
}

function Home() {
  return (
    <>
      <section className="band band-light">
        <div className="hero shell">
          <div className="heroCopy">
            <h1>Ron Omer</h1>
            <p className="intro">
              Junior developer focused on backend, full-stack, and practical AI
              software using C#, .NET, SQL, Python, and JavaScript.
            </p>
            <div className="actions">
              <Button to="/projects">Explore projects</Button>
              <Button to="/about#contact" ghost>
                Contact me
              </Button>
            </div>
            <div className="techline">
              <span>C# / .NET</span>
              <span>SQL</span>
              <span>Python</span>
              <span>JavaScript</span>
            </div>
          </div>
          <div className="portrait">
            <img src="/assets/images/ron-omer.jpg" alt="Ron Omer" />
            <div className="status">
              <i /> Open to junior roles
            </div>
          </div>
        </div>
      </section>
      <section className="band band-blue">
        <div className="shell section">
          <div className="sectionTitle">
            <h2>Selected projects</h2>
          </div>
          <div className="featured">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
          <Button to="/projects" ghost>
            Browse all {projects.length} projects
          </Button>
        </div>
      </section>
      <section className="band band-light">
        <div className="shell section split">
          <div>
            <h2>About me</h2>
          </div>
          <div className="prose">
            <p>
              I like following a feature from the interface, through its API
              contract and business logic, to the database behind it.
            </p>
            <p>
              My Computer Science and technical leadership background taught me
              to diagnose carefully, communicate clearly, and remain dependable
              under pressure.
            </p>
            <Link className="inline" to="/about">
              More about my path <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Projects() {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('featured')
  const list = useMemo(
    () =>
      projects
        .filter((p) => {
          if (filter === 'all') return true
          if (filter === 'team')
            return !p.github.toLowerCase().includes('ronomer')
          return p.category.includes(filter)
        })
        .sort((a, b) =>
          sort === 'recent'
            ? b.updated.localeCompare(a.updated)
            : sort === 'name'
              ? a.name.localeCompare(b.name)
              : sort === 'technology'
                ? a.tech.localeCompare(b.tech) || a.name.localeCompare(b.name)
                : a.rank - b.rank,
        ),
    [filter, sort],
  )
  return (
    <>
      <section className="band band-light">
        <div className="shell page">
          <PageHead title="Projects" />
          <div className="toolbar">
            <div>
              <span className="controlLabel">Filter by area</span>
              <div className="filters">
                {[
                  'all',
                  'team',
                  'backend',
                  'fullstack',
                  'data',
                  'systems',
                  'frontend',
                ].map((f) => (
                  <button
                    key={f}
                    className={filter === f ? 'on' : ''}
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'team'
                      ? 'Team projects'
                      : f === 'data'
                        ? 'AI & data'
                        : f}
                  </button>
                ))}
              </div>
            </div>
            <label>
              <span className="controlLabel">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="recent">Recently updated</option>
                <option value="name">Name A–Z</option>
                <option value="technology">Technology</option>
              </select>
            </label>
          </div>
          <p className="resultCount" role="status">
            {list.length} project{list.length !== 1 ? 's' : ''}
          </p>
          <div className="catalog">
            {list.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
function PageHead({ title }) {
  return (
    <header className="pagehead">
      <h1>{title}</h1>
    </header>
  )
}
function Experience() {
  return (
    <>
      <section className="band band-light">
        <div className="shell page">
          <PageHead title="Experience" />
          <div className="timeline">
            <ExperienceItem
              date="Academic research"
              title="Research Assistant"
              org="Ruppin Academic Center"
              items={[
                'Continued research following the final B.Sc. project, focusing on data analysis and machine-learning methods.',
                'Contributed to the analysis, interpretation, and preparation of results for two academic research papers.',
                'Worked with Python, statistical analysis, machine-learning models, and research datasets.',
              ]}
              link="/projects/asthma-research"
              linkText="View the final B.Sc. project"
            />
            <ExperienceItem
              date="Student support"
              title="Programming Tutor"
              org="C# & Front-End Development"
              items={[
                'Provided one-on-one tutoring in C#, object-oriented programming, JavaScript, HTML, and CSS to Industrial Engineering and Management students, including reservists returning to their studies.',
                'Assisted with programming assignments, debugging, and understanding core development concepts.',
              ]}
            />
            <ExperienceItem
              date="2024 — 2026"
              title="B.Sc. Computer Science"
              org="Ruppin Academic Center"
              items={[
                'Graduated with a final average of 88.',
                'Built backend, full-stack, networking, database, and machine-learning projects.',
                'Designed REST APIs and relational data flows with C#, ASP.NET Core, ADO.NET, and SQL Server.',
                'Worked in teams to plan, integrate, test, and document multi-layer systems.',
              ]}
            />
          </div>
        </div>
      </section>
      <section className="band band-blue" aria-label="Military experience">
        <div className="shell section">
          <MilitaryService />
        </div>
      </section>
    </>
  )
}
function ExperienceItem({ date, title, org, items, link, linkText }) {
  return (
    <article className="timelineItem">
      <div className="date">{date}</div>
      <div>
        <p className="label">{org}</p>
        <h2>{title}</h2>
        <ul>
          {items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {link && (
          <Link className="btn experienceBtn" to={link}>
            {linkText} <Arrow />
          </Link>
        )}
      </div>
    </article>
  )
}
function MilitaryService() {
  return (
    <section className="militaryService" aria-labelledby="military-title">
      <div className="militaryHead">
        <div>
          <h2 id="military-title">Military service</h2>
        </div>
        <p>Israel Defense Forces · 2018–2026 · Regular and reserve service</p>
      </div>
      <div className="militaryRoles">
        <article className="militaryRole">
          <div className="roleMeta">
            <span>01</span>
            <p>Aug 2018 — Apr 2021</p>
          </div>
          <div>
            <p className="label">IDF</p>
            <h3>Mandatory Military Service</h3>
            <ul>
              <li>
                Worked with communication and operational systems in a
                responsibility-heavy environment.
              </li>
              <li>
                Diagnosed technical issues and supported both technical and
                non-technical users.
              </li>
            </ul>
          </div>
        </article>
        <article className="militaryRole">
          <div className="roleMeta">
            <span>02</span>
            <p>2021–2024</p>
          </div>
          <div>
            <p className="label">IDF · Career Service</p>
            <h3>Computing Platoon Commander</h3>
            <ul>
              <li>
                Commanded approximately 6 soldiers with full IT responsibility
                for approximately 7 command centers, reporting to the Head of
                the C4I Division.
              </li>
              <li>
                Managed a technical support center covering user management,
                communication cabinets, infrastructure, a technical lab, and
                ongoing IT projects.
              </li>
              <li>
                Managed and maintained servers, Active Directory environments,
                and secure communication infrastructure.
              </li>
              <li>
                Commanded approximately 30 soldiers for six months while
                covering two vacant key positions.
              </li>
              <li>
                Improved IT and operations-center support by building an
                effective service model.
              </li>
            </ul>
          </div>
        </article>
        <article className="militaryRole">
          <div className="roleMeta">
            <span>03</span>
            <p>2024–2026</p>
          </div>
          <div>
            <p className="label">IDF · Reserve Service</p>
            <h3>Computing Lead</h3>
            <ul>
              <li>
                Led a computing team of approximately 30 technicians, supporting
                7 activated command centers and 12 battalions.
              </li>
              <li>
                Managed full IT and teleprocessing operations at scale,
                overseeing infrastructure, technical support, and ongoing
                operations across multiple units.
              </li>
            </ul>
          </div>
        </article>
      </div>
      <div className="militaryCredentials">
        <div>
          <span className="credentialMark" aria-hidden="true">
            ★
          </span>
          <h3>Certificates of Excellence</h3>
        </div>
        <ul className="certificateList">
          <li>One certificate as a commander during career service.</li>
          <li>One certificate as a team leader during mandatory service.</li>
        </ul>
      </div>
    </section>
  )
}
function About() {
  return (
    <>
      <section className="band band-light" aria-label="About">
        <div className="shell page">
          <PageHead title="About" />
          <div className="aboutGrid">
            <img src="/assets/images/ron-omer.jpg" alt="Ron Omer" />
            <div className="prose big">
              <p>
                I’m Ron, a B.Sc. Computer Science graduate from Ruppin Academic
                Center (2024–2026), with a final average of 88. I’m based in
                Holon, Israel.
              </p>
              <p>
                I’m building my career around{' '}
                <strong>backend and full-stack software development</strong>,
                with particular interest in C#, .NET, relational databases, and
                practical AI features.
              </p>
              <p>
                I enjoy problems that cross layers: API contracts, database
                design, error handling, browser interactions, and the user’s
                actual goal.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Skills />
      <Contact />
    </>
  )
}
function Skills() {
  return (
    <section
      id="skills"
      className="band band-blue aboutSection"
      aria-labelledby="skills-title"
    >
      <div className="shell section">
        <header className="aboutSectionHead">
          <h2 id="skills-title">Skills</h2>
        </header>
        <div className="skillAreas">
          {skillGroups.map(([name, items]) => (
            <article className="skillArea" key={name}>
              <h3>{name}</h3>
              <ul className="chips">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
function Contact() {
  return (
    <section
      id="contact"
      className="band band-light aboutSection"
      aria-labelledby="contact-title"
    >
      <div className="shell section">
        <header className="aboutSectionHead">
          <h2 id="contact-title">Contact</h2>
          <p className="intro">
            I’m open to junior backend, full-stack, .NET, and AI-oriented
            software development opportunities.
          </p>
        </header>
        <div className="contactPanel">
          <a href="mailto:ronomer4@gmail.com">
            <span>Email</span>
            <strong>ronomer4@gmail.com</strong>
            <Arrow />
          </a>
          <a href="https://github.com/RonOmer" target="_blank" rel="noreferrer">
            <span>GitHub</span>
            <strong>github.com/RonOmer</strong>
            <Arrow />
          </a>
          <a
            href="https://il.linkedin.com/in/ron-omer"
            target="_blank"
            rel="noreferrer"
          >
            <span>LinkedIn</span>
            <strong>Connect with me</strong>
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}
function CaseStudy() {
  const { slug } = useParams()
  const c = caseStudies[slug]
  const p = projects.find((x) => x.slug === slug)
  if (!p || !Object.hasOwn(caseStudies, slug)) return <NotFound />
  return (
    <div className="case">
      <section className="band band-light">
        <div className="shell caseHero">
          <h1>{c.title}</h1>
          {!p.github.toLowerCase().includes('ronomer') && (
            <p className="label">Team project</p>
          )}
          <p className="intro">{c.intro}</p>
          <div className="actions">
            <a className="btn" href={p.github} target="_blank" rel="noreferrer">
              Repository <Arrow />
            </a>
            <Button to="/projects" ghost>
              All projects
            </Button>
          </div>
        </div>
      </section>
      <section className="band band-blue" aria-label="Project architecture">
        <div className="shell caseBody">
          <div>
            <h2>Architecture</h2>
            <p className="intro">{c.stack}</p>
          </div>
          <div className="flow">
            {c.architecture.map((x, i) => (
              <div key={x}>
                <span>{i + 1}</span>
                {x}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="band band-light" aria-label="Engineering highlights">
        <div className="shell section">
          <div className="sectionTitle">
            <h2>Highlights</h2>
          </div>
          <div className="highlights">
            {c.highlights.map(([h, p]) => (
              <article key={h}>
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
function NotFound() {
  return (
    <section className="shell page">
      <PageHead title="Page not found" />
      <Button to="/">Return home</Button>
    </section>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<CaseStudy />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/skills"
          element={<Navigate to="/about#skills" replace />}
        />
        <Route
          path="/contact"
          element={<Navigate to="/about#contact" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
