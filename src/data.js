/**********Data for rendering app views************/
import {database} from './database.js';

//functions for navigating app views
var navigate = {
  toMealPlan: ()=>{
    m.route.set('/plan');
  },
  toMealEdit: ()=>{
    m.route.set('/edit');
  },
  toMealList: ()=>{
    m.route.set('/list');
  },
  toShoppingList: ()=>{
    m.route.set('/shop');
  }
}

export{navigate};
