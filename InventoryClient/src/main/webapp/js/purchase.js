let purchaseInvoice;
const API_FOR_PRODUCT_CATEGORY_PORT = "http://localhost:8888/productcategory";
const API_FOR_SUPPLIER_STOCK_PORT = "http://localhost:8888/supplierstock";
const API_FOR_ORDER_SALE_PORT = "http://localhost:8888/ordersale";

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];
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
  fetch(API_FOR_ORDER_SALE_PORT + "/savepurchaseorder", {
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

//fetch invoice
function currentPurchaseInvoice() {
  fetch(API_FOR_ORDER_SALE_PORT + "/getpurchasecount", {
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

//get supplier function

function getSupplier() {
  //const supplierTableElement = document.getElementById("supplierTable");
  const supplierElement = document.getElementById("supplier");
  fetch(API_FOR_SUPPLIER_STOCK_PORT + "/getsupplier", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      //supplierTableElement.innerHTML = "";
      supplierElement.innerHTML =
        "<option value='' disabled selected>Select Supplier</option>";
      data.forEach((supplier) => {
        ////console.log(supplier);

        //for suppler table
        // supplierTableElement.innerHTML +=
        //   "<tr><td>" +
        //   supplier.supplier_name +
        //   "</td><td>" +
        //   supplier.supplier_phone +
        //   "</td><td>" +
        //   supplier.supplier_email +
        //   "</td><td>" +
        //   supplier.supplier_address +
        //   "</td><td class='action'>" +
        //   '<button class="btn btn-danger mt-2" onclick="deleteSupplier(' +
        //   supplier.supplier_id +
        //   ')">Delete</button>' +
        //   '<button class="btn btn-info mt-2" onclick="editSupplier(' +
        //   supplier.supplier_id +
        //   ", '" +
        //   supplier.supplier_name +
        //   "', '" +
        //   supplier.supplier_phone +
        //   "', '" +
        //   supplier.supplier_email +
        //   "', '" +
        //   supplier.supplier_address +
        //   "')\">Edit</button>" +
        //   "</td></tr>";

        //for supller name
        supplierElement.innerHTML +=
          "<option value='" +
          supplier.supplier_id +
          "'>" +
          supplier.supplier_name +
          "</option>";
      });
    })
    .catch((error) => console.error(error));
}

//purchase order

const itemsContainer2 = document.getElementById("itemsContainer2");
const addItemButton = document.getElementById("purchaseButton");
const grandTotalSpan = document.getElementById("grandTotal");

//const API_BASE_URL = "http://localhost:8080/"; // Change this to your API base URL

// Function to fetch categories from API
async function fetchCategories() {
  try {
    const response = await fetch(
      API_FOR_PRODUCT_CATEGORY_PORT + "/getcategories"
    );
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
      API_FOR_PRODUCT_CATEGORY_PORT +
        "/getproducts/" +
        category +
        "/" +
        purchase_sale
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
                         <input type="number" class="purchaseItemRowquantity form-control me-2" placeholder="Qty" min="1"  required />
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

getSupplier();
currentPurchaseInvoice();
document.getElementById("purchaseDate").value = today;
