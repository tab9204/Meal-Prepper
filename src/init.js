//********Initalization script that starts the app*****//
//import views and the mithril library
import {mealList,mealEdit,mealPlan,shoppingList} from './views.js';
import "../libraries/mithril.min.js";

window.onload = async () =>{
  //route to star the app on
  m.route.set('/list');
  //get the root element of the app
  var root = document.body.children[0];
  //set up the app routes
  m.route(root, "/list",{
    "/list": mealList,
    "/edit": mealEdit,
    "/plan": mealPlan,
    "/shop": shoppingList
  })
}
