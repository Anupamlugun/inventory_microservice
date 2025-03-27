//fetching stock
const API_FOR_SUPPLIER_STOCK_PORT = "http://localhost:8888/supplierstock";
function stocktable() {
  fetch(API_FOR_SUPPLIER_STOCK_PORT + "/stock", {
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

stocktable();
