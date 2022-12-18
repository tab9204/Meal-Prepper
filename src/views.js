/*****app views****/
import {database} from './database.js';
import {navigate,views,utilities} from './data.js'
import {
  loadingImg,
  trashCan,
  checkIcon,
  navigateIcon,
  shoppingCartIcon,
  plusIcon,
  plusIconSmall,
  checkIconSmall,
  popupMenu,
  editIcon,
  confirmIcon,
  cancelIcon
} from './components.js'



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
      m(popupMenu,[
        m(editIcon,{onclick:(e)=>{views.mealList.popup.edit();}}),
        m(trashCan,{onclick:(e)=>{views.mealList.popup.delete();}})
      ]),
      m("#pageContent",{
        ontouchstart:()=>{utilities.popup.close()},//when the user clicks here the popup should close
        onscroll: (e)=> {views.mealList.cancelHold(e);}//when the view scrolls cancel the delete hold timer
      },[
        m(".pageSection", views.mealList.allMeals.length >= 1 ? [//if there is at least 1 meal already saved
          m("#recipeList",[
            m("#sortedList",views.mealList.allowedChracters.map((c)=>{//loop through all allowed catagory characters
              return m(".section",[
                m(".sectionTitle",String.fromCharCode(c)),//convert the char code to a string
                m(".sectionList",views.mealList.allMeals.map((meal)=>{//loop through all recipes
                  if(meal.doc.name.charAt(0).toUpperCase().charCodeAt(0) == c){
                    return m(".sectionMeal",{
                        id: meal.id,
                        //mobile gestures
                        ontouchstart: (e)=>{
                          views.mealList.startHold(e,meal.id);
                        },
                        ontouchend: (e)=>{
                          views.mealList.cancelHold(e);
                        },
                        //desktop gestures
                        onmousedown: (e)=>{
                          views.mealList.startHold(e,meal.id);
                        },
                        onmouseup: (e)=>{
                          views.mealList.cancelHold(e);
                        },
                        onmouseleave: (e)=>{
                          //views.mealList.cancelHold(e);
                        },
                        //on click
                        onclick: async () =>{
                          await navigate.toMealView(meal.id);
                        }
                      },[
                      m(".mealName",meal.doc.name),
                      m(navigateIcon)
                    ]);
                  }
                }))
              ])
            })),
            m("#unsortedList",[
              m(".section",[
                  m(".sectionTitle","Misc"),
                  m(".sectionList",views.mealList.unsortedMeals.map((meal)=>{//loop through all unsorted recipes
                    return m(".sectionMeal",{
                        id: meal.id,
                        //mobile gestures
                        ontouchstart: (e)=>{
                          views.mealList.startHold(e,meal.id);
                        },
                        ontouchend: (e)=>{
                          views.mealList.cancelHold(e);
                        },
                        //desktop gestures
                        onmousedown: (e)=>{
                          views.mealList.startHold(e,meal.id);
                        },
                        onmouseup: (e)=>{
                          views.mealList.cancelHold(e);
                        },
                        onmouseleave: (e)=>{
                          views.mealList.cancelHold(e);
                        },
                        //on click
                        onclick: async () =>{
                          await navigate.toMealView(meal.id);
                        }
                      },[
                      m(".mealName",meal.doc.name),
                      m(navigateIcon)
                    ]);
                }))
              ])
            ])
          ])
        ] : m(".explainationText","Add some recipes to get started!"))//if there are no meals saved yet
      ])
    ])
  }
}

