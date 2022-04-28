/**********Data for rendering app views************/
import {database} from './database.js';
import "../libraries/pouchdb-7.2.1.js";

//navigating app views
var navigate = {
  //navigates to the meal list view
  toMealList: async ()=>{
    await views.mealList.initalize();
    //route to the meal plan view passing along all the meals
    m.route.set('/list');
  },
  //navigates to the meal edit view
  //id => the id of the meal to display for editing
  toMealEdit: async (id)=>{
    await views.mealEdit.initalize(id);
    //route to the edit view passing the rendering vars
    m.route.set('/edit');
  },
  //navigates to the meal plan view
  toMealPlan: async ()=>{
    await views.mealPlan.initalize();
    //route to the mealPlan view passing the render data to the view
    m.route.set('/plan');
  },
  //navigates to the shopping list view
  toShoppingList: async ()=>{
    await views.shoppingList.initalize();
    //route to the shopping list view
    m.route.set('/shop');
  },
  toLoadingScreen: async()=>{
    //route to the loading screen view
    m.route.set('/loading');
  },
  //adds a pulse animation to a navigation button on click
  //e => element that triggered the click event
  addPulse: (e)=>{
    //create the background pulse element
    var pulse = document.createElement('div');
    pulse.classList.add('btnBackground', 'pulse');
    //add an animationend event listener to the new element
    pulse.addEventListener("animationend",(e)=>{
      //when the pulse animation ends remove the element from the dom
      e.currentTarget.remove();
    });
    //get the parent container  of the nav button that was clicked
    var container = e.currentTarget.parentElement;
    //add the background pulse to the parent container, adding it before the button
    container.insertBefore(pulse,container.children[0]);
  }
}

