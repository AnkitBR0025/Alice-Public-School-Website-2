import ContactForm from '../components/ContactForm'

export default function Admissions() {
  return (
    <section className="sec wrap">

      <h1>Admissions</h1>

      <p className="lead">
        Admissions enquiries are welcome for Nursery
        through Class V. Tell us a little about your
        child and the school team will get back to you.
      </p>

      <div className="two">

        <div className="card">
          <h2>Start an enquiry</h2>

          <p>
            Ask about admission from Nursery through
            Class V. Families are welcome to visit the
            campus, meet the staff, and learn about
            the next steps.
          </p>

          <p>
            For your visit, bring proof of age,
            proof of address, and any previous
            school records.
          </p>

          <p>
            Call the school:
            {' '}
            <a href="tel:+919899137983">
              +91 98991 37983
            </a>
          </p>
        </div>

        <ContactForm admission />

      </div>

    </section>
  )
}