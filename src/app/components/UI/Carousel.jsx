import { useState, useRef, useEffect } from "react";
import config from "../../../config";

function Carousel({ photos = [], altPrefix = "photo" }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  const deltaX = useRef(0);

  useEffect(() => {
    if (index >= photos.length) {
      setIndex(0);
    }
  }, [photos, index]);

  const prev = () =>
    setIndex((i) =>
      photos.length ? (i - 1 + photos.length) % photos.length : 0
    );

  const next = () =>
    setIndex((i) => (photos.length ? (i + 1) % photos.length : 0));

  const goTo = (i) => {
    if (i >= 0 && i < photos.length) {
      setIndex(i);
    }
  };

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };

  const onTouchMove = (e) => {
    if (startX.current != null) {
      deltaX.current = e.touches[0].clientX - startX.current;
    }
  };

  const onTouchEnd = () => {
    if (Math.abs(deltaX.current) > 50) {
      deltaX.current < 0 ? next() : prev();
    }
    startX.current = null;
    deltaX.current = 0;
  };

  if (!photos.length) {
    return (
      <div className="carousel empty">
        <img src="/placeholder-car.jpg" alt={altPrefix} />
      </div>
    );
  }
  
  const getBestSize = () => {
    const dpr = window.devicePixelRatio || 1;
    const containerWidth = 900; // max carousel width in CSS
    const needed = Math.ceil(containerWidth * dpr);

    if (needed <= 156) return 156;
    if (needed <= 512) return 512;
    return 512; // fallback if screen is huge
  };

  const mainPhotoUrl =
    config.photosEndpoint + photos[index].url + getBestSize();

  const hasMultiple = photos.length > 1;

  return (
    <div className="carousel">
      <div
        className="carousel__main"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {hasMultiple && (
          <button
            className="carousel__nav carousel__nav--prev"
            onClick={prev}
            aria-label="Poprzednie"
          >
            ‹
          </button>
        )}

        <img src={mainPhotoUrl} alt={`${altPrefix}-${index}`} />

        {hasMultiple && (
          <button
            className="carousel__nav carousel__nav--next"
            onClick={next}
            aria-label="Następne"
          >
            ›
          </button>
        )}
      </div>

      {photos.length > 1 && (
        <div className="carousel__thumbs">
          {photos.slice(0, 6).map((p, i) => {
            const thumbUrl = config.photosEndpoint + p.url + "128";

            return (
              <button
                key={p.id ?? i}
                className={`carousel__thumb ${i === index ? "is-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Pokaż zdjęcie ${i + 1}`}
              >
                <img src={thumbUrl} alt={`${altPrefix}-thumb-${i}`} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Carousel;
