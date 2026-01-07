import React, { useState, useRef } from "react";

function Carousel({ photos = [], altPrefix = "photo" }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  const deltaX = useRef(0);

  const prev = () => setIndex((i) => (photos.length ? (i - 1 + photos.length) % photos.length : 0));
  const next = () => setIndex((i) => (photos.length ? (i + 1) % photos.length : 0));
  const goTo = (i) => setIndex(i);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };
  const onTouchMove = (e) => {
    if (startX.current != null) deltaX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(deltaX.current) > 50) {
      if (deltaX.current < 0) next();
      else prev();
    }
    startX.current = null;
    deltaX.current = 0;
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="carousel empty">
        <img src="/placeholder-car.jpg" alt={altPrefix} />
      </div>
    );
  }

  return (
    <div className="carousel">
      <div
        className="carousel__main"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button className="carousel__nav carousel__nav--prev" onClick={prev} aria-label="Poprzednie">
          ‹
        </button>
        <img src={photos[index].url} alt={`${altPrefix}-${index}`} />
        <button className="carousel__nav carousel__nav--next" onClick={next} aria-label="Następne">
          ›
        </button>
      </div>

      {photos.length > 1 && (
        <div className="carousel__thumbs">
          {photos.slice(0, 6).map((p, i) => (
            <button
              key={p.id}
              className={`carousel__thumb ${i === index ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Pokaż zdjęcie ${i + 1}`}
            >
              <img src={p.url} alt={`${altPrefix}-thumb-${i}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;
