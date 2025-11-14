import { useRef } from "react";
import ScrollButtons from "./ScrollButtons";
import HorizontalScroll from "./HorizontalScroll";
import CarCard from "./CarCard";

function CardSlider({ carData }) {
  const scrollRef = useRef();
  return (
    <div className="card-slider">
      <div className="card-slider__content">
        <ScrollButtons scrollRef={scrollRef}/>
        <HorizontalScroll>
          {carData?.map((data, index) => (
            <CarCard carInfo={data} />
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}

export default CardSlider;
