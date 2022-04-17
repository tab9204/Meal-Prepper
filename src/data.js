/**********Data for rendering app views************/
//import {database} from './database.js';
import "../libraries/pouchdb-7.2.1.js";

//navigating app views
var navigate = {
  //navigates to the meal edit view
  //id => the id of the meal to display for editing
  //navIn => animation class to add the view to the screen
  toMealEdit: async (id,navIn)=>{
    //the meal data the edit view needs to render
    var meal_id, name, ingredients, directions, checked;
    //boolean for if the text input should automatically focus on page render
    var autoFocus;
    //if the id is not undefined we are editing an existing meal
    if(id !== undefined){
      //get the meal data from the db
      var meal = await database.get(database.meals,id);
      //set the rendering vars to the meal data from the db
      meal_id = id;
      name = meal.name;
      ingredients = meal.ingredients;
      directions = meal.directions;
      checked = meal.checked !== undefined ? meal.checked : [];
      //since this is an existing meal we are editing the mobile keyboard should not automatically show
      autoFocus = false;
    }
    //if the id is undefined then we must add a new meal to the db
    else{
      //generate a unique id for the new meal
      var new_id = '' + Date.now();
      //meal data to store in the db
      //since its new the data should default to empty
      var data = {name: '', ingredients:'', directions:'', checked: []};
      //add the new meal to the db
      await database.add(database.meals,new_id,data);
      //rendering vars default to empty
      meal_id = new_id;
      name = '';
      ingredients = '';
      directions = '';
      checked = []
      //new meal so mobile keyboard should auto show
      autoFocus = true;
    }
    //route to the edit view passing the rendering vars
    m.route.set('/edit', {meal:{id:meal_id, name:name, ingredients:ingredients, directions:directions, checked:checked}, navIn: navIn, autoFocus: autoFocus});
  },
  //navigates to the meal list view
  toMealList: async ()=>{
    //get an up to date list of meals from the meals db
    var allMeals = await database.getAll(database.meals);
    //sort the meals in order of newest to oldest
    allMeals.sort((a,b)=>{return b.id - a.id;});
    //route to the meal plan view passing along all the meals
    m.route.set('/list', {meals: allMeals});
  },
  //navigates to the meal plan view
  //navIn => animation class to add the view to the screen
  toMealPlan: async (navIn)=>{
    //array of objects needed to render the meal plan view
    //each object is a meal consisting of:
      //the name of the meal, the meal id, the id of the day in the meal plan db, and a checked boolean
    var renderData = [];
    //get all days in the meal plan
    var mealPlan = await database.getAll(database.mealPlan);
    //if the meal plan is not empty
    if(mealPlan[0] !== ""){
      //loop through all the days
      for (var day of mealPlan) {
        //get the name and id of the meal on each day of the plan
        var meal = await database.get(database.meals,day.doc.meal_id);
        var name = meal.name;
        var meal_id = meal._id;
        //add an object with the meal name, meal id, day id and checked boolan to the render data array
        renderData.push({name: name, meal_id:meal_id, id: day.id, checked: day.doc.checked});
      }
    }
    //uf the meal plan is empty return an empty array
    else{
      renderData = [""];
    }
    //route to the mealPlan view passing the render data to the view
    m.route.set('/plan',{plan: renderData, navIn: navIn});
  },
  //navIn => animation class to add the view to the screen
  toShoppingList: async (navIn)=>{
    //create the shopping list
    var shoppingList = await views.shoppingList.createList();
    if(shoppingList == undefined || shoppingList.length == 0){shoppingList = [""];}
    //route to the shopping list view
    m.route.set('/shop',{list: shoppingList, navIn: navIn});
  },
  toLoadingScreen: async()=>{
    //route to the loading screen view
    m.route.set('/loading');
  }
}

