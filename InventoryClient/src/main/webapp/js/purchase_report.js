//purchase report fillter
const API_FOR_ORDER_SALE_PORT = "http://localhost:8888/ordersale";
const API_FOR_PRODUCT_CATEGORY_PORT = "http://localhost:8888/productcategory";
let pagerpt = 0; //page for purchase order report
// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];
let fromDateForNextPrev; // from date for puchase report
let toDateForNextPrev; // to date for puchase report

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
    API_FOR_ORDER_SALE_PORT +
      "/getpurchasereport?startDate=" +
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
            " <a href='#purReportdtlSection' class='text-primary'><i class='fas fa-eye'></i></a>" +
            "</td>" +
            " </tr>";
        });
      }
    })
    .catch((error) => console.error(error));
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
// Find purchase report by invoice number
document.getElementById("invoiceSearch").addEventListener("input", function () {
  const purchaseReportTable = document.getElementById("reportTable");
  const purchase_invoice = this.value.trim().toUpperCase();

  fetch(
    API_FOR_ORDER_SALE_PORT +
      "/purchasereportbyinvoice?purchase_invoice=" +
      purchase_invoice,
    {
      method: "GET",
    }
  )
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
        document.getElementById("purchaseFilter").reset();
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
          " <a href='#purReportdtlSection' class='text-primary'><i class='fas fa-eye'></i></a>" +
          "</td>" +
          " </tr>";
      }
    })
    .catch((error) => console.error(error));
});

getPurchaseReportByPage((startDate = today), (endDate = today), pagerpt, 5);

////
///
//get purchase report
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
  showSection("display");
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
      const response = await fetch(
        API_FOR_ORDER_SALE_PORT + "/getpurchasereport/" + id,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(async (product) => {
          // console.log(product);
          // Fetch the product data using the product_id from the first response
          const response2 = await fetch(
            API_FOR_PRODUCT_CATEGORY_PORT +
              "/getproductbyid?product_id=" +
              product.product_id,
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

function showSection(displayorhide) {
  if (displayorhide == "display") {
    document.getElementById("purReportdtlSection").style.display = "";
  } else {
    document.getElementById("purReportdtlSection").style.display = "none";
  }
}
