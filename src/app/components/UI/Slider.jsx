import "styles/_slider.scss";

function Slider({ children }) {
  return (
    <div className="slider">
      <div className="slide-track">{children}</div>
    </div>
  );
}

export default Slider;
