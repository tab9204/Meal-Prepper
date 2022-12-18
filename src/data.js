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
  //navigates to the meal view screen
  //id => the id of the meal to display
  toMealView: async (id)=>{
    //init the view
    await views.mealView.initalize(id);
    m.route.set('/view');
  },
  //navigates to the meal edit screen
  //id => the id of the meal to display for editing
  toMealEdit: async (id)=>{
    await views.mealEdit.initalize(id);
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
  //adds a pulse animation to a navigation bar button on click
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
    popup: {
      meal_id: null, //the id of the meal that should be deleted if the user selects delete
      delete: async ()=>{
        //delete the selected recipe from the db
        await database.delete(database.meals,views.mealList.popup.meal_id);
        //delete the meal from the meal plan if it is on it
        var meal = await database.get(database.mealPlan,views.mealList.popup.meal_id);
        if(meal !== ""){
          await database.delete(database.mealPlan,views.mealList.popup.meal_id);
        }
        //reload the meal list page by navigating back to it
        await navigate.toMealList();
        //close the lightbox
        utilities.popup.close();
      },
      edit: async ()=>{
        await navigate.toMealEdit(views.mealList.popup.meal_id);
      }
    },
    allMeals: [],//array containg the meal data needed to render the view
    allowedChracters:[],//the chracters allowed when sorting meals
    unsortedMeals:[],//meals whos name begins with a character that is now allowed as a category
    initalize: async ()=>{//initalizes the view data
      //get an up to date list of meals from the meals db
      var meals = await database.getAll(database.meals);
      //sort the meals in alphabetical order
      meals.sort((a,b)=>{return a.doc.name.localeCompare(b.doc.name);});
      //set the meal list variable
      views.mealList.allMeals = meals;
      //init the allowedChracters with all the alphanumeric chracters used to sort the meals
      //for this use the character codes for A-Z which is 65 - 90
      views.mealList.allowedChracters = [];
      for(var i = 65; i <= 90; i++){
        views.mealList.allowedChracters.push(i);
      }
      //add meals with disallowed chacters to the unsorted array
      views.mealList.unsortedMeals = [];
      views.mealList.allMeals.map((meal)=>{
        //the char code of the first character in the meal name
        var firstCharCode = meal.doc.name.charAt(0).toUpperCase().charCodeAt(0);
        if(firstCharCode < 65 || firstCharCode > 90){
          views.mealList.unsortedMeals.push(meal);
        }
        //check if the name is blank and then add a name
        if(meal.doc.name == ""){
          meal.doc.name = "?????";
          views.mealList.unsortedMeals.push(meal);
        }
      });
      //redraw the view
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
        //cancel the delete hold
        views.mealList.cancelHold();
      },
      bottom: ()=>{
        var element = document.querySelector("#pageContent");
        if(views.mealList.overscroll.drag >= -5){
          element.style.overflowY = "hidden";
          element.style.top = (views.mealList.overscroll.drag) +"px";
          views.mealList.overscroll.drag--;
        }
        //cancel the delete hold
        views.mealList.cancelHold();
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
    },
    //timeout function for the go btn hold gesture
    holdTimeout: null,
    touchX:null,
    touchY: null,
    //starts a go btn hold gesture
    //e => the event that triggered the hold
    //id => the id of the meal from the btn the user pressed
    startHold: (e,id)=>{
      //clear the hold timeout function
      clearTimeout(views.mealList.holdTimeout);
      //set the touch x and y to where the user has placed their finger
      var touchX = e.touches[0].clientX;
      var touchY = e.touches[0].clientY;
      //set a new timeout
      //run the hold function after .750 seconds of holding
      views.mealList.holdTimeout = setTimeout(()=>{
        //set the meal id for the popup menu so we delete the correct meal
        views.mealList.popup.meal_id = id;
        //get the screen width and height
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        //popup menu element so we can use its width and height
        var popup = document.querySelector("#popupMenu");
        //calculate the x and y of the popup menu
        var offsetX = touchX <= screenWidth / 2 ? 30 : (popup.offsetWidth + 30) * -1;
        var offsetY = touchY <= screenHeight / 2 ? 30 : (popup.offsetHeight + 30) * -1;
        var x = touchX + offsetX;
        var y = touchY + offsetY;

        utilities.popup.open(popup,x,y);

      },600);
    },
    //stops a go btn hold gesture
    cancelHold: (e)=>{
      //e.target.classList.remove("held");
      clearTimeout(views.mealList.holdTimeout);
    }
  },
  mealView:{
    //the meal data the view needs to render
    meal: {
      id:null,
      name:null,
      ingredients:null,
      directions:null,
      checked:null
    },
    //id => the id of the meal to display for editing
    initalize: async (id)=>{
      //get the meal data from the db
      var meal = await database.get(database.meals,id);
      //set the rendering vars to the meal data from the db
      views.mealView.meal.id = id;
      views.mealView.meal.name = meal.name;
      views.mealView.meal.ingredients = meal.ingredients.trim().split(/\r?\n/);//split the ingredients string on each new line
      views.mealView.meal.directions = meal.directions.trim().split(/\r?\n/);
      views.mealView.meal.checked = meal.checked !== undefined ? meal.checked : [];
      //since this is an existing meal we are editing the mobile keyboard should not automatically show
      views.mealView.autoFocus = false;
    }
  },
  mealEdit: {
    //the meal data of the currently edited meal
    meal: {
      id:'',
      name:'',
      ingredients:[],
      directions:[],
      checked:[]
    },
    //boolean for if the text input should automatically focus on page render
    autoFocus:false,
    //reference to the setTimout function
    timeout: null,
    initalize: async (id)=>{
      //if the id is not undefined we are editing an existing meal
      if(id !== undefined){
        //get the meal data from the db
        var meal = await database.get(database.meals,id);
        //set the rendering vars to the meal data from the db
        views.mealEdit.meal.id = id;
        views.mealEdit.meal.name = meal.name;
        views.mealEdit.meal.ingredients = meal.ingredients.trim();
        views.mealEdit.meal.directions = meal.directions.trim();
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
        views.mealEdit.meal.name = "";
        views.mealEdit.meal.ingredients = "";
        views.mealEdit.meal.directions = "";
        views.mealEdit.meal.checked = []
        //new meal so mobile keyboard should auto show
        views.mealEdit.autoFocus = true;
      }
    },
    //saves the current meal data to the db
    saveMeal: ()=>{
      //clear any exising setTimout functions
      clearTimeout(views.mealEdit.timeout);
      //create a new setTimeout
      views.mealEdit.timeout = setTimeout(async () => {
        //gather the meal data we want to save to the db
        var id = views.mealEdit.meal.id;
        var checked = views.mealEdit.meal.checked;
        var name = document.querySelector("#name").value.trim();
        var ingredients = document.querySelector("#ingredients").value.trim();
        var directions = document.querySelector("#directions").value.trim();
        //the data object we are saving to the db
        var data = {name: name, ingredients: ingredients, directions: directions, checked: checked};
        //check if there is at least a name, ingredients or directions
        //if the data lacks all of those we don't want to save the new entry
        if(name == "" && ingredients == "" && directions == ""){
          return;
        }
        //check if this meal already exists in the db or is brand new
        var meal = await database.get(database.meals,id);
        //if the meal is not blank then it already exists in the db and we can update it
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
    savedMeals: [],//list of all saved meals available to use in the meal plan
    selectedMeals: [],//list of meals selected to be added to the meal plan
    initalize: async ()=>{
      views.mealPlan.savedMeals = [];
      views.mealPlan.selectedMeals = [];
      //get all the saved meals
      var allMeals = await database.getAll(database.meals);
      //sort the meals alphabetically
      allMeals.sort((a,b)=>{return a.doc.name.localeCompare(b.doc.name)});
      //set the saved meals array to all the returned meals
      views.mealPlan.savedMeals = allMeals;
    },
    //adds a group of meals to the meal plan db
    //meals => the ids of the meals to be added to the meal plan
    createPlan: async (meals)=>{
      //loop through each meal
      for (var meal of meals) {
        //build the object containing the data needed for the new day in the meal plan
        var day = {meal_id: meal, checked: false};
        //add a new entry to the meal plan db
        await database.add(database.mealPlan,day.meal_id,day);
      }
      //navigate to the shopping list view
      navigate.toLoadingScreen("shopping");
    },
    //deletes the meals in the meal plan db
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
    //selects a meal for the meal plan
    //e => element the triggered the the event
    // id => id of the meal being selected
    selectMeal: async(e)=>{
      //toggle the checked class
      e.currentTarget.classList.toggle("checked");
      //check if the create meal plan button should be enabled
      //if there is at least 1 item in the selected array enable the button
      if(document.querySelectorAll(".checkBtn.checked").length >= 1){
        document.querySelector(".menu").classList.remove("hidden");
      }
      else{
        document.querySelector(".menu").classList.add("hidden");
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

          var buttons = document.querySelectorAll(".checkBtn");
          buttons.forEach((button) => {
            var style = button.currentStyle || window.getComputedStyle(button);
            button.style.margin = (parseInt(style.margin) + (views.mealList.overscroll.drag / 2)) + "px 0px";
          });

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

          console.log(views.mealList.overscroll.drag)
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

        var buttons = document.querySelectorAll(".checkBtn");
        buttons.forEach((button) => {
          button.removeAttribute("style");
        });
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
      //loop through the meal plan
      for (var meal of mealPlan){
        //get the meal data for the meal
        var meal = await database.get(database.meals,meal.doc.meal_id);
        //if the meal is not in the db skip it
        if(meal == ""){continue;}
        //if the meals checked array is undefined set it to an empty array
        var checked = meal.checked == undefined ? [] : meal.checked;
        //convert the ingredients string into an array
        //filter out any blank strings as we want to ignore those
        var strToArry = meal.ingredients.split("\n").filter(ingredient => ingredient.trim().length > 0);
        var ingredients = strToArry.length >= 1 ? strToArry : [];
        //object containing all the meal data needed to shop for this meal
        var addToList = {meal_id: meal._id, name: meal.name, ingredients: ingredients, checked: checked};
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
    //e => element that should have the checked class on it
    //name => name of the ingredient
    //id => the meal id that the ingredient is part of
    checkOffIngredient: async (e,name,id)=>{
      //toggle the checked class on the button's parent element
      e.classList.toggle("checked");
      //determine if the ingredient is being checked or unchecked
      var checked = e.classList.contains("checked");
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
    },
    //popup menu button functions
    popup: {
      meal_id: null, //the id of the meal that should be deleted if the user selects delete
      delete: async ()=>{
        //delete the meal plan
        await views.mealPlan.deletePlan();
        //empty the shopping list
        views.shoppingList.list = [];
        //route to the meal plan view
        await navigate.toMealPlan();
      },
      cancel: async ()=>{
        utilities.popup.close();
      }
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
  //functions to open and close the popup menu
  popup: {
    //element => the popup html element
    //x,t => the coordinates of where the menu should open
    open: (element,x,y)=>{
      //set the x and y of the popup menu
      element.style.left = x + "px";
      element.style.top = y + "px";
      //show the menu on screen and add the scale up animation
      element.classList.remove("invisible");
      element.classList.add("scaleUp");
    },
    close: ()=>{
      var popup = document.querySelector("#popupMenu");
      popup.classList.add("invisible");
      popup.classList.remove("scaleUp");
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
