//sale section
const API_FOR_PRODUCT_CATEGORY_PORT = "http://localhost:8888/productcategory";
const API_FOR_ORDER_SALE_PORT = "http://localhost:8888/ordersale";
const MIN_GST = 0.05;
const MAX_GST = 0.18;
const MAX_PROFIT = 0.1;
const MIN_PROFIT = 0.05;

let product_seclected = [];

const itemsContainerSale2 = document.getElementById("itemsContainersale2");
document.addEventListener("DOMContentLoaded", function () {
  const addItemButtonSale = document.getElementById("saleButton");
  const saleGrandTotalSpan = document.getElementById("salegrandTotal");

  // Fetch categories from API
  async function fetchCategoriesSale() {
    try {
      const response = await fetch(
        API_FOR_PRODUCT_CATEGORY_PORT + "/getcategories"
      );
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
        API_FOR_PRODUCT_CATEGORY_PORT +
          "/getproducts/" +
          category +
          "/" +
          purchase_sale
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

    for (const item of items) {
      if (product_seclected.includes(item.product_id)) {
        continue; // Skip this item
      }

      const option = document.createElement("option");
      option.value = item.product_id;
      option.textContent = item.product_name;

      // Calculate price with GST
      option.dataset.price =
        item.product_price > 1000
          ? item.product_price * MAX_GST +
            item.product_price +
            item.product_price * MAX_PROFIT
          : item.product_price * MIN_GST +
            item.product_price +
            item.product_price * MIN_PROFIT;
      option.dataset.available = item.available;
      itemSelect.appendChild(option);
    }

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
        parseInt(row.querySelector(".saleItemRowquantity").value) || "";
      const total = price * quantity;
      row.querySelector(".saleItemRowtotal").value = total.toFixed(2);
      grandTotalSale += total;

      if (product_seclected.includes(parseInt(saleItemRowitem))) {
        console.log("Product already selected");
      } else {
        if (saleItemRowitem != "") {
          product_seclected.push(parseInt(saleItemRowitem));
        }
      }
      console.log(product_seclected);
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
                       <input type="number" class="saleItemRowquantity form-control me-2" placeholder="Qty" min="1" required />
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
        console.log(
          event.target.parentElement.querySelector(".saleItemRowitem").value
        );
        const valueToRemove = parseInt(
          event.target.parentElement.querySelector(".saleItemRowitem").value
        );
        const index = product_seclected.indexOf(valueToRemove);
        if (index > -1) {
          product_seclected.splice(index, 1);
        }
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

    fetch(API_FOR_ORDER_SALE_PORT + "/sale", {
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
