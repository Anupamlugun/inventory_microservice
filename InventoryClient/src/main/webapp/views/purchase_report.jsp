<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>purchase report</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <!-- Nav bar  -->
    <%@ include file="nav.jsp" %>
    <div class="container mt-5">
      <div id="purchaseReportSection" class="container-fluid">
        <h2 class="mb-4 text-center text-primary fw-bold">Purchase Report</h2>

        <!-- Date Filter -->
        <form
          id="purchaseFilter"
          class="row g-3 mb-4 bg-light p-4 rounded shadow-sm border"
        >
          <div class="col-md-4">
            <label for="fromDate" class="form-label fw-bold">From Date:</label>
            <input
              type="date"
              id="fromDate"
              class="form-control border"
              required
            />
          </div>
          <div class="col-md-4">
            <label for="toDate" class="form-label fw-bold">To Date:</label>
            <input
              type="date"
              id="toDate"
              class="form-control border"
              required
            />
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button type="submit" class="btn btn-primary w-100 fw-semibold">
              Filter
            </button>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button type="reset" class="btn btn-secondary w-100 fw-semibold">
              Reset
            </button>
          </div>
        </form>

        <!-- Search Box for Invoice -->
        <div class="mb-4">
          <label for="invoiceSearch" class="form-label fw-bold"
            >Search Invoice:</label
          >
          <input
            type="text"
            id="invoiceSearch"
            class="form-control border"
            placeholder="Enter Invoice Number"
          />
        </div>

        <!-- Purchase Report Table -->
        <div class="table-responsive bg-white p-4 rounded shadow-sm border">
          <table class="table table-bordered table-striped text-center">
            <thead class="table-dark">
              <tr>
                <th>Purchase Invoice</th>
                <th>Date</th>
                <th>Grand Total</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody id="reportTable">
              <!-- Dynamic Data will be inserted here -->
            </tbody>
          </table>
        </div>

        <!-- Pagination Buttons -->
        <div class="d-flex justify-content-between mt-4">
          <button
            type="button"
            class="btn btn-outline-primary fw-semibold purReportPrev"
            onclick="purReportPage(event)"
          >
            Previous Page
          </button>
          <button
            type="button"
            class="btn btn-outline-primary fw-semibold purReportNext"
            onclick="purReportPage(event)"
          >
            Next Page
          </button>
        </div>
      </div>

      <div
        style="display: none"
        id="purReportdtlSection"
        class="container-fluid mt-5"
      >
        <!-- Back Button -->
        <button
          type="button"
          class="btn btn-outline-secondary mb-4 fw-semibold"
          onclick="showSection('hide')"
        >
          Hide Details
        </button>

        <h2 class="text-center text-primary fw-bold">
          Purchase Report Details
        </h2>

        <!-- Master Table: Purchase Summary -->
        <div
          class="table-responsive bg-white p-4 rounded shadow-sm border mt-4"
        >
          <h4 class="text-dark fw-semibold">Purchase Summary</h4>
          <table class="table table-bordered text-center">
            <thead class="table-dark">
              <tr>
                <th>Purchase Invoice</th>
                <th>Supplier Name</th>
                <th>Date</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody id="purchaserptMaster">
              <!-- Dynamic Data Will Be Inserted Here -->
            </tbody>
          </table>
        </div>

        <!-- Child Table: Purchased Products -->
        <div
          class="table-responsive bg-white p-4 rounded shadow-sm border mt-4"
        >
          <h4 class="text-dark fw-semibold">Purchased Products</h4>
          <table class="table table-bordered text-center">
            <thead class="table-dark">
              <tr>
                <th>Category Name</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody id="purchaserptChild">
              <!-- Dynamic Data Will Be Inserted Here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script src="<%=request.getContextPath()%>/js/purchase_report.js"></script>
    <%@ include file="footer_link.jsp" %>
  </body>
</html>
