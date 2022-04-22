//********Initalization script that starts the app*****//
//import views and the mithril library
import {mealList,mealEdit,mealPlan,shoppingList,loadingScreen} from './views.js';
import {navigate} from './data.js'
import {navBar} from './components.js'
import "../libraries/mithril.min.js";

window.onload = async () =>{
  //register service worker
  if ('serviceWorker' in navigator) {
    var registration = await navigator.serviceWorker.register('service-worker.js');
    console.log("service worker registered");
    //if the registration has been changed update it
    registration.update();
  }
  else{
    console.log("Service Workers not supported");
  }
  //get the nav root container
  var navRoot = document.getElementById("navRoot");
  //render the navBar to the nav root container
  m.render(navRoot, m(navBar));
  //app should start on the meal list
  await navigate.toMealList();
  //get the page root container
  var pageRoot = document.getElementById("pageRoot");
  //set up the app routes
  m.route(pageRoot, "/list",{
    "/list": mealList,
    "/edit": mealEdit,
    "/plan": mealPlan,
    "/shop": shoppingList,
    "/loading": loadingScreen
  })
}
