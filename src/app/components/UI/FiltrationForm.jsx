import "styles/_filtration-form.scss";

function FiltrationForm() {
  const handleSubmitFiltration = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <h3 className="filtration-form__title">Samochody Osobowe</h3>
      <form className="filtration-form" onSubmit={handleSubmitFiltration}>
        <div className="form-field">
          <label className="heading">Szczegóły</label>
          <textarea placeholder="Szczegóły" />
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="heading">Model pojazdu</label>
          <select>
            <option>Model pojazdu</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="heading">Cena od</label>
            <input placeholder="Cena od" />
          </div>
          <div className="form-field">
            <label className="heading">Cena do</label>
            <input placeholder="Cena do" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="heading">Rok produkcji od</label>
            <input placeholder="Rok produkcji od" />
          </div>
          <div className="form-field">
            <label className="heading">Rok produkcji do</label>
            <input placeholder="Rok produkcji do" />
          </div>
        </div>

        <div className="form-field">
          <label className="heading">Rodzaj paliwa</label>
          <select>
            <option>Rodzaj paliwa</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="heading">Przebieg od</label>
            <input placeholder="Przebieg od" />
          </div>
          <div className="form-field">
            <label className="heading">Przebieg do</label>
            <input placeholder="Przebieg do" />
          </div>
        </div>

        <button className="show-btn" type="submit">
          Pokaż Wszystkie Ogłoszenia
        </button>
      </form>
    </>
  );
}

export default FiltrationForm;
