import chatting from "assets/img/auth-page/chatting.svg";
import chatting_pgone from "assets/img/auth-page/chatting-phone.svg"
import "styles/profilePage/_profile-messages.scss"
import {Link} from "react-router-dom";

function ProfileMessages() {

  return (
      // <h1>Wiadomości</h1>
      <>
          <section className="profile-messages">

              <h1 className="profile-messages__news">Wiadomości</h1>

            <div className="profile-messages__content">
                <aside className="profile-messages__chose">
                    <img className="profile-messages__image" src={chatting} alt="chatting" />
                    <h4 className="profile-messages__subtitle">Wybór konwersacji do przejrzenia i udzielenia odpowiedzi</h4>
                    <p className="profile-messages__text">W tym miejscu pojawią się rozmowy rozpoczęte przez kupujących</p>
                    <p className="profile-messages__text">Jeśli chcesz coś sprzedać lub oferujesz usługę, zacznij od <Link to="/sellcar" className="profile-messages__link"> dodania ogłoszenia</Link> </p>
                </aside>



                <article className="profile-messages__article">
                    <div>
                        <img src={chatting_pgone} alt="chatting_pgone" />
                        <h4 className="profile-messages__subtitle">Wybór konwersacji do przejrzenia i udzielenia odpowiedzi</h4>
                    </div>
                </article>
            </div>


          </section>


      </>
  );
}

export default ProfileMessages;