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
  //navigates to the loading screen view
  //load => string that specifies what what steps to take during loading and what page to route to after the loading is complete
  toLoadingScreen: async(load)=>{
    //route to the loading screen view
    m.route.set('/load',{load:load});
  },
  toMealOptions: async()=>{
    //route to the meal options screen view
    m.route.set('/options');
  },
  toMealSelect: async()=>{
    //route to the meal select screen view
    m.route.set('/select');
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
    },
    //variables and functions for oversrolling the meal list
    overscroll: {
      drag: 0,
      start: ()=>{
        //get the scrolling page element
        var element = document.querySelector("#pageContent");
        //reset the element to the default position
        element.style.top = "0px";
        //set the overflowY to scroll if not already
        element.style.overflowY = "scroll";
        //remove the snap back animation classes
        element.classList.remove("snapBackTop");
        element.classList.remove("snapBackBottom");
        //reset the drag variable
        views.mealList.overscroll.drag = 0;
      },
      top: ()=>{
        var element = document.querySelector("#pageContent");
        //if the element has been dragged less then 10 px
        if(views.mealList.overscroll.drag <= 5){
          //lock the scrolling
          element.style.overflowY = "hidden";
          //move the element by the drag amount
          element.style.top = (views.mealList.overscroll.drag) +"px";
          //increment the drag
          views.mealList.overscroll.drag++;
        }
      },
      bottom: ()=>{
        var element = document.querySelector("#pageContent");
        if(views.mealList.overscroll.drag >= -5){
          element.style.overflowY = "hidden";
          element.style.top = (views.mealList.overscroll.drag) +"px";
          views.mealList.overscroll.drag--;
        }
      },
      end: ()=>{
        var element = document.querySelector("#pageContent");
        //unlock the elements overflowY scroll
        element.style.overflowY = "scroll";
        //if the element has been dragged down
        if(parseInt(element.style.top) >= 1){
          //snap the element back to the top and reset the drag
          element.classList.add("snapBackTop");
          views.mealList.overscroll.drag = 0;
        }
        //if the element was dragged up
        else if(parseInt(element.style.top) <= -1){
          //snap the element back to the bottom and reset the drag
          element.classList.add("snapBackBottom");
          views.mealList.overscroll.drag = 0;
        }
      }
    }
  },
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
  mealSelect: {
    //array of recipes returned by a getRecipes request
    recipes: [],
    getRecipes: async ()=>{
      try{
        //make a request to the server for some recipes
        var request = await fetch("/getRecipes", {method: 'GET'});
        //parse the response as json
        var recipeJSON = await request.json();
        //loop through all the recipes in the json
        for(var recipe of recipeJSON.results){
          //object to hold the recipe data we want to save
          var data = {
            name:null,
            ingredients:[],
            directions:[],
            image:null
          };
          //add the title
          data.name = recipe.title;
          //check that the ingredients and directions exist, if not we can skip the recipe
          if(recipe.analyzedInstructions[0] == undefined || recipe.extendedIngredients == undefined){continue;}
          //loop though the ingredients and add each to the data object
          for(var ingredient of recipe.extendedIngredients){
            data.ingredients.push(ingredient.original);
          }
          //do the same for the directions
          for(var direction of recipe.analyzedInstructions[0].steps){
            data.directions.push(direction.step);
          }
          //fetch the image from the provided image url
          var image = await fetch(recipe.image, {method: 'GET'});
          //convert the image to a blob
          var blob = await image.blob();
          //convert the blob to an image url
          var imageUrl = URL.createObjectURL(blob);
          //finally add the url to the data object
          data.image = imageUrl;
          //add the data object to the recipes array
          views.mealSelect.recipes.push(data);
        }
      }
      catch(e){
        return e;
      }
    },
    //selects a recipe and adds it to the meals db
    //e => the click event that triggered the function
    //index => the position of the recipe in the recipes array
    selectRecipe: async (e,index)=>{
      //add the checked and disabled classes to the button that was clicked on
      e.currentTarget.classList.add("checked", "disabled");
      //get the recipe data from the recipes array
      var recipe = views.mealSelect.recipes[index];
      //convert the ingredients and directions arrays into strings
      var ingredientString = "";
      var directionString = "";
      for(var ingredient of recipe.ingredients){
        ingredientString += ingredient + "\n";
      }
      for(var direction of recipe.directions){
        directionString += direction + "\n";
      }
      //create an id for the new entry
      var id = '' + Date.now();
      //object caontaining all the data needed for a new meal entry in the db
      var data = {name: recipe.name, ingredients: ingredientString, directions: directionString, checked: []};
      await database.add(database.meals,id,data);
    },
    overscroll: {
      start: ()=>{
        //get the scrolling page element
        var icon = document.querySelector(".reload");
        //set the loading icon back to its default position
        icon.style.bottom = "-42px";
        //remove the slide up animation from the icon
        icon.classList.remove("slideDown");
      },
      bottom: (deltaY)=>{
        var icon = document.querySelector(".reload");
        var element = document.querySelector("#pageContent");
        element.style.overflowY = "hidden";
        //if the delta y is less then the buffer amount move the loading icon by the delta amount
        if(Math.abs(deltaY) <= 250){
          icon.style.bottom = -42 - (deltaY) +"px";
        }
      },
      end: (deltaY)=>{
        var icon = document.querySelector(".reload");
        var element = document.querySelector("#pageContent");
        //if the loading icon was dragged to the buffer point route to the loading screen
        if(deltaY <= -250){
          navigate.toLoadingScreen("recipe");
        }
        else{
          //animate the loading icon back to the top of the screen
          icon.classList.add("slideDown");
          //reset the overflow y to allow for page scrolling
          element.style.overflowY = "scroll";
        }
      }
    }
  },
  mealPlan:{
    lightBox1: {
      id: "mealPlanLightbox",
      text: "Delete this meal plan and start over with a new one?",
      buttons: [
        {
          click: async (vnode)=>{
            await views.mealPlan.deletePlan();//delete the meal plan
            //close the lightboxes
            utilities.lightBox.close("mealPlanLightbox");
            //hide the main section and show the first selection section
            document.querySelector("#main.pageSection").classList.add("hidden");
            document.querySelector("#select.pageSection").classList.remove("hidden");
            //make sure the menu popup is closed
            document.getElementsByClassName("menu")[0].classList.add("hidden");
            //switch the menu buttons
            document.getElementById("mainMenu").classList.add("hidden");
            document.getElementById("selectMenu").classList.add("hidden");
          },
          text: "Delete"
        },
        {
          click: (vnode) =>{
            utilities.lightBox.close("mealPlanLightbox");
          },
          text: "Cancel"
        }
      ]
    },
    planData: [],//meal plan data needed to render the view
    savedMeals: [],//list of all saved meals available to use in the meal plan
    selectedMeals: [],//list of meals selected to be added to the meal plan
    initalize: async ()=>{
      //empty the plan data, saved meals, and selected meals arrays
      views.mealPlan.planData = [];
      views.mealPlan.savedMeals = [];
      views.mealPlan.selectedMeals = [];
      //get all days in the meal plan
      var mealPlan = await database.getAll(database.mealPlan);
      //get all the saved meals
      var allMeals = await database.getAll(database.meals);
      //loop through all the days
      for (var day of mealPlan) {
        //get the name and id of the meal on each day of the plan
        var meal = await database.get(database.meals,day.doc.meal_id);
        var name = meal.name;
        var meal_id = meal._id;
        //add an object with the meal name, meal id, day id and checked boolan to the meal plan array
        views.mealPlan.planData.push({name: name, meal_id:meal_id, id: day.id, checked: day.doc.checked});
      }
      //loop through all the meals
      for (var meal of allMeals) {
        views.mealPlan.savedMeals.push(meal);
      }
    },
    //creates a meal plan by added meals to the meal plan db
    //meals => the ids of the meals selected to be added to the meal plan
    createPlan: async (meals)=>{
      //shuffle the order of the meals
      utilities.shuffle(meals);
      //the id of the new entry in the meal plan db
      var dayId = 0;
      //loop through each meal
      for (var meal of meals) {
        //build the object containing the data needed for the new day in the meal plan
        var day = {meal_id: meal, checked: false};
        //add a new entry to the meal plan db
        await database.add(database.mealPlan,dayId + "",day);
        //increment the day id
        dayId++;
      }
      //navigate to the meal plan view. This will re-render the view with the most up to date meal plan
      navigate.toLoadingScreen("plan");
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
    },
    //selects a meal for the meal plan
    //e => element the triggered the the event
    // id => id of the meal being selected
    selectMeal: async(e,id)=>{
      //toggle the checked class
      e.currentTarget.classList.toggle("checked");
      //if the meal is now checked att it to the selected array
      if(e.currentTarget.classList.contains("checked")){
        views.mealPlan.selectedMeals.push(id);
      }
      //the meal is being deselected so remove it from the array
      else{
        views.mealPlan.selectedMeals = views.mealPlan.selectedMeals.filter((i)=>{
          return i !== id;
        })
      }
      //check if the create meal plan button should be enabled
      //if there is at least 1 item in the selected array enable the button
      if(views.mealPlan.selectedMeals.length >= 1){
        document.querySelector("#selectMenu").classList.remove("hidden");
      }
      else{
        document.querySelector("#selectMenu").classList.add("hidden");
      }
    },
    //variables and functions for oversrolling the meal list
    overscroll: {
      drag: 0,
      start: ()=>{
        //get the scrolling page element
        var element = document.querySelector(".pageSection:not(.hidden) .planList")
        //reset the element to the default position
        element.style.top = "0px";
        //set the overflowY to scroll if not already
        element.style.overflowY = "scroll";
        //remove the snap back animation classes
        element.classList.remove("snapBackTop");
        element.classList.remove("snapBackBottom");
        //reset the drag variable
        views.mealList.overscroll.drag = 0;
      },
      top: ()=>{
        var element = document.querySelector(".pageSection:not(.hidden) .planList")
        //if the element has been dragged less then 10 px
        if(views.mealList.overscroll.drag <= 5){
          //lock the scrolling
          element.style.overflowY = "hidden";
          //move the element by the drag amount
          element.style.top = (views.mealList.overscroll.drag) +"px";
          //increment the drag
          views.mealList.overscroll.drag++;
        }
      },
      bottom: ()=>{
        var element = document.querySelector(".pageSection:not(.hidden) .planList")
        if(views.mealList.overscroll.drag >= -5){
          element.style.overflowY = "hidden";
          element.style.top = (views.mealList.overscroll.drag) +"px";
          views.mealList.overscroll.drag--;
        }
      },
      end: ()=>{
        var element = document.querySelector(".pageSection:not(.hidden) .planList")
        //unlock the elements overflowY scroll
        element.style.overflowY = "scroll";
        //if the element has been dragged down
        if(parseInt(element.style.top) >= 1){
          //snap the element back to the top and reset the drag
          element.classList.add("snapBackTop");
          views.mealList.overscroll.drag = 0;
        }
        //if the element was dragged up
        else if(parseInt(element.style.top) <= -1){
          //snap the element back to the bottom and reset the drag
          element.classList.add("snapBackBottom");
          views.mealList.overscroll.drag = 0;
        }
      }
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
  //functions for the navigation bar
  navBar: {
    //disables user events on the nav bar
    disable: ()=>{
      document.querySelectorAll("#toMealPlan, #toMealList, #toMealEdit").forEach((element) => {
        element.classList.add("disabled");
      });
    },
    //enables user events on the nav bar
    enable: ()=>{
      document.querySelectorAll("#toMealPlan, #toMealList, #toMealEdit").forEach((element) => {
        element.classList.remove("disabled");
      });
    }
  },
  //returns a promise to delay the remove of an element from the dom
  //used when navigating between app pages
  timedDelay: (time)=>{
    //wait 300 ms to allow time for the nav animation to finish
    return new Promise((resolve) => {setTimeout(() => {resolve()}, time)});
  },
  //initalizes over scroll functionality on a specified element
  //determines what should happen when a scrollable element reaches the end of its scroll and the user continues to scroll
  //element => the scrollable element to attach the event listners on
  //start => function to run when user touch starts
  //top => function to run when the user is scrolling at the top of the page
  //bottom => function to run when the user is scrolling at the bottom of the page
  //end => function to run when the user touch ends
  initOverscroll: (element,start,top,bottom,end)=>{
    //the Y postion of the user's finger when dragging starts
   var dragStartY;
   //The starting Y position of the user's finger when the element reaches the end of its scroll
   var endScrollY = 0;
   //how many px the user has swiped down since reaching the end of its scroll
   var deltaY = 0;
   //add the touch start, touch move, and touch end event listeners to the touch element
   element.addEventListener('touchstart', (e)=>{
      //set the dragStartY
      dragStartY = e.touches[0].pageY;
      //run the start function
      if(start !== null){
        start(deltaY);
      }
    }, {passive: true});

    element.addEventListener('touchmove', (e) => {
      //y position of the user's finger during the touch move
      var y = e.touches[0].pageY;
      //if the user is at the top of the element scroll and is swiping down
      if (element.scrollTop == 0 && y > dragStartY) {
        //set the endScrollY if it has not already been set
        if(endScrollY == 0){endScrollY = y;}
        //calculate the deltaY
        deltaY = y - endScrollY;
        //pass the deltaY to the top function and run it
        if(top !== null){
          top(deltaY);
        }
      }
      //if the user is at the bottom of the element scroll and is swiping up
      else if(Math.ceil(element.offsetHeight + element.scrollTop) >= element.scrollHeight && y < dragStartY){
        //set the endScrollY if it has not already been set
        if(endScrollY == 0){endScrollY = y;}
        //calculate the deltaY
        deltaY = y - endScrollY;
        //pass the deltaY to the bottom function and run it
        if(bottom !== null){
          bottom(deltaY);
        }
      }
      //if the scroll is neither at the top or bottom or the page
      else if(element.scrollTop != 0 || Math.ceil(element.offsetHeight + element.scrollTop) <= element.scrollHeight){
        //reset the endScrollY to 0
        endScrollY = 0;
      }
    }, {passive: false});

    element.addEventListener('touchend', (e) => {
      //reset the endScrollY to 0
      endScrollY = 0;
      //run the end function
      if(end !== null){
        end(deltaY);
      }
    },{passive: true});
  }
}


export{navigate,views,utilities};
