import ContactForm from '../components/ContactForm'

export default function Contact({ isAdmin = false }) {
  return (
    <section className="sec wrap">

      <h1>Contact us</h1>

      <div className="two">

        <div className="card">

          <h2>Alice Public School</h2>

          <address className="contact-address">
            155E, Khajoor Rd, Block C
            <br />
            Molarband Extension, Badarpur
            <br />
            New Delhi, Delhi 110044
          </address>

          <p>
            📞
            {' '}
            <a href="tel:+919899137983">
              +91 98991 37983
            </a>
          </p>

          <a
            className="btn"
            href="https://www.google.com/maps/search/?api=1&query=Alice+Public+School+155E+Khajoor+Rd+Block+C+Molarband+Extension+Badarpur+New+Delhi+110044"
            target="_blank"
            rel="noreferrer"
          >
            Get directions
          </a>

          <iframe
            className="contact-map"
            title="Map to Alice Public School"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=155E%2C%20Khajoor%20Rd%2C%20Block%20C%2C%20Molarband%20Extension%2C%20Badarpur%2C%20New%20Delhi%2C%20Delhi%20110044&z=16&output=embed"
          />

        </div>

        {!isAdmin && <ContactForm />}

      </div>

    </section>
  )
}