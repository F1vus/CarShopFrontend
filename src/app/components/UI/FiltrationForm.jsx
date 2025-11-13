import useDeviceMode from "../common/useDeviceMode";
import "styles/_filtration-form.scss";

function FiltrationForm({ variant = "auto" }) {
  const device = useDeviceMode();
  const activeVariant = variant === "auto" ? device : variant;

  const handleSubmitFiltration = (e) => {
    e.preventDefault();
  };

  return (
    <section className={`filtration-form filtration-form--${activeVariant}`}>
      <h3 className="filtration-form__title">Samochody Osobowe</h3>

      <form className="filtration-form__body" onSubmit={handleSubmitFiltration}>
        <div className="filtration-form__field">
          <label className="filtration-form__label">Szczegóły</label>
          <textarea
            className="filtration-form__input filtration-form__input--textarea"
            placeholder="Szczegóły"
          />
        </div>

        <div className="filtration-form__row filtration-form__row--selects">
          <div className="filtration-form__field">
            <label className="filtration-form__label">Model pojazdu</label>
            <select className="filtration-form__input">
              <option>Model pojazdu</option>
            </select>
          </div>

          <div className="filtration-form__field">
            <label className="filtration-form__label">Rodzaj paliwa</label>
            <select className="filtration-form__input">
              <option>Rodzaj paliwa</option>
            </select>
          </div>
        </div>

        <div className="filtration-form__row">
          <div className="filtration-form__field">
            <label className="filtration-form__label">Cena od</label>
            <input className="filtration-form__input" placeholder="Cena od" />
          </div>
          <div className="filtration-form__field">
            <label className="filtration-form__label">Cena do</label>
            <input className="filtration-form__input" placeholder="Cena do" />
          </div>
        </div>

        <div className="filtration-form__row">
          <div className="filtration-form__field">
            <label className="filtration-form__label">Rok produkcji od</label>
            <input
              className="filtration-form__input"
              placeholder="Rok produkcji od"
            />
          </div>
          <div className="filtration-form__field">
            <label className="filtration-form__label">Rok produkcji do</label>
            <input
              className="filtration-form__input"
              placeholder="Rok produkcji do"
            />
          </div>
        </div>

        <div className="filtration-form__row">
          <div className="filtration-form__field">
            <label className="filtration-form__label">Przebieg od</label>
            <input
              className="filtration-form__input"
              placeholder="Przebieg od"
            />
          </div>
          <div className="filtration-form__field">
            <label className="filtration-form__label">Przebieg do</label>
            <input
              className="filtration-form__input"
              placeholder="Przebieg do"
            />
          </div>
        </div>

        <button className="filtration-form__btn" type="submit">
          Pokaż Wszystkie Ogłoszenia
        </button>
      </form>
    </section>
  );
}

export default FiltrationForm;
