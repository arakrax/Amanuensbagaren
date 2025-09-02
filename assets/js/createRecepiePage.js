import { getRecipe, getFoodID, getIngredientID, getNutritionalInformation } from "./apiConnection.js";

const nutritionalElements = ['ENERC', 'FAT', 'FASAT', 'CHO', 'SUGAR', 'FIBT', 'PROT', 'NACL']
const nutritionalLabels   = {'ENERC (kJ)' : 'Energi (kJ)','ENERC (kcal)' : 'Engergi (kcal)', 'FAT' : 'Fett', 'FASAT' : '- varav mättat fett', 'CHO' : 'Kolhydrater', 'SUGAR' : '- varav sockerarter', 'FIBT' : 'Fiber', 'PROT' : 'Protein', 'NACL' : 'Salt'}  
let nutritionalTableColumnCounter = 2;

function removeFoodColumn(columnClass) {
    let column = document.getElementsByClassName(columnClass)

    for (let i = column.length - 1; i >= 0; i--) {
        column[i].remove()
    }

}

function summariseNutritionalInformation(nutInfo) {
    let nutritionalInformation = {  "ENERC (kcal)": 0, 
        "ENERC (kJ)": 0, 
        "FAT": 0, 
        "FASAT": 0,
        "CHO":0,
        "SUGAR": 0,
        "FIBT": 0,
        "PROT": 0,
        "NACL": 0}

    nutInfo.forEach(element => {
        if(nutritionalElements.includes(element.euroFIRkod)){
            if(element.euroFIRkod == "ENERC" && element.enhet == "kJ") {
                nutritionalInformation["ENERC (kJ)"] += Number(element.varde);
            }
            else if(element.euroFIRkod == "ENERC" && element.enhet == "kcal") {
                nutritionalInformation["ENERC (kcal)"] += Number(element.varde);
            }
            else {
                nutritionalInformation[element.euroFIRkod] += Number(element.varde);
            }
        }   
    });

    return nutritionalInformation;
}

async function nutritionalWidgetAddFood(thead, tbody, tfoot, food, foodID) {
    let nutInfo = await getNutritionalInformation(foodID);
    nutInfo = summariseNutritionalInformation(nutInfo);

    let columnClass = "col-" + nutritionalTableColumnCounter;

    let tr = thead.children[0];
    let th = document.createElement("th");
    th.textContent = food;
    th.classList.add(columnClass);
    tr.append(th);

    for (let i=0; i < tbody.children.length; i++) {
        let td = document.createElement("td");
        td.textContent = (nutInfo[Object.keys(nutritionalLabels)[i]] || 0).toFixed(2);
        td.classList.add(columnClass);
        tbody.children[i].append(td);
    };

    let td = document.createElement("td");
    td.classList.add(columnClass);
    let removeButton = document.createElement("input");
    removeButton.type = "button";
    removeButton.value = "Ta bort";
    removeButton.addEventListener('click', () => {
        removeFoodColumn(columnClass);
    });
    
    td.append(removeButton);
    tfoot.children[0].append(td);
    nutritionalTableColumnCounter++;
}

async function createNutritionalWidget(name, nutritionalInformation, totalWeight) {
    // Find the widget handle
    const widget = document.getElementById("nutritional-widget");
    // Create widget heading, populate with text and add to the widget
    const heading = document.createElement("h3");
    heading.textContent = "Näringsvärde per 100g*";

    // Create a div container for the table
    const div = document.createElement("div")
    div.classList.add("table-container")

    // Create the table to hold nutritional information
    const table  = document.createElement("table");

    // Create and populate the header
    let header = ["Näringsvärde", name]
    const thead  = document.createElement("thead");
    let tr = document.createElement("tr");
    header.forEach(element => {
        const th = document.createElement("th");
        th.textContent = element;
        tr.append(th);
    });
    thead.append(tr);
    
    
    // Create and populate the body
    const tbody  = document.createElement("tbody");
    Object.entries(nutritionalLabels).forEach(([key, value]) => {
        tr = document.createElement("tr");
        let th = document.createElement("th");
        th.textContent = value;
        if (value[0] == '-') {
            th.classList.add("subHeader");
        }
        tr.append(th);
        let td = document.createElement("td");
        td.textContent = (nutritionalInformation[key] || 0).toFixed(2);
        tr.append(td);
        tbody.append(tr);
    });


    // Create and popluate the table footer
    const tfoot = document.createElement("tfoot");
    tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = "Totalt vikt";
    const td = document.createElement("td");
    td.textContent = totalWeight.toFixed(0) + "g";
    tr.append(th, td);
    tfoot.append(tr);

    // Add content and table to the widget
    table.append(thead, tbody, tfoot);
    div.append(table);


    // Fetch the available options for comparison
    let foods = await getFoodID(true);
    // Extract the keys and sort them a->z
    let names = Object.keys(foods).sort();

    // Create the form for searching/adding columns
    const form  = document.createElement("form");
    const label = document.createElement("label");
    label.textContent  = "Sök och välj ett bröd att jämföra med:";

    const input = document.createElement("input");
    input.type  = "text";
    input.setAttribute("list", "availableFoods");

    const datalist = document.createElement("datalist");
    datalist.id = "availableFoods";
    
    names.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        datalist.append(option);    
    });

    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Lägg till";

    form.append(label, input, datalist, submitButton);

    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = "https://www.livsmedelsverket.se/om-oss/psidata/livsmedelsdatabasen/#Licens";
    a.target = "_blank";
    a.textContent = "Livsmedelsverkets öppna API"
 
    p.append("*Näringsinneåll hämtas från ", a, ", publicerat under Creative Commons Erkännande 4.0.");

    widget.append(heading, div, form, p);



    // add a listener to the submit button
    form.addEventListener('submit', async (event) => {
        // prevent page reload
        event.preventDefault();
        // get value from input
        const selectedFood = input.value;
        // get foodID
        let foodID = await getFoodID(false, selectedFood);
        // if food id does not exist, do not add column
        if (foodID) {
            // add food to table
            nutritionalWidgetAddFood(thead, tbody, tfoot, selectedFood, foodID);
        };
        // clear input field
        input.value = "";
    });
}



