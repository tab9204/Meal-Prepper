/*****app views****/
import {database} from './database.js';
import {navigate,views,utilities} from './data.js'
import {lightBox,loadingImg} from './components.js'


//view that lists all meals that have been saved in the meals db
var mealList = {
  view: (vnode)=>{
    return m("mealList#pageContainer",[
      m("#pageContent",[
        m(".pageSection",[
          m("#mealList",vnode.attrs.meals.map((meal)=>{
            if(meal !== ""){//if the meal array is not empty
              return m(".mealListItem",{ id: meal.id, onclick: async (e)=>{
                  await navigate.toMealEdit(meal.id,"navInRight");
                }
              }, meal.doc.name == "" ? "Nameless Meal" : meal.doc.name)
            }
            else{//if the meal array is empty
              return m("#explainationText",[
                m("div", "You haven't added any meals yet!"),
                m("div", "Use the bottom right icon to add some meals."),
                m("div", "Once you have some meals added you can use the bottom left icon to create a meal plan."),
              ])
            }
          }))
        ])
      ])
    ])
  }
}

//view for editing a meal's data
var mealEdit = {
  oncreate: (vnode)=>{
    if(vnode.attrs.autoFocus){
      document.getElementById("name").focus();
    }
  },
  view: (vnode)=>{
    return m("mealEdit#pageContainer",{class:vnode.attrs.navIn},[
      m(lightBox,{//delete the current meal
        id: views.mealEdit.lightBox.id,
        text: views.mealEdit.lightBox.text,
        buttons: views.mealEdit.lightBox.buttons,
        vnode: vnode
      }),
      m("#mealEditHeader.header",[
        m("img#deleteMeal.headerImg",{src: "../assets/trashCan.png", onclick: async ()=>{
          //delay opening the lightbox to give time for the mobile keyboard to close
          setTimeout(()=>{utilities.lightBox.open("mealEditLightBox")},100);
        }}),
      ]),
      m("#pageContent",[
        m(".pageSection",[
          m("textarea#name",{placeholder: "Provide a name for this meal.", rows: 1, oninput: (e)=>{
            views.mealEdit.onChange(e,vnode.attrs.meal.id,vnode.attrs.meal.checked);
          }},vnode.attrs.meal.name)
        ]),
        m(".pageSection",[
          m("textarea#ingredients",{placeholder: "Add ingredients for the meal here.\n\nSeparate individual ingredients with line breaks.", oninput: (e)=>{
            views.mealEdit.onChange(e,vnode.attrs.meal.id,vnode.attrs.meal.checked);
          }},vnode.attrs.meal.ingredients)
        ]),
        m(".pageSection",[
          m("textarea#directions",{placeholder: "Add cooking instructions for the meal here.", oninput: (e)=>{
            views.mealEdit.onChange(e,vnode.attrs.meal.id,vnode.attrs.meal.checked);
          }},vnode.attrs.meal.directions)
        ])
      ])
    ])
  }
}

//view for generating a meal plan or displaying an exiting one
var mealPlan = {
  oncreate: (vnode)=>{
    //if there is no current meal plan open the meal plan selection lightbox
    if(vnode.attrs.plan == ""){utilities.lightBox.open("mealPlanLightBox2");}
  },
  view: (vnode)=>{
    return m("mealPlan#pageContainer",{class:vnode.attrs.navIn},[
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
      m("#mealPlanHeader.header",[
        m("img#deleteMealPlan.headerImg",{src: "../assets/trashCan.png", onclick: async ()=>{
          utilities.lightBox.open("mealPlanLightbox1");
        }}),
        m("img#toShoppingList.headerImg",{src: "../assets/shoppingCart.png",onclick: async ()=>{
          await navigate.toShoppingList("navInLeft");
        }})
      ]),
      m("#pageContent",[
        m(".pageSection",[
          m("#mealPlanList",vnode.attrs.plan.map((day,i)=>{
            if(day !== ""){//if the meal plan array is not empty
            return m(".mealDay",{id: day.id, class: day.checked ? "checked" : "", meal_id: day.meal_id, onclick: (e)=>{
              views.mealPlan.checkOffDay(e,day.id,day.meal_id);
            }},[
              /*m("img.mealCheck",{src:"../assets/x.png", onclick: async (e)=>{views.mealPlan.checkOffDay(e,day.id,day.meal_id);}}),*/
              m(".mealNumber", "Day " +  (i + 1)),
              m(".mealName", day.name)
            ])
            }
            else{//if the meal plan array is empty
              return m("div","")
            }
          }))
        ])
      ])
    ])
  }
}

//view that generates and displays a shopping list
//lists everything needed to cook the entire meal plan
var shoppingList = {
  view: (vnode)=>{
    return m("shoppingList#pageContainer",{class:vnode.attrs.navIn},[
      m("#pageContent",[
        m(".pageSection",[
          m("#shoppingList",vnode.attrs.list.map((item,i)=>{
            if(item !== ""){//if the shopping list is not empty
              return m(".shoppingListMeal",{item_id: item.meal_id, repeat: item.repeat},[
                m(".nameContainer",[
                  m(".mealName",item.name == "" ? "Nameless Meal" : item.name),
                  m(".mealRepeat",item.repeat >= 2 ?  "x" + item.repeat : "")
                ]),
                item.ingredients.map((ingredient,i)=>{
                  if(ingredient !== ""){
                    return m(".mealIngredient",{class: item.checked.includes(ingredient) ? "checked" : "", onclick: async (e)=>{
                      await views.shoppingList.checkOffIngredient(e,ingredient,item.meal_id);
                    }},ingredient)
                  }
                  else{
                    return m("div","No ingredients needed")
                  }
                })
              ])
            }
            else{//if shopping list is empty
              return m("div","Nothing to shop for!")
            }
          }))
        ])
      ])
    ])
  }
}

//screen that shows a loading icon
var loadingScreen = {
  oninit: ()=>{
    setTimeout(() => {navigate.toMealPlan();}, 2000);
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
