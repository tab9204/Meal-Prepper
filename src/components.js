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



var trashCan = {
  view: (vnode)=>{
    return m(".icon",{class:vnode.attrs.class, id:vnode.attrs.id, onclick: async ()=>{
      await vnode.attrs.click();
    }},[
      m.trust('<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="10.09" y="5.04" width="32.9" height="1.88"/> <rect x="20.04" y="3.03" width="1.93" height="2.17"/> <rect x="21.78" y="4.02" width="1.2" height="1.34"/> <rect x="21.01" y="1.04" width="1.97" height="1.97"/> <rect x="21.99" width="8.01" height="2.02"/> <rect x="30" y="1.01" width="1.99" height="4.19"/> <rect x="31.42" y="4.02" width="1.56" height="1.44"/> <rect x="21.01" y="2.58" width="0.99" height="2.04"/> <rect x="20.01" y="3.01" width="1.05" height="2.15"/> <rect x="9.02" y="5.98" width="1.97" height="1.97"/> <rect x="8.03" y="7.04" width="2.06" height="4.95"/> <rect x="7" y="9" width="1.58" height="1.01"/> <rect x="42.08" y="5.98" width="1.91" height="2.01"/> <rect x="43.03" y="7.62" width="0.95" height="3.33"/> <rect x="43.39" y="7.99" width="1.61" height="2.99"/> <rect x="41.94" y="10.01" width="2.08" height="1.99"/> <rect x="9.74" y="10.01" width="32.34" height="1.98"/> <rect x="19.96" y="18.99" width="2.03" height="16.97"/> <rect x="25" y="18.99" width="1.94" height="16.97"/> <rect x="30.98" y="18.99" width="2" height="16.97"/> <rect x="40" y="11.71" width="2.02" height="34.29"/> <rect x="10.99" y="11.71" width="2.06" height="36.29"/> <rect x="11.98" y="47" width="2.01" height="2.01"/> <rect x="13.99" y="48.01" width="24.98" height="1.99"/> <rect x="38.98" y="46" width="2.03" height="2.01"/> <rect x="37.96" y="46.94" width="2.04" height="2.04"/> </svg>')
    ])
  }
}

//checkmark svg icon
var checkIcon = {
  view: (vnode)=>{
    return m(".checkIcon",{class:vnode.attrs.class, id:vnode.attrs.id, onclick: async ()=>{
      await vnode.attrs.click();
    }},[
      m.trust('<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <style type="text/css"> .st2{fill:#000000;} .st1{fill:#000000;stroke:#000000;stroke-miterlimit:10;} </style> <rect x="11.39" y="30.56" transform="matrix(0.6107 -0.7918 0.7918 0.6107 -24.9274 25.2201)" class="st2" width="3.6" height="14.81"/> <rect x="30.12" y="0.91" transform="matrix(0.7999 0.6001 -0.6001 0.7999 21.0499 -14.3168)" class="st1" width="3.76" height="47"/> </svg>')
    ])
  }
}

var navigateIcon = {
  view: (vnode)=>{
    return m(".icon",{class:vnode.attrs.class, id:vnode.attrs.id, onclick: async ()=>{
      await vnode.attrs.click();
    }},[
      m.trust('<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="23.1" y="8.65" transform="matrix(0.6631 0.7485 -0.7485 0.6631 22.4351 -11.5083)" width="1.8" height="21.03"/><rect x="12.63" y="31.97" transform="matrix(0.667 0.745 -0.745 0.667 32.1526 -6.3543)" width="21.12" height="1.64"/></svg>')
    ])
  }
}

