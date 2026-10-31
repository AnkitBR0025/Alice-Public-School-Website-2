
import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'

const tabs = ['Announcements', 'Gallery', 'Inquiries']

export default function Admin() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState(tabs[0])
  const [announcements, setAnnouncements] = useState([])
  const [photos, setPhotos] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const loadDashboard = useCallback(async () => {
    const [announcementData, galleryData, inquiryData] =
      await Promise.all([
        api('/announcements/admin'),
        api('/gallery/admin'),
        api('/inquiries/admin'),
      ])

    setAnnouncements(announcementData.announcements)
    setPhotos(galleryData.photos)
    setInquiries(inquiryData.inquiries)
  }, [])

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const { user: admin } = await api('/auth/me')

        if (!active) return

        setUser(admin)

        window.dispatchEvent(
          new Event('admin-session-login')
        )

        await loadDashboard()
      } catch {
        if (active) {
          setUser(null)

          window.dispatchEvent(
            new Event('admin-session-logout')
          )
        }
      } finally {
        if (active) {
          setChecking(false)
        }
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [loadDashboard])

  async function signIn(event) {
    event.preventDefault()
    setBusy(true)
    setNotice('')

    const fields = Object.fromEntries(
      new FormData(event.currentTarget)
    )

    try {
      const result = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(fields)
      })

      setUser(result.user)

      // Notify App.jsx that admin has logged in
      window.dispatchEvent(
        new Event('admin-session-login')
      )

      await loadDashboard()

    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    try {
      await api('/auth/logout', {
        method: 'POST'
      })
    } finally {
      setUser(null)

      // Notify App.jsx that admin has logged out
      window.dispatchEvent(
        new Event('admin-session-logout')
      )
    }
  }

  async function createAnnouncement(event) {
    event.preventDefault()
    setBusy(true)
    setNotice('')

    const form = event.currentTarget
    const fields = Object.fromEntries(
      new FormData(form)
    )

    fields.published = form.elements.published.checked

    try {
      await api('/announcements/admin', {
        method: 'POST',
        body: JSON.stringify(fields)
      })

      form.reset()
      setNotice('Announcement published.')
      await loadDashboard()

    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  async function editAnnouncement(item) {
    const title = window.prompt(
      'Edit announcement title',
      item.title
    )

    if (title === null) return

    const message = window.prompt(
      'Edit announcement message',
      item.message
    )

    if (message === null) return

    try {
      await api(`/announcements/admin/${item._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title, message })
      })

      await loadDashboard()
      setNotice('Announcement updated.')

    } catch (error) {
      setNotice(error.message)
    }
  }

  async function deleteAnnouncement(item) {
    if (!window.confirm(`Delete “${item.title}”?`)) return

    try {
      await api(`/announcements/admin/${item._id}`, {
        method: 'DELETE'
      })

      await loadDashboard()
      setNotice('Announcement deleted.')

    } catch (error) {
      setNotice(error.message)
    }
  }

  async function toggleAnnouncement(item) {
    try {
      await api(`/announcements/admin/${item._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          published: !item.published
        })
      })

      await loadDashboard()

      setNotice(
        item.published
          ? 'Announcement unpublished.'
          : 'Announcement published.'
      )

    } catch (error) {
      setNotice(error.message)
    }
  }

  async function uploadPhoto(event) {
    event.preventDefault()
    setBusy(true)
    setNotice('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      await api('/gallery/admin', {
        method: 'POST',
        body: formData
      })

      form.reset()
      await loadDashboard()

      setNotice('Photo uploaded to the gallery.')

    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  async function deletePhoto(photo) {
    if (
      !window.confirm(
        `Remove “${photo.title || photo.fileName}” from the gallery?`
      )
    ) return

    try {
      await api(`/gallery/admin/${photo._id}`, {
        method: 'DELETE'
      })

      await loadDashboard()
      setNotice('Photo removed.')

    } catch (error) {
      setNotice(error.message)
    }
  }

  async function setInquiryStatus(inquiry, status) {
    try {
      await api(
        `/inquiries/admin/${inquiry._id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status })
        }
      )

      await loadDashboard()

    } catch (error) {
      setNotice(error.message)
    }
  }

  async function deleteInquiry(inquiry) {
    if (
      !window.confirm(
        `Delete the enquiry from ${inquiry.name}?`
      )
    ) return

    try {
      await api(`/inquiries/admin/${inquiry._id}`, {
        method: 'DELETE'
      })

      await loadDashboard()
      setNotice('Enquiry deleted.')

    } catch (error) {
      setNotice(error.message)
    }
  }

  if (checking) {
    return (
      <section className="sec wrap">
        <p>Checking admin session…</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="sec wrap narrow admin-login">
        <form
          className="card form"
          onSubmit={signIn}
        >
          <h1>Admin sign in</h1>

          <p>
            Sign in to manage school announcements,
            gallery photos, and enquiries.
          </p>

          <label>
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              required
              minLength="8"
              autoComplete="current-password"
            />
          </label>

          <button
            className="btn"
            disabled={busy}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          {notice && (
            <p role="alert">{notice}</p>
          )}
        </form>
      </section>
    )
  }

  return (
    <section className="sec wrap admin-dashboard">

      <div className="admin-heading">
        <div>
          <h1>Admin dashboard</h1>
          <p>
            Signed in as {user.name} · {user.email}
          </p>
        </div>

        <button
          className="btn alt"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>

      <div className="admin-tabs" role="tablist">
        {tabs.map((name) => (
          <button
            key={name}
            className={
              tab === name ? 'chip on' : 'chip'
            }
            onClick={() => {
              setTab(name)
              setNotice('')
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}

      {tab === 'Announcements' && (
        <div className="admin-section">

          <form
            className="card form"
            onSubmit={createAnnouncement}
          >
            <h2>Post an announcement</h2>

            <label>
              Title
              <input
                name="title"
                required
                maxLength="120"
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                required
                maxLength="3000"
                rows="4"
              />
            </label>

            <label className="check-label">
              <input
                name="published"
                type="checkbox"
                defaultChecked
                value="true"
              />
              Publish now
            </label>

            <button
              className="btn"
              disabled={busy}
            >
              Publish announcement
            </button>
          </form>

          <div className="admin-list">
            {announcements.map((item) => (
              <article
                className="card admin-item"
                key={item._id}
              >
                <div>
                  <p className="admin-meta">
                    {item.published ? 'Published' : 'Draft'}
                    {' · '}
                    {new Date(item.publishAt).toLocaleString()}
                  </p>

                  <h3>{item.title}</h3>
                  <p>{item.message}</p>
                </div>

                <div className="admin-actions">
                  <button
                    className="chip"
                    onClick={() => editAnnouncement(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="chip"
                    onClick={() => toggleAnnouncement(item)}
                  >
                    {item.published ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    className="chip danger"
                    onClick={() => deleteAnnouncement(item)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'Gallery' && (
        <div className="admin-section">

          <form
            className="card form"
            onSubmit={uploadPhoto}
          >
            <h2>Upload a gallery photo</h2>

            <label>
              Photo (JPEG, PNG, or WebP; up to 5 MB)
              <input
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
              />
            </label>

            <label>
              Caption
              <input
                name="title"
                maxLength="120"
              />
            </label>

            <label>
              Category
              <input
                name="category"
                defaultValue="School Events"
                required
                maxLength="60"
              />
            </label>

            <button
              className="btn"
              disabled={busy}
            >
              {busy ? 'Uploading…' : 'Upload photo'}
            </button>
          </form>

          <div className="gal admin-gallery">
            {photos.map((photo) => (
              <article
                className="card admin-photo"
                key={photo._id}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title || photo.category}
                />

                <h3>{photo.title || photo.category}</h3>
                <p>{photo.category}</p>

                <button
                  className="chip danger"
                  onClick={() => deletePhoto(photo)}
                >
                  Delete photo
                </button>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'Inquiries' && (
        <div className="admin-list">

          {inquiries.length === 0 && (
            <p>No enquiries yet.</p>
          )}

          {inquiries.map((inquiry) => (
            <article
              className="card admin-item"
              key={inquiry._id}
            >
              <div>
                <p className="admin-meta">
                  {new Date(inquiry.createdAt).toLocaleString()}
                  {' · '}
                  {inquiry.subject}
                </p>

                <h3>{inquiry.name}</h3>

                <p>
                  <a href={`mailto:${inquiry.email}`}>
                    {inquiry.email}
                  </a>

                  {inquiry.phone && (
                    <>
                      {' · '}
                      <a href={`tel:${inquiry.phone}`}>
                        {inquiry.phone}
                      </a>
                    </>
                  )}
                </p>

                <p>{inquiry.message}</p>
              </div>

              <div className="admin-actions">
                <label>
                  Status
                  <select
                    value={inquiry.status}
                    onChange={(event) =>
                      setInquiryStatus(
                        inquiry,
                        event.target.value
                      )
                    }
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In progress</option>
                    <option value="handled">Handled</option>
                  </select>
                </label>

                <button
                  className="chip danger"
                  onClick={() => deleteInquiry(inquiry)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

    </section>
  )
}
