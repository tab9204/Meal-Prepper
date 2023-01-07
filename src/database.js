/*********database functionality********/
import "../libraries/pouchdb-7.2.1.js";

//functions for interacting with the database
var database = {
  //db to store all meals
  //each entry is an individual meal that contains:
    //name => name of the meal
    //ingredients => string that contains all ingredients for the meal
    //directions => string that contains all directions for the meal
    //checked => array containing ingredients that have been checked off on the shopping list
  meals: new PouchDB('meals'),
  //stores a list of meals that make up a meal plan
  //each entry is a day in the meal plan that contains:
    //meal_id => id of the meal on that day of the meal plan
    //checked => a boolean for if the day was checked off or not
  mealPlan: new PouchDB("mealPlan"),
  //returns all entries in a specified db
  //db => the database to query
  getAll: async (db)=>{
    var all;
    try{
      all = await db.allDocs({include_docs: true});
      //if the db is empty return an empty array
      if(all.rows.length <= 0){all.rows = [];}
    }
    catch(e){throw new Error(e);}
    return all.rows;
  },
  //returns 1 entry from the specified db
  //db => the database to query
  //id => id of the entry to return
  get: async (db,id)=>{
    var entry;
    try{
      entry = await db.get(id);
    }
    catch(e){
      //if the entry is missing
      if(e.status = 404){
        //return an empty entry
        entry = "";
      }
      else{
        throw new Error(e);
      }    }
    return entry;
  },
  //adds a new entry to the specified db
  //db => the database being added to
  //id => unique id for the new entry
  //data => object containing the data for the new entry
  add: async (db,id,data)=>{
    try{
      //put the id into an object with the proper _id property
      var entry_id = {_id:id};
      //combine the entry_id object and data object into one single objecg
      var new_entry = Object.assign(entry_id, data);
      //put the new entry into the db
      await db.put(new_entry);
    }
    catch(e){throw new Error(e);}
  },
  //updates the data of an entry in a specified db
  //db => the database containing the entry being updated
  //id => id of the entry being updated
  //data => object containing the updated data for the entry
  update: async (db,id,data)=>{
    try{
      //get the entry to be updated from the db so we can get its current _rev property value
      var entry = await db.get(id);
      //create an object containg the updated entry's id and rev properties
      var props = {_id:id, _rev: entry._rev};
      //combine the props and data objects
      var updated_entry = Object.assign(props, data);
      //add the updated entry to the specified db
      await db.put(updated_entry);
    }
    catch(e){throw new Error(e);}
  },
  //deletes an entry from the specified db
  //db = database the entry is being deleted from
  //id => id of the entry to delete
  delete: async (db,id)=>{
    try{
      //get the entry to be deleted from the db
      var entry = await db.get(id);
      //delete the entry from the db
      await db.remove(entry);
    }
    catch(e){
      if(e.status = 404){
        //return an empty entry
        return;
      }
      else{
        throw new Error(e);
      }
    }
  }
}

export{database};
