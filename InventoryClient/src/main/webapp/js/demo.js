//for active link
function setActive(element, section) {
  // Store the active section in localStorage
  sessionStorage.setItem("activeSection", section);

  // Remove 'active' class from all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Add 'active' class to the clicked link
  element.classList.add("active");
}

// Function to restore the active section on page load
function restoreActiveSection() {
  const activeSection = sessionStorage.getItem("activeSection") || "category";
  if (activeSection) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.getAttribute("onclick").includes(activeSection)) {
        link.classList.add("active");
      }
    });
  }
}

// Call function on page load
document.addEventListener("DOMContentLoaded", restoreActiveSection);

let fromDateForNextPrev; // from date for puchase report
let toDateForNextPrev; // to date for puchase report

let fromDateSaleReport; // from date for sale report
let toDateSaleReport; // from date for sale report

let pageforsalereport = 0; //page for sale report
let pagerpt = 0; //page for purchase order report
let pageProd = 0; //page for products
let purchaseOrderCount;
let purchaseInvoice;
// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

// Set the span text to today's date
document.getElementById("currentDate").textContent = today;
function showSection(section) {
  // event.target.classList.add("active");
  // Hide all sections
  document.getElementById("categorySection").style.display = "none";
  document.getElementById("productSection").style.display = "none";
  document.getElementById("supplierSection").style.display = "none";
  document.getElementById("supplierSection").style.display = "none";
  document.getElementById("purchaseOrderSection").style.display = "none";
  document.getElementById("saleSection").style.display = "none";
  document.getElementById("purchaseReportSection").style.display = "none";
  document.getElementById("purReportdtlSection").style.display = "none";
  document.getElementById("saleReportSection").style.display = "none";
  document.getElementById("saleReportDtlSection").style.display = "none";
  document.getElementById("stockSection").style.display = "none";

  // Show the selected section
  const currentSection = document.getElementById(section + "Section");
  if (currentSection) {
    currentSection.style.display = "block";
  } else {
    console.error("Section not found: " + section + "Section");
  }
  // Store the selected section in sessionStorage
  sessionStorage.setItem("selectedSection", section);

  if (section == "purchaseOrder") {
    currentPurchaseInvoice();
    //console.log("purchase order");
  }
  if (section == "category") {
    const url = "getcategoriespage";
    getCategories((page = 0), (size = 5), url);
  }
  if (section == "product" || section == "purchaseOrder" || section == "sale") {
    const url = "getcategories";
    getCategories((page = 0), (size = 5), url);
    document.getElementById("purchaseOrderForm").reset();
    updateTotals();

    document.getElementById("productForm").reset();
    document.getElementById("salesOrderForm").reset();
    document.getElementById("purchaseDate").value = today;
    document.getElementById("salegrandTotal").innerHTML = "0";
  }

  if (section == "purchaseReport") {
    //console.log("report");
    getPurchaseReportByPage(
      (startDate = fromDateForNextPrev ? fromDateForNextPrev : today),
      (endDate = toDateForNextPrev ? toDateForNextPrev : today),
      (page = 0),
      (size = 5)
    );
    document.getElementById("invoiceSearch").value = "";
    document.querySelector(".purReportPrev").style.display = "";
    document.querySelector(".purReportNext").style.display = "";
  }

  if (section == "saleReport")
    getSaleReportByPage(
      (startDate = fromDateSaleReport ? fromDateSaleReport : today),
      (endDate = toDateSaleReport ? toDateSaleReport : today),
      (page = 0),
      (size = 5)
    );
  document.getElementById("saleInvoiceSearch").value = "";
  document.querySelector(".saleReportPrev").style.display = "";
  document.querySelector(".saleReportNext").style.display = "";

  if (section == "stock") {
    // console.log("stock");
    stocktable();
  }
}

//fetch invoice
function currentPurchaseInvoice() {
  fetch("getpurchasecount", {
    method: "GET",
  })
    .then((response) => response.text()) // Convert response to text
    .then((data) => {
      purchaseOrderCount = data;
      purchaseInvoice = "PO" + today.replaceAll("-", "") + purchaseOrderCount;
      //console.log(purchaseInvoice);
      document.getElementById("purchaseInvoice").textContent = purchaseInvoice;
    }) // Log the data
    .catch((error) => console.error(error)); // Properly handle errors
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
    : "savecategory";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryObj),
  })
    .then((response) => response.text())
    .then((data) => {
      ////console.log(data);

      getCategories((page = 0), (size = 5), (urlproduct = "getcategoriespage"));
      getProducts((page = 0), (size = 5));
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
      }
    })
    .catch((error) => console.error(error));
});

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
    product_name: productName,
    product_price: productPrice,
  };

  const method = currentEditProductId ? "PUT" : "POST";
  const url = currentEditProductId
    ? "/updateproducts/" + currentEditProductId
    : "saveproduct";
  fetch(url, {
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
    })
    .catch((error) => console.error(error));
});

