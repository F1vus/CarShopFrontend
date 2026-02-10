# Car Shop - Frontend

## Opis

Niniejszy dokument opisuje sposób instalacji oraz uruchomienia części frontendowej projektu.

Projekt został przygotowany z wykorzystaniem narzędzia **Vite** i wymaga środowiska **Node.js**.

---

## Wymagania systemowe

Do poprawnego uruchomienia aplikacji wymagane są:

- **Node.js** w wersji **v22.14.0**
- **npm** (menedżer pakietów instalowany wraz z Node.js)


## Instalacja zależności

Przed uruchomieniem aplikacji należy pobrać wszystkie wymagane zależności projektu:

```bash
npm install
```


## Uruchomienie aplikacji

- Tryb developerski

  Uruchomienie aplikacji w trybie developerskim

  ```bash
  npm run dev
  ```

  Po uruchomieniu aplikacja będzie dostępna pod adresem wyświetlonym w konsoli (domyślnie http://localhost:5173)

- Budowanie wersji produkcyjnej

  W celu zbudowania aplikacji do wersji produkcyjnej należy wykonać polecenie:

  ```bash
  npm run build
  ```

- Podgląd wersji produkcyjnej

  Lokalne uruchomienie podglądu wersji produkcyjnej

  ```bash
  npm run preview
  ```