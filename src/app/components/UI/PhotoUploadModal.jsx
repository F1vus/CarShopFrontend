import { useRef } from "react";

function PhotoUploadModal({ onClose, onAddFiles, images, onRemove }) {
  const fileInputRef = useRef();

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length) onAddFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (dt?.files?.length) onAddFiles(dt.files);
  };

  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="photo-modal" onClick={onClose}>
      <div
        role="dialog"
        className="photo-modal__dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="photo-modal__header">
          <h3>Zarządzaj zdjęciami</h3>
          <div>
            <button className="photo-modal__close-btn" onClick={onClose}>
              Zamknij
            </button>
          </div>
        </div>

        <div
          className="photo-modal__dropzone"
          onDrop={handleDrop}
          onDragOver={prevent}
          onDragEnter={prevent}
          onDragLeave={prevent}
        >
          <p>
            Przeciągnij i upuść obrazy tutaj lub wybierz pliki ręcznie.
            <br />
            Wspierane: jpeg, webp, png — max 5MB na plik.
          </p>
          <div className="photo-modal__meta-note">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileInput}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              Wybierz pliki
            </button>
          </div>
        </div>

        <div className="photo-modal__thumbnails">
          {images.length === 0 && <div>Brak wybranych zdjęć.</div>}
          {images.map((img) => (
            <div className="photo-modal__thumb" key={img.id}>
              <div className="photo-modal__thumb-img">
                <img src={img.previewUrl} alt="preview" />
              </div>

              <div className="photo-modal__thumb-controls">
                <button type="button" onClick={() => onRemove(img.id)}>
                  Usuń
                </button>
                <div className="photo-modal__status">
                  {img.status === "uploading" && "Wysyłanie..."}
                  {img.status === "uploaded" && "Wysłane"}
                  {img.status === "error" && <span>Błąd</span>}
                  {img.status === "idle" && "Gotowy"}
                </div>
              </div>

              {img.error && (
                <div className="photo-modal__thumb-error">{img.error}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoUploadModal;
