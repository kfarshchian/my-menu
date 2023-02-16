const deleteFavoriteHandler = async (event) => {
    event.preventDefault();
    // alert('this works');
    if(event.target.hasAttribute('favorite-id')){
        // alert('this works');
        const recipeId = event.target.getAttribute('favorite-id');
        const response = await fetch('/api/users/favorites',{
            method: 'DELETE',
            body: JSON.stringify({recipe_id: recipeId}),
            headers: { 'Content-Type': 'application/json' },
        });

        if(response.ok){
            // console.log
            window.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document
    .querySelector('.favorites-container')
    .addEventListener('click',deleteFavoriteHandler);