/*****app views****/
import {database} from './database.js';
import {navigate,views,utilities} from './data.js'
import {lightBox,loadingImg,pullToReload} from './components.js'


//lists out all meals saved in the db
var mealList = {
  view: (vnode)=>{
    return m("mealList#pageContainer",[
      m(lightBox,{//delete the current meal
        id:  views.mealList.lightBox.id,
        text:  views.mealList.lightBox.text,
        buttons: views.mealList.lightBox.buttons
      }),
      m("#pageContent",[
        m(".pageSection",[
          m(".goBtnList",views.mealList.allMeals.length >= 1 ? views.mealList.allMeals.map((meal)=>{
            return m(".goBtn",{ id: meal.id}, [
              m("div", meal.doc.name == "" ? "Nameless Meal" : meal.doc.name),
              m(".goIcons",[
                m("img.icon",{src: "../assets/trashCan.png", onclick: async ()=>{
                  //set the meal id for the lightbox so we delete the correct meal
                  views.mealList.lightBox.meal_id =  meal.id;
                  //open the lightbox
                  setTimeout(()=>{utilities.lightBox.open("mealListLightBox")},100);
                }}),
                m("img.icon",{src: "../assets/navigate.png", onclick: async (e)=>{
                    await navigate.toMealEdit(meal.id);
                }})
              ])
            ])
          }) : m("#explainationText",[
            m("div", "Add some recipes to get started!")
          ]))
        ])
      ])
    ])
  }
}

//generates a new meal plan or displays an existing one
var mealPlan = {
  oncreate: (vnode)=>{
    //if there is no current meal plan open the meal plan selection lightbox
    if(views.mealPlan.planData.length <= 0){
      //hide the main section and show the first selection section
      document.querySelector("#main.pageSection").classList.add("hidden");
      document.querySelector("#select.pageSection").classList.remove("hidden");
      document.getElementById("mainMenu").classList.add("hidden");
    }
  },
  view: (vnode)=>{
    return m("mealPlan#pageContainer",[
      m(lightBox,{//delete the current meal plan
        id: views.mealPlan.lightBox1.id,
        text: views.mealPlan.lightBox1.text,
        buttons: views.mealPlan.lightBox1.buttons,
        vnode: vnode
      }),
      m("#pageContent",{onmousedown: ()=>{
          document.getElementsByClassName("menu")[0].classList.add("hidden");
      }},[
        m("#main.pageSection",[
          m("#mealPlanList",views.mealPlan.planData.map((day,i)=>{
            return m(".checkBtn",{id: day.id, class: day.checked ? "checked" : "", meal_id: day.meal_id, onclick: (e)=>{
              views.mealPlan.checkOffDay(e,day.id,day.meal_id);
            }},[
              m("div", "Day " +  (i + 1)),
              m("div", day.name)
            ])
          }))
        ]),
        m("#select.pageSection.hidden", views.mealPlan.savedMeals.length >= 1 ? [
          m(".explainationText","Tap on a meal to include it in your meal plan"),
          m("#selectList",[
            views.mealPlan.savedMeals.map((meal)=>{
              return m(".checkBtn", {meal_id: meal.id, onclick: (e)=>{
                views.mealPlan.selectMeal(e,meal.id);
              }},[
                m("div",meal.doc.name),
                m("img",{src:"../assets/plus.png"})
              ])
            })
          ])
        ] : "You must add meals before you can create a meal plan")
      ]),
      m("img.menuBtn#mainMenu",{src:"../assets/menu.png", onclick: ()=>{
        document.getElementsByClassName("menu")[0].classList.remove("hidden");
      }}),
      m("img.menuBtn.hidden#selectMenu",{src:"../assets/check.png", onclick: ()=>{
        //use the selected meals to create the meal plan
        views.mealPlan.createPlan(views.mealPlan.selectedMeals);
      }}),
      m(".menu.hidden.scaleUp",[
        m("img.menuIcon",{src: "../assets/trashCan.png", onclick: async ()=>{
          utilities.lightBox.open("mealPlanLightbox");
        }}),
        m("img.menuIcon",{src: "../assets/shoppingCart.png",onclick: async ()=>{
          await navigate.toShoppingList();
        }})
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
        touch: "#pageContent",
        icon: ".reload",
        length: 250
      })
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

//generates and displays a shopping list of ingredients needed for the meal plan
var shoppingList = {
  view: (vnode)=>{
    return m("shoppingList#pageContainer",[
      m("#pageContent",[
        m(".pageSection",[
          m("#shoppingList",views.shoppingList.list.length >= 1 ? views.shoppingList.list.map((item,i)=>{
            return m(".shoppingListMeal",{item_id: item.meal_id, repeat: item.repeat},[
              m(".nameContainer",[
                m(".mealName",item.name == "" ? "Nameless Meal" : item.name)
              ]),
              item.ingredients.length >= 1 ? item.ingredients.map((ingredient,i)=>{
                return m(".mealIngredient",{class: item.checked.includes(ingredient) ? "checked" : "", onclick: async (e)=>{
                  await views.shoppingList.checkOffIngredient(e,ingredient,item.meal_id);
                }},ingredient)
              }) : "No ingredients needed"
            ])
          }) : "Nothing to shop for")
        ])
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
