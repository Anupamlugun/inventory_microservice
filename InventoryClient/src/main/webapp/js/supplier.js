//Supplier
let currentEditSupplierId = null;
const API_PORT = "http://localhost:8888/supplierstock";
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
    : "/savesupplier";
  fetch(API_PORT + url, {
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

//get supplier function

function getSupplier() {
  const supplierTableElement = document.getElementById("supplierTable");
  //const supplierElement = document.getElementById("supplier");
  fetch(API_PORT + "/getsupplier", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      supplierTableElement.innerHTML = "";
      //   supplierElement.innerHTML =
      //     "<option value='' disabled selected>Select Supplier</option>";
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

        // //for supller name
        // supplierElement.innerHTML +=
        //   "<option value='" +
        //   supplier.supplier_id +
        //   "'>" +
        //   supplier.supplier_name +
        //   "</option>";
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

    fetch(API_PORT + "/deletesupplier/" + supplier_id, {
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

getSupplier();
