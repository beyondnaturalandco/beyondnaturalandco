import React, { useState } from "react";
import "./Search.css";
import { assets, food_list } from "../../assets/assets";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="search">
      <div className="search-items">
        <input
          id="searchInput"
          type="text"
          placeholder="Search food"
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <img src={assets.search_icon} alt="" />
      </div>
      <br />
      <hr />
      <div className="search-results">
        {food_list
          .filter((item) => {
            if (searchTerm === "") {
              return item;
            } else if (
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return item;
            }
          })
          .map((item) => {
            return (
              <div className="food-item">
                <div className="food-item-img-container">
                  <img className="food-item-image" src={item.image} alt="" />
                </div>
                <div className="food-item-info">
                  <div className="food-item-name-rating">
                    <p>{item.name}</p>
                    <img src={assets.rating_starts} alt="" />
                  </div>
                  <p className="food-item-desc">{item.description}</p>
                  <p className="food-item-price">₹{item.price}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Search;
