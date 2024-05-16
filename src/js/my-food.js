import { addMeal, getAllMeals, deleteMeal, getCategorizedMeals } from "./firebase.js";

import Sortable from './sortable.esm.js';

const commonIngredientsGroups = [
  { //Vegetables
    label: "Vegetables",
    ingredients: [
      {
        name: "Broccoli",
        calories: 55,
        carbs: 11,
        fats: 0.6,
        proteins: 4.2,
        servingSize: 91, // 1 cup chopped broccoli is approximately 91 grams
        servingUnit: "g"
      },
      {
        name: "Lentils",
        calories: 230,
        carbs: 40,
        fats: 0.8,
        proteins: 18,
        servingSize: 1,
        servingUnit: "amount-of-item"
      },
      {
          name: "Spinach",
          calories: 7,
          carbs: 1,
          fats: 0.1,
          proteins: 0.9,
          servingSize: 1,
          servingUnit: "oz"
      },
      {
        name: "Lettuce",
        calories: 5,
        carbs: 1,
        fats: 0.1,
        proteins: 0.5,
        servingSize: 56, // 1 cup shredded lettuce is approximately 56 grams
        servingUnit: "g"
    },
    {
        name: "Onion",
        calories: 44,
        carbs: 10,
        fats: 0.1,
        proteins: 1.1,
        servingSize: 110, // 1 cup chopped onion is approximately 110 grams
        servingUnit: "g"
    },
      {
          name: "Tomato",
          calories: 22,
          carbs: 5,
          fats: 0.2,
          proteins: 1,
          servingSize: 1,
          servingUnit: "amount-of-item"
      },
      {
          name: "Potato",
          calories: 161,
          carbs: 37,
          fats: 0.2,
          proteins: 4.3,
          servingSize: 1,
          servingUnit: "amount-of-item"
      },
      {
          name: "Avocado",
          calories: 234,
          carbs: 12,
          fats: 21,
          proteins: 3,
          servingSize: 1,
          servingUnit: "amount-of-item"
      },
      {
          name: "Carrot",
          calories: 25,
          carbs: 6,
          fats: 0.1,
          proteins: 0.6,
          servingSize: 1,
          servingUnit: "amount-of-item"
      },
    ]
  },
  { //Fruits
    label: "Fruits",
    ingredients: [
      {
        name: "Apple",
        calories: 95,
        carbs: 25,
        fats: 0.3,
        proteins: 0.5,
        servingSize: 1,
        servingUnit: "amount-of-item"
      },
      {
        name: "Cantaloupe",
        calories: 53,
        carbs: 13,
        fats: 0.3,
        proteins: 1.3,
        servingSize: 177, // 1 cup diced cantaloupe is approximately 177 grams
        servingUnit: "g"
    },
    {
        name: "Strawberries",
        calories: 49,
        carbs: 11,
        fats: 0.4,
        proteins: 1,
        servingSize: 152, // 1 cup of sliced strawberries is approximately 152 grams
        servingUnit: "g"
    },
      {
          name: "Frozen Mango",
          calories: 90,
          carbs: 22,
          fats: 0.6,
          proteins: 1.2,
          servingSize: 150,
          servingUnit: "g"
      },
        {
          name: "Orange",
          calories: 62,
          carbs: 15.4,
          fats: 0.2,
          proteins: 1.2,
          servingSize: 1,
          servingUnit: "amount-of-item"
      },
      {
          name: "Grapes",
          calories: 52,
          carbs: 13.8,
          fats: 0.3,
          proteins: 0.6,
          servingSize: 1,
          servingUnit: "cup"
      },
      {
          name: "Banana",
          calories: 105,
          carbs: 27,
          fats: 0.4,
          proteins: 1.3,
          servingSize: 1,
          servingUnit: "amount-of-item"
      },
    ]
  },
  { //Proteins
    label: "Proteins",
    ingredients: [
      {
        name: "Chicken Breast",
        calories: 165,
        carbs: 0,
        fats: 3.6,
        proteins: 31,
        servingSize: 3.5,
        servingUnit: "oz"
      },
      {
        name: "Salmon (Atlantic)",
        calories: 206,
        carbs: 0,
        fats: 10.9,
        proteins: 22,
        servingSize: 3,
        servingUnit: "oz"
      },
      {
        name: "Ground Beef (80% lean)",
        calories: 254,
        carbs: 0,
        fats: 20.3,
        proteins: 17.3,
        servingSize: 3,
        servingUnit: "oz"
      },
      {
        name: "Turkey",
        calories: 135,
        carbs: 0,
        fats: 5,
        proteins: 20,
        servingSize: 100, // 100 grams of turkey
        servingUnit: "g"
      },
      {
        name: "Ham",
        calories: 145,
        carbs: 0,
        fats: 6,
        proteins: 21,
        servingSize: 100, // 100 grams of ham
        servingUnit: "g"
    },
    {
      name: "Bacon",
      calories: 541,
      carbs: 0,
      fats: 42,
      proteins: 37,
      servingSize: 5, // 5 pieces of bacon
      servingUnit: "pieces"
    },
    ]
  },
  { //Bread
    label: "Breads",
    ingredients: [
      {
        name: "Whole Wheat Bread",
        calories: 69,
        carbs: 12,
        fats: 0.9,
        proteins: 3.6,
        servingSize: 32, // Average weight of one slice of whole wheat bread in grams
        servingUnit: "g"
      },
      {
        name: "White Bread",
        calories: 79,
        carbs: 14,
        fats: 1,
        proteins: 2.7,
        servingSize: 25, // Average weight of one slice of white bread in grams
        servingUnit: "g"
      },
      {
        name: "Multigrain Bread",
        calories: 71,
        carbs: 13,
        fats: 1.1,
        proteins: 3.1,
        servingSize: 30, // Average weight of one slice of multigrain bread in grams
        servingUnit: "g"
      },
      {
        name: "Sourdough Bread",
        calories: 80,
        carbs: 15,
        fats: 0.7,
        proteins: 3,
        servingSize: 28, // Average weight of one slice of sourdough bread in grams
        servingUnit: "g"
      },
      {
        name: "Rye Bread",
        calories: 83,
        carbs: 15,
        fats: 1,
        proteins: 2.7,
        servingSize: 32, // Average weight of one slice of rye bread in grams
        servingUnit: "g"
      },
      {
        name: "Brioche Bun",
        calories: 239,
        carbs: 28,
        fats: 12,
        proteins: 6,
        servingSize: 1, // Average weight of one brioche bun in grams
        servingUnit: ""
      },
      {
        name: "Ciabatta Bun",
        calories: 270,
        carbs: 53,
        fats: 2,
        proteins: 10,
        servingSize: 1, // Representing the item itself
        servingUnit: ""
      },
      {
        name: "White Bun",
        calories: 265,
        carbs: 50,
        fats: 3,
        proteins: 9,
        servingSize: 1, // 1 white bun
        servingUnit: ""
      },
    ]
  },
  { //Rice
    label: "Rice",
    ingredients: [
      {
        name: "White Rice (Long Grain)",
        calories: 205,
        carbs: 45,
        fats: 0.4,
        proteins: 4.3,
        servingSize: 158, // 1 cup cooked white rice (long grain) is approximately 158 grams
        servingUnit: "g"
    },
    {
        name: "Brown Rice",
        calories: 216,
        carbs: 45,
        fats: 1.8,
        proteins: 5,
        servingSize: 195, // 1 cup cooked brown rice is approximately 195 grams
        servingUnit: "g"
    },
    {
        name: "Basmati Rice",
        calories: 191,
        carbs: 39,
        fats: 0.4,
        proteins: 4.1,
        servingSize: 158, // 1 cup cooked basmati rice is approximately 158 grams
        servingUnit: "g"
    },
    {
        name: "Jasmine Rice",
        calories: 205,
        carbs: 45,
        fats: 0.4,
        proteins: 4.3,
        servingSize: 158, // 1 cup cooked jasmine rice is approximately 158 grams
        servingUnit: "g"
    },
    {
        name: "Wild Rice",
        calories: 166,
        carbs: 35,
        fats: 0.6,
        proteins: 6.5,
        servingSize: 164, // 1 cup cooked wild rice is approximately 164 grams
        servingUnit: "g"
    },
    ]
  },
  { //Other Starches
    label: "Other Starchy Items",
    ingredients: [
      {
        name: "Pasta (Spaghetti)",
        calories: 220,
        carbs: 43,
        fats: 1.3,
        proteins: 8.1,
        servingSize: 2,
        servingUnit: "oz"
      },
    ]
  },
  { //Oils
    label: "Oils",
    ingredients: [
      {
        name: "Olive Oil",
        calories: 119,
        carbs: 0,
        fats: 13.5,
        proteins: 0,
        servingSize: 1,
        servingUnit: "oz"
    },
    {
      name: "Avocado Oil",
      calories: 124,
      carbs: 0,
      fats: 14,
      proteins: 0,
      servingSize: 1, // 1 tablespoon of avocado oil
      servingUnit: "tbsp"
    },
    {
      name: "Vegetable Oil",
      calories: 120,
      carbs: 0,
      fats: 14,
      proteins: 0,
      servingSize: 1, // 1 tablespoon of vegetable oil
      servingUnit: "tbsp"
    },
    {
      name: "Canola Oil",
      calories: 124,
      carbs: 0,
      fats: 14,
      proteins: 0,
      servingSize: 1, // 1 tablespoon of canola oil
      servingUnit: "tbsp"
    },
    ]
  },
  { //Plant Recplacements
    label: "Plant Replacements",
    ingredients: [
      {
        name: "Soy Milk",
        calories: 131,
        carbs: 8,
        fats: 4.2,
        proteins: 11,
        servingSize: 243, // 1 cup of soy milk is approximately 243 grams
        servingUnit: "g"
      },
      {
        name: "Oat Milk",
        calories: 120,
        carbs: 16,
        fats: 5,
        proteins: 3,
        servingSize: 240, // 1 cup of oat milk is approximately 240 grams
        servingUnit: "g"
      },
      {
        name: "Almond Milk",
        calories: 60,
        carbs: 8,
        fats: 2.5,
        proteins: 1,
        servingSize: 240, // 1 cup of almond milk is approximately 240 grams
        servingUnit: "g"
      },
      {
        name: "Soy Milk (Unsweetened)",
        calories: 80,
        carbs: 4,
        fats: 4,
        proteins: 7,
        servingSize: 240, // 1 cup of unsweetened soy milk is approximately 240 grams
        servingUnit: "g"
      },
      {
        name: "Almond Milk (Unsweetened)",
        calories: 30,
        carbs: 1,
        fats: 2.5,
        proteins: 1,
        servingSize: 240, // 1 cup of unsweetened almond milk is approximately 240 grams
        servingUnit: "g"
      },
      {
        name: "Oat Milk (Unsweetened)",
        calories: 120,
        carbs: 16,
        fats: 5,
        proteins: 3,
        servingSize: 240, // 1 cup of unsweetened oat milk is approximately 240 grams
        servingUnit: "g"
      },
      {
        name: "Coconut Milk (Unsweetened)",
        calories: 45,
        carbs: 1,
        fats: 4.5,
        proteins: 0,
        servingSize: 240, // 1 cup of unsweetened coconut milk is approximately 240 grams
        servingUnit: "g"
      },
      {
        name: "Vegenaise (Soy-Free)",
        calories: 80,
        carbs: 0,
        fats: 9,
        proteins: 0,
        servingSize: 14,
        servingUnit: "g"
      }
    ]
  },
  { //Dairy
    label: "Dairy",
    ingredients: [
      {
        name: "Yogurt (Plain, Low-fat)",
        calories: 154,
        carbs: 17.4,
        fats: 3.4,
        proteins: 13,
        servingSize: 1,
        servingUnit: "amount-of-item"
    },
    {
        name: "Cheese (Cheddar)",
        calories: 113,
        carbs: 0.4,
        fats: 9.3,
        proteins: 6.7,
        servingSize: 1,
        servingUnit: "oz"
    },
    {
        name: "Milk (Whole)",
        calories: 149,
        carbs: 11.7,
        fats: 7.9,
        proteins: 7.7,
        servingSize: 1,
        servingUnit: "amount-of-item"
    },
    {
        name: "Egg",
        calories: 72,
        carbs: 0.4,
        fats: 4.8,
        proteins: 6.3,
        servingSize: 50, // Average weight of one large egg in grams
        servingUnit: "g"
    },
    {
      name: "Butter",
      calories: 102,
      carbs: 0,
      fats: 11.5,
      proteins: 0.1,
      servingSize: "1",
      servingUnit: "tbsp"
    },
    ]
  },
  { //Nuts
    label: "Nuts",
    ingredients: [
      {
        name: "Almonds",
        calories: 579,
        carbs: 21,
        fats: 49.4,
        proteins: 21,
        servingSize: 1,
        servingUnit: "oz"
    },
    {
      name: "Pistachios",
      calories: 562,
      carbs: 28,
      fats: 45,
      proteins: 21,
      servingSize: 100, // 100 grams of pistachios
      servingUnit: "g"
    },
    ]
  },
  { //Other
    label: "Other",
    ingredients: [
      {
        name: "Sugar (Granulated)",
        calories: 49,
        carbs: 12.6,
        fats: 0,
        proteins: 0,
        servingSize: 4.2, // 1 teaspoon of granulated sugar is approximately 4.2 grams
        servingUnit: "g"
      },
    ]
  }
]
//TEMPLATE: 
// {
//   name: "",
//   calories: ,
//   carbs: ,
//   fats: ,
//   proteins: ,
//   servingSize: ,
//   servingUnit: ""
// },

