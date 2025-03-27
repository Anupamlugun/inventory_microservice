let pageProd = 0; //page for products
//get categories function
let cateGories = [];

const API_PORT = "http://localhost:8888/productcategory";

function getCategories(page, size, url) {
  const categoryElement = document.getElementById("category");

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
      categoryElement.innerHTML =
        "<option  disabled selected>Select Category</option>";
      //   CategoryTableBody.innerHTML = "";
      //   Array.from(purchaseItemRowcategory).forEach(
      //     (categoryElement) =>
      //       (categoryElement.innerHTML =
      //         "<option value='' disabled selected>Select Category</option>")
      //   );
      //   // //console.log(data.content);
      //   // //console.log(data);

      if (data.content == undefined) {
        data.forEach((category) => {
          // console.log(category);
          //category for product section
          categoryElement.innerHTML +=
            "<option value='" +
            category.category_id +
            "'>" +
            category.category_name +
            "</option>";

          //   //category for purchase  order section
          //   Array.from(purchaseItemRowcategory).forEach(
          //     (categoryElement) =>
          //       (categoryElement.innerHTML +=
          //         "<option value='" +
          //         category.category_id +
          //         "'>" +
          //         category.category_name +
          //         "</option>")
          //   );
        });
      }

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
          const option = document.createElement("option");
          option.textContent = category.category_name;
          option.value = category.category_id;
          categoryElement.appendChild(option);

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
    })
    .catch((error) => console.error(error));
}

//Products
let currentEditProductId = null;
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const category = document.getElementById("category").value;
  const productName = document.getElementById("productName").value;
  const productPrice = document.getElementById("productPrice").value;

  const productObj = {
    category_id: category,
    product_name: productName.trim(),
    product_price: productPrice,
  };

  const method = currentEditProductId ? "PUT" : "POST";
  const url = currentEditProductId
    ? "/updateproducts/" + currentEditProductId
    : "/saveproduct";
  fetch(API_PORT + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productObj),
  })
    .then((response) => response.text())
    .then((data) => {
      ////console.log(data);
      getProducts((page = 0), (size = 5));
      currentEditProductId = null;
      productForm.reset();
      if (data == "No duplicates allowed") {
        // alert(data);
        Toastify({
          text: data,
          duration: 1500,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
      } else if (data == "Products already exist") {
        Toastify({
          text: data,
          duration: 1500,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
      } else {
        // alert(data);
        Toastify({
          text: data,
          duration: 1500,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();
      }
      add_update_Product();
    })
    .catch((error) => console.error(error));
});

//get products function
let productList = [];
function getProducts(page, size) {
  const tableBodyElement = document.getElementById("tableBody");

  fetch(API_PORT + "/getproducts?page=" + page + "&size=" + size, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      tableBodyElement.innerHTML = "";

      if (Array.isArray(data.content)) {
        productList = data.content;
        data.content.forEach((product) => {
          ////console.log(product);
          tableBodyElement.innerHTML +=
            "<tr><td>" +
            product.category_name +
            "</td><td>" +
            product.product_name +
            "</td><td>" +
            product.product_price +
            "</td><td class='action'>" +
            "<button class='btn btn-danger mt-2' onclick='deleteProduct(" +
            product.product_id +
            ")'>Delete</button>" +
            "<button class='btn btn-info mt-2' onclick='editProduct(" +
            product.product_id +
            "," +
            product.category_id +
            ',"' +
            product.product_name +
            '",' +
            product.product_price +
            ")'>Edit</button>" +
            "</td></tr>";
        });
      }
    })
    .catch((error) => console.error(error));
}

//edit product function
function editProduct(product_id, category_id, product_name, product_price) {
  currentEditProductId = product_id;
  ////console.log(product_id, category_id, product_name, product_price);
  const category = (document.getElementById("category").value = category_id);
  const productName = (document.getElementById("productName").value =
    product_name);
  const productPrice = (document.getElementById("productPrice").value =
    product_price);
  add_update_Product();
}
//add or update product button
function add_update_Product() {
  const productButton = document.getElementById("productButton");

  currentEditProductId
    ? (productButton.innerText = "Update Product")
    : (productButton.innerText = "Add Product");
}

//delete product function
function deleteProduct(product_id) {
  if (confirm("Do you want to Delete?")) {
    // //console.log("User clicked Yes");

    fetch(API_PORT + "/deleteproduct/" + product_id, {
      method: "PUT",
    })
      .then((response) => response.text())
      .then((data) => {
        //alert(data);
        Toastify({
          text: data,
          duration: 1500,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();

        getProducts((page = 0), (size = 5));
      })
      .catch((error) => console.error(error));
  } else {
    ////console.log("User clicked No");
  }
}

///
//
//page next prev for products
function productPage(event) {
  if (event.target.classList.contains("productNext") && pageProd >= 0) {
    if (productList.length == 0) {
      //console.log(productList.length);
      return;
    }
    pageProd++;
    getProducts((page = pageProd), (size = 5));
  } else if (event.target.classList.contains("productPrev") && pageProd > 0) {
    pageProd--;
    getProducts((page = pageProd), (size = 5));
  }

  //console.log(pageProd, productList);
}

const url = "/getcategories";
getCategories((page = 0), (size = 5), url);
getProducts(0, 5);
