import chatting from "assets/img/auth-page/chatting.svg";
import chattingPhone from "assets/img/auth-page/chatting-phone.svg";
import "styles/profilePage/_profile-messages.scss";
import { Link } from "react-router-dom";

function ProfileMessages() {
  return (
    <section className="profile-messages">
      <h1 className="profile-messages__title">Wiadomości</h1>

      <div className="profile-messages__content">
        <aside className="profile-messages__sidebar">
          <img
            className="profile-messages__image"
            src={chatting}
            alt="chatting"
          />
          <h4 className="profile-messages__subtitle">
            Wybór konwersacji do przejrzenia i udzielenia odpowiedzi
          </h4>
          <p className="profile-messages__text">
            W tym miejscu pojawią się rozmowy rozpoczęte przez kupujących
          </p>
          <p className="profile-messages__text">
            Jeśli chcesz coś sprzedać lub oferujesz usługę, zacznij od{" "}
            <Link to="/sellcar" className="profile-messages__link">
              dodania ogłoszenia
            </Link>
          </p>
        </aside>

        <article className="profile-messages__main">
          <div className="profile-messages__main-inner">
            <img src={chattingPhone} alt="chatting phone" />
            <h4 className="profile-messages__subtitle">
              Wybór konwersacji do przejrzenia i udzielenia odpowiedzi
            </h4>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ProfileMessages;
