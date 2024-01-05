const apiKey = "6bd5a1218b9842ed9deee7ffbf0849c6";
const baseMovieApiUrl = `https://api.themoviedb.org/3/movie/97?language=en-US&api_key=${apiKey}`;

const searchValue = document.getElementById("searchField");
const formApi = document.getElementById("SearchForm");
const ulELClean = document.querySelector("ul");
const headerTextH3 = document.getElementById("headerText");
const searcH3 = document.querySelector(".searcH3");
const popularButtonTop = document.getElementById("selectButtonTop");
const popularButton = document.getElementById("selectButton");
const upcomingButton = document.getElementById("upSelectButton");
const buttonshover = document.querySelectorAll(".hover");
const searchAgain = document.getElementById("SearchAgain");

formApi.addEventListener("submit", getSearch);
popularButtonTop.addEventListener("click", () => getData("", "top rated"));
popularButton.addEventListener("click", () => getData("", "popular"));
upcomingButton.addEventListener("click", () => getData("", "upcoming"));
searchAgain.addEventListener("click", scrollToSearch);

function getData(value, type) {
  let movieUrl = "";
  let headerText = "";
  switch (type) {
    case "popular":
      movieUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=${apiKey}`;
      headerText = "Most popular movies";
      break;
    case "actor":
      movieUrl = `https://api.themoviedb.org/3/search/person?query=${value}&language=en-US&api_key=${apiKey}`;
      headerText = `You searched for: ${value}`;
      break;
    case "top rated":
      movieUrl = `https://api.themoviedb.org/3/movie/top_rated?query=${value}&language=en-US&api_key=${apiKey}`;
      headerText = "Top rated movies";
      break;
    case "upcoming":
      movieUrl = `https://api.themoviedb.org/3/movie/upcoming?query=${value}&language=en-US&api_key=${apiKey}`;
      headerText = "Upcoming movies";
      break;
    default:
      movieUrl = `https://api.themoviedb.org/3/search/movie?query=${value}&language=en-US&api_key=${apiKey}`;
      headerText = `You searched for: ${value}`;
  }

  fetch(movieUrl)
    .then((res) => res.json())
    .then((json) => {
      if (type === "actor") {
        creatActorList(json, headerText);
      } else {
        creatMovieList(json, type, headerText);
      }
      searcH3.classList.add("visible");
      searchAgain.classList.add("visible");
      searcH3.scrollIntoView({
        behavior: "smooth",
      });
    })

    .catch((err) => {
      searcH3.classList.add("visible");
      searchAgain.classList.add("visible");
      searcH3.scrollIntoView({
        behavior: "smooth",
      });
      headerTextH3.innerText = "Something went wrong with Api";
    });
}

function creatMovieList(json, type, headerText) {
  ulELClean.innerHTML = "";
  if (json.results.length) {
    const movieList =
      type == "movie" ? json.results : json.results.slice(0, 10);
    movieList.forEach((element) => {
      creatLiMovie(element);
    });
    headerTextH3.innerText = headerText;
  } else {
    headerTextH3.innerText = `${headerText} - No movies were found`;
  }
}

function creatActorList(json, headerText) {
  ulELClean.innerHTML = "";
  if (json.results.length) {
    json.results.slice(0, 10).forEach((element) => {
      creatLiActor(element);
    });
  } else {
    headerTextH3.innerText = `${headerText} - No actors were found by that name`;
  }
}

function getSearch(event) {
  event.preventDefault();
  const inputRadio = document.querySelector('[name="mov"]:checked');
  const value = searchValue.value;
  getData(value, inputRadio.value);
}

buttonshover.forEach((button) => {
  button.addEventListener("mouseenter", onHover);
  button.addEventListener("mouseleave", onLeav);
});

function onHover(event) {
  const targetID = event.target.id;
  anime({
    targets: `#${targetID}`,
    backgroundColor: "#b4b4b4",
  });
}

function onLeav(event) {
  const targetID = event.target.id;
  anime({
    targets: `#${targetID}`,
    backgroundColor: "#4ababa",
  });
}

function createMovieImage(backdrop_path) {
  if (backdrop_path) {
    return `
        <div class="picDiv">
            <img src="https://image.tmdb.org/t/p/w500${backdrop_path}" alt="Girl in a jacket" />
        </div>`;
  }
  return `
    <div>
        <img src="noimgMovie.png" alt="placeholder" /> 
    </div>`;
}

function creatLiMovie(movie) {
  const liElCreat = document.createElement("li");

  liElCreat.innerHTML = `
    ${createMovieImage(movie.backdrop_path)}
    <div class="listText">
        <h4>${movie.title}</h4>
        <p class="infoP">${movie.overview}</p>
        <hr />
        <p class="dateP">${movie.release_date}</p>
    </div>
    `;

  ulELClean.appendChild(liElCreat);
}

function createLiKnownFor(known_for, type) {
  let liString = "";
  const knownFor = known_for.filter((element) => element.media_type === type);
  knownFor.forEach((element) => {
    const title = type === "movie" ? element.title : element.name;
    liString += `<li><p>${title}</p></li>`;
  });
  if (knownFor.length) {
    return `<h4>Known ${type}s</h4><ul>${liString}</ul>`;
  }
  return "";
}

function createActorImage(profile_path) {
  if (profile_path) {
    return `
        <div>
            <img  src="https://image.tmdb.org/t/p/w500${profile_path}" alt="Girl in a jacket" />
        </div>`;
  }
  return `
    <div>
        <img clas="actorImg" src="noimg.png" alt="placeholder" /> 
    </div>`;
}

function creatLiActor(actor) {
  const liElCreat = document.createElement("li");
  liElCreat.innerHTML = `
    ${createActorImage(actor.profile_path)}
    <div class="listText">
        <h4>${actor.name}</h4>
        <h4>known for</h4><p>${actor.known_for_department}</p>
        
        
        ${createLiKnownFor(actor.known_for, "movie")}
        ${createLiKnownFor(actor.known_for, "tv")}
        <hr />
    </div>
    `;
  ulELClean.appendChild(liElCreat);
}

function scrollToSearch(event) {
  document.body.scrollIntoView({ behavior: "smooth" });
  searchAgain.classList.add("visible");
}
