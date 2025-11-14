function HorizontalScroll({ children, scrollRef }) {
  const handleMouseDown = (e) => {
    const oldX = e.pageX;

    const scrollLeft = scrollRef.current.scrollLeft;

    const handleMouseMove = (e) => {
      const newX = e.pageX;
      const offset = newX - oldX;

      scrollRef.current.scrollLeft = scrollLeft - offset;
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseUp);
  };

  return (
    <div
      className="widget-container"
      ref={scrollRef}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}
export default HorizontalScroll;