window.onload = () => {
  getProducts((page = 0), (size = 5));
  getSupplier();
  const savedSection = sessionStorage.getItem("selectedSection") || "category";

  if (savedSection == "category") {
    getCategories((page = 0), (size = 5), (url = "getcategoriespage"));
  } else {
    getCategories((page = 0), (size = 5), (url = "getcategories"));
  }
  showSection(savedSection);
  document.getElementById("purchaseDate").value = today;
};

//get categories function
let cateGories = [];
function getCategories(page, size, url) {
  const categoryElement = document.getElementById("category");
  const CategoryTableBody = document.getElementById("CategoryTableBody");

  const purchaseItemRowcategory = document.getElementsByClassName(
    "purchaseItemRowcategory"
  );

  if (url == "getcategoriespage") {
    url += "?page=" + page + "&size=" + size;
  } else {
    url = "getcategories";
  }

  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      categoryElement.innerHTML =
        "<option  disabled selected>Select Category</option>";
      CategoryTableBody.innerHTML = "";
      Array.from(purchaseItemRowcategory).forEach(
        (categoryElement) =>
          (categoryElement.innerHTML =
            "<option value='' disabled selected>Select Category</option>")
      );
      // //console.log(data.content);
      // //console.log(data);

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

          //category for purchase  order section
          Array.from(purchaseItemRowcategory).forEach(
            (categoryElement) =>
              (categoryElement.innerHTML +=
                "<option value='" +
                category.category_id +
                "'>" +
                category.category_name +
                "</option>")
          );
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
      add_update_Category();
    })
    .catch((error) => console.error(error));
}

//Edit category function
function editCategory(category_id, category_name) {
  ////console.log(category_id, category_name);
  currentEditCategoryId = category_id;
  const categoryName = (document.getElementById("categoryName").value =
    category_name);
  add_update_Category();
}

//get products function
let productList = [];
function getProducts(page, size) {
  const tableBodyElement = document.getElementById("tableBody");

  fetch("getproducts?page=" + page + "&size=" + size, {
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

        add_update_Product();
      }
    })
    .catch((error) => console.error(error));
}

//delete product function
function deleteProduct(product_id) {
  if (confirm("Do you want to Delete?")) {
    // //console.log("User clicked Yes");

    fetch("/deleteproduct/" + product_id, {
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

//Supplier
let currentEditSupplierId = null;
const supplierForm = document.getElementById("supplierForm");
supplierForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  const supplierObj = {
    supplier_name: name,
    supplier_phone: phone,
    supplier_email: email,
    supplier_address: address,
  };

  const method = currentEditSupplierId ? "PUT" : "POST";
  const url = currentEditSupplierId
    ? "/updatesupplier/" + currentEditSupplierId
    : "savesupplier";
  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supplierObj),
  })
    .then((response) => response.text())
    .then((data) => {
      ////console.log(data);
      getSupplier();
      currentEditSupplierId = null;
      supplierForm.reset();
      if (data == "Your phone no. or email Id is Alreay Exist") {
        //alert(data);
        Toastify({
          text: data,
          duration: 1500,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
      }
    })
    .catch((error) => console.error(error));
});

//get supplier function

function getSupplier() {
  const supplierTableElement = document.getElementById("supplierTable");
  const supplierElement = document.getElementById("supplier");
  fetch("getsupplier", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      supplierTableElement.innerHTML = "";
      supplierElement.innerHTML =
        "<option value='' disabled selected>Select Supplier</option>";
      data.forEach((supplier) => {
        ////console.log(supplier);

        //for suppler table
        supplierTableElement.innerHTML +=
          "<tr><td>" +
          supplier.supplier_name +
          "</td><td>" +
          supplier.supplier_phone +
          "</td><td>" +
          supplier.supplier_email +
          "</td><td>" +
          supplier.supplier_address +
          "</td><td class='action'>" +
          '<button class="btn btn-danger mt-2" onclick="deleteSupplier(' +
          supplier.supplier_id +
          ')">Delete</button>' +
          '<button class="btn btn-info mt-2" onclick="editSupplier(' +
          supplier.supplier_id +
          ", '" +
          supplier.supplier_name +
          "', '" +
          supplier.supplier_phone +
          "', '" +
          supplier.supplier_email +
          "', '" +
          supplier.supplier_address +
          "')\">Edit</button>" +
          "</td></tr>";

        //for supller name
        supplierElement.innerHTML +=
          "<option value='" +
          supplier.supplier_id +
          "'>" +
          supplier.supplier_name +
          "</option>";
      });

      add_update_Supplier();
    })
    .catch((error) => console.error(error));
}

