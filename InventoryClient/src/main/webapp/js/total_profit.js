const API_PORT = "http://localhost:8888/supplierstock";
const profitdescription = document.getElementById("profitdescription");

if (profitdescription) {
  fetch(API_PORT + "/gettotalprofit", { method: "GET" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error! Status: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      console.log("Profit Data:", data);
      profitdescription.innerHTML = ""; // Clear previous content

      if (data != null) {
        var profit = data; // Assuming data contains only one profit object

        var financialSummary =
          "<h4 class='alert-heading'>Financial Summary:</h4>" +
          "<p class='mb-2'><strong>Total Purchased Amount:</strong> ₹" +
          profit.total_purchase_amount +
          "</p>" +
          "<p class='mb-2'><strong>Total Sales Amount:</strong> ₹" +
          profit.total_sale_amount +
          "</p>" +
          "<p class='mb-2'><strong>Gross Profit:</strong> ₹" +
          profit.total_profit +
          "</p>" +
          "<p class='mb-2'><strong>GST Deducted:</strong> ₹" +
          profit.gst_deduction +
          "</p>" +
          "<p class='display-4'><strong>Net Profit Earned:</strong> ₹" +
          profit.total_profit_after_gst +
          "</p>";

        profitdescription.innerHTML = financialSummary;
      } else {
        profitdescription.innerHTML =
          "<p class='text-muted'>No financial data available.</p>";
      }
    })
    .catch(function (error) {
      console.error("Fetch error (profit data):", error);
      profitdescription.innerHTML =
        "<p class='text-danger'>Error loading financial data.</p>";
    });
}