//view specific data, functions and events
var views = {
  mealList: {
    lightBox: {
      meal_id: null, //the id of the meal that should be deleted if the user selects delete
      id: "mealListLightBox",
      text: "Are you sure you want to delete this meal?",
      buttons: [
        {
          click: async (vnode)=>{
            //delete the selected recipe from the db
            await database.delete(database.meals,views.mealList.lightBox.meal_id);
            //reload the meal list page by navigating back to it
            await navigate.toMealList();
            //close the lightbox
            utilities.lightBox.close(views.mealList.lightBox.id);
          },
          text: "Delete"
        },
        {
          click: (vnode) =>{
            //close the lightbox
            utilities.lightBox.close(views.mealList.lightBox.id);
          },
          text: "Cancel"
        }
      ]
    },
    allMeals: [],//array containg the meal data needed to render the view
    initalize: async ()=>{//initalizes the view data
      //get an up to date list of meals from the meals db
      var meals = await database.getAll(database.meals);
      //sort the meals in order of newest to oldest
      meals.sort((a,b)=>{return b.id - a.id;});
      //set the meal list variable
      views.mealList.allMeals = meals;
      m.redraw();
    }
  },
  //the mealEdit view
  mealEdit:{
    //reference to the setTimout function
    timeout: null,
    //the meal data the view needs to render
    meal: {
      id:null,
      name:null,
      ingredients:null,
      directions:null,
      checked:null
    },
    //boolean for if the text input should automatically focus on page render
    autoFocus:false,
    //id => the id of the meal to display for editing
    initalize: async (id)=>{
      //if the id is not undefined we are editing an existing meal
      if(id !== undefined){
        //get the meal data from the db
        var meal = await database.get(database.meals,id);
        //set the rendering vars to the meal data from the db
        views.mealEdit.meal.id = id;
        views.mealEdit.meal.name = meal.name;
        views.mealEdit.meal.ingredients = meal.ingredients;
        views.mealEdit.meal.directions = meal.directions;
        views.mealEdit.meal.checked = meal.checked !== undefined ? meal.checked : [];
        //since this is an existing meal we are editing the mobile keyboard should not automatically show
        views.mealEdit.autoFocus = false;
      }
      //if the id is undefined then we are creating a brand new meal
      else{
        //generate a unique id for the new meal
        var new_id = '' + Date.now();
        //meal data to store in the db
        //since its new the data should default to empty
        //var data = {name: '', ingredients:'', directions:'', checked: []};
        //add the new meal to the db
        //await database.add(database.meals,new_id,data);
        //rendering vars default to empty
        views.mealEdit.meal.id = new_id;
        views.mealEdit.meal.name = '';
        views.mealEdit.meal.ingredients = '';
        views.mealEdit.meal.directions = '';
        views.mealEdit.meal.checked = []
        //new meal so mobile keyboard should auto show
        views.mealEdit.autoFocus = true;
      }
    },
    //on input change
    //e => event data
    //id => id of the meal being edited
    //id => the checked ingredients array for the meal
    onChange: (e,id,checked)=>{
      //prevent mithril from redrawing the view
      //if we did not do this the text in the textarea would be removed
      e.redraw = false;
      //clear any exising setTimout functions
      clearTimeout(views.mealEdit.timeout);
      //create a new setTimeout
      views.mealEdit.timeout = setTimeout(async () => {
        //get the text in each textarea input
        var name = document.getElementById("name").value;
        var ingredients = document.getElementById("ingredients").value;
        var directions = document.getElementById("directions").value;
        //meal data object with the values from the textareas
        var data = {name: name, ingredients: ingredients, directions: directions, checked: checked};
        //check if this meal already exists in the db or is brand new
        var meal = await database.get(database.meals,id);
        //if the meal is not blank then it already exits in the db and we can update it
        if(meal !== ""){
          await database.update(database.meals,id,data);
        }
        //otherwise the meal doesnt exit and we should add it to the db
        else if (meal == ""){
          await database.add(database.meals,id,data);
        }
      }, 500);
    }
  },
  // the mealPlan view
  mealPlan:{
    lightBox1: {
      id: "mealPlanLightbox1",
      text: "Delete this meal plan and start over with a new one?",
      buttons: [
        {
          click: async (vnode)=>{
            await views.mealPlan.deletePlan();//delete the meal plan
            //open and close the correct lightboxes
            utilities.lightBox.close("mealPlanLightbox1");
            utilities.lightBox.open("mealPlanLightBox2");
          },
          text: "Delete"
        },
        {
          click: (vnode) =>{
            utilities.lightBox.close("mealPlanLightbox1");
          },
          text: "Cancel"
        }
      ]
    },
    lightBox2: {
      id: "mealPlanLightBox2",
      text: "How many days would you like to meal prep for?",
      buttons: [
        {
          click: async (vnode)=>{
            await views.mealPlan.createPlan(3,0);
            utilities.lightBox.close("mealPlanLightBox2");
          },
          text: "3 Days"
        },
        {
          click: async (vnode)=>{
            await views.mealPlan.createPlan(5,0);
            utilities.lightBox.close("mealPlanLightBox2");
          },
          text: "5 Days"
        },
        {
          click: async (vnode)=>{
            await views.mealPlan.createPlan(7,0);
            utilities.lightBox.close("mealPlanLightBox2");
          },
          text: "7 Days"
        },
        {
          click: async (vnode)=>{
            await views.mealPlan.createPlan(14,0);
            utilities.lightBox.close("mealPlanLightBox2");
          },
          text: "14 Days"
        },
      ]
    },
    //meal plan data needed to render the view
    plan: [],
    initalize: async ()=>{
      //empty the meal plan array
      views.mealPlan.plan = [];
      //get all days in the meal plan
      var mealPlan = await database.getAll(database.mealPlan);
      //loop through all the days
      for (var day of mealPlan) {
        //get the name and id of the meal on each day of the plan
        var meal = await database.get(database.meals,day.doc.meal_id);
        var name = meal.name;
        var meal_id = meal._id;
        //add an object with the meal name, meal id, day id and checked boolan to the meal plan array
        views.mealPlan.plan.push({name: name, meal_id:meal_id, id: day.id, checked: day.doc.checked});
      }
    },
    //creates a meal plan by adding X number of entries to the mealPlan db
    //days => number of days and meals in the meal plan
    //added => counter to keep track of the number of meals added
    createPlan: async (days,added)=>{
      //get all the meals in the db
      var allMeals = await database.getAll(database.meals);
      //if the there are no meals saved in the db create an empty array to use instead
      if(allMeals.length <= 0){
        //fill the allMeals array with empty strings for each day in the meal plan
        allMeals = Array(days).fill("");
      }
      //shuffle the order of the meals array
      utilities.shuffle(allMeals);
      //loop through each meal
      for(var i = 0; i < allMeals.length; i++){
        //get a meal from the meals array
        var selectedMeal = allMeals[i];
        //build the object containing the data needed for the new entry in the meal plan db
        var data = {meal_id: selectedMeal.id, checked: false};
        //add a new entry to the meal plan db
        await database.add(database.mealPlan,added + "",data);
        //increment the added counter
        added++;
        //if the number of meals added is equal to the number of days in the meal plan
        if(added == days){
          //we have added enough meals so we can break out of the loop
          break;
        }
      }
      //if the number of meals added is less then the number of days in the meal plan
      if(added < days){
        //we will need to add more so call createPlan again
        await views.mealPlan.createPlan(days,added);
      }
      //if we have added enough meals for each day in the meal plan
      else if(added == days){
        //navigate to the meal plan view. This will re-render the view with the most up to date meal plan
        navigate.toLoadingScreen();
      }
    },
    //deletes the current meal plan from the db
    deletePlan: async ()=>{
      //get all days in the meal plan
      var allDays = await database.getAll(database.mealPlan);
      //loop through all meals and delete them from the meal plan db
      for(var i = 0; i < allDays.length; i++){
        //since we are going to create a new meal plan we want to reset the checked array on each meal in the meal plan
        //get the meal data
        var meal = await database.get(database.meals,allDays[i].doc.meal_id);
        //update the checked array only if the meal still exists in the recipe
        if(meal !== ""){
          //reset the checked array
          meal.checked = undefined;
          //update the meal entry with the new checked array
          var update = {name: meal.name, ingredients:meal.ingredients, directions:meal.directions, checked: meal.checked};
          await database.update(database.meals,meal._id,update);
        }
        //now we can delete the meal from the meal plan
        await database.delete(database.mealPlan,allDays[i].id + "");
      }
    },
    //toggles if a day in the meal plan has been checked
    //e => the click event data
    //day_id => id of the day clicked on
    //meal_id => id of the meal on the day clicked on
    checkOffDay: async (e,day_id,meal_id)=>{
      //toggle the checked class on the button's parent element
      e.currentTarget.classList.toggle("checked");
      //get the meal plan data so that that the db entry can be updated
      var checked = e.currentTarget.classList.contains("checked");
      //create the object containing the updated data
      var update = {meal_id: meal_id, checked: checked};
      //update the entry in the db
      await database.update(database.mealPlan,day_id,update);
    }
  },
  shoppingList:{
    //shopping list render data
    list: [],
    initalize: async ()=>{
      //holds all the shopping list data
      var shoppingList = [];
      //get the meals in the meal plan
      var mealPlan = await database.getAll(database.mealPlan);
      //if the meal plan is empty exit the function
      if(mealPlan.length <= 0){return;}
      //loop through the meal plan and count up how many times each meal appears in the entire plan
      const repeats = {};
      mealPlan.forEach((meal) => {
        repeats[meal.doc.meal_id] = (repeats[meal.doc.meal_id] || 0) + 1;
      });
      //loop through the meal plan
      for (var day of mealPlan){
        //add the id of each meal in the meal plan to the shopping list
        //for any duplicate meals increment the repeat number
        //shoppingList.push({meal_id:id,name:name:ingredients,checked:[]})
        //get the meal data for the meal of the day
        var meal = await database.get(database.meals,day.doc.meal_id);
        //if the meal is not in the db skip it
        if(meal == ""){continue;}
        //if the meals checked array is undefined set it to an empty array
        var checked = meal.checked == undefined ? [] : meal.checked;
        //convert the ingredients string into an array
        //filter out any blank strings as we want to ignore those
        var strToArry = meal.ingredients.split("\n").filter(ingredient => ingredient);
        var ingredients = strToArry.length >= 1 ? strToArry : [];
        //object containing all the meal data needed to shop for this meal
        var addToList = {meal_id: meal._id, name: meal.name, ingredients: ingredients, checked: checked, repeat: repeats[meal._id]};
        //find if this list item has already been added to the shopping list
        var duplicate = shoppingList.some((item)=>{if(item.meal_id == meal._id){return true;}})
        //if this data has not already been added to the shopping list add it
        if(!duplicate){
          shoppingList.push(addToList);
        }
      }
      //set the shopping list data
      views.shoppingList.list = shoppingList;
    },
    //adds or removes an ingredient from the checkedIngredients array
    //e => element that was clicked
    //name => name of the ingredient
    //id => the meal id that the ingredient is part of
    checkOffIngredient: async (e,name,id)=>{
      //toggle the checked class on the button's parent element
      e.currentTarget.classList.toggle("checked");
      //determine if the ingredient is being checked or unchecked
      var checked = e.currentTarget.classList.contains("checked");
      //get the meal entry from the db
      var meal = await database.get(database.meals,id);
      //if the checked array is undefined it should be an empty array
      meal.checked = meal.checked == undefined ? [] : meal.checked;
      //if the item is being checked
      //and the ingredient is not already in the checked array
      if(checked && !meal.checked.includes(name)){
        //add the ingredient to the array
        meal.checked.push(name);
      }
      //otherwise the item is being unchecked
      else{
        //remove the ingredient from the array
       meal.checked.splice(meal.checked.indexOf(name),1);
      }
      //update the meal entry with the new checked array
      var update = {name: meal.name, ingredients:meal.ingredients, directions:meal.directions, checked: meal.checked};
      await database.update(database.meals,meal._id,update);
    }
  }
}

//general utility functions
const utilities ={
  //randomly shuffles the order of an array
  shuffle: (array)=>{
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  },
  //functions to open and close an on screen lightbox
  lightBox:{
    //id => element id of the lightbox to open
    open: (id)=>{
      try {
        //only open the lightbox if one is not already open
        if(!document.getElementsByClassName("lightBoxContainer open").length >= 1){
          var lightBox = document.getElementById(id);
          lightBox.classList.remove("closed");
          lightBox.classList.add("open");
        }
      }
      catch(e){console.log("No lightbox on this view");}
    },
    //id => element id of the lightbox to close
    close: (id)=>{
      try{
        var lightBox = document.getElementById(id);
        lightBox.classList.remove("open");
        lightBox.classList.add("closed");
      }
      catch(e){console.log("No lightbox on this view");}
    }
  },
  //returns a promise to delay the remove of an element from the dom
  //used when navigating between app pages
  timedDelay: (time)=>{
    //wait 300 ms to allow time for the nav animation to finish
    return new Promise((resolve) => {setTimeout(() => {resolve()}, 750)});
  },
}


export{navigate,views,utilities};
