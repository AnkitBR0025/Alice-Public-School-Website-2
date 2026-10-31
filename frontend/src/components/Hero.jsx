import { Link } from 'react-router-dom'

export default function Hero({ isAdmin = false }) {
  return (
    <section className="hero">
      <div className="wrap hero-in">

        <div>
          <h1>Learning that feels like home</h1>

          <p className="tag">
            एलिस पब्लिक स्कूल · Alice Public School
          </p>

          <p>
            A neighbourhood school in Badarpur for
            Nursery through Class V, where children
            receive steady attention in a safe,
            welcoming place.
          </p>

          <div className="btns">

            {!isAdmin && (
              <Link
                className="btn"
                to="/admissions"
              >
                Start admissions
              </Link>
            )}

            <a
              className="btn alt"
              href="tel:+919899137983"
            >
              Call school
            </a>

          </div>
        </div>

        <div className="art" aria-hidden="true">
          🏫
          <span>🎒</span>
          <span>✏️</span>
          <span>⭐</span>
        </div>

      </div>
    </section>
  )
}