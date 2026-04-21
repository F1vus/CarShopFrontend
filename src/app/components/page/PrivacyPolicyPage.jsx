import "styles/_privacy-policy-page.scss";

function PrivacyPolicyPage() {
  return (
    <div className="privacy-policy">
      <div className="privacy-policy__container">
        <h1 className="privacy-policy__title">Polityka Prywatności</h1>
        <p className="privacy-policy__last-updated">
          Ostatnia aktualizacja: 21 kwietnia 2026
        </p>

        <section className="privacy-policy__section">
          <h2>1. Informacje ogólne</h2>
          <p>
            Niniejsza polityka prywatności dotyczy serwisu{" "}
            <strong>Car Shop</strong> (zwanego dalej „Serwisem”), który służy
            do sprzedaży i zakupu samochodów. Serwis działa w oparciu o
            obowiązujące przepisy prawa, w tym Rozporządzenie Parlamentu
            Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r.
            (RODO).
          </p>
          <p>
            Administratorem Twoich danych osobowych jest{" "}
            <strong>Car Shop Sp. z o.o.</strong> z siedzibą przy ul.
            Motoryzacyjnej 10, 00-001 Warszawa, NIP: 123-45-67-890.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>2. Jakie dane zbieramy?</h2>
          <p>
            W zależności od sposobu korzystania z Serwisu, możemy gromadzić
            następujące dane:
          </p>
          <ul>
            <li>
              <strong>Dane konta:</strong> imię i nazwisko, adres e-mail, numer
              telefonu, adres (opcjonalnie) – gdy zakładasz konto.
            </li>
            <li>
              <strong>Dane ofertowe:</strong> informacje o samochodzie (marka,
              model, rok, przebieg, cena, zdjęcia, opis) – gdy dodajesz
              ogłoszenie.
            </li>
            <li>
              <strong>Dane transakcyjne:</strong> historia zakupów, zapisane
              ogłoszenia, preferencje wyszukiwania.
            </li>
            <li>
              <strong>Dane techniczne:</strong> adres IP, typ przeglądarki,
              system operacyjny, zachowanie na stronie (pliki cookies).
            </li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>3. Cel i podstawa przetwarzania</h2>
          <p>Twoje dane przetwarzamy w następujących celach:</p>
          <ul>
            <li>
              Zakładanie i zarządzanie kontem użytkownika (art. 6 ust. 1 lit. b
              RODO).
            </li>
            <li>
              Publikowanie i zarządzanie ogłoszeniami sprzedaży samochodów (art.
              6 ust. 1 lit. b RODO).
            </li>
            <li>
              Komunikacja z Tobą, w tym obsługa zapytań i powiadomień (art. 6
              ust. 1 lit. f RODO).
            </li>
            <li>
              Analiza i poprawa działania Serwisu, personalizacja treści (art. 6
              ust. 1 lit. f RODO).
            </li>
            <li>
              Wypełnienie obowiązków prawnych, np. podatkowych (art. 6 ust. 1
              lit. c RODO).
            </li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>4. Udostępnianie danych</h2>
          <p>
            Twoje dane osobowe nie są sprzedawane ani udostępniane osobom
            trzecim bez Twojej zgody, z wyjątkiem sytuacji wymaganych przez
            prawo lub niezbędnych do świadczenia usług:
          </p>
          <ul>
            <li>
              Dostawcy usług hostingowych i technicznych (np. serwery, bazy
              danych).
            </li>
            <li>
              Platformy analityczne (np. Google Analytics) – w formie
              zanonimizowanej.
            </li>
            <li>Organy ścigania lub sądy – na żądanie prawne.</li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>5. Okres przechowywania danych</h2>
          <p>
            Dane przechowujemy przez czas niezbędny do realizacji celu, w jakim
            zostały zebrane:
          </p>
          <ul>
            <li>
              Dane konta – do czasu usunięcia konta lub wniesienia sprzeciwu.
            </li>
            <li>
              Dane ogłoszeń – przez okres ważności ogłoszenia + 30 dni po jego
              usunięciu.
            </li>
            <li>
              Dane analityczne i cookies – zgodnie z ustawieniami Twojej
              przeglądarki.
            </li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>6. Twoje prawa</h2>
          <p>Przysługują Ci następujące prawa wobec Twoich danych osobowych:</p>
          <ul>
            <li>Dostęp do danych (w tym otrzymanie kopii).</li>
            <li>Sprostowanie nieprawidłowych danych.</li>
            <li>Usunięcie danych („prawo do bycia zapomnianym”).</li>
            <li>Ograniczenie przetwarzania.</li>
            <li>Przenoszenie danych.</li>
            <li>
              Wniesienie sprzeciwu wobec przetwarzania (w tym profilowania).
            </li>
            <li>
              Cofnięcie zgody w dowolnym momencie (jeśli przetwarzanie opiera
              się na zgodzie).
            </li>
          </ul>
          <p>
            Aby skorzystać z powyższych praw, skontaktuj się z nami pod adresem{" "}
            <a href="mailto:carshop@carshop.pl">carshop@carshop.pl</a>.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>7. Pliki cookies</h2>
          <p>
            Serwis używa plików cookies w celu zapewnienia prawidłowego
            działania, analizy ruchu oraz personalizacji treści. Możesz
            zarządzać ustawieniami cookies w swojej przeglądarce. Szczegółowe
            informacje znajdziesz w naszej{" "}
            <a href="/cookies">Polityce Cookies</a>.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>8. Bezpieczeństwo danych</h2>
          <p>
            Stosujemy środki techniczne i organizacyjne (m.in. szyfrowanie SSL,
            kontrola dostępu, regularne kopie zapasowe) aby chronić Twoje dane
            przed utratą, nieuprawnionym dostępem lub zniszczeniem.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>9. Zmiany w polityce prywatności</h2>
          <p>
            Zastrzegamy sobie prawo do aktualizacji niniejszej polityki
            prywatności. O wszelkich zmianach poinformujemy Cię poprzez widoczny
            komunikat na stronie lub wiadomość e-mail (jeśli posiadasz konto).
            Data ostatniej aktualizacji znajduje się na początku dokumentu.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>10. Kontakt</h2>
          <p>
            W sprawach związanych z ochroną danych osobowych możesz skontaktować
            się z nami:
          </p>
          <ul>
            <li>
              e-mail: <a href="mailto:carshop@carshop.pl">carshop@carshop.pl</a>
            </li>
            <li>telefon: +48 123 456 789</li>
          </ul>
        </section>

        <div className="privacy-policy__footer-note">
          <p>
            Korzystanie z Serwisu oznacza akceptację niniejszej polityki
            prywatności.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
