import "styles/_scroll-buttons.scss";

function ScrollButtons({ scrollRef }) {
  const scrollAmount = 125; // size to move

  const handleClickLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const handleClickRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="scroll-buttons">
      <button
        className="move-button move-button__left"
        onClick={handleClickLeft}
      >
        <i className="bi bi-caret-left-fill"></i>
      </button>
      <button
        className="move-button move-button__right"
        onClick={handleClickRight}
      >
        <i className="bi bi-caret-right-fill"></i>
      </button>
    </div>
  );
}

export default ScrollButtons;
