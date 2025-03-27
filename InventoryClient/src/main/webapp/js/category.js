//get categories function
let cateGories = [];
const API_PORT = "http://localhost:8888/productcategory";
function getCategories(page, size, url) {
  // const categoryElement = document.getElementById("category");
  const CategoryTableBody = document.getElementById("CategoryTableBody");

  // const purchaseItemRowcategory = document.getElementsByClassName(
  //   "purchaseItemRowcategory"
  // );

  if (url == "/getcategoriespage") {
    url += "?page=" + page + "&size=" + size;
  } else {
    url = "/getcategories";
  }

  fetch(API_PORT + url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      // categoryElement.innerHTML =
      //   "<option  disabled selected>Select Category</option>";
      CategoryTableBody.innerHTML = "";
      // Array.from(purchaseItemRowcategory).forEach(
      //   (categoryElement) =>
      //     (categoryElement.innerHTML =
      //       "<option value='' disabled selected>Select Category</option>")
      // );
      // // //console.log(data.content);
      // // //console.log(data);

      // if (data.content == undefined) {
      //   data.forEach((category) => {
      //     // console.log(category);
      //     //category for product section
      //     categoryElement.innerHTML +=
      //       "<option value='" +
      //       category.category_id +
      //       "'>" +
      //       category.category_name +
      //       "</option>";

      //     // //category for purchase  order section
      //     // Array.from(purchaseItemRowcategory).forEach(
      //     //   (categoryElement) =>
      //     //     (categoryElement.innerHTML +=
      //     //       "<option value='" +
      //     //       category.category_id +
      //     //       "'>" +
      //     //       category.category_name +
      //     //       "</option>")
      //     // );
      //   });
      // }

      if (Array.isArray(data.content)) {
        cateGories = data.content;
        //console.log(data.content.length);
        if (data.content.length == 0) {
          // document.getElementById("LoadCategoryPrev").style.display =
          //   "none";
          document.getElementById("LoadCategoryNext").style.display = "none";
        } else {
          document.getElementById("LoadCategoryPrev").style.display = "";
          document.getElementById("LoadCategoryNext").style.display = "";
        }

        data.content.forEach((category) => {
          //console.log(category);
          // const option = document.createElement("option");
          // option.textContent = category.category_name;
          // option.value = category.category_id;
          // categoryElement.appendChild(option);

          //category for categoy table

          CategoryTableBody.innerHTML +=
            "<tr><td>" +
            category.category_name +
            "</td><td><button  class='btn btn-info mt-2' onclick='editCategory(" +
            category.category_id +
            ', "' +
            category.category_name +
            "\")'>Edit</button></td></tr>";
        });
      }
      add_update_Category();
    })
    .catch((error) => console.error(error));
}

//Catergory
let currentEditCategoryId = null;
const categoryForm = document.getElementById("categoryForm");
categoryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const categoryName = document.getElementById("categoryName").value;
  categoryObj = {
    category_name: categoryName,
  };

  const method = currentEditCategoryId ? "PUT" : "POST";
  const url = currentEditCategoryId
    ? "/updatecategory/" + currentEditCategoryId
    : "/savecategory";

  fetch(API_PORT + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryObj),
  })
    .then((response) => response.text())
    .then((data) => {
      ////console.log(data);

      getCategories(
        (page = 0),
        (size = 5),
        (urlproduct = "/getcategoriespage")
      );
      // getProducts((page = 0), (size = 5));
      currentEditCategoryId = null;
      categoryForm.reset();
      if (data == "Category already exists") {
        //alert(data);
        //toastf
        Toastify({
          text: data,
          duration: 1500,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
      } else {
        Toastify({
          text: data,
          duration: 1500,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();
      }
    })
    .catch((error) => console.error(error));
});

function add_update_Category() {
  const categoryButton = document.getElementById("categoryButton");

  currentEditCategoryId
    ? (categoryButton.innerText = "Update Category")
    : (categoryButton.innerText = "Add Category");
}

let page = 0;

function loadMore(event) {
  if (event.target.id === "LoadCategoryPrev") {
    if (page > 0) {
      page--;
    }
  } else if (event.target.id === "LoadCategoryNext") {
    // Assuming "LoadCategoryNext" is for next
    if (cateGories.length == 0) {
      document.getElementById("LoadCategoryPrev").style.display = "none";
      return;
    }
    page++;
  }
  getCategories(page, (size = 5), (urlproduct = "/getcategoriespage"));
  //console.log(event.target.id, page);
}
//Edit category function
function editCategory(category_id, category_name) {
  ////console.log(category_id, category_name);
  currentEditCategoryId = category_id;
  const categoryName = (document.getElementById("categoryName").value =
    category_name);
  add_update_Category();
}

getCategories((page = 0), (size = 5), (url = "/getcategoriespage"));
