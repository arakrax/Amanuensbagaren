// define location of local recipe files
const recipePath = "../recipes/"
// define path for ingredientID lookup
const ingredientIDPath = "../js/ingredientID.json"
// define path for foodID lookup
const foodIDPath = "../js/foodID.json"
// define API path for foodID 
//const foodIDPath = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel"


const recipeList = "../recipes/recipeList.json"

export async function readRecipes() {
    let json = {}
    try {
        const response = await fetch(recipeList)
        if  (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        json = await response.json();
        
    } catch (error) {
        console.error("Caught error:", error.message, "when reading ", recipeList);        
    }
    finally {
        return json;
    }
}

export async function getRecipe(id) {
    let json = {}
    try {
        const response = await fetch(recipePath + id + '.json')
        if  (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        json = await response.json();
        
    } catch (error) {
        console.error("Caught error:", error.message, "when looking up ID ", id, "in ", recipePath);        
    }
    finally {
        return json;
    }
}

export async function getIngredientID(ingredientName) {
    let id = -1;
    try {
        const response = await fetch(ingredientIDPath)

        if  (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        let json = await response.json();
        id = json[ingredientName];
    } catch (error) {
        console.error("Caught error:", error.message, "when looking up ingredientID for ", ingredientName, "in ", ingredientIDPath);
    }
    finally {
        return id;
    }
}


export async function getFoodID(getAll, foodName) {
    let id = -1;
    try {
        const response = await fetch(foodIDPath)

        if  (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        let json = await response.json();
        if (getAll) {
            id = json;
        } else {
        id = json[foodName];
        }
    } catch (error) {
        console.error("Caught error:", error.message, "when looking up foodID for ", foodName, "in ", foodIDPath);
    }
    finally {
        return id;
    }
}


export async function getNutritionalInformation(foodID) {
    // define API path for nutritional information
    const nutritionalInfoPath = `https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/${foodID}/naringsvarden?sprak=1`;
    let json = []
    try {
        const response = await fetch(nutritionalInfoPath)

        if  (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        json = await response.json();
        
    } catch (error) {
        console.error("Caught error:", error.message, "when looking up nutritional information for foodID:", foodID, "in ", nutritionalInfoPath);
    }
    finally {
        return json;
    }
}