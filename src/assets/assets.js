import basket_icon from './basket_icon.png'
import logo from './logo.png'
import logowhite from './logoTransWhite.png'
import header_img from './header_img.jpg'
import search_icon from './search_icon.png'
import menu_1 from './menu_1.png'
import menu_2 from './menu_2.jpg'

import food_1 from './food_1.jpg'


import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import rating_starts from './rating_starts.png'
import profile_icon from './profile_icon.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'
import WaldorfSalad from './WaldorfSalad.jpg'
import TunaSalad from './TunaSalad.jpg'
import ChickenDill from './ChickenDill.jpg'
import ChickenOrzo from './ChickenOrzo.jpg'
import BabySpinach from './BabySpinach.jpg'
import ArugulaMandarine from './ArugulaMandarine.jpg'
import Spring from './Spring.png'
import Romaine1 from './Romaine1.jpg'
import Romaine from './Romaine.jpg'
export const assets = {
    logo,
    basket_icon,
    header_img,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon,
    WaldorfSalad,
    TunaSalad,
    ChickenDill,
    logowhite,
    ChickenOrzo,
    BabySpinach,
    ArugulaMandarine,
    Spring,
    Romaine1,
    Romaine
}

export const menu_list = [
    {
        menu_name: "Salad",
        menu_image: menu_1
    },
    {
        menu_name: "Maked Your Own Salad",
        menu_image: menu_2
    }]

export const food_list = [
    {
        _id: "1",
        name: "Chicken Waldorf Salad",
        image: food_1,
        image2: WaldorfSalad,
        description: "A fresh salad with chicken, apples, celery, grapes, and walnuts in creamy mayo.",
        category: "Salad",
        ingredients: "- Shredded chicken\n- Celery\n- Apple\n- Grapes\n- Pecans or walnuts\n- Yogurt\n- Lemon juice\n- Salt and pepper\n- Romaine lettuce"

    },
    {
        _id: "2",
        name: "Tuna Salad",
        image: TunaSalad,
        image2: TunaSalad,
        description: "A classic salad with tuna, mixed greens, crunchy veggies, and a zesty dressing.",
        category: "Salad",
        ingredients: "- Tuna\n- Pasta or spring mix lettuce\n- Tomato\n- Red onion\n- Scallions\n- Hard boiled eggs\n- Olives\n- Lemon juice\n- Salt and pepper\n- Low fat Greek yogurt"

    }, {
        _id: "3",
        name: "Chicken Dill Quinoa Salad",
        image: ChickenDill,
        image2: ChickenDill,
        description: "A hearty salad with chicken, quinoa, fresh dill, and a lemony vinaigrette.",
        category: "Salad",
        ingredients: "- Quinoa\n- Dill\n- Chickpeas\n- Cucumber\n- Cherry tomatoes\n- Dry cranberries\n- Peppers\n- Baby bok choy\n- Carrots\n- Broccoli\n- Walnuts\n- Sunflower seeds\n- Salt and pepper\n- Lemon juice"

    }, {
        _id: "4",
        name: "Chicken Orzo Greek Salad",
        image: ChickenOrzo,
        image2: ChickenOrzo,
        description: "A vibrant salad with chicken, orzo, olives, feta, and a tangy Greek dressing.",
        category: "Salad",
        ingredients: "- Grilled chicken breast\n- Orzo\n- Cherry tomatoes\n- Cucumber\n- Red onions\n- Parsley\n- Black olives\n- Red and green peppers\n- Chickpeas\n- Feta cheese\n- Olive oil\n- Salt and pepper"

    }, {
        _id: "5",
        name: "Baby Spinach StrawBerry Salad",
        image: BabySpinach,
        image2: BabySpinach,
        description: "A refreshing salad with baby spinach, sweet strawberries, almonds, and balsamic vinaigrette.",
        category: "Salad",
        ingredients: "- Grilled chicken breast\n- Baby spinach\n- Strawberries\n- Mint\n- Feta cheese\n- Toasted almonds\n- Lemon juice\n- Balsamic vinegar\n- Honey\n- Olive oil\n- Salt and pepper"

    }, {
        _id: "6",
        name: "Arugula Mandarine Beets Salad",
        image: ArugulaMandarine,
        image2: ArugulaMandarine,
        description: "A vibrant salad featuring peppery arugula, juicy mandarin oranges, and flavorful beets",
        category: "Salad",
        ingredients: "- Grilled chicken breast\n- Mandarin\n- Red onion\n- Mint\n- Dill\n- Arugula\n- Beets\n- Sunflower seeds\n- Goat cheese\n- Dijon mustard\n- Salt and pepper"

    }, {
        _id: "7",
        name: "Spring Mix",
        image: Spring,
        image2: Spring,
        description: "A refreshing salad mix served with a zesty olive oil mustard dressing.",
        category: "MakeSalad",
        ingredients: "",
        protein: "Grilled chicken breast, Tuna",
        toppings: "- Cherry tomatoes\n- Cucumber\n- Radish\n- Carrots\n- Chickpeas\n- Broccoli\n- Peppers\n- Heart of palm\n- Olives\n- Hard-boiled eggs\n- Walnuts",
        dressing: "Olive oil mustard, Cilantro lime"
    }, {
        _id: "8",
        name: "Romaine lettuce",
        image: Romaine1,
        image2: Romaine,
        description: "A crisp and refreshing salad base made with Romaine lettuce leaves, perfect for customizing with your favorite toppings and dressings.",
        category: "MakeSalad",
        ingredients: "",
        protein: "Grilled chicken breast, Buffalo chicken",
        toppings: "- Cauliflower\n- Corn\n- Black beans\n- Tomatoes\n- Red onion\n- Peppers\n- Cucumber\n- Olives\n- Carrots\n- Almonds\n- Feta cheese",
        dressing: "Low-fat Greek yogurt dressing, Buffalo dressing, Olive oil Dijon mustard"
    },
]
