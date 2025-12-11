import React from "react";
import "styles/_contacts.scss";

const ContactsPage = () => {
  const phone = "+48 123 321 221";
  const email = "carshopoffice@gmail.com";

  return (
    <div className="contacts-page">
      <div className="contacts-container">
        <header className="contacts-hero">
          <h1 className="contacts-hero__title">Skontaktuj się z nami</h1>
          <p className="contacts-hero__subtitle">
            Jesteśmy do Twojej dyspozycji — telefonicznie i mailowo. Szybkie
            odpowiedzi i pomoc techniczna w godzinach pracy.
          </p>
        </header>

        <section className="contacts-grid">
          <div className="contacts-card contacts-card--info">
            <div className="contact-item">
              <div className="contact-item__icon phone-icon" aria-hidden>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12C22 10.6868 21.7413 9.38647 21.2388 8.1731C20.7362 6.95996 19.9997 5.85742 19.0711 4.92896C18.1425 4.00024 17.0401 3.26367 15.8268 2.76123C14.6136 2.25854 13.3132 2 12 2V4C13.0506 4 14.0909 4.20703 15.0615 4.60889C16.0321 5.01099 16.914 5.60034 17.6569 6.34326C18.3997 7.08594 18.989 7.96802 19.391 8.93848C19.7931 9.90918 20 10.9495 20 12H22Z" fill="currentColor"/>
                  <path d="M2 10V5C2 4.44775 2.44772 4 3 4H8C8.55228 4 9 4.44775 9 5V9C9 9.55225 8.55228 10 8 10H6C6 14.4182 9.58173 18 14 18V16C14 15.4478 14.4477 15 15 15H19C19.5523 15 20 15.4478 20 16V21C20 21.5522 19.5523 22 19 22H14C7.37259 22 2 16.6274 2 10Z" fill="currentColor"/>
                  <path d="M17.5433 9.70386C17.8448 10.4319 18 11.2122 18 12H16.2C16.2 11.4485 16.0914 10.9023 15.8803 10.3928C15.6692 9.88306 15.3599 9.42017 14.9698 9.03027C14.5798 8.64014 14.1169 8.33081 13.6073 8.11963C13.0977 7.90869 12.5515 7.80005 12 7.80005V6C12.7879 6 13.5681 6.15527 14.2961 6.45679C15.024 6.7583 15.6855 7.2002 16.2426 7.75732C16.7998 8.31445 17.2418 8.97583 17.5433 9.70386Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="contact-item__body">
                <h3>Telefon</h3>
                <a className="contact-link" href={`tel:${phone.replace(/\s+/g, "")}`}>
                  {phone}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item__icon mail-icon" aria-hidden>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div className="contact-item__body">
                <h3>E-mail</h3>
                <a className="contact-link" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            </div>

            <div className="contact-item contact-item--socials">
              <div className="contact-item__icon socials-icon" aria-hidden>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6.05-1.79C9.29 21.61 10.63 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.41 0-2.73-.36-3.88-.99l-.28-.15-2.89.86.86-2.89-.15-.28C4.36 14.73 4 13.41 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.5-9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5S7.67 8 8.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <div className="contact-item__body">
                <h3>Obserwuj nas</h3>
                <div className="social-links">
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-link social-link--tiktok social-animate" aria-label="TikTok" title="TikTok">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.87 2.87 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.08 6.85 6.85 0 1 0 6.89 6.85V10.9a8.63 8.63 0 0 0 4.86 1.48V8.94a4.84 4.84 0 0 1-.99-.25z"/></svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link social-link--instagram social-animate" aria-label="Instagram" title="Instagram">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.1A4.9 4.9 0 1012 17a4.9 4.9 0 010-8.9zM18.4 6.6a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link social-link--facebook social-animate" aria-label="Facebook" title="Facebook">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.6c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.1h-1.08c-1.06 0-1.39.66-1.39 1.34V12h2.36l-.38 2.9h-1.98v7A10 10 0 0022 12z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contacts-card contacts-card--hours">
            <h3 className="hours-title">Godziny pomocy telefonicznej</h3>
            <div className="hours-list">
              <div className="hours-row"><span>Pon - Pt</span><span>08:00 — 20:00</span></div>
              <div className="hours-row"><span>Sobota</span><span>09:00 — 16:00</span></div>
              <div className="hours-row"><span>Niedziela</span><span>Nieczynne</span></div>
            </div>

            <div className="contacts-cta">
              <a className="btn btn--primary" href={`tel:${phone.replace(/\s+/g, "")}`}>Zadzwoń teraz</a>
              <a className="btn btn--secondary" href={`mailto:${email}`}>Napisz e-mail</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactsPage;
