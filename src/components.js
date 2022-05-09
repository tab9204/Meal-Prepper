/*****view components****/
import {navigate,utilities} from './data.js'
import {views} from './data.js'

//on screen lightbox that shows in front of all other content in the view
//needs to be passed:
  //an id for the lightBox
  //text to display in the box
  //an array of buttons where each button is an object with a click function and text
  //vnode data of the view where the lightBox is being used
var lightBox = {
  view: (vnode)=>{
    return m(".lightBoxContainer.closed",{id: vnode.attrs.id},[
      m(".lightBoxBackground",""),
      m('.lightBox',[
        m(".lightBoxText",vnode.attrs.text),
        m(".lightBoxButtons",[
          vnode.attrs.buttons.map((button)=>{
            return m(".lightBoxBtn",{onclick: ()=>{
              button.click();
            }}, button.text)
          })
        ])
      ])
    ])
  }
}

//loading gif
var loadingImg = {
  view: (vnode)=>{
    return m("#loadingImg",[
      m("img",{src:"./assets/loading.gif"})
    ])
  }
}

//navigation bar containing buttons to navigate app views
var navBar = {
  view: (vnode)=>{
    return m(".navBar",[
      m(".navBtnContainer",[
        m("img#toMealPlan.btnImage",{//nav button, to meal plan
          src: "../assets/plan.png",
          onclick: async (e)=>{
            //add the pulse animation
            navigate.addPulse(e);
            //navigate to the meal edit view
            await navigate.toMealPlan();
          }
        })
      ]),
      m(".navBtnContainer",[
        m("img#toMealList.btnImage",{//nav button, to meal list
          src: "../assets/home.png",
          onclick: async (e)=>{
            //add the pulse animation
            navigate.addPulse(e);
            //navigate to the meal edit view
            await navigate.toMealList();
          }
        })
      ]),
      m(".navBtnContainer",[
        m("img#toMealEdit.btnImage",{//nav button, to meal edit
          src: "../assets/plus.png",
          onclick: async (e)=>{
            //add the pulse animation
            navigate.addPulse(e);
            //navigate to the meal edit view
            await navigate.toMealOptions();
          }
        })
      ])
    ])
  }
}

//off screen loading icon that can be pulled into view to reload or do some other action
var pullToReload ={
  oncreate: (vnode)=>{
    var element = document.querySelector(vnode.attrs.touch);
    var start = views.mealSelect.overscroll.start;
    var bottom = views.mealSelect.overscroll.bottom;
    var end = views.mealSelect.overscroll.end;
    //init the overscroll functionality
    utilities.initOverscroll(element,start,null,bottom,end);
  },
  view: (vnode)=>{
    return m(".reload",[
      m("img",{src:"./assets/loading.gif"})
    ])
  }
}



export{lightBox,loadingImg,navBar,pullToReload};