//edit product function
function editSupplier(
  supplier_id,
  supplier_name,
  supplier_phone,
  supplier_email,
  supplier_address
) {
  currentEditSupplierId = supplier_id;

  document.getElementById("name").value = supplier_name;
  document.getElementById("phone").value = supplier_phone;
  document.getElementById("email").value = supplier_email;
  document.getElementById("address").value = supplier_address;
  add_update_Supplier();
}

//delete supplier function
function deleteSupplier(supplier_id) {
  if (confirm("Do you want to Delete?")) {
    ////console.log("User clicked Yes");

    fetch("/deletesupplier/" + supplier_id, {
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
        getSupplier();
      })
      .catch((error) => console.error(error));
  } else {
    // //console.log("User clicked No");
  }
}

//add or update supplier button
function add_update_Supplier() {
  const supplierButton = document.getElementById("supplierButton");

  currentEditSupplierId
    ? (supplierButton.innerText = "Update Supplier")
    : (supplierButton.innerText = "Add Supplier");
}
//add or update product button
function add_update_Product() {
  const productButton = document.getElementById("productButton");

  currentEditProductId
    ? (productButton.innerText = "Update Product")
    : (productButton.innerText = "Add Product");
}

function add_update_Category() {
  const categoryButton = document.getElementById("categoryButton");

  currentEditCategoryId
    ? (categoryButton.innerText = "Update Category")
    : (categoryButton.innerText = "Add Category");
}

//purchase order

const itemsContainer2 = document.getElementById("itemsContainer2");
const addItemButton = document.getElementById("purchaseButton");
const grandTotalSpan = document.getElementById("grandTotal");

//const API_BASE_URL = "http://localhost:8080/"; // Change this to your API base URL

// Function to fetch categories from API
async function fetchCategories() {
  try {
    const response = await fetch("getcategories");
    const categories = await response.json();
    return categories; // Assuming API returns [{id: 1, name: "Electronics"}, {id: 2, name: "Furniture"}]
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Function to fetch items based on category from API
const purchase_sale = "purchase";
async function fetchItems(category) {
  try {
    const response = await fetch(
      "getproducts/" + category + "/" + purchase_sale
    );
    const data = await response.json();
    //console.log(data); // Debugging step

    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

// Function to populate category dropdown
async function populateCategories(selectElement) {
  selectElement.innerHTML =
    '<option value="" disabled selected>Select Category</option>';
  const categories = await fetchCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.category_id;
    option.textContent = category.category_name;
    selectElement.appendChild(option);
  });
}

// Function to populate items dropdown based on selected category
async function populateItems(selectElement, category) {
  const itemSelect = selectElement.parentElement.querySelector(
    ".purchaseItemRowitem"
  );
  itemSelect.innerHTML =
    '<option value="" disabled selected>Select Item</option>';

  const prieField = (selectElement.parentElement.querySelector(
    ".purchaseItemRowprice"
  ).value = 0);
  const items = await fetchItems(category);
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.product_id;
    option.textContent = item.product_name;
    option.dataset.price = item.product_price; // Store price in dataset
    itemSelect.appendChild(option);
  });

  updateTotals();
}

// Function to update totals
function updateTotals() {
  let grandTotal = 0;
  document.querySelectorAll(".purchaseItemRow").forEach((row) => {
    const item = row.querySelector(".purchaseItemRowitem").value || "";
    const price = item
      ? parseFloat(row.querySelector(".purchaseItemRowprice").value)
      : 0;
    const quantity =
      parseInt(row.querySelector(".purchaseItemRowquantity").value) || 1;
    const total = price * quantity;
    row.querySelector(".purchaseItemRowtotal").value = total.toFixed(2);
    grandTotal += total;
  });
  grandTotalSpan.textContent = grandTotal.toFixed(2);
}

// Function to handle category selection
function handleCategoryChange(event) {
  const category = event.target.value;
  populateItems(event.target, category);
}

// Function to handle item selection and price update
function handleItemChange(event) {
  const selectedOption = event.target.options[event.target.selectedIndex];
  const priceInput = event.target.parentElement.querySelector(
    ".purchaseItemRowprice"
  );

  if (selectedOption.dataset.price) {
    priceInput.value = selectedOption.dataset.price;
  } else {
    priceInput.value = "";
  }

  updateTotals();
}

