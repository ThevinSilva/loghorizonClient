import React from "react";
import Category from "./Category";

const CategoryCarousel = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="carousel carouselContainer tooltipped"
      data-position="bottom"
      data-tooltip="if glitched or not there click center"
    >
      <Category name="Theory" img="Theory.jpg" />
      <Category name="DIY" img="DIY.jpg" />
      <Category name="Machine Learning" img="MachineLearning.jpg" />
      <Category name="Web Dev" img="WebDevelopment.jpg" />
      <Category name="Game Dev" img="GameDev.jpg" />
      <Category name="UX/UI" img="UXUI.jpg" />
      <Category name="off topic" img="offTopic.jpg" />
    </div>
  );
});

export default CategoryCarousel;
