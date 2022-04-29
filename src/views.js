/*****app views****/
import {database} from './database.js';
import {navigate,views,utilities} from './data.js'
import {lightBox,loadingImg} from './components.js'


//view that lists all meals that have been saved in the meals db
var mealList = {
  oninit: async (vnode)=>{
    //await views.mealList.initalize();
    //m.redraw();
  },
  view: (vnode)=>{
    return m("mealList#pageContainer",[
      m(lightBox,{//delete the current meal
        id:  views.mealList.lightBox.id,
        text:  views.mealList.lightBox.text,
        buttons: views.mealList.lightBox.buttons
      }),
      m("#pageContent",[
        m(".pageSection",[
          m("#mealList",views.mealList.allMeals.length >= 1 ? views.mealList.allMeals.map((meal)=>{
            return m(".mealListItem",{ id: meal.id}, [
              m(".mealItemName", meal.doc.name == "" ? "Nameless Meal" : meal.doc.name),
              m(".mealItemBtns",[
                m("img.mealItemDelete",{src: "../assets/trashCan.png", onclick: async ()=>{
                  //set the meal id for the lightbox so we delete the correct meal
                  views.mealList.lightBox.meal_id =  meal.id;
                  //open the lightbox
                  setTimeout(()=>{utilities.lightBox.open("mealListLightBox")},100);
                }}),
                m("img.mealItemEdit",{src: "../assets/navigate.png", onclick: async (e)=>{
                    await navigate.toMealEdit(meal.id);
                }})
              ])
            ])
          }) : m("#explainationText",[
            m("div", "Add some meals to get started!"),
            m("div", "Use the top right button to add a meal."),
            m("div", "Then use the top left button to create a meal plan.")
          ]))
        ])
      ])
    ])
  }
}

//view for editing a meal's data
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
        m(".pageSection",[
          m("#toggle",[
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
          m("textarea#ingredients",{placeholder: "Add ingredients for the meal here.\n\nSeparate individual ingredients with line breaks.\n\nAny ingredients placed here will be used when creating the meal plan shopping list.", oninput: (e)=>{
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

//view for generating a meal plan or displaying an exiting one
var mealPlan = {
  oncreate: (vnode)=>{
    //if there is no current meal plan open the meal plan selection lightbox
    if(views.mealPlan.planData.length <= 0){
      //hide the main section and show the first selection section
      document.querySelector("#main.pageSection").classList.add("hidden");
      document.querySelector("#select.pageSection").classList.remove("hidden");
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
      m(lightBox,{//selecting how long a meal plan shoud be
        id: views.mealPlan.lightBox2.id,
        text: views.mealPlan.lightBox2.text,
        buttons: views.mealPlan.lightBox2.buttons,
        vnode: vnode
      }),
      m("#pageContent",{onmousedown: ()=>{
        document.getElementById("mealPlanMenu").classList.add("hidden");
      }},[
        m("#main.pageSection",[
          m("#mealPlanList",views.mealPlan.planData.map((day,i)=>{
            return m(".btn",{id: day.id, class: day.checked ? "checked" : "", meal_id: day.meal_id, onclick: (e)=>{
              views.mealPlan.checkOffDay(e,day.id,day.meal_id);
            }},[
              m(".mealNumber", "Day " +  (i + 1)),
              m(".mealName", day.name)
            ])
          })),
          m("img.menu",{src:"../assets/menu.png", onclick: ()=>{
            document.getElementById("mealPlanMenu").classList.remove("hidden");
          }})
        ]),
        m("#select.pageSection.hidden", views.mealPlan.savedMeals.length >= 1 ? [
          m("div","Tap on a meal to include it in your meal plan"),
          views.mealPlan.savedMeals.map((meal)=>{
            return m(".btn", {meal_id: meal.id, onclick: (e)=>{
              views.mealPlan.selectMeal(e,meal.id);
            }},[
              m("div",meal.doc.name),
              m(".img","")
            ])
          }),
          m("img.menu.disabled",{src:"../assets/check.png", onclick: ()=>{
            //use the selected meals to create the meal plan
            views.mealPlan.createPlan(views.mealPlan.selectedMeals);
          }})
        ] : "You must add meals before you can create a meal plan")
      ]),
      m("#mealPlanMenu.hidden.scaleUp",[
        m("img#deleteMealPlan.menuIcon",{src: "../assets/trashCan.png", onclick: async ()=>{
          utilities.lightBox.open("mealPlanLightbox1");
        }}),
        m("img#toShoppingList.menuIcon",{src: "../assets/shoppingCart.png",onclick: async ()=>{
          await navigate.toShoppingList();
        }})
      ])
    ])
  }
}

//view that generates and displays a shopping list
//lists everything needed to cook the entire meal plan
var shoppingList = {
  view: (vnode)=>{
    return m("shoppingList#pageContainer",[
      m("#pageContent",[
        m(".pageSection",[
          m("#shoppingList",views.shoppingList.list.length >= 1 ? views.shoppingList.list.map((item,i)=>{
            return m(".shoppingListMeal",{item_id: item.meal_id, repeat: item.repeat},[
              m(".nameContainer",[
                m(".mealName",item.name == "" ? "Nameless Meal" : item.name),
                m(".mealRepeat",item.repeat >= 2 ?  "x" + item.repeat : "")
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

//screen that shows a loading icon
var loadingScreen = {
  oninit: ()=>{
    //disable the nav buttons so the user cannot navigate away during the animation load
    document.querySelectorAll("#toMealPlan, #toMealList, #toMealEdit").forEach((element) => {
      element.classList.add("disabled");
    });
    setTimeout(() => {
      document.querySelectorAll("#toMealPlan, #toMealList, #toMealEdit").forEach((element) => {
        element.classList.remove("disabled");
      });
      //navigate back to the meal plan
      navigate.toMealPlan();
    }, 2000);
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


export{mealList,mealEdit,mealPlan,shoppingList,loadingScreen};
