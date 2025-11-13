import "styles/_divider.scss";

function Divider({ right = false }) {
  return (
    <div className="divider wide-container">
      <div className="divider-line">
        <div
          className={`divider-dot divider-dot-${right ? "-right" : "-left"}`}
        ></div>
      </div>
    </div>
  );
}

export default Divider;
