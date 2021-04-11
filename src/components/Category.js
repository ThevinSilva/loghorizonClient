import react from "react";

const Category = ({ name, img }) => {
  return (
    <div className="carousel-item z-depth-4 categoryCard" data-value={name}>
      <img
        src={img}
        style={{ height: "80%", width: "auto", marginTop: "1.5rem" }}
      />
      <p>{name}</p>
    </div>
  );
};

export default Category;