async function calculateNutritionalInformation(ingredients) {
    let nutritionalInformation = {  "ENERC (kcal)": 0, 
                                    "ENERC (kJ)": 0, 
                                    "FAT": 0, 
                                    "FASAT": 0,
                                    "CHO":0,
                                    "SUGAR": 0,
                                    "FIBT": 0,
                                    "PROT": 0,
                                    "NACL": 0}
    let totalWeight = 0;

    // summarise nutritional information for all ingredients
    for (const ingredient of ingredients) {
        totalWeight += Number(ingredient.quantity);
        let foodID = await getIngredientID(ingredient.item);
        let nutInfo = await getNutritionalInformation(foodID);

        nutInfo.forEach(element => {
                if(nutritionalElements.includes(element.euroFIRkod)){
                if(element.euroFIRkod == "ENERC" && element.enhet == "kJ") {
                    nutritionalInformation["ENERC (kJ)"] += Number(element.varde) / 100 * Number(ingredient.quantity);
                }
                else if(element.euroFIRkod == "ENERC" && element.enhet == "kcal") {
                    nutritionalInformation["ENERC (kcal)"] += Number(element.varde) / 100 * Number(ingredient.quantity);
                }
                else {
                    nutritionalInformation[element.euroFIRkod] += Number(element.varde) / 100 * Number(ingredient.quantity);
                }
            }   
        });
    };

    // normalise to per 100g
    for (const key in nutritionalInformation) {
        if (totalWeight > 0) {
            nutritionalInformation[key] = (nutritionalInformation[key] / totalWeight) * 100;
        } else {
            nutritionalInformation[key] = 0;
        }
    }


    return {nutritionalInformation, totalWeight};
}


async function populateRecipePage(id) {
    let recipeData = await getRecipe(id);

    // Enter all static text/paths
    document.title = recipeData.name + " " + document.title;
    document.getElementById('name').textContent         = recipeData.name;
    document.getElementById('description').textContent  = recipeData.description;
    document.getElementById('img').src                  = recipeData.img_path;
    document.getElementById('img').alt                  = recipeData.img_alt;
    document.getElementById('portions').textContent     = recipeData.portions;
    document.getElementById('prep_time').textContent    = recipeData.prep_time;
    document.getElementById('rise_time').textContent    = recipeData.rise_time;
    document.getElementById('bake_time').textContent    = recipeData.bake_time;

    // Add the ingredients line by line in the table
    const ingredientsTable = document.getElementById('ingredients');
    recipeData.ingredients.forEach(element => {
        const newRow = ingredientsTable.insertRow();
        const itemCell = newRow.insertCell();
        const qtyCell = newRow.insertCell();
        itemCell.textContent = element.item;
        qtyCell.textContent = element.quantity + " " + element.unit;
    });

    // Add the instructions step by step in an ordered list
    const instructionsList = document.getElementById('instructions');
    recipeData.instructions.forEach(element => {
        const newListItem = document.createElement('li');
        newListItem.textContent = element;
        instructionsList.append(newListItem);
    });

    let {nutritionalInformation, totalWeight} = await calculateNutritionalInformation(recipeData.ingredients);

    createNutritionalWidget(recipeData.name, nutritionalInformation, totalWeight);
}



function main() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    populateRecipePage(urlParams.get('id'));
}



main()