// Function to add a new item row
async function addItemRow() {
  const newRow = document.createElement("div");
  newRow.style.minWidth = "max-content";
  newRow.classList.add(
    "purchaseItemRow",
    "d-flex",
    "align-items-center",
    "mb-2"
  );

  newRow.innerHTML = `
                         <select class="purchaseItemRowcategory form-control me-2" required>
                           <option value="" disabled selected>Select Category</option>
                         </select>
                         <select class="purchaseItemRowitem form-control me-2" required>
                           <option value="" disabled selected>Select Item</option>
                         </select>
                         <input type="number" class="purchaseItemRowprice form-control me-2" placeholder="Price" readonly required />
                         <input type="number" class="purchaseItemRowquantity form-control me-2" placeholder="Qty" min="1" value="1" required />
                         <input type="number" class="purchaseItemRowtotal form-control me-2" placeholder="Total" readonly required />
                         <button type="button" class="btn btn-danger removeItem">X</button>
                       `;

  itemsContainer2.appendChild(newRow);

  // Populate categories in new row
  await populateCategories(newRow.querySelector(".purchaseItemRowcategory"));
}

// Event Listener for Add Item Button
addItemButton.addEventListener("click", addItemRow);

// Event Delegation for dynamically added elements
itemsContainer2.addEventListener("change", async function (event) {
  if (event.target.classList.contains("purchaseItemRowcategory")) {
    handleCategoryChange(event);
  } else if (event.target.classList.contains("purchaseItemRowitem")) {
    handleItemChange(event);
  } else if (event.target.classList.contains("purchaseItemRowquantity")) {
    updateTotals();
  }
});

