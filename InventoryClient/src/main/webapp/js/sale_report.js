let fromDateSaleReport; // from date for sale report
let toDateSaleReport; // from date for sale report

const MIN_GST = 0.05;
const MAX_GST = 0.18;

const API_FOR_ORDER_SALE_PORT = "http://localhost:8888/ordersale";
const API_FOR_PRODUCT_CATEGORY_PORT = "http://localhost:8888/productcategory";

let pageforsalereport = 0; //page for sale report
// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];
const nextDay = new Date(today);
nextDay.setDate(nextDay.getDate() + 1);
const formattedNextDay = nextDay.toISOString().split("T")[0];
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
    pageforsalereport,
    5
  );
});

document.getElementById("saleFilter").addEventListener("reset", () => {
  getSaleReportByPage(
    (startDate = today),
    (endDate = formattedNextDay),
    pageforsalereport,
    5
  );
  fromDateSaleReport = null;
  toDateSaleReport = null;
});

let saleReport = [];
function getSaleReportByPage(startDate, endDate, page, size) {
  const saleReportTable = document.getElementById("saleReportTable");
  fetch(
    API_FOR_ORDER_SALE_PORT +
      "/getsalesreport?startDate=" +
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
            " <a href='#saleReportDtlSection' class='text-primary'><i class='fas fa-eye'></i></a>" +
            "</td>" +
            " </tr>";
        });
      }
    })
    .catch((error) => console.error(error));
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
    (endDate = toDateSaleReport ? toDateSaleReport : formattedNextDay),
    pageforsalereport,
    5
  );
  //console.log(pageforsalereport, saleReport);
}

///
///
//find sale report by invoice number
document
  .getElementById("saleInvoiceSearch")
  .addEventListener("input", function () {
    const saleReportTable = document.getElementById("saleReportTable");
    const bill = this.value.trim().toUpperCase();

    fetch(API_FOR_ORDER_SALE_PORT + "/sale?bill=" + bill, {
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
        console.log(report);

        if (report) {
          document.querySelector(".saleReportPrev").style.display = "none";
          document.querySelector(".saleReportNext").style.display = "none";

          //document.getElementById("saleFilter").reset();
          console.log(report, saleReportTable);
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
            " <a href='#saleReportDtlSection' class='text-primary'><i class='fas fa-eye'></i></a>" +
            "</td>" +
            " </tr>";
          //});
        }
      })
      .catch((error) => console.error(error));
  });

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
  showSection("display");
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
      const response = await fetch(
        API_FOR_ORDER_SALE_PORT + "/getsalesreport/" + id,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(async (product) => {
          //console.log(product);
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

          saleRptChild.innerHTML +=
            "<tr>" +
            "<td>" +
            data2.category_name +
            "</td>" +
            "<td>" +
            data2.product_name +
            "</td>" +
            "<td>" +
            product.item_qty +
            "</td>" +
            "<td>" +
            (data2.product_price > 1000
              ? product.item_total_price - data2.product_price * MAX_GST
              : product.item_total_price - data2.product_price * MIN_GST) +
            "<td>" +
            product.item_total_price +
            "</td>" +
            "</tr>";
        });
      }
    } catch (error) {
      // Catch and log any errors
      console.error(error);
    }
  }
  getSaleReport(id);
}

getSaleReportByPage(
  (startDate = fromDateSaleReport ? fromDateSaleReport : today),
  (endDate = toDateSaleReport ? toDateSaleReport : formattedNextDay),
  (page = 0),
  (size = 5)
);

function showSection(displayorhide) {
  if (displayorhide == "display") {
    document.getElementById("saleReportDtlSection").style.display = "";
  } else {
    document.getElementById("saleReportDtlSection").style.display = "none";
  }
}
