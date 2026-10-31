import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import { api } from './lib/api'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Admissions from './pages/Admissions'
import Principal from './pages/Principal'
import Contact from './pages/Contact'
import StudentLife from './pages/StudentLife'
import Admin from './pages/Admin'

function ScrollTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return show ? (
    <button
      className="totop"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    >
      ↑
    </button>
  ) : null
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    let active = true

    const handleAdminLogin = () => {
      setIsAdmin(true)
    }

    const handleAdminLogout = () => {
      setIsAdmin(false)
    }

    window.addEventListener(
      'admin-session-login',
      handleAdminLogin
    )

    window.addEventListener(
      'admin-session-logout',
      handleAdminLogout
    )

    async function checkSession() {
      try {
        await api('/auth/me')

        if (active) {
          setIsAdmin(true)
        }
      } catch {
        if (active) {
          setIsAdmin(false)
        }
      } finally {
        if (active) {
          setSessionChecked(true)
        }
      }
    }

    checkSession()

    return () => {
      active = false

      window.removeEventListener(
        'admin-session-login',
        handleAdminLogin
      )

      window.removeEventListener(
        'admin-session-logout',
        handleAdminLogout
      )
    }
  }, [])

  if (!sessionChecked) {
    return (
      <section className="sec wrap">
        <p>Loading website...</p>
      </section>
    )
  }

  return (
    <>
      <ScrollTop />

      <Navbar isAdmin={isAdmin} />

      <main>
        <Routes>
          <Route
            path="/admin"
            element={<Admin />}
          />

          <Route
            path="/"
            element={<Home isAdmin={isAdmin} />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/admissions"
            element={
              isAdmin
                ? <Navigate to="/" replace />
                : <Admissions />
            }
          />

          <Route
            path="/principal"
            element={<Principal />}
          />

          <Route
            path="/student-life"
            element={<StudentLife />}
          />

          <Route
            path="/contact"
            element={<Contact isAdmin={isAdmin} />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />

      <BackToTop />
    </>
  )
}