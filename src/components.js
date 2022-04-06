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
    return m('.lightBox.closed',{id: vnode.attrs.id} ,[
      m(".lightBoxText",vnode.attrs.text),
      m(".lightBoxButtons",[
        vnode.attrs.buttons.map((button)=>{
          return m(".lightBoxBtn",{onclick: ()=>{
            button.click(vnode.attrs.vnode);
          }}, button.text)
        })
      ])
    ])
  }
}



export{lightBox};
