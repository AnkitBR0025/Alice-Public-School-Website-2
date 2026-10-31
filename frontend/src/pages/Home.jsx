import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import NoticeBoard from '../components/NoticeBoard'
import Gallery from '../components/Gallery'
import StudentLifeCards from '../components/StudentLife'
import { faqs } from '../data'

export default function Home({ isAdmin = false }) {
  return (
    <>
      <Hero isAdmin={isAdmin} />

      <section className="sec wrap">
        <h2>Welcome to Alice Public School</h2>

        <p className="lead">
          Serving families in Molarband Extension,
          Badarpur, with attentive teaching, a safe
          campus, and steady progress for every child.
        </p>

        <div className="grid3">
          <div className="card tile c1">
            <div className="ico">📚</div>
            <h4>Core learning</h4>
            <p>
              Language, mathematics, and environmental
              studies with regular assessment.
            </p>
          </div>

          <div className="card tile c2">
            <div className="ico">⚽</div>
            <h4>Sports &amp; play</h4>
            <p>
              Physical activity and friendly games
              through the year.
            </p>
          </div>

          <div className="card tile c3">
            <div className="ico">🎨</div>
            <h4>Creative activities</h4>
            <p>
              Art, craft, assemblies, and school
              celebrations.
            </p>
          </div>
        </div>
      </section>

      <section className="sec wrap">
        <h2>School gallery</h2>

        <Gallery />

        <p className="center">
          <Link className="btn" to="/gallery">
            View full gallery
          </Link>
        </p>
      </section>

      <section className="sec wrap two">
        <div>
          <h2>School life</h2>

          <p className="lead">
            A general education built on core subjects,
            with room to grow beyond the classroom.
          </p>

          <StudentLifeCards />
        </div>

        <NoticeBoard />
      </section>

      <section className="sec wrap narrow">
        <h2>Frequently asked questions</h2>

        {faqs.map(([question, answer]) => (
          <div
            key={question}
            className="card faq"
          >
            <h3>{question}</h3>
            <p>{answer}</p>
          </div>
        ))}

        {!isAdmin && (
          <p className="center">
            <Link
              className="btn"
              to="/admissions"
            >
              Apply for Admission
            </Link>
          </p>
        )}

      </section>
    </>
  )
}