// Event Delegation for Remove Item Button
itemsContainer2.addEventListener("click", function (event) {
  if (event.target.classList.contains("removeItem")) {
    // Check if there is more than one child
    if (itemsContainer2.children.length > 1) {
      event.target.parentElement.remove();
      updateTotals();
    } else {
      //alert("At least one item must remain!");
      Toastify({
        text: "At least one item must remain!",
        duration: 1500,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
    }
  }
});

// Initialize the first row with categories
addItemRow();

//purchase order submit
const purchaseOrderForm = document.getElementById("purchaseOrderForm");
purchaseOrderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const supplier = document.getElementById("supplier").value;
  const inputDate = document.getElementById("purchaseDate").value;
  const grandTotalSpan = parseInt(
    document.getElementById("grandTotal").innerText
  );
  let purchaseOrder = {
    purchaseInvoice: purchaseInvoice,
    supplier_id: supplier,
    purchaseDate: inputDate,
    grand_total: grandTotalSpan,
    items: [],
  };
  document.querySelectorAll(".purchaseItemRow").forEach((row) => {
    const item = row.querySelector(".purchaseItemRowitem").value || "";
    const price =
      parseFloat(row.querySelector(".purchaseItemRowprice").value) || 0;

    const quantity =
      parseInt(row.querySelector(".purchaseItemRowquantity").value) || 1;
    const total = price * quantity;
    purchaseOrder.items.push({
      product_id: item,
      item_qty: quantity,
      item_total_price: total,
    });
  });
  //console.log(purchaseOrder);
  fetch("/savepurchaseorder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchaseOrder),
  })
    .then((response) => response.text())
    .then((data) => {
      // alert(data);
      Toastify({
        text: data,
        duration: 2500,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
      currentPurchaseInvoice();
      document.getElementById("grandTotal").innerText = "0";
      purchaseOrderForm.reset();
      itemsContainer2.innerHTML = "";
      addItemRow();
      document.getElementById("purchaseDate").value = today;
    })
    .catch((error) => console.error(error));
});

//sale section
const itemsContainerSale2 = document.getElementById("itemsContainersale2");
document.addEventListener("DOMContentLoaded", function () {
  const addItemButtonSale = document.getElementById("saleButton");
  const saleGrandTotalSpan = document.getElementById("salegrandTotal");

  const API_BASE_URL_SALES = "http://localhost:8080"; // Replace with your API URL

  // Fetch categories from API
  async function fetchCategoriesSale() {
    try {
      const response = await fetch(API_BASE_URL_SALES + "/getcategories");
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  // Fetch items based on category
  const purchase_sale = "sale";
  async function fetchItemsSale(category) {
    try {
      const response = await fetch(
        API_BASE_URL_SALES + "/getproducts/" + category + "/" + purchase_sale
      );

      const items = await response.json();
      return items;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  }

  // Populate category dropdown
  async function populateCategoriesSale(selectElement) {
    selectElement.innerHTML =
      '<option value="" disabled selected>Select Category</option>';
    const categories = await fetchCategoriesSale();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.category_id;
      option.textContent = category.category_name;
      selectElement.appendChild(option);
    });
  }

  // Populate items based on category selection
  async function populateItemsSale(selectElement, category) {
    const itemSelect =
      selectElement.parentElement.querySelector(".saleItemRowitem");
    itemSelect.innerHTML =
      '<option value="" disabled selected>Select Item</option>';

    const items = await fetchItemsSale(category);
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.product_id;
      option.textContent = item.product_name;
      option.dataset.price = item.product_price;
      option.dataset.available = item.available;
      itemSelect.appendChild(option);
    });
    updateTotalsSale();
  }

  // Update total calculation
  function updateTotalsSale() {
    let grandTotalSale = 0;
    document.querySelectorAll(".saleItemRow").forEach((row) => {
      const saleItemRowitem = row.querySelector(".saleItemRowitem").value || "";
      const price = saleItemRowitem
        ? parseFloat(row.querySelector(".saleItemRowprice").value)
        : 0;
      const quantity =
        parseInt(row.querySelector(".saleItemRowquantity").value) || 1;
      const total = price * quantity;
      row.querySelector(".saleItemRowtotal").value = total.toFixed(2);
      grandTotalSale += total;
    });
    saleGrandTotalSpan.textContent = grandTotalSale.toFixed(2);
  }

  // Handle category selection
  function handleCategoryChangeSale(event) {
    const category = event.target.value;
    populateItemsSale(event.target, category);
  }

  // Handle item selection and price update
  function handleItemChangeSale(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const priceInput =
      event.target.parentElement.querySelector(".saleItemRowprice");

    const quantityInput = event.target.parentElement.querySelector(
      ".saleItemRowquantity"
    );

    if (selectedOption.dataset.price) {
      priceInput.value = selectedOption.dataset.price;
    } else {
      priceInput.value = "";
    }

    if (selectedOption.dataset.available) {
      quantityInput.max = selectedOption.dataset.available;
    } else {
      quantityInput.max = 0;
    }
    updateTotalsSale();
  }

  // Add new item row
  async function addItemRowSale() {
    const newRow = document.createElement("div");
    newRow.style.minWidth = "max-content";
    newRow.classList.add("saleItemRow", "d-flex", "align-items-center", "mb-2");

    newRow.innerHTML = `
                       <select class="saleItemRowcategory form-control me-2" required>
                         <option value="" disabled selected>Select Category</option>
                       </select>
                       <select class="saleItemRowitem form-control me-2" required>
                         <option value="" disabled selected>Select Item</option>
                       </select>
                       <input type="number" class="saleItemRowprice form-control me-2" placeholder="Price" readonly />
                       <input type="number" class="saleItemRowquantity form-control me-2" placeholder="Qty" min="1" value="1" />
                       <input type="number" class="saleItemRowtotal form-control me-2" placeholder="Total" readonly />
                       <button type="button" class="btn btn-danger removeItem">X</button>
                     `;

    itemsContainerSale2.appendChild(newRow);

    // Populate categories in the new row
    await populateCategoriesSale(newRow.querySelector(".saleItemRowcategory"));
  }

  // Event Listener for Add Item Button
  addItemButtonSale.addEventListener("click", addItemRowSale);

  //Event Delegation for dynamic elements
  itemsContainerSale2.addEventListener("change", async function (event) {
    if (event.target.classList.contains("saleItemRowcategory")) {
      handleCategoryChangeSale(event);
    } else if (event.target.classList.contains("saleItemRowitem")) {
      handleItemChangeSale(event);
    } else if (event.target.classList.contains("saleItemRowquantity")) {
      updateTotalsSale();
    }
  });

  // Remove item row
  itemsContainerSale2.addEventListener("click", function (event) {
    if (event.target.classList.contains("removeItem")) {
      // Check if there is more than one child
      if (itemsContainerSale2.children.length > 1) {
        event.target.parentElement.remove();
        updateTotalsSale();
      } else {
        //alert("At least one item must remain!");
        Toastify({
          text: "At least one item must remain!",
          duration: 1500,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
      }
    }
  });

  // Auto-fill current date
  document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString();

  // Initialize first row
  addItemRowSale();

  const salesOrderForm = document.getElementById("salesOrderForm");
  salesOrderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const salegrandTotal = document.getElementById("salegrandTotal").innerText;
    let saleOrder = {
      customer_name: customerName,
      phone_number: phoneNumber,
      sale_grand_total: salegrandTotal,
      items: [],
    };

    document.querySelectorAll(".saleItemRow").forEach((row) => {
      const item = row.querySelector(".saleItemRowitem").value || "";
      const price =
        parseFloat(row.querySelector(".saleItemRowprice").value) || 0;

      const quantity =
        parseInt(row.querySelector(".saleItemRowquantity").value) || 1;
      const total = price * quantity;
      saleOrder.items.push({
        product_id: item,
        item_qty: quantity,
        item_total_price: total,
      });
    });

    //console.log(saleOrder);

    fetch("/sale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleOrder),
    })
      .then((response) => response.text())
      .then((data) => {
        // alert(data);
        Toastify({
          text: data,
          duration: 2500,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();
        document.getElementById("salegrandTotal").innerText = "0";
        salesOrderForm.reset();
        itemsContainerSale2.innerHTML = "";
        addItemRowSale();
      })
      .catch((error) => console.error(error));
  });
}); ///this is ending of load
//pagination

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
  getCategories(page, (size = 5), (urlproduct = "getcategoriespage"));
  //console.log(event.target.id, page);
}

