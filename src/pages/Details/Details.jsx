import React, { useEffect, useState } from 'react'
import './Details.css'
import { food_list } from "../../assets/assets";
import { useParams } from 'react-router-dom';
function Details() {
    const { id } = useParams();

    const [foodItem, setFoodItem] = useState(null);
    useEffect(() => {
        console.log(id)
        // Busca el elemento correspondiente al ID en la lista de alimentos
        const selectedFoodItem = food_list.find(item => item._id === id);
        if (selectedFoodItem) {
            setFoodItem(selectedFoodItem);
        }
    }, [id]);
    return (
        <div className='detailsContainer'>
            <div className='detailsImage'>
                {foodItem && (
                    <img src={foodItem.image2} alt="" className="responsive-image" />
                )}
            </div>
            <div className='detailsInfo'>
                {foodItem && (
                    <div>
                        <h3 className='title'>{foodItem.name}</h3>
                        <p className='description'>{foodItem.description}</p>
                        {foodItem.ingredients && (
                            <div>
                                <h4>Ingredients:</h4>
                                <ul>
                                    {foodItem.ingredients.split('\n').map((ingredient, index) => (
                                        <li className='ingredient' key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {foodItem.protein && 
                        <div className='protein'>
                            <h4>Protein:</h4>
                             <p> {foodItem.protein}</p>
                        </div>
                       }
                        {foodItem.toppings && (
                            <div>
                                <h4>Toppings:</h4>
                                <ul>
                                    {foodItem.toppings.split('\n').map((topping, index) => (
                                        <li className='topping' key={index}>{topping}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {foodItem.dressing && 
                        <div>
                            <h4>Dressing:</h4>
                            <p> {foodItem.dressing}</p>
                        </div>
                        }

                    </div>
                )}
            </div>

        </div>

    )
}

export default Details