// Initialize Firebase

let allMeals;

let categorizedMeals;

getAllMeals()
  //When all meals are retrieved
  .then(returnedMeals => {
    allMeals = returnedMeals;
  })
  .catch(error => {
    console.error("Error fetching meals:", error);
  });
getCategorizedMeals()
  .then(returnedMeals => {
    categorizedMeals = returnedMeals;
    addSortedGroups();
    document.querySelector("#edit-and-view-meal .status-text").innerHTML = "Meals Retrieved"
    document.querySelector("#edit-and-view-meal .status-text").style.color = "green";
    setTimeout(() => {
      document.querySelector("#edit-and-view-meal .status-text").innerHTML = "";
    }, 3000)
    refreshUserMealsList();
    console.log(allMeals);
  })  
  .catch(error => {
    console.error("Error fetching meals:", error);
  });
let newMealSelectOption = document.getElementById("select-meal-to-edit");

const mealMenu = document.getElementById("add-by-meal-inputs");

const ingredientMenu = document.getElementById("add-by-ingredient-inputs");

//Will hold the meal that is currently being viewed/edited
let selectedMeal = undefined;

let selectedMealId = undefined;

let mealInProgess = {ingredientIterator: 0, calories: 0, carbs: 0, fats: 0, proteins: 0};

