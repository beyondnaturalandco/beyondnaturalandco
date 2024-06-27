import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import MenuItem from "../MenuItem/MenuItem";

const ExploreMenu = ({ category, setCategory }) => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Para activar la animación una vez cuando entre en la vista
    threshold: 0.5, // Porcentaje de visibilidad para activar la detección
  });
  return (
    <div ref={ref} className={`explore-menu ${inView ? "visible" : ""}`} id="explore-menu">
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        Explore our menu
      </motion.h1>
      <motion.p
        className="explore-menu-text"
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
      </motion.p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            category={category}
            setCategory={setCategory}
          />
        ))}
      </div>
      <motion.hr
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
    </div>
  );
};

export default ExploreMenu;
