import {readRecipes, getRecipe} from "./apiConnection.js";

const recipeWidget = document.getElementById("recipeWidget");
const recipePath = "../sites/receptsamling.html";

function populatePage(recipes) {

    recipes.forEach(async recipeID => {        
        let recipe = await getRecipe(recipeID)
        let h3 = document.createElement("h3");
        h3.textContent = recipe.name;
        let p = document.createElement("p");
        p.textContent = recipe.portions;
        let img = document.createElement("img");
        img.src = recipe.img_path;
        img.alt = recipe.img_alt;
        let a = document.createElement("a");
        a.href = `${recipePath}?id=${recipeID}`;
        
        a.append(img, h3, p);
        recipeWidget.append(a)
    });
}

async function main(){
    let recipes = await readRecipes();
    populatePage(recipes.sort());
}

main()