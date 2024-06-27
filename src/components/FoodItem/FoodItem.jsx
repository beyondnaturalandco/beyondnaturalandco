import React from "react";
import "./FoodItem.css";
import { Link } from "react-router-dom";

const FoodItem = ({ id, name, description, image }) => {

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img loading="lazy" className="food-item-image" src={image} alt="" />
      </div>
      <Link to={`/details/${id}`}>
        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
          </div>
          <p className="food-item-desc">{description}</p>
        </div>
      </Link>

    </div>
  );
};

export default FoodItem;
