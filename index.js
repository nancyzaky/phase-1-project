const init = () => {
  //get full recipe steps
  function fullrecipe(recipe) {
    let stepsList = document.createElement("ul");
    stepsList.classList.add("stepslist");

    stepsList.innerHTML = "";

    console.log(recipe);
    let recipeUrl = `https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=Api-key`;

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
  // fav array to not repeat the favorite items rendered
  let favArr = [];
  function addToFavList(favItem) {
    console.log(favArr);
    if (!favArr.includes(favItem.title)) {
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
    favArr.push(favItem.title);
  }

  //full recipe with pic steps/ fav and full list buttons
  function createRecipeDiv(item) {
    document.getElementById("dailyheaderone").innerText = "";
    document.getElementById("dailyheadertwo").innerText = "";
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
      document.getElementById("dailyheaderone").innerText =
        "Every Second we post a new recipe, try it, and let us know what you think!";
      document.getElementById("dailyheadertwo").innerText =
        "Click To View Our Recipe Of The Day";
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
      fullrecipe(item);
    });
  }

  const fetchUrl = () => {
    let modal = document.getElementById("modal");
    modal.style.display = "block";
    console.log(modal);
    let menuHeader = document.createElement("h2");
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
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=Api-key"
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
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
    document.getElementById("dailyheaderone").innerText = "";
    document.getElementById("dailyheadertwo").innerText = "";
    favList.style.display = "block";
    let innerfav = document.getElementById("favoriteitems");
    innerfav.innerHTML = "";
    fetch("http://localhost:3000/fav")
      .then((resp) => resp.json())
      .then((data) => {
        debugger;
        for (let fav of data) {
          let addFav = document.createElement("li");
          addFav.innerText = fav.title;
          innerfav.appendChild(addFav);
        }
      });
    let closefav = document.getElementById("closefav");

    closefav.addEventListener("click", () => {
      favList.style.display = "none";
      document.getElementById("dailyheaderone").innerText =
        "Every Second we post a new recipe, try it, and let us know what you think!";
      document.getElementById("dailyheadertwo").innerText =
        "Click To View Our Recipe Of The Day";
    });
  });

  let dailyBtn = document.getElementById("daily-btn");
  let dailyDiv = document.getElementById("daily-recipe");
  let dailyDietList = document.getElementById("dietItems");
  dailyBtn.addEventListener("click", () => {
    dailyDiv.style.display = "block";

    fetch(
      "https://api.spoonacular.com/recipes/random?apiKey=Api-key"
    )
      .then((resp) => resp.json())
      .then((data) => {
        let dailyCont = document.getElementById("daily-recipe-cont");
        dailyCont.innerHTML = "";
        let title = document.createElement("h5");
        title.id = "dailytitle";
        title.innerText = data.recipes[0].title;
        dailyCont.appendChild(title);
        let dietList = document.createElement("ul");
        dailyCont.appendChild(dietList);
        for (let item of data.recipes[0].diets) {
          let dietItem = document.createElement("li");
          dietItem.innerText = item;
          dietList.appendChild(dietItem);
        }
        let stepsArr = data.recipes[0].analyzedInstructions[0].steps;
        let listDiv = document.createElement("ul");
        listDiv.id = "daily-steps";
        dailyCont.appendChild(listDiv);

        for (let i of stepsArr) {
          let stepDaily = document.createElement("li");
          stepDaily.innerText = i.step;
          stepDaily.id = "step";
          listDiv.appendChild(stepDaily);
        }
        let btnFav = document.createElement("button");
        btnFav.id = "daily-fav-btn";
        btnFav.innerText = "Add To Favorite List";
        dailyCont.appendChild(btnFav);
        btnFav.addEventListener("click", () => {
          let newFav = data.recipes[0];

          addToFavList(newFav);
        });
      });
  });
  let closedaily = document.getElementById("daily-recipe-close");
  closedaily.addEventListener("click", () => {
    document.getElementById("daily-recipe").style.display = "none";
  });

  let formSubmit = document.getElementById("submitForm");
  console.log(formSubmit);
  formSubmit.addEventListener("submit", (e) => {
    e.preventDefault();
    let newComment = e.target[1].value;
    let newName = e.target[0].value;
    let timePosted = new Date() + "";
    console.log(timePosted);
    fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: newName,
        comment: newComment,
        time: timePosted,
      }),
    });
    fetchComments();
  });
  let idArr = [];
  function fetchComments() {
    fetch("http://localhost:3000/comments")
      .then((resp) => resp.json())
      .then((data) => {
        data.forEach((item) => {
          if (idArr.indexOf(item.id) === -1) {
            let comment = document.getElementById("commentsSection");
            let name = document.createElement("p");
            name.innerText = `${item.name} said: \n ${item.comment} \n ${item.time}`;
            idArr.push(item.id);
            comment.appendChild(name);
          }
        });
      });
  }
  fetchComments();

  //search recipes by ingredienst:
  function searchIngredients(arr) {
    const searchUrl =
      "https://api.spoonacular.com/recipes/findByIngredients?apiKey=Api-key3&ingredients=";

    let word = arr.join(",+");
    console.log(word);
    const fullUrl = searchUrl + word;
    console.log(fullUrl);
    return fullUrl;
  }
  let searchResult = document.getElementById("search");
  searchResult.addEventListener("submit", (e) => {
    e.preventDefault();
    let itemsArr = [];
    let result = e.target[0].value;
    let resultTwo = e.target[1].value;
    let resultThree = e.target[2].value;
    let resultFour = e.target[3].value;
    itemsArr.push(result, resultTwo, resultThree, resultFour);
    console.log(itemsArr);
    let resultVal = searchIngredients(itemsArr);
    console.log(resultVal);
    fetch(resultVal)
      .then((resp) => resp.json())
      .then((data) => {
        let rightModal = document.getElementById("search-ing-recipe");
        rightModal.innerHTML = "";
        rightModal.style.display = "block";
        let header = document.createElement("h1");
        header.innerText = "Recipes that matches your search";
        rightModal.appendChild(header);
        let newArr = [];
        console.log(data);
        for (let i of data) {
          console.log(i.title);

          let recipeUrl = `https://api.spoonacular.com/recipes/${i.id}/analyzedInstructions?apiKey=Api-key`;
          let headers = document.createElement("h2");
          headers.innerText = i.title;
          rightModal.append(headers);
          console.log(rightModal);
          headers.addEventListener("click", () => {
            console.log("clicked", recipeUrl);
            fetch(recipeUrl)
              .then((resp) => resp.json())
              .then((data) => {
                let rightModal = document.getElementById("search-ing-recipe");
                rightModal.innerHTML = "";
                console.log(data[0]);
                if (data[0]) {
                  data[0].steps.forEach((step) => {
                    console.log(step);

                    let stepsList = document.createElement("ul");
                    let stepPara = document.createElement("li");
                    stepPara.innerText = step.step;

                    stepsList.appendChild(stepPara);
                    rightModal.appendChild(stepsList);
                  });
                }
              });
          });
        }
      });
  });
};

window.addEventListener("DOMContentLoaded", init);
