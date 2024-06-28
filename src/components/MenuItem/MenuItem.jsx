// MenuItem.jsx
import React from "react";
import "./MenuItem.css";

const MenuItem = ({ item, category, setCategory }) => {

  
    return (
      <div

        className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
        onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}

      >
        <img
          loading="lazy"
          src={item.menu_image}
          alt=""
        />
        <p>{item.menu_name}</p>
      </div>
    );
  };
  
  export default MenuItem;