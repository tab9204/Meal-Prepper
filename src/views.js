/*****app views****/
import {database} from './database.js';
import {navigate} from './data.js'
import {component} from './components.js'


//view that lists all meals that have been saved
var mealList = {
  view: (vnode)=>{
    return m("mealList#pageContainer",[
      m("#mealListHeader.header",[
        m("img#toMealPlan.navBtn",{src: "../assets/navigate.png", onclick: ()=>{navigate.toMealPlan()}}),
        m("img#toMealEdit.navBtn",{src: "../assets/navigate.png", onclick: ()=>{navigate.toMealEdit()}})
      ]),
      m("#pageContent",[
        m(".pageSection",[
          m("div","Meal List View")
        ])
      ])
    ])
  }
}

//view for adding/editing a meal
var mealEdit = {
  view: (vnode)=>{
    return m("mealEdit#pageContainer",[
      m("#mealEditHeader.header",[
        m("img#toMealList.navBtn",{src: "../assets/navigate.png", onclick: ()=>{navigate.toMealList()}})
      ]),
      m("#pageContent",[
        m(".pageSection",[
          //m(".sectionHeader", "Ingredients"),
          //m(component,{class:"test"}),
          m("textarea.ingredients",{placeholder: "Ingredients"},"")
        ]),
        m(".pageSection",[
          //m(".sectionHeader", "Directions"),
          //m(component,{class:"test"}),
          m("textarea.directions",{placeholder: "Directions"},"")
        ])
      ])
    ])
  }
}

//view for generating a meal plan
var mealPlan = {
  view: (vnode)=>{
    return m("mealPlan#pageContainer",[
      m("#mealPlanHeader.header",[
        m("img#toShoppingList.navBtn",{src: "../assets/navigate.png", onclick: ()=>{navigate.toShoppingList()}}),
        m("img#toMealList.navBtn",{src: "../assets/navigate.png", onclick: ()=>{navigate.toMealList()}})
      ]),
      m("#pageContent",[
        m(".pageSection",[
          m("div","Meal Plan View")
        ])
      ])
    ])
  }
}

//view that shows a list of all ingredients needed for the meal plan
var shoppingList = {
  view: (vnode)=>{
    return m("shoppingList#pageContainer",[
      m("#shoppingListHeader.header",[
        m("img#tomealPlan.navBtn",{src: "../assets/navigate.png", onclick: ()=>{navigate.toMealPlan()}})
      ]),
      m("#pageContent",[
        m(".pageSection",[
          m("div","Shopping List View")
        ])
      ])
    ])
  }
}



export{mealList,mealEdit,mealPlan,shoppingList};
