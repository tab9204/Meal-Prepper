//********Initalization script that starts the app*****//
//import views and the mithril library
import {mealList,mealView,mealEdit,mealPlan,shoppingList,loadingScreen,mealOptions,mealSelect,recoverData} from './views.js';
import {navigate,views} from './data.js'
import {navBar} from './components.js'
import {database} from './database.js';
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
  //app init recovery entry update
  //this can happen in the background so no need to await
  views.recovery.update_recovery();
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
    "/list": mealList,//lists out all meals
    "/view": mealView,//allows a meal to be edited
    "/edit": mealEdit,//allows a meal to be edited
    "/plan": mealPlan,//provides options to make a shopping list
    "/shop": shoppingList,//displays the shopping list
    "/load": loadingScreen,//shows a loading screen
    "/options": mealOptions,//shows options for how the user can add a meal
    "/select": mealSelect,//shows a list of recipes the user can select
    "/recovery":recoverData//allows the user to input a recovery id and recover lost data
  })
}
