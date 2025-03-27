const API_PORT = "http://localhost:8888/supplierstock";
const lowStockTable = document.getElementById("lowStockTable");
const outOfStockTable = document.getElementById("outOfStockTable");

if (lowStockTable) {
  fetch(API_PORT + "/getlistoflowstock", { method: "GET" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error! Status: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      console.log("Low Stock Data:", data);
      lowStockTable.innerHTML = ""; // Clear previous data
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(function (stock) {
          lowStockTable.insertAdjacentHTML(
            "beforeend",
            "<tr>" +
              "<td>" +
              stock.product_name +
              "</td>" +
              "<td>" +
              stock.category_name +
              "</td>" +
              "<td>" +
              stock.available +
              "</td>" +
              "</tr>"
          );
        });
      } else {
        lowStockTable.innerHTML =
          "<tr><td colspan='3'>No low stock items found.</td></tr>";
      }
    })
    .catch(function (error) {
      console.error("Fetch error (low stock):", error);
    });
}

if (outOfStockTable) {
  fetch(API_PORT + "/getListofoutofstock", { method: "GET" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error! Status: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      console.log("Out of Stock Data:", data);
      outOfStockTable.innerHTML = ""; // Clear previous data
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(function (stock) {
          outOfStockTable.insertAdjacentHTML(
            "beforeend",
            "<tr>" +
              "<td>" +
              stock.product_name +
              "</td>" +
              "<td>" +
              stock.category_name +
              "</td>" +
              "<td>" +
              stock.available +
              "</td>" +
              "</tr>"
          );
        });
      } else {
        outOfStockTable.innerHTML =
          "<tr><td colspan='3'>No out-of-stock items found.</td></tr>";
      }
    })
    .catch(function (error) {
      console.error("Fetch error (out of stock):", error);
    });
}