document.getElementById("lone-meal-option").checked = true;
//New meal selected to view/edit
document.getElementById("select-meal-to-edit").addEventListener("change", () => {
    selectedMeal = allMeals[newMealSelectOption.value];
    selectedMealId = newMealSelectOption.value;
    resetMealInfo();
    if (selectedMeal) {
      updateMealInfo(selectedMeal);
    }
});
//Delete meal button clicked
document.getElementById("delete-meal-button").addEventListener("click", () => {
  //Confirm meal deletion
  if (confirm(`Are you sure you want to delete meal '${selectedMeal.mealName}'?`)) {
    //Remove it from DB
    deleteMeal(selectedMeal.mealName)
      //After its removed from DB
      .then(() => {
        //Remove item from current list
        allMeals.splice(selectedMealId, 1);

        //Remove it from the sorted list
        for (const key in categorizedMeals) {
          const group = categorizedMeals[key];
          //Iterate through all the meals in the group
          for (let i = 0; i < group.length; i++) {
            //If it is the meal desired to be removed
            if (group[i].position == selectedMealId) {
              //Remove it from this group in the catergorizedMeals object
              group.splice(i, 1);
              break;
            }
          }
        }

        //Reset everything
        document.getElementById("select-meal-to-edit").selectedIndex = 0;
        document.querySelector("#edit-and-view-meal .status-text").innerHTML = "Meal Deleted!";
        document.querySelector("#edit-and-view-meal .status-text").style = "color: red";
        newMealSelectOption.dispatchEvent(new Event("change"));
        addSortedGroups();
        refreshUserMealsList();
      })
      //If something went wrong
      .catch((err) => {
        console.log(err);
        alert("Something went wrong with deleting your meal")
      })
  }
})
//Add by "meal"
document.getElementById("lone-meal-option").addEventListener("change", function () {
    if (this.checked) {
        mealMenu.style.display = "block";
        ingredientMenu.style.display = "none";
    }
});
//Add by "ingredients"
document.getElementById("ingredient-meal-option").addEventListener("change", function () {
    if (this.checked) {
        mealMenu.style.display = "none";
        ingredientMenu.style.display = "block";
    }
    console.log(allMeals)
});
//Add new ingredient menu switch
document.getElementById("add-ingredient-menu-button").addEventListener("click", () => {
  document.getElementById("meal-to-be-added-info").style.display = "none";
  document.getElementById("add-ingredient-menu").style.display = "flex";
})
//Add a new meal (meal)
document.getElementById("add-meal-button").addEventListener("click", () => {
  //Get inputs
  const inputs = {
    mealName: document.getElementById("meal-name-input").value,
    notes: document.getElementById("meal-notes-input").value,
    calories: document.getElementById("meal-calories-input").value,
    carbs: document.getElementById("meal-carbs-input").value,
    fats: document.getElementById("meal-fats-input").value,
    proteins: document.getElementById("meal-protein-input").value,
    position: allMeals.length,
    group: "Uncategorized",
  }
  Object.assign(inputs, {ingredients: [{    
    ingredientName: "Meal",
    calories: inputs.calories,
    carbs: inputs.carbs,
    fats: inputs.fats,
    proteins: inputs.proteins,
    size: 1,
    unit: "amount-of-item",}]
  });
  //Add new meal to DB passing the meal as a solo ingredient
  addMeal(inputs).then( function () {
    allMeals.push(inputs);

    sortMeal(inputs);

    addSortedGroups();

    refreshUserMealsList();

    document.getElementById("add-meal-forum").reset();

    addCommonIngredients();

    document.querySelector("#add-meal > header .status-text").innerHTML = "Meal Added";
    document.querySelector("#add-meal > header .status-text").style.color = "green";
  }
  ).catch((err) => {
    console.log(err);
    document.querySelector("#add-meal > header .status-text").innerHTML = "Error Adding Meal";
    document.querySelector("#add-meal > header .status-text").style.color = "red";
  });
});
//Revert button under add new ingredient (ingredients)
document.querySelector("#add-by-ingredient-inputs #add-ingredient-menu i").addEventListener("click", () => {
  document.getElementById("meal-to-be-added-info").style.display = "block";
  document.getElementById("add-ingredient-menu").style.display = "none";
})
//Add ingredient button (ingredients)
document.getElementById("add-ingredient-button").addEventListener("click", () => {
  //Add ingredient button clicked

  //Get inputs
  const inputs = {
  ingredientName: document.getElementById("ingredient-name-input").value,
  size: document.getElementById("ingredient-size-input").value,
  unit: document.getElementById("ingredient-unit-input").value,
  calories: document.getElementById("ingredient-calories-input").value,
  carbs: document.getElementById("ingredient-carbs-input").value,
  fats: document.getElementById("ingredient-fats-input").value,
  proteins: document.getElementById("ingredient-protein-input").value,
  }
  document.getElementById("add-meal-forum").reset();

  addCommonIngredients();
  //Add it to the current meal total
  addIngredientToMealInProgress(inputs);
  //Return to current meal view
  document.getElementById("meal-to-be-added-info").style.display = "block";
  document.getElementById("add-ingredient-menu").style.display = "none";
})
//Re-scale size
document.getElementById("ingredient-size-input").addEventListener("change", () => {
  scaleIngredient(getChosenIngredient(), document.getElementById("ingredient-size-input").value);
})
//Add a new meal (ingredients)
document.getElementById("add-meal-ingredient-button").addEventListener("click", () => {
  //Assign the name, notes, position, and group to the object.
  Object.assign(mealInProgess, {
    mealName: prompt("What is your new meal's name?"), 
    notes: prompt("Add notes for your new meal."),    
    position: allMeals.length,
    group: "Uncategorized",
  });

  console.log("adding: ",mealInProgess)
  //Add the meal in DB
  addMeal(mealInProgess)
    .then(() => {
      allMeals.push(mealInProgess);
      
      sortMeal(mealInProgess);

      addSortedGroups();

      //Reset the meal in progress
      mealInProgess = {ingredientIterator: 0, calories: 0, carbs: 0, fats: 0, proteins: 0};

      refreshUserMealsList();

      document.getElementById("add-meal-forum").reset();
  
      addCommonIngredients();
      
      //Reset the DOM
      refreshMealInProgress();

      document.getElementById("meal-in-progress-ingredients").innerHTML = "";

      document.querySelector("#add-meal > header .status-text").innerHTML = "Meal Added";
      document.querySelector("#add-meal > header .status-text").style.color = "green";
    }
    ).catch((err) => {
      console.log(err);
      document.querySelector("#add-meal > header .status-text").innerHTML = "Error Adding Meal";
      document.querySelector("#add-meal > header .status-text").style.color = "red";
    });
});
//Add a new categorie
document.querySelector("fieldset i").addEventListener("click", () => {
  //Get the name
  const categorieName = prompt("What would you like to name your new categorie?");
  
  //Insert the HTML
  document.getElementById("all-categories-wrapper").insertAdjacentHTML("afterbegin", 
  `<fieldset><legend>${categorieName}</legend><ul class='meal-categorie' id='${categorieName}'></ul></fieldset>`)

  //Add the new category to the current info
  categorizedMeals[categorieName] = [];

  //Add its sortable properties
  addSortable(document.getElementById(categorieName), categorieName);
})
addCommonIngredients();