//purchase report fillter

document
  .getElementById("purchaseFilter")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElementById("invoiceSearch").value = "";
    let fromDate = document.getElementById("fromDate").value;
    let toDate = document.getElementById("toDate").value;
    // console.log(fromDate, toDate);
    fromDateForNextPrev = fromDate;
    toDateForNextPrev = toDate;
    getPurchaseReportByPage(
      (startDate = fromDate),
      (endDate = toDate),
      pagerpt,
      5
    );
  });

document.getElementById("purchaseFilter").addEventListener("reset", () => {
  getPurchaseReportByPage((startDate = today), (endDate = today), pagerpt, 5);
  fromDateForNextPrev = null;
  toDateForNextPrev = null;
});

let pureport = [];
function getPurchaseReportByPage(startDate, endDate, page, size) {
  const reportTable = document.getElementById("reportTable");
  fetch(
    "getpurchasereport?startDate=" +
      startDate +
      "&endDate=" +
      endDate +
      "&page=" +
      page +
      "&size=" +
      size,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      reportTable.innerHTML = "";

      // console.log(data.content);
      pureport = data.content;
      if (Array.isArray(data.content)) {
        data.content.forEach((report) => {
          reportTable.innerHTML +=
            "<tr>" +
            "<td>" +
            report.purchaseInvoice +
            "</td>" +
            "<td>" +
            report.updatedAt.split("T")[0] +
            "</td>" +
            " <td>" +
            report.grand_total +
            "</td>" +
            " <td onclick='viewpurchaserptdtl(" +
            report.id +
            ',"' +
            report.purchaseInvoice +
            '",' +
            report.supplier_id +
            ',"' +
            report.supplier_name +
            '","' +
            report.updatedAt.split("T")[0] +
            '",' +
            report.grand_total +
            ")'>" +
            " <a href='#' class='text-primary'><i class='fas fa-eye'></i></a>" +
            "</td>" +
            " </tr>";
        });
      }
    })
    .catch((error) => console.error(error));
}
function viewpurchaserptdtl(
  id,
  invoice,
  supplier_id,
  supplier_name,
  purchaseDate,
  grand_total
) {
  const purchaserptMaster = document.getElementById("purchaserptMaster");
  const purchaserptChild = document.getElementById("purchaserptChild");
  purchaserptChild.innerHTML = "";
  // console.log(
  //   id,
  //   invoice,
  //   supplier_id,
  //   supplier_name,
  //   purchaseDate,
  //   grand_total
  // );
  showSection("purReportdtl");
  purchaserptMaster.innerHTML =
    "<tr>" +
    "<td>" +
    invoice +
    "</td>" +
    " <td>" +
    supplier_name +
    "</td>" +
    " <td>" +
    purchaseDate +
    "</td>" +
    "   <td>" +
    grand_total +
    "</td>" +
    " </tr>";

  async function getPurchaseReport(id) {
    try {
      // Fetch the purchase report data
      const response = await fetch("getpurchasereport/" + id, {
        method: "GET",
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(async (product) => {
          // console.log(product);
          // Fetch the product data using the product_id from the first response
          const response2 = await fetch(
            "getproductbyid?product_id=" + product.product_id,
            {
              method: "GET",
            }
          );
          const data2 = await response2.json();

          // Log the product data
          //console.log(data2);

          purchaserptChild.innerHTML +=
            "  <tr>" +
            " <td>" +
            data2.category_name +
            "</td>" +
            "<td>" +
            data2.product_name +
            "</td>" +
            " <td>" +
            product.item_qty +
            "</td>" +
            " <td>" +
            data2.product_price +
            "</td>" +
            " </tr>";
        });
      }
    } catch (error) {
      // Catch and log any errors
      console.error(error);
    }
  }
  getPurchaseReport(id);
}

// purchase report page function

function purReportPage(event) {
  if (event.target.classList.contains("purReportNext") && pagerpt >= 0) {
    if (pureport.length == 0) {
      return;
    }
    pagerpt++;
  } else if (event.target.classList.contains("purReportPrev") && pagerpt > 0) {
    pagerpt--;
  }

  getPurchaseReportByPage(
    (startDate = fromDateForNextPrev ? fromDateForNextPrev : today),
    (endDate = toDateForNextPrev ? toDateForNextPrev : today),
    pagerpt,
    5
  );
  // console.log(pagerpt, pureport);
}

///
///
///
//for sale report

document.getElementById("saleFilter").addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("saleInvoiceSearch").value = "";
  let fromDateSale = document.getElementById("fromDateSale").value;
  let toDateSale = document.getElementById("toDateSale").value;
  //console.log(fromDateSale, toDateSale);
  fromDateSaleReport = fromDateSale;
  toDateSaleReport = toDateSale;
  getSaleReportByPage(
    (startDate = fromDateSaleReport),
    (endDate = toDateSaleReport),
    pagerpt,
    5
  );
});

