// FoodDisplay.jsx
import React, { useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../context/StoreContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [ref, inView] = useInView({
    triggerOnce: true, // Para activar la animación una vez cuando entre en la vista
    threshold: 0.5, // Porcentaje de visibilidad para activar la detección
  });
  return (
    <div ref={ref} className={`food-display ${inView ? "visible" : ""}`} id="food-display">

      <h2>Top dishes near you</h2>
      <motion.div className="food-display-list" initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}>
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </motion.div>

    </div>

  );
};

export default FoodDisplay;