function addSortable(element, tag) {
  new Sortable(element,{
    group: 'categorie',
    animation: 150,
    emptyInsertThreshold: 10,
    //When a new item is added to it
    onAdd: function (evt) {
      //Get the meal that was added
      const meal = allMeals[Number(evt.item.id)];

      console.log("On Add: ", meal, evt.item.id);

      //Set its group property to the group that it was added into
      meal.group = tag;

      //Change add it this group in the categorizedMeals object
      categorizedMeals[tag].push(meal);

      //Add it to db
      addMeal(meal).then(() => {
        console.log("meal updated")
      })
      setTimeout(() => {
        refreshUserMealsList();
      }, 200)
    },
    //When a item is removed
    onRemove: function (evt) {
      const meal = allMeals[Number(evt.item.id)];
      const group = categorizedMeals[tag];

      //Iterate through all the meals in the group
      for (let i = 0; i < group.length; i++) {
        //If it is the meal desired to be removed
        if (group[i].mealName == meal.mealName) {
          //Remove it from this group in the catergorizedMeals object
          group.splice(i, 1);
        }
      }
    }
  })
}
function addSortedGroups() {
  const container = document.getElementById("all-categories-wrapper");
  console.log("groups: ",categorizedMeals)
  let htmlString = "";
  //Create DOM for each group
  for (const group in categorizedMeals) {
    //Get the key of the object
    const objectKey = group;
    const object = categorizedMeals[group]
    //Set the html string to the opening of the ul, the id to the key of the object
    htmlString += `<fieldset><legend>${objectKey}</legend><ul class='meal-categorie' id='${objectKey}'>`;
    
    //Foreach meal in the group
    object.forEach(meal => {
      //Add its list item to the string
      htmlString += `<li id=${meal.position}>${meal.mealName}</li>`;
    })

    //Close the tags
    htmlString += "</ul></fieldset>";
  }
  //Set the html
  container.innerHTML = htmlString;

  //Add its sortable properties
  for (const group in categorizedMeals) {
    addSortable(document.getElementById(group), group);
  }
}
//Adds a meal to the categorizedMeal object
function sortMeal(meal) {
  if (categorizedMeals[meal.group] == undefined) {
    categorizedMeals[meal.group] = [meal];
  }
}
function addIngredientToMealInProgress(ingredient) {
  function addNumbers() {
    //Update big numbers
    mealInProgess.calories += Number(ingredient.calories);
    mealInProgess.carbs += Number(ingredient.carbs);
    mealInProgess.fats += Number(ingredient.fats);
    mealInProgess.proteins += Number(ingredient.proteins);
    if (mealInProgess.ingredients == undefined) {
      mealInProgess.ingredients = [];
    }
    //Add the ingredient
    mealInProgess.ingredients.push(ingredient);
  }
  function addDom(ingredient) {
  //Create the html for the ingredient
  document.getElementById("meal-in-progress-ingredients").insertAdjacentHTML("beforeend", `
  <tr id="meal-in-progress-ingredient-${mealInProgess.ingredientIterator}">
    <td>
      <p>${ingredient.ingredientName}</p>
      <i class="fa-solid fa-x" id="remove-ingredient-${mealInProgess.ingredientIterator}"></i>
    </td>
  </tr>
`)

  //Add an event listener to the X
  document.getElementById(`remove-ingredient-${mealInProgess.ingredientIterator++}`).addEventListener("click", (element) => {
    //Assign values
    element = element.target;
    const id = Number(element.id.split("-")[2]) 

    //Remove all DOM
    document.getElementById("meal-in-progress-ingredients").innerHTML = "";

    //Remove the numbers and items from inner state
    removeIngredientFromMealInProgress(id);
    
    //Re-Add all ingredients
    mealInProgess.ingredientIterator = 0;

    mealInProgess.ingredients.forEach(ingredient => {
      addDom(ingredient);
    });
  })
  }

  addNumbers();

  refreshMealInProgress();

  addDom(ingredient);
}
function removeIngredientFromMealInProgress(id) {
  const ingredientToRemove = mealInProgess.ingredients[id];
  //Subtract all the values
  mealInProgess.calories -= ingredientToRemove .calories;
  mealInProgess.carbs -= ingredientToRemove .carbs;
  mealInProgess.fats -= ingredientToRemove .fats;
  mealInProgess.proteins -= ingredientToRemove .proteins;
  const newIngredients = [];
  //Add every ingredient except the one youd like to remove to the new array
  mealInProgess.ingredients.forEach(ingredient => {
    if (ingredient != ingredientToRemove) {
      newIngredients.push(ingredient);
    }
  });
  //set it to the new array
  mealInProgess.ingredients = newIngredients;

  refreshMealInProgress();
}
function refreshMealInProgress() {
  document.getElementById("meal-in-progress-calories-count").innerHTML = "Calories: "+Math.ceil(mealInProgess.calories);
  document.getElementById("meal-in-progress-carbs-count").innerHTML = "Carbs: "+Math.ceil(mealInProgess.carbs);
  document.getElementById("meal-in-progress-fats-count").innerHTML = "Fats: "+Math.ceil(mealInProgess.fats);
  document.getElementById("meal-in-progress-proteins-count").innerHTML = "Proteins: "+Math.ceil(mealInProgess.proteins);
}
function getChosenIngredient() {
  let ids = document.getElementById("select-from-cmn-ingredients").value.split("-");
  return commonIngredientsGroups[Number(ids[0])].ingredients[Number(ids[1])];
}
function addCommonIngredients() {
  let iterator = 0;
  let htmlString = "";
  //For each ingredient group
  commonIngredientsGroups.forEach(ingredientGroup => {
    //Add the OptGroup
    htmlString += `<optgroup label="${ingredientGroup.label}">`;
    let subIterator = 0;
    ingredientGroup.ingredients.forEach(ingredient => {
      htmlString += `<option value="${iterator}-${subIterator++}">${ingredient.name}</option>`
    });
    htmlString += "</optgroup>";
    iterator++;
  });
  document.getElementById("select-from-cmn-ingredients").innerHTML = htmlString;
  document.getElementById("select-from-cmn-ingredients").addEventListener("change", () => {
    const chosenIngredient = getChosenIngredient();
    document.getElementById("ingredient-name-input").value = chosenIngredient.name;
    document.getElementById("ingredient-size-input").value = chosenIngredient.servingSize;
    document.getElementById("ingredient-unit-input").value = chosenIngredient.servingUnit;
    document.getElementById("ingredient-calories-input").value = chosenIngredient.calories;
    document.getElementById("ingredient-carbs-input").value = chosenIngredient.carbs;
    document.getElementById("ingredient-fats-input").value = chosenIngredient.fats;
    document.getElementById("ingredient-protein-input").value = chosenIngredient.proteins;
  })
}
function scaleIngredient(chosenIngredient, newSize) {
  const multiplier = newSize/chosenIngredient.servingSize;
  document.getElementById("ingredient-calories-input").value = Math.ceil(chosenIngredient.calories * multiplier);
  document.getElementById("ingredient-carbs-input").value = Math.ceil(chosenIngredient.carbs * multiplier);
  document.getElementById("ingredient-fats-input").value = Math.ceil(chosenIngredient.fats * multiplier);
  document.getElementById("ingredient-protein-input").value = Math.ceil(chosenIngredient.proteins * multiplier);
}
function resetMealInfo() {
  document.getElementById("meal-info-cals").innerHTML = "";
  document.getElementById("meal-info-carbs").innerHTML = "";
  document.getElementById("meal-info-fats").innerHTML = "";
  document.getElementById("meal-info-proteins").innerHTML = "";
  document.getElementById("meal-info-name").innerHTML = "Select A Meal To View Or Edit";
  document.getElementById("meal-info-notes").innerHTML = "";
  document.getElementById("delete-meal-button").style = "display: none";
  document.querySelector("#ingredient-list tbody").innerHTML = "";
}
function updateMealInfo(selectedMeal) {
    document.getElementById("meal-info-cals").innerHTML = "Calories: " + Math.ceil(selectedMeal.calories);
    document.getElementById("meal-info-carbs").innerHTML = "Carbohydrates: " + Math.ceil(selectedMeal.carbs);
    document.getElementById("meal-info-fats").innerHTML = "Fats: " + Math.ceil(selectedMeal.fats);
    document.getElementById("meal-info-proteins").innerHTML = "Proteins:" + Math.ceil(selectedMeal.proteins);
    document.getElementById("meal-info-name").innerHTML = selectedMeal.mealName;
    document.getElementById("meal-info-notes").innerHTML = selectedMeal.notes;
    document.getElementById("delete-meal-button").style = "display: inline";
    getIngredients(selectedMeal);
}
function getIngredients(selectedMeal) {
    console.log(selectedMeal);
    //Set the ingredients
    const ingredients = selectedMeal.ingredients;
    let iterator = 0;
    ingredients.forEach(ingredient => {
      let unit = "";
      if (ingredient.unit != "amount-of-item") {
        unit = ingredient.unit
      }
      document.querySelector("#ingredient-list tbody").insertAdjacentHTML("beforeend", `
    <tr class="ingredient">
      <td id="ingredient-${iterator}">
        <header>
          <p>${ingredient.size}${unit} ${ingredient.ingredientName}:</p>
          <i class="fa-solid fa-angle-up"></i>
        </header>
        <div class="info-view" style="display: none">
          <div class="macros">
            <p>Cals: ${ingredient.calories}</p>
            <p>Carbs: ${ingredient.carbs}</p>
            <p>Fats: ${ingredient.fats}</p>
            <p>Proteins: ${ingredient.proteins}</p>
          </div>
          <div class="buttons">
            <button id="edit-${iterator}">Edit</button><button id="remove-${iterator}">Remove</button>
          </div>
        </div>
        <div class="info-edit" style="display: none">
          <div class="info-inputs">
            <div>
              <label for="serving-size">Serving Size</label>
              <input type="number" name="serving-size" value="${ingredient.size}" id="serving-size-input-${iterator}"/>
            </div>
            <div>
              <label for="serving-unit">Serving Unit</label>
              <input type="text" name="serving-unit" value="${ingredient.unit}" id="serving-unit-input-${iterator}"/>
            </div>
            <div>
              <label for="cals">Calories</label>
              <input type="number" name="cals" value="${ingredient.calories}" id="calories-input-${iterator}"/>
            </div>
            <div>
              <label for="carbs">Carbohydrates</label>
              <input type="number" name="carbs" value="${ingredient.carbs}" id="carbs-input-${iterator}"/>
            </div>
            <div>
              <label for="fats">Fats</label>
              <input type="number" name="fats" value="${ingredient.fats}" id="fats-input-${iterator}"/>
            </div>
            <div>
              <label for="proteins">Proteins</label>
              <input type="numb" name="proteins" value="${ingredient.proteins}" id="proteins-input-${iterator}""/>
            </div>
          </div>
          <button id="done-${iterator}">Done</button>
        </div>
      </td>
    </tr>`)
    document.querySelector(`#ingredient-${iterator}`).addEventListener("click", (element) => {
      element = element.target;
      let id = element.id.split("-")[1];
      const currentIngredient = selectedMeal.ingredients[id]; 

      //If they clicked the edit button
      if (element.id == `edit-${id}`) {
        document.querySelector(`#ingredient-${id} .info-view`).style = "display: none";
        document.querySelector(`#ingredient-${id} .info-edit`).style = "display: block";

      //If they clicked the delete button
      } else if (element.id == `remove-${id}`) {
        
        //Remove the macros from the current meal, round up
        selectedMeal.calories = Math.ceil(Number(selectedMeal.calories) - Number(currentIngredient.calories));
        selectedMeal.carbs = Math.ceil(Number(selectedMeal.carbs) - Number(currentIngredient.carbs));
        selectedMeal.fats = Math.ceil(Number(selectedMeal.fats) - Number(currentIngredient.fats));
        selectedMeal.proteins = Math.ceil(Number(selectedMeal.proteins) - Number(currentIngredient.proteins));
        
        //Remove the ingredient
        selectedMeal.ingredients.splice(id, 1);

        //Remove the old meal from DB
        deleteMeal(selectedMeal.mealName)
        .then(() => {
          console.log("deleted "+selectedMeal.mealName)
        })
        .finally(() => {
          //Add the new one when the other one is finished being deleted
          addMeal(selectedMeal).then(() => {
            console.log("added",selectedMeal)
            //Reset everything
            document.getElementById("select-meal-to-edit").selectedIndex = 0;
            document.querySelector("#edit-and-view-meal .status-text").innerHTML = "Ingredient Deleted";
            document.querySelector("#edit-and-view-meal .status-text").style = "color: red";
            newMealSelectOption.dispatchEvent(new Event("change"));
            refreshUserMealsList();
            })
        })
        
      //If they clicked "done" under the edit menu
      } else if (element.id == `done-${id}`) {
        const editInputs = getEditMealInputs(id);
        const macroDifference = calcMacroDifference(currentIngredient, editInputs);

        //Set the values of the current ingredient to the inputted new values.
        currentIngredient.calories = Number(editInputs.calories);
        currentIngredient.carbs = Number(editInputs.carbs);
        currentIngredient.fats = Number(editInputs.fats);
        currentIngredient.proteins = Number(editInputs.proteins);
        currentIngredient.size = editInputs.size;
        currentIngredient.unit = editInputs.unit;

        //Change the total macros of the meal
        selectedMeal.calories = Math.ceil(Number(selectedMeal.calories) - Number(macroDifference.calories));
        selectedMeal.carbs = Math.ceil(Number(selectedMeal.carbs) - Number(macroDifference.carbs));
        selectedMeal.fats = Math.ceil(Number(selectedMeal.fats) - Number(macroDifference.fats));
        selectedMeal.proteins = Math.ceil(Number(selectedMeal.proteins) - Number(macroDifference.proteins));
        //Remove the old meal from DB
        deleteMeal(selectedMeal.mealName)
          .finally(() => {
          //Add the edited meal to DB
          addMeal(selectedMeal);
          })
        
        //Reset everything
        document.getElementById("select-meal-to-edit").selectedIndex = 0;
        document.querySelector("#edit-and-view-meal .status-text").innerHTML = "Ingredient Edited!";
        document.querySelector("#edit-and-view-meal .status-text").style = "color: orange";
        newMealSelectOption.dispatchEvent(new Event("change"));
        refreshUserMealsList();
      } else {
        while (id == undefined || id == "") {
          id = element.parentNode.id.split("-")[1];
          element = element.parentNode;
        }
        if (document.querySelector(`#ingredient-${id} .info-view`).style.display == "none") {
          //Menu not expanded
          if (document.querySelector(`#ingredient-${id} .info-edit`).style.display == "none") {
            document.querySelector(`#ingredient-${id} header i`).classList = "fa-solid fa-angle-down";
            document.querySelector(`#ingredient-${id} .info-view`).style = "display: block";
          }
        } else {
          console.log(document.querySelector(`#ingredient-${id} .info-view`).style.display);
          //Menu expanded
          document.querySelector(`#ingredient-${id} header i`).classList = "fa-solid fa-angle-up";
          document.querySelector(`#ingredient-${id} .info-view`).style = "display: none";
          document.querySelector(`#ingredient-${id} .info-edit`).style = "display: none";
        } 
      }
    })
    iterator++;
    });
    if (iterator == 0) {
      document.querySelector("#ingredient-list tbody").innerHTML = "";
    }
}
function refreshUserMealsList() {
  const displayedMeals = [...document.querySelectorAll("#edit-and-view-meal option:not(:first-of-type)")];
    displayedMeals.forEach(element => {
      element.remove();
    });
    let htmlString = "<option value='undefined'>Select A Meal</option>";
    //For each meal group
    for (const object in categorizedMeals) {
      const group = categorizedMeals[object];
      if (group && group.length) {
      //Add the OptGroup
      htmlString += `<optgroup label="${object}">`;

      //Add the options
      group.forEach(meal => {
        htmlString += `<option value="${meal.position}">${meal.mealName}</option>`
      });
      htmlString += "</optgroup>";
    }
    document.getElementById("select-meal-to-edit").innerHTML = htmlString;
    }
}
function getEditMealInputs(id) {
  return {
    calories: document.querySelector(`#calories-input-${id}`).value, 
    carbs: document.querySelector(`#carbs-input-${id}`).value,
    fats: document.querySelector(`#fats-input-${id}`).value,
    proteins: document.querySelector(`#proteins-input-${id}`).value,
    size: document.querySelector(`#serving-size-input-${id}`).value,
    unit: document.querySelector(`#serving-unit-input-${id}`).value,
  }
}
function calcMacroDifference(macros1, macros2) {
  console.log(macros1, macros2)
  console.log(Number(macros1.calories) - Number(macros2.calories))
  return {
    calories: (Number(macros1.calories) - Number(macros2.calories)),
    carbs: (Number(macros1.carbs) - Number(macros2.carbs)),
    fats: (Number(macros1.fats) - Number(macros2.fats)),
    proteins: (Number(macros1.proteins) - Number(macros2.proteins)),
  }
}
//Unfinished!!!!
// async function editIngredientFromDb(info, ingredientName) {
//   const docRef = doc(db, "users", username, "meals", selectedMeal, "ingredients", ingredientName);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     await setDoc(docRef, {
//       calories: info.calories,
//       carbs: info.carbs,
//       fats: info.fats,
//       proteins: info.proteins,
//       servingSize: info.servingSize,
//       servingUnit: info.servingUnit,
//     })
//   } else {
//     alert("meal doesent exist (somehow)");
//   }
// }