document.getElementById("saleFilter").addEventListener("reset", () => {
  getSaleReportByPage((startDate = today), (endDate = today), pagerpt, 5);
  fromDateSaleReport = null;
  toDateSaleReport = null;
});

let saleReport = [];
function getSaleReportByPage(startDate, endDate, page, size) {
  const saleReportTable = document.getElementById("saleReportTable");
  fetch(
    "getsalesreport?startDate=" +
      startDate +
      "&endDate=" +
      endDate +
      "&page=" +
      page +
      "&size=" +
      size,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      saleReportTable.innerHTML = "";

      // console.log(data.content);
      saleReport = data.content;
      if (Array.isArray(data.content)) {
        data.content.forEach((report) => {
          saleReportTable.innerHTML +=
            "<tr>" +
            "<td>" +
            report.bill +
            "</td>" +
            "<td>" +
            report.curren_date +
            "</td>" +
            " <td>" +
            report.sale_grand_total +
            "</td>" +
            " <td onclick='viewsalereptrptdtl(" +
            report.id +
            ',"' +
            report.bill +
            '","' +
            report.customer_name +
            '","' +
            report.phone_number +
            '","' +
            report.curren_date +
            '",' +
            report.sale_grand_total +
            ")'>" +
            " <a href='#' class='text-primary'><i class='fas fa-eye'></i></a>" +
            "</td>" +
            " </tr>";
        });
      }
    })
    .catch((error) => console.error(error));
}

