//********Initalization script that starts the app*****//
//import views and the mithril library
import {mealList,mealEdit,mealPlan,shoppingList,loadingScreen} from './views.js';
import {navigate} from './data.js'
import "../libraries/mithril.min.js";

window.onload = async () =>{
  //route to start the app on
  await navigate.toMealList();
  //get the root element of the app
  var root = document.body.children[0];
  //set up the app routes
  m.route(root, "/list",{
    "/list": mealList,
    "/edit": mealEdit,
    "/plan": mealPlan,
    "/shop": shoppingList,
    "/loading": loadingScreen
  })
}