//view specific data, functions and events
var views = {
  //the mealEdit view
  mealEdit:{
    //reference to the setTimout function
    timeout: null,
    //data needed for lightbox rendering
    lightBox: {
      id: "mealEditLightBox",
      text: "Are you sure you want to delete this meal?",
      buttons: [
        {
          click: async (vnode)=>{
            await database.delete(database.meals,vnode.attrs.meal.id);
            navigate.toMealList();
            //animate the view out
            vnode.dom.classList.add("navOutRight");
          },
          text: "Delete"
        },
        {
          click: (vnode) =>{
            utilities.lightBox.close(views.mealEdit.lightBox.id);
          },
          text: "Cancel"
        }
      ]
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
        //update the meal data in the db
        await database.update(database.meals,id,data);
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
            await views.mealPlan.howLong(3);
          },
          text: "3 Days"
        },
        {
          click: async (vnode)=>{
            await views.mealPlan.howLong(5);
          },
          text: "5 Days"
        },
        {
          click: async (vnode)=>{
            await views.mealPlan.howLong(7);
          },
          text: "7 Days"
        },
        {
          click: async (vnode)=>{
            await views.mealPlan.howLong(14);
          },
          text: "14 Days"
        },
      ]
    },
    //gathers how many days should be in a meal plan before calling createPlan
    //numDays => how many days are in the plan
    howLong: async (numDays) =>{
      //call createPlan with the number of days selected
      await views.mealPlan.createPlan(numDays,0);
      //close the selection lightbox
      utilities.lightBox.close("mealPlanLightBox2");
    },
    //creates a meal plan by adding X number of entries to the mealPlan db
    //days => number of days and meals in the meal plan
    //added => counter to keep track of the number of meals added
    createPlan: async (days,added)=>{
      //get all the meals in the db
      var allMeals = await database.getAll(database.meals);
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
      //stop event propagation so that this is the only event that fires
      e.stopPropagation();
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
    //generates a list of ingredients based on the meals in the meal plan
    createList: async ()=>{
      //holds all the shopping list data
      var shoppingList = [];
      //get the meals in the meal plan
      var mealPlan = await database.getAll(database.mealPlan);
      //if the meal plan is empty exit the function
      if(mealPlan[0] == ""){return;}
      //loop through the meal plan and cout up how many times each meal appears in the entire plan
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
        //if the meal no longer exists in the db skip it
        if(meal == ""){continue ;}
        //if the meals checked array is undefined or empty we need to set the array to have an empty string
        //we cannot pass an empty array to the view so we need to pass the array with something in it or else we get an error
        var checked = meal.checked == undefined || meal.checked.length == 0 ? [""] : meal.checked;
        //convert the ingredients string into an array
        //filter out any blank strings as we want to ignore those
        var strToArry = meal.ingredients.split("\n").filter(ingredient => ingredient);
        var ingredients = strToArry.length >= 1 ? strToArry : [""];
        //object containing all the meal data needed to shop for this meal
        var addToList = {meal_id: meal._id, name: meal.name, ingredients: ingredients, checked: checked, repeat: repeats[meal._id]};
        //find if this list item has already been added to the shopping list
        var duplicate = shoppingList.some((item)=>{if(item.meal_id == meal._id){return true;}})
        //if this data has not already been added to the shopping list add it
        if(!duplicate){
          shoppingList.push(addToList);
        }
      }
      return shoppingList;
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
  //resolves a promise after an animation has ended
  //used to delay removing a view until after that view's animation has ended
  animationDelay: (vnode) =>{
    //defer removing the view until after the nav out animation finishes
    return new Promise((resolve)=> {
        vnode.dom.addEventListener("animationend", resolve);
    })
  },
  //resolves a promise after a set amount of time
  timedDelay: ()=>{
    //wait 300 ms to allow time for the nav animation to finish
    return new Promise((resolve) => {setTimeout(() => {resolve()}, 300)});
  }
}

//functions for interacting with the database
var database = {
  //db to store all meals
  //each entry is an individual meal that contains:
    //name => name of the meal
    //ingredients => string that contains all ingredients for the meal
    //directions => string that contains all directions for the meal
    //checked => array containing ingredients that have been checked off on the shopping list
  meals: new PouchDB('meals'),
  //stores a list of days that make up a meal plan
  //each entry is a day in the meal plan that contains:
    //meal_id => id of the meal on that day of the meal plan
    //checked => a boolean for if the day was checked off or not
  mealPlan: new PouchDB("mealPlan"),
  //returns all entries in a specified db
  //db => the database to query
  getAll: async (db)=>{
    var all;
    try{
      all = await db.allDocs({include_docs: true});
      //if the db is empty return an array with an empty string
      //we do this because an empty array cannot be passed to the view as data. The array needs something in it
      if(all.rows.length <= 0){all.rows = [""];}
    }
    catch(e){throw new Error(e);}
    return all.rows;
  },
  //returns 1 entry from the specified db
  //db => the database to query
  //id => id of the entry to return
  get: async (db,id)=>{
    var entry;
    try{
      entry = await db.get(id);
    }
    catch(e){
      //if the entry is missing
      if(e.status = 404){
        //return an empty entry
        entry = "";
      }
      else{
        throw new Error(e);
      }    }
    return entry;
  },
  //adds a new entry to the specified db
  //db => the database being added to
  //id => unique id for the new entry
  //data => object containing the data for the new entry
  add: async (db,id,data)=>{
    try{
      //put the id into an object with the proper _id property
      var entry_id = {_id:id};
      //combine the entry_id object and data object into one single objecg
      var new_entry = Object.assign(entry_id, data);
      //put the new entry into the db
      await db.put(new_entry);
    }
    catch(e){throw new Error(e);}
  },
  //updates the data of an entry in a specified db
  //db => the database containing the entry being updated
  //id => id of the entry being updated
  //data => object containing the updated data for the entry
  update: async (db,id,data)=>{
    try{
      //get the entry to be updated from the db so we can get its current _rev property value
      var entry = await db.get(id);
      //create an object containg the updated entry's id and rev properties
      var props = {_id:id, _rev: entry._rev};
      //combine the props and data objects
      var updated_entry = Object.assign(props, data);
      //add the updated entry to the specified db
      await db.put(updated_entry);
    }
    catch(e){throw new Error(e);}
  },
  //deletes an entry from the specified db
  //db = database the entry is being deleted from
  //id => id of the entry to delete
  delete: async (db,id)=>{
    try{
      //get the entry to be deleted from the db
      var entry = await db.get(id);
      //delete the entry from the db
      await db.remove(entry);
    }
    catch(e){throw new Error(e);}
  }
}


export{navigate,database,views,utilities};