function viewsalereptrptdtl(
  id,
  bill,
  customer_name,
  phone_number,
  saleDate,
  grand_total
) {
  const saleRptMaster = document.getElementById("saleRptMaster");
  const saleRptChild = document.getElementById("saleRptChild");
  saleRptChild.innerHTML = "";
  // console.log(
  //   id,
  //   bill,
  //   customer_name,
  //   phone_number,
  //   saleDate,
  //   grand_total
  // );
  showSection("saleReportDtl");
  saleRptMaster.innerHTML =
    "<tr>" +
    "<td>" +
    bill +
    "</td>" +
    " <td>" +
    customer_name +
    " <td>" +
    phone_number +
    "</td>" +
    " <td>" +
    saleDate +
    "</td>" +
    "   <td>" +
    grand_total +
    "</td>";
  (" </tr>");

  async function getSaleReport(id) {
    try {
      // Fetch the sale report data
      const response = await fetch("getsalesreport/" + id, {
        method: "GET",
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(async (product) => {
          //console.log(product);
          // Fetch the product data using the product_id from the first response
          const response2 = await fetch(
            "getproductbyid?product_id=" + product.product_id,
            {
              method: "GET",
            }
          );
          const data2 = await response2.json();

          // Log the product data
          //console.log(data2);

          saleRptChild.innerHTML +=
            "  <tr>" +
            " <td>" +
            data2.category_name +
            "</td>" +
            "<td>" +
            data2.product_name +
            "</td>" +
            " <td>" +
            product.item_qty +
            "</td>" +
            " <td>" +
            data2.product_price +
            "</td>" +
            " </tr>";
        });
      }
    } catch (error) {
      // Catch and log any errors
      console.error(error);
    }
  }
  getSaleReport(id);
}

// Sale report page function
function saleReportPage(event) {
  if (
    event.target.classList.contains("saleReportNext") &&
    pageforsalereport >= 0
  ) {
    if (saleReport.length == 0) {
      return;
    }
    pageforsalereport++;
  } else if (
    event.target.classList.contains("saleReportPrev") &&
    pageforsalereport > 0
  ) {
    pageforsalereport--;
  }

  getSaleReportByPage(
    (startDate = fromDateSaleReport ? fromDateSaleReport : today),
    (endDate = toDateSaleReport ? toDateSaleReport : today),
    pageforsalereport,
    5
  );
  //console.log(pageforsalereport, saleReport);
}

////

///
//fetching stock
function stocktable() {
  fetch("stock", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const stocktable = document.getElementById("stockTable");
      // console.log(data);
      stocktable.innerHTML = "";
      if (Array.isArray(data)) {
        data.forEach((stock) => {
          stocktable.innerHTML +=
            "<tr>" +
            "<td>" +
            stock.category_name +
            "</td>" +
            "<td>" +
            stock.product_name +
            "</td>" +
            "<td>" +
            stock.product_price +
            "</td>" +
            "<td>" +
            stock.purchase +
            "</td>" +
            "<td>" +
            stock.sale +
            "</td>" +
            "<td>" +
            stock.available +
            "</td>" +
            "</tr>";
        });
      }
    })
    .catch((error) => console.error(error));
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

///
///
//find sale report by invoice number
document
  .getElementById("saleInvoiceSearch")
  .addEventListener("input", function () {
    const saleReportTable = document.getElementById("saleReportTable");
    const bill = this.value.trim().toUpperCase();

    fetch("sale?bill=" + bill, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Read as text first
      })
      .then((text) => {
        if (!text) {
          //console.log("No data found for this bill.");
          return null; // Handle empty response properly
        }
        return JSON.parse(text); // Manually parse JSON
      })
      .then((report) => {
        //console.log(report);
        document.querySelector(".saleReportPrev").style.display = "none";
        document.querySelector(".saleReportNext").style.display = "none";
        if (report) {
          saleReportTable.innerHTML = "";
          // data.forEach((report) => {
          saleReportTable.innerHTML +=
            "<tr>" +
            "<td>" +
            report.bill +
            "</td>" +
            "<td>" +
            report.curren_date +
            "</td>" +
            " <td>" +
            report.sale_grand_total +
            "</td>" +
            " <td onclick='viewsalereptrptdtl(" +
            report.id +
            ',"' +
            report.bill +
            '","' +
            report.customer_name +
            '","' +
            report.phone_number +
            '","' +
            report.curren_date +
            '",' +
            report.sale_grand_total +
            ")'>" +
            " <a href='#' class='text-primary'><i class='fas fa-eye'></i></a>" +
            "</td>" +
            " </tr>";
          //});
        }
      })
      .catch((error) => console.error(error));
  });

///
///
// Find purchase report by invoice number
document.getElementById("invoiceSearch").addEventListener("input", function () {
  const purchaseReportTable = document.getElementById("reportTable");
  const purchase_invoice = this.value.trim().toUpperCase();

  fetch("purchasereportbyinvoice?purchase_invoice=" + purchase_invoice, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text(); // Read as text first
    })
    .then((text) => {
      if (!text) {
        //console.log("No data found for this purchase invoice.");
        return null; // Handle empty response properly
      }
      return JSON.parse(text); // Manually parse JSON
    })
    .then((report) => {
      document.querySelector(".purReportPrev").style.display = "none";
      document.querySelector(".purReportNext").style.display = "none";
      //console.log(report);
      purchaseReportTable.innerHTML = "";
      if (report) {
        purchaseReportTable.innerHTML +=
          "<tr>" +
          "<td>" +
          report.purchaseInvoice +
          "</td>" +
          "<td>" +
          report.updatedAt.split("T")[0] +
          "</td>" +
          " <td>" +
          report.grand_total +
          "</td>" +
          " <td onclick='viewpurchaserptdtl(" +
          report.id +
          ',"' +
          report.purchaseInvoice +
          '",' +
          report.supplier_id +
          ',"' +
          report.supplier_name +
          '","' +
          report.updatedAt.split("T")[0] +
          '",' +
          report.grand_total +
          ")'>" +
          " <a href='#' class='text-primary'><i class='fas fa-eye'></i></a>" +
          "</td>" +
          " </tr>";
      }
    })
    .catch((error) => console.error(error));
});
