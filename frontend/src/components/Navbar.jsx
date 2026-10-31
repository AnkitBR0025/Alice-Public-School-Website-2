import { Link, NavLink } from 'react-router-dom'
import { links } from '../data'

export default function Navbar({ isAdmin = false }) {
  const adminLinks = links.filter(
    ([path]) => path !== '/admissions'
  )

  return (
    <header className="site-nav">

      <Link
        className="brand"
        to="/"
        aria-label="Alice Public School home"
      >
        Alice Public School
      </Link>

      <nav aria-label="Main navigation">

        {(isAdmin ? adminLinks : links).map(
          ([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
            >
              {label}
            </NavLink>
          )
        )}

        {isAdmin && (
          <NavLink to="/admin">
            Admin Dashboard
          </NavLink>
        )}

      </nav>

      <a
        className="call-school"
        href="tel:+919899137983"
      >
        Call School
      </a>

    </header>
  )
}