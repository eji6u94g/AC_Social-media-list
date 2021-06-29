const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users";
const PEOPLE_PER_PAGE = 12;
const cardList = document.querySelector("#card-list");
const searchForm = document.querySelector("#search-form");
const pagination = document.querySelector("#pagination");
const modal = document.querySelector("#card-modal");
let peopleInfos = JSON.parse(localStorage.getItem("favoriteList")) || [];
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
            <span class="material-icons md-18"  data-id = '${element.id}'>delete</span>
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

function deletePeopleFromFavorite(id) {
  let deleteIndex = peopleInfos.findIndex(
    (element) => Number(element.id) === Number(id)
  );
  // console.log(typeof PEOPLE_PER_PAGE);
  let page = Math.ceil (deleteIndex / PEOPLE_PER_PAGE);
  peopleInfos.splice(deleteIndex, 1);
  localStorage.setItem("favoriteList", JSON.stringify(peopleInfos));
  RenderPeopleInfoToCardList(devidePeopleByPage(page));
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
  const selectedPeople = peopleInfos.find(
    (element) => Number(element.id) === Number(id)
  );
  if (event.target.tagName === "IMG") {
    const name = document.querySelector("#card-modal-name");
    const avatar = document.querySelector("#card-modal-avatar");
    const info = document.querySelector("#card-modal-info");
    const modalDelete = modal.querySelector("#modal-button-delete");
    name.innerText = selectedPeople.name + " " + selectedPeople.surname;
    avatar.src = selectedPeople.avatar;
    info.innerHTML = `
    <span class="material-icons">${selectedPeople.gender}</span></br>
    Region: ${selectedPeople.region}</br>
    Age: ${selectedPeople.age}</br>
    Birthday: ${selectedPeople.birthday}</br>
    `;
    modalDelete.setAttribute("data-id", id);
  }

  if (event.target.tagName === "SPAN") {
    // let deleteIndex = peopleInfos.findIndex(
    //   (element) => Number(element.id) === Number(id)
    // );
    // peopleInfos.splice(deleteIndex, 1);
    // localStorage.setItem("favoriteList", JSON.stringify(peopleInfos));
    // RenderPeopleInfoToCardList(peopleInfos);
    deletePeopleFromFavorite(id);
  }
});

modal.addEventListener("click", function (event) {
  const id = event.target.dataset.id;
  if (id) {
    deletePeopleFromFavorite(id);
    alert ('Deleted from favorite list!')
  }
});

axios
  .get(INDEX_URL)
  .then(function (response) {
    // peopleInfos.push(...response.data.results);
    setNumberOfPaginator(peopleInfos.length);
    RenderPeopleInfoToCardList(devidePeopleByPage(1));
  })
  .catch(function (error) {
    console.log(error);
  });
