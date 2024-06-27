// MenuItem.jsx
import React from "react";
import { motion } from "framer-motion";
import "./MenuItem.css";
import { useInView } from "react-intersection-observer";

const MenuItem = ({ item, category, setCategory }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.5,
    });
  
    return (
      <motion.div
        ref={ref}
        className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
        onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.img
          loading="lazy"
          src={item.menu_image}
          alt=""
          whileHover={{ scale: 1.1 }}
        />
        <motion.p>{item.menu_name}</motion.p>
      </motion.div>
    );
  };
  
  export default MenuItem;