/*****app views****/
import {database} from './database.js';
import {navigate,views,utilities} from './data.js'
import {lightBox,loadingImg,pullToReload,trashCan,menuIcon,checkIcon,navigateIcon,shoppingCartIcon} from './components.js'


//lists out all meals saved in the db
var mealList = {
  oncreate: ()=>{
    //get the elements on the page that will be used for the overscroll
    var element = document.querySelector("#pageContent");
    var start = views.mealList.overscroll.start;
    var top = views.mealList.overscroll.top;
    var bottom = views.mealList.overscroll.bottom;
    var end = views.mealList.overscroll.end;
    //init the overscroll functionality
    utilities.initOverscroll(element,start,top,bottom,end);
  },
  view: (vnode)=>{
    return m("mealList#pageContainer",[
      m(lightBox,{//delete the current meal
        id:  views.mealList.lightBox.id,
        text:  views.mealList.lightBox.text,
        buttons: views.mealList.lightBox.buttons
      }),
      m("#pageContent",[
        m(".pageSection", views.mealList.allMeals.length >= 1 ? [//if there is at least 1 meal already saved
          m(".goBtnList", views.mealList.allMeals.map((meal)=>{
            return m(".goBtn",{ id: meal.id}, [
              m("div", meal.doc.name == "" ? "Nameless Meal" : meal.doc.name),
              m(".goIcons",[
                m(trashCan,{
                  click: ()=>{
                    //set the meal id for the lightbox so we delete the correct meal
                    views.mealList.lightBox.meal_id =  meal.id;
                    //open the lightbox
                    setTimeout(()=>{utilities.lightBox.open("mealListLightBox")},100);
                  }
                }),
                m(navigateIcon,{
                  click: async () =>{
                    await navigate.toMealEdit(meal.id);
                  }
                })
              ])
            ])
          }))
        ] : m(".explainationText","Add some recipes to get started!"))//if there are no meals saved yet
      ])
    ])
  }
}

//displays a meals info and allows for editing it
var mealEdit = {
  oncreate: (vnode)=>{
    if(views.mealEdit.autoFocus){
      document.getElementById("name").focus();
    }
  },
  view: (vnode)=>{
    return m("mealEdit#pageContainer",[
      m("#pageContent",[
        m(".pageSection",[
          m("input#name",{placeholder: "What is the name of this meal?", value: views.mealEdit.meal.name,  type: "text", oninput: (e)=>{
            views.mealEdit.onChange(e,views.mealEdit.meal.id,views.mealEdit.meal.checked);
          }})
        ]),
        m(".pageSection.",[
          m(".toggle",[
            m("#toggleIngredients.toggleBtn.toggled",{onclick: (e)=>{
              //prevent redraw as it will wipe all text from the fields
              e.redraw = false;
              //toggle this button, remove toggle from the other button, show the ingredients and hide the directions
              e.currentTarget.classList.add("toggled");
              document.getElementById("toggleDirections").classList.remove("toggled");
              document.getElementById("ingredients").classList.remove("hidden");
              document.getElementById("directions").classList.add("hidden");
            }}, "Ingredients"),
            m("#toggleDirections.toggleBtn",{onclick: (e)=>{
              e.redraw = false;
              e.currentTarget.classList.add("toggled");
              document.getElementById("toggleIngredients").classList.remove("toggled");
              document.getElementById("directions").classList.remove("hidden");
              document.getElementById("ingredients").classList.add("hidden");
            }}, "Directions")
          ]),
          m("textarea#ingredients",{placeholder: "Add ingredients for the meal here.\n\nSeparate individual ingredients with line breaks.\n\nAny ingredients placed here will be used when creating your shopping list.", oninput: (e)=>{
            views.mealEdit.onChange(e,views.mealEdit.meal.id,views.mealEdit.meal.checked);
          }},views.mealEdit.meal.ingredients),
          m("textarea#directions.hidden",{placeholder: "Add cooking instructions for the meal here.\n\nThis isn't required but is useful when cooking the meal.", oninput: (e)=>{
            views.mealEdit.onChange(e,views.mealEdit.meal.id,views.mealEdit.meal.checked);
          }},views.mealEdit.meal.directions)
        ])
      ])
    ])
  }
}

//displays a list of meals that the user can select to add to the db
var mealSelect = {
  view: (vnode)=>{
    return m("mealSelect#pageContainer",[
      m("#pageContent",[
        views.mealSelect.recipes.map((recipe,index)=>{
          return m(".pageSection.fadeIn",[
            m(".recipe",[
              m("img.recipeImage", {src:recipe.image}),
              m(".recipeTitle", recipe.name),
              m(".recipeInfo",[
                m(".recipeIngredients.info",[
                  recipe.ingredients.map((ingredient)=>{
                    return m("div",ingredient);
                  })
                ]),
                m(".recipeDirections.info",[
                  recipe.directions.map((direction)=>{
                    return m("div",direction);
                  })
                ])
              ]),
              m(".checkBtn",{onclick: async (e)=>{
                await views.mealSelect.selectRecipe(e,index);
              }}, "Save this recipe")
            ])
          ])
        })
      ]),
      m(pullToReload,{
        touch: "#pageContent"
      })
    ])
  }
}

