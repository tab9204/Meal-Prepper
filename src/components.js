/*****view components****/
import {navigate,utilities} from './data.js'
import {views} from './data.js'
import {database} from './database.js';

//loading gif
var loadingImg = {
  view: (vnode)=>{
    return m("#loadingImg",[
      m("#loading",[
        m(".rotate"),
        m(".rotate"),
        m(".rotate"),
        m(".rotate")
      ])
    ])
  }
}

//navigation bar containing buttons to navigate app views
var navBar = {
  view: (vnode)=>{
    return m(".navBar",[
      m(".navBtnContainer",[
        m(shoppingCartIcon,{
          class: "btnImage navIcon",
          id: "toMealPlan",
          onclick: async (e)=>{
            //add the pulse animation
            navigate.addPulse(e);
            //check if there is a saved meal plan
            var mealPlan = await database.getAll(database.mealPlan);
            //if the meal plan is empty route the user to the meal plan view
            if(mealPlan.length <= 0){
              await navigate.toMealPlan();
            }
            //otherwise take the user to the shopping list view
            else{
              await navigate.toShoppingList();
            }
          }
        })
      ]),
      m(".navBtnContainer",[
        m(home,{
          class: "btnImage navIcon",
          id: "toMealList",
          onclick: async (e)=>{
            //add the pulse animation
            navigate.addPulse(e);
            //navigate to the meal edit view
            await navigate.toMealList();
          }
        })
      ]),
      m(".navBtnContainer",[
        m(plusIcon,{
          class: "btnImage navIcon",
          id: "toMealView",
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

var popupMenu = {
  view: (vnode)=>{
    return m("#popupMenu.invisible", vnode.attrs,[vnode.children])
  }
}


/***********SVG ICONS*****************/
//trash can svg icon
var trashCan = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="10.09" y="5.04" width="32.9" height="1.88"/> <rect x="20.04" y="3.03" width="1.93" height="2.17"/> <rect x="21.78" y="4.02" width="1.2" height="1.34"/> <rect x="21.01" y="1.04" width="1.97" height="1.97"/> <rect x="21.99" width="8.01" height="2.02"/> <rect x="30" y="1.01" width="1.99" height="4.19"/> <rect x="31.42" y="4.02" width="1.56" height="1.44"/> <rect x="21.01" y="2.58" width="0.99" height="2.04"/> <rect x="20.01" y="3.01" width="1.05" height="2.15"/> <rect x="9.02" y="5.98" width="1.97" height="1.97"/> <rect x="8.03" y="7.04" width="2.06" height="4.95"/> <rect x="7" y="9" width="1.58" height="1.01"/> <rect x="42.08" y="5.98" width="1.91" height="2.01"/> <rect x="43.03" y="7.62" width="0.95" height="3.33"/> <rect x="43.39" y="7.99" width="1.61" height="2.99"/> <rect x="41.94" y="10.01" width="2.08" height="1.99"/> <rect x="9.74" y="10.01" width="32.34" height="1.98"/> <rect x="19.96" y="18.99" width="2.03" height="16.97"/> <rect x="25" y="18.99" width="1.94" height="16.97"/> <rect x="30.98" y="18.99" width="2" height="16.97"/> <rect x="40" y="11.71" width="2.02" height="34.29"/> <rect x="10.99" y="11.71" width="2.06" height="36.29"/> <rect x="11.98" y="47" width="2.01" height="2.01"/> <rect x="13.99" y="48.01" width="24.98" height="1.99"/> <rect x="38.98" y="46" width="2.03" height="2.01"/> <rect x="37.96" y="46.94" width="2.04" height="2.04"/> </svg>')
    ])
  }
}
// small trash can svg icon
var trashCanSmall = {
  view: (vnode)=>{
    return m(".icon.smallIcon",vnode.attrs,[
      m.trust('<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="10.09" y="5.04" width="32.9" height="1.88"/> <rect x="20.04" y="3.03" width="1.93" height="2.17"/> <rect x="21.78" y="4.02" width="1.2" height="1.34"/> <rect x="21.01" y="1.04" width="1.97" height="1.97"/> <rect x="21.99" width="8.01" height="2.02"/> <rect x="30" y="1.01" width="1.99" height="4.19"/> <rect x="31.42" y="4.02" width="1.56" height="1.44"/> <rect x="21.01" y="2.58" width="0.99" height="2.04"/> <rect x="20.01" y="3.01" width="1.05" height="2.15"/> <rect x="9.02" y="5.98" width="1.97" height="1.97"/> <rect x="8.03" y="7.04" width="2.06" height="4.95"/> <rect x="7" y="9" width="1.58" height="1.01"/> <rect x="42.08" y="5.98" width="1.91" height="2.01"/> <rect x="43.03" y="7.62" width="0.95" height="3.33"/> <rect x="43.39" y="7.99" width="1.61" height="2.99"/> <rect x="41.94" y="10.01" width="2.08" height="1.99"/> <rect x="9.74" y="10.01" width="32.34" height="1.98"/> <rect x="19.96" y="18.99" width="2.03" height="16.97"/> <rect x="25" y="18.99" width="1.94" height="16.97"/> <rect x="30.98" y="18.99" width="2" height="16.97"/> <rect x="40" y="11.71" width="2.02" height="34.29"/> <rect x="10.99" y="11.71" width="2.06" height="36.29"/> <rect x="11.98" y="47" width="2.01" height="2.01"/> <rect x="13.99" y="48.01" width="24.98" height="1.99"/> <rect x="38.98" y="46" width="2.03" height="2.01"/> <rect x="37.96" y="46.94" width="2.04" height="2.04"/> </svg>')
    ])
  }
}
//plus svg icon
var plusIcon = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M22.5 38V25.5H10v-3h12.5V10h3v12.5H38v3H25.5V38Z"/></svg>')
    ])
  }
}
var boxPlusIcon = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M18.625 31.667V21.375H8.333v-2.75h10.292V8.333h2.75v10.292h10.292v2.75H21.375v10.292Z"/></svg>')
    ])
  }
}
//small plus svg icon
var plusIconSmall = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M9.25 15v-4.25H5v-1.5h4.25V5h1.5v4.25H15v1.5h-4.25V15Z"/></svg>')
    ])
  }
}
//home svg icon
var home = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M8 42V18L24.1 6 40 18v24H28.3V27.75h-8.65V42Z"/></svg>')
    ])
  }
}
//checkmark svg icon
var checkIcon = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m15.792 29.833-9.375-9.375 2-2 7.375 7.417 15.791-15.792 1.959 2Z"/></svg>')
    ])
  }
}
//small checkmark svg icon
var checkIconSmall = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m8.229 14.062-3.521-3.541L5.75 9.479l2.479 2.459 6.021-6L15.292 7Z"/></svg>')
    ])
  }
}
//navigation arrow svg icon
var navigateIcon = {
  view: (vnode)=>{
    return m(".icon",{class:vnode.attrs.class, id:vnode.attrs.id, onclick: async ()=>{
      if(vnode.attrs.click !== undefined){
        await vnode.attrs.click();
      }
    }},[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z"/></svg>')
    ])
  }
}
//shopping cart svg icon
var shoppingCartIcon = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M23.25 17.35V11.2h-6.2v-3h6.2V2.05h3V8.2h6.15v3h-6.15v6.15ZM14.5 44q-1.5 0-2.55-1.05-1.05-1.05-1.05-2.55 0-1.5 1.05-2.55Q13 36.8 14.5 36.8q1.5 0 2.55 1.05 1.05 1.05 1.05 2.55 0 1.5-1.05 2.55Q16 44 14.5 44Zm20.2 0q-1.5 0-2.55-1.05-1.05-1.05-1.05-2.55 0-1.5 1.05-2.55 1.05-1.05 2.55-1.05 1.5 0 2.55 1.05 1.05 1.05 1.05 2.55 0 1.5-1.05 2.55Q36.2 44 34.7 44ZM14.5 33.65q-2.1 0-3.075-1.7-.975-1.7.025-3.45l3.05-5.55L7 7H3.1V4h5.8l8.5 18.2H32l7.8-14 2.6 1.4-7.65 13.85q-.45.85-1.225 1.3-.775.45-1.825.45h-15l-3.1 5.45h24.7v3Z"/></svg>')
    ])
  }
}
var editIcon = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="m39.7 14.7-6.4-6.4 2.1-2.1q.85-.85 2.125-.825 1.275.025 2.125.875L41.8 8.4q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Z"/></svg>')
    ])
  }
}
var confirmIcon = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M18.9 35.7 7.7 24.5l2.15-2.15 9.05 9.05 19.2-19.2 2.15 2.15Z"/></svg>')
    ])
  }
}
var cancelIcon = {
  view: (vnode)=>{
    return m(".icon",vnode.attrs,[
      m.trust('<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"/></svg>')
    ])
  }
}




export{
  loadingImg,
  navBar,
  trashCan,
  checkIcon,
  navigateIcon,
  shoppingCartIcon,
  plusIcon,
  plusIconSmall,
  checkIconSmall,
  trashCanSmall,
  boxPlusIcon,
  popupMenu,
  editIcon,
  confirmIcon,
  cancelIcon
};
