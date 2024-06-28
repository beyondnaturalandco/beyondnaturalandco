import React from "react";
import "./FoodItem.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FoodItem = ({ id, name, description, image }) => {
  return (
    <motion.div className="food-item"
      whileHover={{ y: -10 }} // Animación cuando el usuario pasa el mouse
      whileTap={{ scale: 0.95 }} // Escala cuando se toca en dispositivos móviles
    >
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
    </motion.div>
  );
};

export default FoodItem;