//displays a meals ingredients and directions
var mealView = {
  view: (vnode)=>{
    return m("mealView#pageContainer",[
      m("#pageContent",[
        m(".pageSection",[
          m("#name",views.mealView.meal.name)
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
          m("#ingredients",views.mealView.meal.ingredients.map((ingredient)=>{
            return m(".ingredient",ingredient)
          })),
          m("#directions.hidden",views.mealView.meal.directions.map((direction)=>{
            return m(".direction",direction)
          }))
        ])
      ])
    ])
  }
}

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
            //prevent mithril from redrawing the view
            //if we did not do this the text in the textarea would be removed
            e.redraw = false;
            views.mealEdit.saveMeal();
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
          m("textarea#ingredients",{placeholder: "Add ingredients for the meal here.", oninput: (e)=>{
            e.redraw = false;
            views.mealEdit.saveMeal();
          }},views.mealEdit.meal.ingredients),
          m("textarea#directions.hidden",{placeholder: "Add cooking instructions for the meal here.", oninput: (e)=>{
            e.redraw = false;
            views.mealEdit.saveMeal();
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
      ])
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
                views.mealPlan.selectMeal(e);
              }},[
                m("div",meal.doc.name),
                m(plusIconSmall,{class:"plusIcon"})
              ])
            })
          ])
        ] : m(".explainationText","You must add some recipes before you can create a shopping list"))//there are no meals saved yet
      ]),
      m(".menu .hidden",[
        m(checkIcon,{
          class: "menuIcon",
          onclick: ()=>{
            //get all checked buttons
            document.querySelectorAll(".checkBtn.checked").forEach((item, i) => {
              //add the meal id of each checked button to the selected meals array
              views.mealPlan.selectedMeals.push(item.attributes.meal_id.value);
            });
            //use the selected meals to create the meal plan
            views.mealPlan.createPlan(views.mealPlan.selectedMeals);
          }
        })
      ])
    ])
  }
}

//provides options for how the user can add a new meal
var mealOptions = {
  view: (vnode)=>{
    return m("mealOptions#pageContainer",[
      m("#pageContent",[
        m(".pageSection",[
          m(".fullScreenBtn",{ onclick: async ()=>{
            await navigate.toMealEdit(undefined);
          }},[
           m("div", "Add your own recipe")
         ]),
          m(".fullScreenBtn",{onclick: async ()=>{
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
      m(popupMenu,[
        m(confirmIcon,{onclick:(e)=>{views.shoppingList.popup.delete();}}),
        m(cancelIcon,{onclick:(e)=>{views.shoppingList.popup.cancel();}})
      ]),
      m("#pageContent",{ontouchstart:()=>{utilities.popup.close()}},[
        m("#list.pageSection",[
          m("#shoppingList",views.shoppingList.list.length >= 1 ? views.shoppingList.list.map((item,i)=>{//if there is at least 1 meal on the shopping list
            return m(".shoppingListMeal",{item_id: item.meal_id, repeat: item.repeat},[
              m(".nameContainer",[
                m(".mealName",item.name == "" ? "Nameless Meal" : item.name)//add a default name if the meal does not have one
              ]),
              item.ingredients.length >= 1 ? item.ingredients.map((ingredient,i)=>{//if the meal has at least 1 ingredient
                return m(".mealIngredient",{class: item.checked.includes(ingredient) ? "checked" : ""},[
                  m(".checkBox",{onclick: async (e)=>{
                    //get the parent element as that is the element we want to place the checked class on
                    var element = e.currentTarget.parentElement;
                    //check off ingredient
                    await views.shoppingList.checkOffIngredient(element,ingredient,item.meal_id);
                  }},[
                    m(checkIconSmall,{class:"checkIcon"})
                  ]),
                  m(".ingredientName",ingredient)
                ])
              }) : "No ingredients needed"//the recipe has no ingredients listed
            ])
          }) : "Nothing to shop for")//there are no meals on the shopping list
        ])
      ]),
      m(".menu",[
        m(trashCan,{
          class: "menuIcon",
          onclick: ()=>{
            var popup = document.querySelector("#popupMenu");
            utilities.popup.open(popup,window.innerWidth - (popup.offsetWidth + 7) ,window.innerHeight - (popup.offsetHeight + 70));
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

  },
  oncreate: async (vnode)=>{
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
        }, 2500);
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
        }, 2500);
      }
      else if(vnode.attrs.load == "shopping"){
        //wait at least 2 seconds and then navigate
        setTimeout(async() => {
          utilities.navBar.enable();
          await navigate.toShoppingList();
        }, 2500);
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


export{mealList,mealView,mealEdit,mealPlan,shoppingList,loadingScreen,mealOptions,mealSelect};
