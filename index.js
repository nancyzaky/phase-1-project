const init = () => {
  function fullrecipe(recipe) {
    let stepsList = document.createElement("ul");
    stepsList.classList.add("stepslist");

    stepsList.innerHTML = "";

    console.log(recipe, recipe.id);
    let recipeUrl = `https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=d8f538c223da4aef8b2ec78c600ff003`;

    fetch(recipeUrl)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        data[0].steps.forEach((stepItem) => {
          let stepPara = document.createElement("li");
          stepPara.innerText = stepItem.step;
          let rightModal = document.getElementById("rightmodalcontent");
          stepsList.appendChild(stepPara);
          rightModal.appendChild(stepsList);
        });
      });
  }
  function addToFavList(favItem) {
    fetch("http://localhost:3000/fav", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title: favItem.title,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data));
  }

  function createRecipeDiv(item) {
    let rightModal = document.getElementById("rightmodal");
    rightModal.style.display = "block";
    let rightModalCont = document.getElementById("rightmodalcontent");
    rightModalCont.innerHTML = "";

    let recipe_img = document.createElement("img");
    recipe_img.src = item.image;
    let imageId = item.id;
    let header = document.createElement("h2");
    header.innerText = item.title;

    recipe_img.classList.add("imageId");
    rightmodalcontent.appendChild(header);
    rightmodalcontent.appendChild(recipe_img);
    let headerName = document.getElementById("websiteheader");
    headerName.innerText = "";
    let closeRightModal = document.getElementById("closerightmodal");
    closeRightModal.addEventListener("click", () => {
      rightModal.style.display = "none";
      headerName.innerText = "Recipes On Demand";
    });
    let buttonsDiv = document.createElement("div");
    buttonsDiv.id = "recipeAllButtonsDiv";

    let recipeDetails = document.createElement("button");
    recipeDetails.innerText = "click to see full recipe";
    let favoriteListBtn = document.createElement("button");
    favoriteListBtn.innerText = "Add Recipe To Favorite List";
    favoriteListBtn.id = "favoritebutton";
    recipeDetails.id = "fullrecipebutton";
    buttonsDiv.appendChild(recipeDetails);
    buttonsDiv.appendChild(favoriteListBtn);
    favoriteListBtn.addEventListener("click", () => {
      addToFavList(item);
    });

    rightModal.appendChild(buttonsDiv);
    recipeDetails.addEventListener("click", () => {
      // console.log(item);
      // let stepsList = document.createElement("ul");
      fullrecipe(item);
    });
  }

  const fetchUrl = () => {
    let modal = document.getElementById("modal");
    modal.style.display = "block";
    console.log(modal);
    let menuHeader = document.createElement("h3");
    menuHeader.innerText = "All Recipes";
    let modalContent = document.getElementById("modalContent");
    let closeModal = document.getElementById("close");
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
    let menuList = document.createElement("ul");
    menuList.innerHTML = "";
    menuList.classList.add("recipelist");
    fetch(
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=d8f538c223da4aef8b2ec78c600ff003"
    )
      .then((resp) => resp.json())
      .then((data) => {
        modalContent.innerHTML = "";

        modalContent.appendChild(menuHeader);

        for (let item of data.results) {
          let recipeName = document.createElement("li");
          recipeName.innerText = item.title;
          modalContent.appendChild(recipeName);
          recipeName.addEventListener("click", () => {
            createRecipeDiv(item);
          });
        }
      });
  };
  let dropDownMenu = document.getElementById("recipes-btn");
  dropDownMenu.addEventListener("click", fetchUrl);

  let showList = document.getElementById("fav-btn");
  showList.addEventListener("click", () => {
    let favList = document.getElementById("favoritelist");
    favList.style.display = "block";
    let innerfav = document.getElementById("favoriteitems");
    innerfav.innerHTML = "";
    fetch("http://localhost:3000/fav")
      .then((resp) => resp.json())
      .then((data) => {
        for (let fav of data) {
          let addFav = document.createElement("li");
          addFav.innerText = fav.title;
          innerfav.appendChild(addFav);
        }
      });
    let closefav = document.getElementById("closefav");

    closefav.addEventListener("click", () => {
      favList.style.display = "none";
    });
  });

  let dailyBtn = document.getElementById("daily-btn");
  let dailyDiv = document.getElementById("daily-recipe");
  let dailyDietList = document.getElementById("dietItems");
  dailyBtn.addEventListener("click", () => {
    dailyDiv.style.display = "block";
    fetch(
      "https://api.spoonacular.com/recipes/random?apiKey=d8f538c223da4aef8b2ec78c600ff003"
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.recipes[0]);
        let title = document.getElementById("dailytitle");
        title.innerText = data.recipes[0].title;
        for (let item of data.recipes[0].diets) {
          let dietItem = document.createElement("li");
          dietItem.innerText = item;
          dailyDietList.appendChild(dietItem);
        }
        console.log(data);
        let stepsArr = data.recipes[0].analyzedInstructions[0].steps;
        let listDiv = document.getElementById("daily-steps");
        for (let i of stepsArr) {
          let stepDaily = document.createElement("li");
          stepDaily.innerText = i.step;
          listDiv.appendChild(stepDaily);
        }

        // let dailyImg = document.createElement("img");
        // dailyImg.src = data.recipes[0].image;
        // dailyImg.style = "width: 5px height:50px";
        // dailyDiv.appendChild(dailyImg);
      });
  });
  let closedaily = document.getElementById("daily-recipe-close");
  closedaily.addEventListener("click", () => {
    document.getElementById("daily-recipe").style.display = "none";
  });
};
window.addEventListener("DOMContentLoaded", init);