//lists out saved meals and allows the user to add them to the shopping list
var mealPlan = {
  oncreate: (vnode)=>{
    //if there is at least 1 meal saved
    if(views.mealPlan.savedMeals.length >= 1){
      //get the elements to set up the overscroll
      var selectElement = document.querySelector("#selectList");
      var start = views.mealPlan.overscroll.start;
      var top = views.mealPlan.overscroll.top;
      var bottom = views.mealPlan.overscroll.bottom;
      var end = views.mealPlan.overscroll.end;
      //init the overscroll functionality
      utilities.initOverscroll(selectElement,start,top,bottom,end);
    }
  },
  view: (vnode)=>{
    return m("mealPlan#pageContainer",[
      m("#pageContent",[
        m("#select.pageSection", views.mealPlan.savedMeals.length >= 1 ? [//if there is at least 1 saved meal
          m(".explainationText","Tap on a meal to add it to the shopping list"),
          m("#selectList.planList",[
            views.mealPlan.savedMeals.map((meal)=>{
              return m(".checkBtn", {meal_id: meal.id, onclick: (e)=>{
                views.mealPlan.selectMeal(e,meal.id);
              }},[
                m("div",meal.doc.name),
                m("img",{src:"../assets/plus.png"})
              ])
            })
          ])
        ] : m(".explainationText","You must add some recipes before you can create a shopping list"))//there are no meals saved yet
      ]),
      m(checkIcon,{
        id: "selectMenu",
        class: "menuBtn hidden",
        click: () =>{
          //use the selected meals to create the meal plan
          views.mealPlan.createPlan(views.mealPlan.selectedMeals);
        }
      })
    ])
  }
}

//provides options for how the user can add a new meal
var mealOptions = {
  view: (vnode)=>{
    return m("mealOptions#pageContainer",[
      m("#pageContent",[
        m(".pageSection",[
          m(".checkBtn",{ onclick: async ()=>{
            await navigate.toMealEdit(undefined);
          }},[
           m("div", "Add your own recipe")
         ]),
          m(".checkBtn",{onclick: async ()=>{
            await navigate.toLoadingScreen("recipe");
          }}, [
           m("div", "Find a recipe")
          ])
        ])
      ])
    ])
  }
}


//generates and displays a shopping list of ingredients needed for the meal plan
var shoppingList = {
  view: (vnode)=>{
    return m("shoppingList#pageContainer",[
      m(lightBox,{//delete the current shopping list
        id: views.shoppingList.lightBox.id,
        text: views.shoppingList.lightBox.text,
        buttons: views.shoppingList.lightBox.buttons,
        vnode: vnode
      }),
      m("#pageContent",{onmousedown: ()=>{//mouse down on anywhere on the page
          //close the secondary menu
          document.getElementsByClassName("menu")[0].classList.add("hidden");
      }},[
        m("#list.pageSection",[
          m("#shoppingList",views.shoppingList.list.length >= 1 ? views.shoppingList.list.map((item,i)=>{//if there is at least 1 meal on the shopping list
            return m(".shoppingListMeal",{item_id: item.meal_id, repeat: item.repeat},[
              m(".nameContainer",[
                m(".mealName",item.name == "" ? "Nameless Meal" : item.name)//add a default name if the meal does not have one
              ]),
              item.ingredients.length >= 1 ? item.ingredients.map((ingredient,i)=>{//if the meal has at least 1 ingredient
                return m(".mealIngredient",{class: item.checked.includes(ingredient) ? "checked" : "", onclick: async (e)=>{
                  await views.shoppingList.checkOffIngredient(e,ingredient,item.meal_id);
                }},ingredient)
              }) : "No ingredients needed"//the recipe has no ingredients listed
            ])
          }) : "Nothing to shop for")//there are no meals on the shopping list
        ])
      ]),
      m(menuIcon),
      m(".menu.hidden.scaleUp",[
        m(trashCan,{
          class: "menuIcon",
          click: ()=>{
            utilities.lightBox.open("shoppingListLightbox");
          }
        })
      ])
    ])
  }
}

//shows a loading icon
var loadingScreen = {
  oninit: async (vnode)=>{
    //disable the nav buttons so the user cannot navigate away during the animation load
    utilities.navBar.disable();
    try{
      //check the load variable to see what steps to take during loading
      //meal plan load
      if(vnode.attrs.load == "plan"){
        //wait 2 seconds then navigate to the meal plan view
        //this is a fake load that we do for the benefit of user feedback
        setTimeout(async() => {
          //enable the nav bar again
          utilities.navBar.enable();
          //navigate back to the meal plan
          await navigate.toMealPlan();
        }, 2000);
      }
      //recipe load steps
      else if(vnode.attrs.load == "recipe"){
        //since this is the inital load of the page we want to make sure the recipes array is empty
        views.mealSelect.recipes = [];
        //get a list of recipes from the server
        await views.mealSelect.getRecipes();
        //wait at least 2 seconds and then navigate to the meal select screen
        setTimeout(async() => {
          utilities.navBar.enable();
          await navigate.toMealSelect();
        }, 2000);
      }
      else if(vnode.attrs.load == "shopping"){
        //wait at least 2 seconds and then navigate
        setTimeout(async() => {
          utilities.navBar.enable();
          await navigate.toShoppingList();
        }, 2000);
      }
    }
    catch(e){
      //if there was an error while loading route the user back the the list view
      await navigate.toMealList();
    }
  },
  view: (vnode)=>{
    return m("loadingScreen#pageContainer",[
      m("#pageContent",[
        m(".pageSection",[
          m(loadingImg)
        ])
      ])
    ])
  }
}


export{mealList,mealEdit,mealPlan,shoppingList,loadingScreen,mealOptions,mealSelect};