var shoppingCartIcon = {
  view: (vnode)=>{
    return m(".icon",{class:vnode.attrs.class, id:vnode.attrs.id, onclick: async ()=>{
      await vnode.attrs.click();
    }},[
      m.trust('<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 26.3.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" id="Layer_2_00000030447897787713602610000013023286572561587091_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <style type="text/css"> .st0{fill:none;stroke:#000000;stroke-miterlimit:10;} .st1{stroke:#000000;stroke-width:1;stroke-miterlimit:10.0004;} .st2{stroke:#000000;stroke-miterlimit:10;} .st3{stroke:#000000;stroke-width:1;stroke-miterlimit:9.9997;} .st4{stroke:#000000;stroke-width:1;stroke-miterlimit:10.0002;} .st5{stroke:#000000;stroke-width:1;stroke-miterlimit:10;} .st6{fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10;} .st7{fill:none;stroke:#000000;stroke-width:4;stroke-miterlimit:10;} </style> <g id="Layer_2_00000090983193661010371020000009001160163570147746_"> <g> <rect x="1.8" y="2" class="st0" width="6.4" height="1.8"/> <rect x="12.4" y="2.7" transform="matrix(0.9547 -0.2977 0.2977 0.9547 -5.5501 4.8692)" class="st1" width="1.6" height="35.9"/> <rect x="9.6" y="10.1" class="st2" width="38.2" height="1.7"/> <rect x="34.9" y="20.9" transform="matrix(0.2122 -0.9772 0.9772 0.2122 14.412 60.9856)" class="st3" width="20.2" height="1.3"/> <rect x="16.2" y="30.3" class="st2" width="27.3" height="1.3"/> <polygon class="st2" points="15.4,21.5 43,21.5 43,21.5 "/> <rect x="25" y="12.8" class="st4" width="0" height="16.3"/> <polygon class="st5" points="33.6,29.5 34.7,12.3 34.7,12.3 "/> <rect x="17.5" y="38.2" class="st6" width="23.9" height="0.9"/> <ellipse class="st7" cx="19.2" cy="43.1" rx="4.2" ry="4.4"/> <ellipse class="st7" cx="40.8" cy="43" rx="4.2" ry="4.3"/> </g> <g> <g> <path d="M8.2,2.3c-1.9,0-3.7,0-5.6,0c-0.3,0-0.5,0-0.8,0c0.5,0.5,1,1,1.5,1.5c0-0.6,0-1.2,0-1.8c-0.5,0.5-1,1-1.5,1.5 c1.9,0,3.7,0,5.6,0c0.3,0,0.5,0,0.8,0C7.7,3,7.2,2.5,6.7,2c0,0.6,0,1.2,0,1.8c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5 c0-0.6,0-1.2,0-1.8c0-0.8-0.7-1.5-1.5-1.5c-1.9,0-3.7,0-5.6,0c-0.3,0-0.5,0-0.8,0C1,0.5,0.3,1.2,0.3,2c0,0.6,0,1.2,0,1.8 c0,0.8,0.7,1.5,1.5,1.5c1.9,0,3.7,0,5.6,0c0.3,0,0.5,0,0.8,0c0.8,0,1.5-0.7,1.5-1.5S9,2.3,8.2,2.3z"/> </g> <g> <path d="M18.9,36.1c-0.5,0.2-1,0.3-1.5,0.5c0.6,0.3,1.2,0.7,1.9,1c-3.1-10-6.2-20-9.4-30C9.4,6.2,9,4.8,8.5,3.4 C8.2,4,7.8,4.6,7.5,5.2C8,5,8.5,4.9,9,4.7C8.4,4.4,7.8,4,7.2,3.7c3.1,10,6.2,20,9.4,30c0.4,1.4,0.9,2.8,1.3,4.2 c0.6,1.8,3.5,1,2.9-0.8c-3.1-10-6.2-20-9.4-30c-0.4-1.4-0.9-2.8-1.3-4.2C9.8,2.1,9,1.6,8.2,1.8C7.7,2,7.2,2.2,6.7,2.3 c-0.8,0.2-1.3,1-1,1.8c3.1,10,6.2,20,9.4,30c0.4,1.4,0.9,2.8,1.3,4.2c0.2,0.8,1,1.3,1.9,1c0.5-0.2,1-0.3,1.5-0.5 C21.6,38.4,20.8,35.5,18.9,36.1z"/> </g> <g> <path d="M9.6,13.3c11.1,0,22.3,0,33.4,0c1.6,0,3.2,0,4.8,0c0.8,0,1.5-0.7,1.5-1.5c0-0.6,0-1.1,0-1.7c0-0.8-0.7-1.5-1.5-1.5 c-11.1,0-22.3,0-33.4,0c-1.6,0-3.2,0-4.8,0c-0.8,0-1.5,0.7-1.5,1.5c0,0.6,0,1.1,0,1.7c0,1.9,3,1.9,3,0c0-0.6,0-1.1,0-1.7 c-0.5,0.5-1,1-1.5,1.5c11.1,0,22.3,0,33.4,0c1.6,0,3.2,0,4.8,0c-0.5-0.5-1-1-1.5-1.5c0,0.6,0,1.1,0,1.7c0.5-0.5,1-1,1.5-1.5 c-11.1,0-22.3,0-33.4,0c-1.6,0-3.2,0-4.8,0C7.7,10.3,7.7,13.3,9.6,13.3z"/> </g> <g> <path d="M43.9,30.1c-0.4-0.1-0.8-0.2-1.3-0.3c0.3,0.6,0.7,1.2,1,1.9c1.2-5.8,2.5-11.5,3.8-17.3c0.2-0.8,0.4-1.6,0.5-2.4 c-0.6,0.4-1.2,0.7-1.8,1.1c0.4,0.1,0.8,0.2,1.3,0.3c-0.3-0.6-0.7-1.2-1-1.9c-1.2,5.8-2.5,11.5-3.8,17.3c-0.2,0.8-0.4,1.6-0.5,2.5 C41.7,33,44.5,33.8,45,32c1.2-5.8,2.5-11.5,3.8-17.3c0.2-0.8,0.4-1.6,0.5-2.4c0.2-0.8-0.2-1.7-1-1.9c-0.4-0.1-0.8-0.2-1.3-0.3 c-0.8-0.2-1.7,0.2-1.8,1.1c-1.2,5.8-2.5,11.5-3.8,17.3c-0.2,0.8-0.4,1.6-0.5,2.5c-0.2,0.8,0.2,1.7,1,1.8c0.4,0.1,0.8,0.2,1.3,0.3 C45,33.4,45.8,30.5,43.9,30.1z"/> </g> <g> <path d="M43.5,30c-8,0-16,0-23.9,0c-1.1,0-2.2,0-3.4,0c0.5,0.5,1,1,1.5,1.5c0-0.4,0-0.9,0-1.3c-0.5,0.5-1,1-1.5,1.5 c8,0,16,0,23.9,0c1.1,0,2.2,0,3.4,0c-0.5-0.5-1-1-1.5-1.5c0,0.4,0,0.9,0,1.3c0,1.9,3,1.9,3,0c0-0.4,0-0.9,0-1.3 c0-0.8-0.7-1.5-1.5-1.5c-8,0-16,0-23.9,0c-1.1,0-2.2,0-3.4,0c-0.8,0-1.5,0.7-1.5,1.5c0,0.4,0,0.9,0,1.3c0,0.8,0.7,1.5,1.5,1.5 c8,0,16,0,23.9,0c1.1,0,2.2,0,3.4,0C45.5,33,45.5,30,43.5,30z"/> </g> <g> <path d="M43,20c-8,0-16.1,0-24.1,0c-1.1,0-2.3,0-3.4,0c-0.8,0-1.5,0.7-1.5,1.5l0,0c0,0.8,0.7,1.5,1.5,1.5c8,0,16.1,0,24.1,0 c1.1,0,2.3,0,3.4,0c0.8,0,1.5-0.7,1.5-1.5l0,0c0-1.9-3-1.9-3,0l0,0C42,21,42.5,20.5,43,20c-8,0-16.1,0-24.1,0c-1.1,0-2.3,0-3.4,0 c0.5,0.5,1,1,1.5,1.5l0,0c-0.5,0.5-1,1-1.5,1.5c8,0,16.1,0,24.1,0c1.1,0,2.3,0,3.4,0C44.9,23,44.9,20,43,20z"/> </g> <g> <path d="M25.8,30.6L25.8,30.6c0.8-0.1,1.6-0.6,1.5-1.5c-0.5-4.7-0.9-9.5-1.4-14.2c-0.1-0.7-0.1-1.4-0.2-2.1 c-0.1-0.8-0.6-1.6-1.5-1.5l0,0c-0.8,0.1-1.6,0.6-1.5,1.5c0.5,4.7,0.9,9.5,1.4,14.2c0.1,0.7,0.1,1.4,0.2,2 C24.4,29.9,24.9,30.6,25.8,30.6c0.8,0,1.6-0.7,1.5-1.5c-0.5-4.7-0.9-9.5-1.4-14.2c-0.1-0.7-0.1-1.4-0.2-2.1c-0.5,0.5-1,1-1.5,1.5 l0,0c-0.5-0.5-1-1-1.5-1.5c0.5,4.7,0.9,9.5,1.4,14.2c0.1,0.7,0.1,1.4,0.2,2c0.5-0.5,1-1,1.5-1.5l0,0c-0.8,0.1-1.5,0.6-1.5,1.5 C24.3,29.9,25,30.7,25.8,30.6z"/> </g> <g> <path d="M33.6,31L33.6,31c0.8,0.1,1.5-0.7,1.5-1.5c0.3-5,0.7-10.1,1-15.1c0-0.7,0.1-1.4,0.2-2.2c0.1-0.9-0.7-1.4-1.5-1.5l0,0 c-0.8-0.1-1.5,0.7-1.5,1.5c-0.3,5-0.7,10.1-1,15.1c0,0.7-0.1,1.5-0.2,2.2c-0.1,1.9,2.9,1.9,3,0c0.3-5,0.7-10.1,1-15.1 c0-0.7,0.1-1.4,0.2-2.2c-0.5,0.5-1,1-1.5,1.5l0,0c-0.5-0.5-1-1-1.5-1.5c-0.3,5-0.7,10.1-1,15.1c0,0.7-0.1,1.5-0.2,2.2 c0.5-0.5,1-1,1.5-1.5l0,0C31.6,27.9,31.7,30.9,33.6,31z"/> </g> <g> <path d="M41.5,37.6c-7,0-14,0-21,0c-1,0-2,0-3,0c0.5,0.5,1,1,1.5,1.5c0-0.3,0-0.6,0-0.9c-0.5,0.5-1,1-1.5,1.5c7,0,14,0,21,0 c1,0,2,0,3,0c-0.5-0.5-1-1-1.5-1.5c0,0.3,0,0.6,0,0.9c0,1.9,3,1.9,3,0c0-0.3,0-0.6,0-0.9c0-0.8-0.7-1.5-1.5-1.5c-7,0-14,0-21,0 c-1,0-2,0-3,0c-0.8,0-1.5,0.7-1.5,1.5c0,0.3,0,0.6,0,0.9c0,0.8,0.7,1.5,1.5,1.5c7,0,14,0,21,0c1,0,2,0,3,0 C43.4,40.6,43.4,37.6,41.5,37.6z"/> </g> <g> <path d="M21.9,43.1c0,0.1,0,0.2,0,0.4c0,0.1-0.1,0.3,0,0c0,0.2-0.1,0.4-0.1,0.6c0,0.1-0.1,0.2-0.1,0.3c-0.1,0.2,0.2-0.3,0,0 c-0.1,0.2-0.2,0.4-0.3,0.5c0,0.1-0.2,0.3,0,0c0,0.1-0.1,0.1-0.1,0.2c-0.1,0.1-0.3,0.3-0.4,0.4c-0.3,0.2,0.3-0.2-0.1,0 c-0.1,0-0.1,0.1-0.2,0.1c-0.1,0-0.2,0.1-0.2,0.1c-0.3,0.2,0.2,0-0.1,0c-0.2,0.1-0.4,0.1-0.5,0.2c-0.1,0-0.3,0,0,0 c-0.1,0-0.2,0-0.3,0c-0.2,0-0.4,0-0.5,0c-0.4,0,0.3,0.1-0.1,0c-0.1,0-0.2,0-0.3-0.1c-0.1,0-0.2-0.1-0.3-0.1c-0.2,0,0.3,0.2,0,0 c-0.2-0.1-0.3-0.2-0.5-0.3c-0.1,0-0.2-0.2,0,0c-0.1-0.1-0.1-0.1-0.2-0.2c-0.1-0.1-0.3-0.3-0.4-0.5c0.2,0.3-0.1-0.2-0.2-0.3 c0-0.1-0.3-0.6-0.1-0.3c-0.1-0.2-0.1-0.4-0.2-0.6c0-0.1,0-0.2,0-0.2c-0.1-0.3,0,0.2,0-0.1c0-0.2,0-0.4,0-0.6c0-0.1,0.1-0.5,0-0.1 c0-0.1,0-0.2,0-0.2c0-0.2,0.1-0.4,0.2-0.6c0.1-0.3-0.1,0.2,0,0c0.1-0.1,0.1-0.2,0.2-0.4c0-0.1,0.1-0.1,0.1-0.2 c0,0,0.2-0.3,0.1-0.1c-0.1,0.2,0.1-0.1,0.1-0.1c0.1-0.1,0.1-0.1,0.2-0.2c0.1-0.1,0.1-0.1,0.2-0.2c0.2-0.2,0,0,0,0 c0.2-0.1,0.4-0.2,0.6-0.3c0.2-0.1,0,0,0,0c0.1,0,0.2-0.1,0.3-0.1s0.7-0.1,0.3-0.1c0.2,0,0.4,0,0.5,0c0.1,0,0.2,0,0.3,0 c0.4,0-0.3-0.1,0.1,0c0.2,0.1,0.4,0.1,0.7,0.2c-0.3-0.1-0.1,0,0,0c0.1,0.1,0.2,0.1,0.4,0.2c0.1,0,0.1,0.1,0.2,0.2 c-0.3-0.2,0,0,0,0c0.2,0.2,0.3,0.3,0.5,0.5c-0.2-0.2-0.1-0.1,0,0c0.1,0.1,0.1,0.2,0.2,0.3c0,0.1,0.1,0.2,0.1,0.3 c0.2,0.3-0.1-0.3,0,0.1c0.1,0.2,0.1,0.5,0.2,0.7c0.1,0.3,0,0,0,0C21.9,42.8,21.9,42.9,21.9,43.1c0,0.8,0.7,1.5,1.5,1.5 c0.8,0,1.5-0.7,1.5-1.5c0-2.5-1.5-4.7-3.8-5.5c-2.2-0.8-4.8-0.1-6.2,1.7c-1.6,1.9-1.8,4.7-0.6,6.8c1.2,2.1,3.7,3.2,6.1,2.7 c2.7-0.5,4.4-3.1,4.5-5.7c0-0.8-0.7-1.5-1.5-1.5C22.5,41.6,21.9,42.3,21.9,43.1z"/> </g> <g> <path d="M43.5,43c0,0.1,0,0.2,0,0.4c0,0.3,0,0,0,0c0,0.2-0.1,0.4-0.1,0.6c0,0.1-0.1,0.2-0.1,0.3c0,0,0.1-0.3,0,0 c-0.1,0.2-0.2,0.4-0.3,0.6c-0.2,0.3,0.2-0.1,0,0c-0.1,0.1-0.1,0.1-0.2,0.2c-0.1,0.1-0.3,0.2-0.4,0.4c0.3-0.2-0.2,0.1-0.2,0.1 c-0.1,0-0.1,0.1-0.2,0.1c-0.1,0-0.1,0.1-0.2,0.1c0.2-0.1,0.2-0.1,0.1,0c-0.2,0-0.4,0.1-0.5,0.2c-0.1,0-0.3,0.1,0,0 c-0.1,0-0.2,0-0.3,0c-0.2,0-0.4,0-0.6,0c-0.2,0,0.3,0.1,0,0c-0.1,0-0.2,0-0.3-0.1c-0.1,0-0.2-0.1-0.3-0.1c0,0,0.3,0.1,0,0 c-0.2-0.1-0.3-0.2-0.5-0.3c0,0-0.3-0.2-0.1-0.1c0.2,0.1-0.1-0.1-0.1-0.1c-0.2-0.2-0.3-0.3-0.5-0.5c0.2,0.2,0.1,0.1,0,0 c-0.1-0.1-0.1-0.2-0.2-0.3s-0.3-0.6-0.1-0.2c-0.1-0.2-0.1-0.4-0.2-0.5c0-0.1,0-0.2,0-0.2c-0.1-0.3,0,0.3,0-0.1c0-0.2,0-0.4,0-0.5 c0-0.1,0.1-0.5,0-0.1c0-0.1,0-0.2,0-0.2c0-0.2,0.1-0.4,0.2-0.5c0.1-0.3-0.2,0.3,0-0.1c0-0.1,0.1-0.2,0.2-0.3 c0-0.1,0.4-0.5,0.2-0.2c0.1-0.1,0.2-0.3,0.4-0.4c0.1-0.1,0.2-0.1,0.2-0.2c0.1-0.2-0.3,0.2,0,0c0.2-0.1,0.4-0.2,0.6-0.3 c0.1,0,0.2,0,0,0c0.1,0,0.2-0.1,0.3-0.1c0.1,0,0.2,0,0.2-0.1c0,0,0.4-0.1,0.1,0c-0.2,0,0.1,0,0.2,0c0.1,0,0.2,0,0.3,0 c0.1,0,0.2,0,0.3,0c0.3,0-0.2-0.1,0.1,0c0.2,0.1,0.4,0.1,0.7,0.2c-0.3-0.1-0.1,0,0,0c0.1,0.1,0.2,0.1,0.3,0.2 c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.1,0.1,0,0c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.3,0.3,0.4,0.4c0.2,0.3-0.2-0.3,0,0 c0.1,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.1,0.2,0.2,0.3c0.2,0.3-0.1-0.3,0,0.1c0.1,0.2,0.1,0.4,0.2,0.7c0,0.1,0,0.3,0,0 C43.5,42.7,43.5,42.9,43.5,43c0,0.8,0.7,1.5,1.5,1.5c0.8,0,1.5-0.7,1.5-1.5c0-2.5-1.5-4.6-3.8-5.5c-2.2-0.8-4.8-0.1-6.2,1.7 c-1.5,1.9-1.8,4.6-0.6,6.7c1.2,2.1,3.7,3.2,6.1,2.7c2.7-0.5,4.5-3,4.6-5.7c0-0.8-0.7-1.5-1.5-1.5C44.2,41.5,43.5,42.2,43.5,43z" /> </g> </g> </g> </svg>')
    ])
  }
}

//menu icon used on the meal plan view
var menuIcon = {
  view: (vnode)=>{
    return m(".menuBtn#mainMenu",{onclick: ()=>{
      document.getElementsByClassName("menu")[0].classList.remove("hidden");
    }},[
      m(".dot"),
      m(".dot"),
      m(".dot")
    ])
  }
}

export{lightBox,loadingImg,navBar,pullToReload,trashCan,menuIcon,checkIcon,navigateIcon,shoppingCartIcon};
