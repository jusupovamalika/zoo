let API = "http://localhost:8000/public";

let carsList = $("#cars-list");
let details = $(".details");
let search = $("#search");
let pagination = $("#pagination");

// ? add form
let addFormModel = $("#add-form-model");
let addFormVideo = $("#add-form-video");
let addFormImage1 = $("#add-form-image-1");
let addFormImage2 = $("#add-form-image-2");
let addFormSaveBtn = $("#add-form-save-btn");

// ? edit form
let editFormModel = $("#edit-form-model");
let editFormVideo = $("#edit-form-video");
let editFormImage1 = $("#edit-form-image-1");
let editFormImage2 = $("#edit-form-image-2");
let editFormId = $("#edit-form-id");
let editFormSaveBtn = $("#edit-form-save-btn");

let page = 1;
let limit = 1;

addFormSaveBtn.on("click", async function () {
  let newAnimal = {
    model: addFormModel.val(),
    video: addFormVideo.val(),
    image1: addFormImage1.val(),
    image2: addFormImage2.val(),
  };
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newAnimal),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  getAnimals();
});
async function getAnimals() {
  let data = await fetch(
    `${API}?q=${search.val()}&_page=${page}&_limit=${limit}`
  ).then((res) => res.json());
  console.log(data);
  carsList.empty();
  data.forEach((animal) => {
    carsList.append(`
      <div id=${animal.id} class="card" style="width: 18rem;">
      <img src=${animal.image1} class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">Животное: ${animal.model}</h5>
        <div class="d-flex justify-content-around">
          <i class="fas fa-trash btn-delete"></i>
          <i class="fas fa-edit btn-edit" data-bs-toggle="modal"data-bs-target="#exampleModal"></i>
          <i class="fas fa-info-circle btn-details" data-bs-toggle="modal" data-bs-target="#exampleModal1"></i>
  </div>
      </div>
    </div>`);
  });
  pagination.html(
    `<button ${
      page == 1 ? "disabled" : ""
    }disabled id="btn-prev">Prev</button><span>${page}</span><button 
     id="btn-next">Next</button>`
  );
}
$("body").on("click", "#btn-prev", function () {
  page -= 1;

  getAnimals();
});
$("body").on("click", "#btn-next", function () {
  page += 1;
  getAnimals();
});
getAnimals();
search.on("input", getAnimals);

$("body").on("click", ".btn-delete", async function (e) {
  let id = e.target.parentNode.parentNode.parentNode.id;
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  getAnimals();
});

$("body").on("click", ".btn-edit", async function (e) {
  let id = e.target.parentNode.parentNode.parentNode.id;
  console.log(id);
  let editData = await fetch(`${API}/${id}`).then((res) => res.json());
  console.log(editData);
  editFormModel.val(editData.model);
  editFormVideo.val(editData.video);
  editFormImage1.val(editData.image1);
  editFormImage2.val(editData.image2);
  editFormId.val(editData.id);
});
editFormSaveBtn.on("click", async function () {
  let editedData = {
    model: editFormModel.val(),
    video: editFormVideo.val(),
    image1: editFormImage1.val(),
    image2: editFormImage2.val(),
  };
  await fetch(`${API}/${editFormId.val()}`, {
    method: "PATCH",
    body: JSON.stringify(editedData),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  getAnimals();
});
$("body").on("click", ".btn-details", async function (e) {
  let id = e.target.parentNode.parentNode.parentNode.id;
  console.log(id);
  let detailsData = await fetch(`${API}/${id}`).then((res) => res.json());
  details.html(
    `<video autoplay muted loop width="100%" src=${detailsData.video}></video><div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src=${detailsData.image2} class="d-block w-100" alt="...">
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>`
  );
  console.log(detailsData);
});
