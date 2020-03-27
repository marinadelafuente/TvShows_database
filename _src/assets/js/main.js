'use strict';

const input = document.querySelector('.js-name-input');
const button = document.querySelector('.js-button');
let favoriteShowList = document.querySelector('.js-shows-favorite');
let showList = document.querySelector('.js-shows-list');
let resetButton = document.querySelector('.js-reset-button');
let resultsTitle = document.querySelector('.js__content__title');
let resultsTitleFav = document.querySelector('.js__content__fav');

let tvShows = [];
let favTvShows = [];

function setLocalStorage() {
  localStorage.setItem("favTvShows", JSON.stringify(favTvShows));
}

function getLocalStorage() {
  const localStoragefavTvShowsJSON = localStorage.getItem("favTvShows");
  const localStoragefavTvShows = JSON.parse(localStoragefavTvShowsJSON);
  if (localStoragefavTvShows !== null) {
    favTvShows = localStoragefavTvShows;
    paintFavShows();
    listenShows();
  }
}

const getServerData = function () {
  fetch(`https://api.tvmaze.com/search/shows?q=${input.value}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (serverData) {
      tvShows = serverData;
      paintShows();
      listenShows();

    })
    .catch(function (err) {
      console.log('Error al traer los datos del servidor', err);
    });
};

const paintShows = function () {
  let htmlCode = '';
  for (let i = 0; i < tvShows.length; i++) {
    const index = favTvShows.findIndex(function (show) {
      return show.id == tvShows[i].show.id;
    });
    let isFavorite = index !== -1;

    if (isFavorite === true) {
      htmlCode += `<li class="js-show show__container show__container-click" id=${tvShows[i].show.id}>`;
    } else {
      htmlCode += `<li class="js-show show__container" id=${tvShows[i].show.id}>`;
    }
    if (tvShows[i].show.image === null) {
      htmlCode += `<img class="show__container-img" src ='https://via.placeholder.com/210x295/ffffff/666666/?text=TV.'>`;
    } else {
      htmlCode += `<img class="show__container-img" src= ${tvShows[i].show.image.medium} alt= ${tvShows[i].show.name}>`;
    }
    htmlCode += `<h3 class="show__title">${tvShows[i].show.name}</h3>`;
    htmlCode += `</li>`;

  }
  resultsTitle.classList.remove('hidden');
  resultsTitleFav.classList.remove('hidden');
  showList.innerHTML = htmlCode;
};

const paintFavShows = function () {
  let htmlCode = '';
  for (let i = 0; i < favTvShows.length; i++) {
    htmlCode += `<li class="js-show show__container show__container-fav" id=${favTvShows[i].id} >`;
    htmlCode += `<div class= "close-fav js-close-button" >X</div>`
    if (favTvShows[i].image === null) {
      htmlCode += `<img class="show__img show__img-fav" src ='https:via.placeholder.com/210x295/ffffff/666666/?text=TV.'>`;
    } else {
      htmlCode += `<img class="show__img show__img-fav" src= ${favTvShows[i].image.medium} alt= ${favTvShows[i].name}>`;
    }
    htmlCode += `<h3 class="show__title show__title-fav">${favTvShows[i].name}</h3>`;
    htmlCode += `</li>`;
  }
  favoriteShowList.innerHTML = htmlCode;
};

const changeFavs = function (event) {
  const clickedId = parseInt(event.currentTarget.id);
  const index = favTvShows.findIndex(function (show) {
    return show.id === clickedId;
  });

  const isFavorite = index !== -1;

  if (isFavorite === true) {
    favTvShows.splice(index, 1);

  } else {
    for (let i = 0; i < tvShows.length; i++) {
      if (tvShows[i].show.id === clickedId) {
        favTvShows.push(tvShows[i].show);
      }
    }
  }
  paintShows();
  listenShows();
  setLocalStorage();
  paintFavShows();


  let closeButtons = document.querySelectorAll('.js-close-button');
  for (const closeButton of closeButtons) {
    closeButton.addEventListener('click', changeFavs);
  }
};

const listenShows = function () {
  const tvShowElements = document.querySelectorAll('.js-show');
  for (const tvShowElement of tvShowElements) {
    tvShowElement.addEventListener('click', changeFavs);
  }
};

const reset = function (event) {
  event.preventDefault();
  favTvShows = [];
  paintFavShows();
}

resetButton.addEventListener('click', reset);

const search = function (event) {
  event.preventDefault();
  getServerData();
};

getLocalStorage();

button.addEventListener('click', search);
