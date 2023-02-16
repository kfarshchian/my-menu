
const apiId = 'a4effe10';
const apiKey = 'f944412b3011c0f498d615d4abf9bcf6';
let submitButton = document.getElementById("search");

const imageSize = 1;




submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    $('.columns').remove();
});


submitButton.addEventListener('click', async function(event) {
    event.preventDefault();
    let diet = document.getElementById("diet").value;
    let health = document.getElementById("health").value;
    let cuisineType = document.getElementById("cuisineType").value;
    let mealType = document.getElementById("mealType").value;
    let calories = document.getElementById("calories").value;
    let keyword = document.getElementById("keyword").value;

    let apiURL = [`https://api.edamam.com/api/recipes/v2?type=public&q=${keyword}&app_id=${apiId}&app_key=${apiKey}`];
   

    if (diet !== ""){
        apiURL.push(`&diet=${diet}`)
    }
    if(health !== ""){
        apiURL.push(`&health=${health}`)
    }
    if(cuisineType !== ""){
        apiURL.push(`&cuisineType=${cuisineType}`)
    }
    if(mealType !== ""){
        apiURL.push(`&mealType=${mealType}`)
    }
    if(calories !== ""){
        apiURL.push(`&calories=${calories}`)
    }
    if(imageSize !== ""){
        apiURL.push(`&imageSize=THUMBNAIL`)
    }

    // console.log(apiURL.join(''));
    
    const apiResponse = await (await (fetch(apiURL.join('')))).json();
    const hits = apiResponse.hits;

    // console.log(hits);

    const recipies = [];
    //loop through array and descructure array 
    hits.forEach(hit => {
        const recipeData = hit.recipe;
        const recipe = {};
        recipe.calories = Math.round(recipeData.calories),
        recipe.cuisine_type = recipeData.cuisineType,
        recipe.health_labels = recipeData.healthLabels,
        recipe.image = recipeData.image,
        recipe.ingredients = recipeData.ingredientLines,
        recipe.label = recipeData.label,
        recipe.meal_type = recipeData.mealType,
        recipe.url = recipeData.url,
        recipe.yield = recipeData.yield
        recipies.push(recipe);
    });
    console.log(recipies)
    // console.log(recipies[0].)

    // console.log(JSON.stringify(recipies));

    localStorage.setItem("search_results", JSON.stringify(recipies));

    generateHTML(recipies);

    // await fetch('/search',{
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json' }
    // })
});
    
const generateRecipe = function (newRecipes, i) {
    return `
    <div class="columns" id="allCard">
        <div class="column body" id="inner-card">
             <div class="columns card-header-title">
                <img class="thumbnail"src="${newRecipes[i].image}" />
                <p class="column">
                    Recipe: <span id="label">${newRecipes[i].label}</span>
                </p>
                <p class="column">
                    Calories: <span id="calories">${Math.round(newRecipes[i].calories)}</span>
                </p>
                <p class="column">
                    Cuisine type: <span id="cuisine-type">${newRecipes[i].cuisine_type}</span>
                </p>
                <p class="column">
                    Servings: <span id="yield">${newRecipes[i].yield}</span>
                </p>
                <p class="column">
                    Meal Type: <span id="meal-type">${newRecipes[i].meal_type}</span>
                </p>
            </div>
            <div class="columns card-header-title" id="inner-card>
                <p class="column" id="health-labels">
                    Health Label: <span class="scroll" id="health-labels">${newRecipes[i].health_labels}</span>
                </p>
                <p class="column" id="ingredients">
                    Ingredients: <span class="scroll" id="ingredients">${newRecipes[i].ingredients}</span>
                </p>
                <p class="column">
                    Link to Recipe: <span id="url">${newRecipes[i].url}</span>
                </p>
            </div>
            <div class="save-form" id="savebtn">
                <button class="button is-primary" btn-id="${i}" type="save">Save</button>
            </div>
        </div>
    </div>
    `;
}

generateHTML = (recipies) => {
    // console.log(recipies[0].label);
    let allRecipes = []; 
    
    for (let i = 0; i < recipies.length; i++) {
        const newRecipes = recipies;
        const recipeHtml = generateRecipe(newRecipes, i);
        allRecipes.push(recipeHtml);
    }
    $('#results-container').append(allRecipes)
    // console.log(allRecipes);
}

const recipeFavoriteFormHandler = async (event) => {
    event.preventDefault();
    // alert('here');
    // alert(JSON.stringify(event.target.getAttribute('class')));
    // console.log(event.target.getAttribute('class'));
    if(event.target.getAttribute('btn-id')){
        // alert('here');
        // const label = event.target
        $(event.target).hide();
        const recipe_index = event.target.getAttribute('btn-id');
        const recipe = JSON.parse(localStorage.getItem('search_results'))[recipe_index];
        // console.log(recipe);
        const response = await fetch('/api/users/favorites',{
            method: 'POST',
            body: JSON.stringify(recipe),
            headers: { 'Content-Type': 'application/json' }
        })

        console.log(response);
        if(response.redirected){
            document.location.replace('/login')
            return;
        }

        if(response.ok){
            
        } else {
            alert('You already have this saved')
        }
        // console.log(response);
    }

}

document
    .querySelector('#results-container')
    .addEventListener('click',recipeFavoriteFormHandler);

