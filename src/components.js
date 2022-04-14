/*****view components****/
//import {data} from './data.js'

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
              button.click(vnode.attrs.vnode);
            }}, button.text)
          })
        ])
      ])
    ])
  }
}

//loading gif
//if the icon is not hidden on the page will hide iself after X seconds
var loadingImg = {
  view: (vnode)=>{
    return m("#loadingImg",[
      m("img",{src:"./assets/loading.gif"})
    ])
  }
}



export{lightBox,loadingImg};
