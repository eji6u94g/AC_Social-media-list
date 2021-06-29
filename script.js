const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users";
const PEOPLE_PER_PAGE = 12;
const cardList = document.querySelector("#card-list");
const searchForm = document.querySelector("#search-form");
const pagination = document.querySelector("#pagination");
const modal = document.querySelector("#card-modal");
let peopleInfos = [];
let filteredPeople = [];

function RenderPeopleInfoToCardList(Arr) {
  let rawHTML = "";
  Arr.forEach((element) => {
    rawHTML += `
    <div
          class="card"
          style = "width: 8rem";
        >
          <img src="${element.avatar}" class="card-img-top card-picture" alt="People avatar" data-bs-toggle="modal"
            data-bs-target="#card-modal" data-id = '${element.id}'/>
          <div class='card-name-and-heart d-flex flex-column justify-content-center align-items-center'>
            <h6>${element.name}</h6>
            <span class="material-icons md-18" data-id = '${element.id}'> favorite</span>
          </div>
        </div>
    `;
  });

  cardList.innerHTML = rawHTML;
}

function setNumberOfPaginator(amount) {
  let totalPage = Math.ceil(amount / PEOPLE_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= totalPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`;
  }
  pagination.innerHTML = rawHTML;
}

function devidePeopleByPage(page) {
  let data = filteredPeople.length ? filteredPeople : peopleInfos;
  const startIndex = (page - 1) * PEOPLE_PER_PAGE;
  return data.slice(startIndex, PEOPLE_PER_PAGE * page);
}

function addPeopleToFavortieList(id) {
  const selectedPeople = peopleInfos.find(
    (element) => Number(element.id) === Number(id)
  );
  let favoriteList = JSON.parse(localStorage.getItem("favoriteList")) || [];
  if (favoriteList.some((element) => Number(element.id) === Number(id))) {
    return alert("This person is already in your Favorite List!");
  }
  favoriteList.push(selectedPeople);
  localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
}

searchForm.addEventListener("submit", function searchPeople(event) {
  event.preventDefault();
  const inputValue = event.target
    .querySelector("input")
    .value.trim()
    .toLowerCase();
  filteredPeople = [];
  filteredPeople = peopleInfos.filter((element) =>
    element.name.trim().toLowerCase().includes(inputValue)
  );

  if (filteredPeople.length === 0) {
    setNumberOfPaginator(peopleInfos.length);
    RenderPeopleInfoToCardList(devidePeopleByPage(1));
    alert("There is no match!!");
  } else {
    setNumberOfPaginator(filteredPeople.length);
    RenderPeopleInfoToCardList(devidePeopleByPage(1));
  }
});

pagination.addEventListener("click", function renderPageByPagination(event) {
  if (event.target.tagName !== "A") return;
  let page = event.target.dataset.page;
  RenderPeopleInfoToCardList(devidePeopleByPage(page));
});

cardList.addEventListener("click", function showModal(event) {
  const id = event.target.dataset.id;
  if (event.target.tagName === "IMG") {
    const selectedPeople = peopleInfos.find(
      (element) => Number(element.id) === Number(id)
    );
    const name = document.querySelector("#card-modal-name");
    const avatar = document.querySelector("#card-modal-avatar");
    const info = document.querySelector("#card-modal-info");
    const favoriteButton = modal.querySelector("#modal-button-favorite");
    const favoriteIcon = modal.querySelector("#modal-icon-favorite");
    name.innerText = selectedPeople.name + " " + selectedPeople.surname;
    avatar.src = selectedPeople.avatar;
    info.innerHTML = `
    <span class="material-icons">${selectedPeople.gender}</span></br>
    Region: ${selectedPeople.region}</br>
    Age: ${selectedPeople.age}</br>
    Birthday: ${selectedPeople.birthday}</br>
    `;
    favoriteButton.setAttribute("data-id", id);
    favoriteIcon.setAttribute("data-id", id);
  }

  if (event.target.tagName === "SPAN") {
    addPeopleToFavortieList(id);
    // let favoriteList = JSON.parse(localStorage.getItem("favoriteList")) || [];
    // if (favoriteList.some((element) => Number(element.id) === Number(id))) {
    //   return alert("This person is already in your Favorite List!");
    // }
    // favoriteList.push(selectedPeople);
    // localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
  }
});

modal.addEventListener("click", function (event) {
  const id = event.target.dataset.id;
  if (id) {
    addPeopleToFavortieList(id);
  }
});

axios
  .get(INDEX_URL)
  .then(function (response) {
    peopleInfos.push(...response.data.results);
    setNumberOfPaginator(peopleInfos.length);
    RenderPeopleInfoToCardList(devidePeopleByPage(1));
  })
  .catch(function (error) {
    console.log(error);
  });
