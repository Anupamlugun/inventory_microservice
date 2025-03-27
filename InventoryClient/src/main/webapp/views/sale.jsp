<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>sale</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <!-- Nav bar  -->
    <%@ include file="nav.jsp" %>
    <div class="container mt-5">
      <div id="saleSection" class="container-fluid">
        <form id="salesOrderForm" class="p-4 bg-light rounded shadow-sm border">
          <h2 class="mb-4 text-center text-primary fw-bold">Sales Products</h2>

          <!-- Customer & Date Section -->
          <div class="mb-4 p-3 bg-white rounded shadow-sm border">
            <div class="row">
              <div class="col-md-6">
                <label for="customerName" class="form-label fw-bold"
                  >Customer Name:</label
                >
                <input
                  type="text"
                  id="customerName"
                  class="form-control border"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div class="col-md-6">
                <label for="phoneNumber" class="form-label fw-bold"
                  >Phone Number:</label
                >
                <input
                  type="text"
                  id="phoneNumber"
                  class="form-control border"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
            <div class="mt-3">
              <label class="fw-bold">Date:</label>
              <span id="currentDate" class="text-secondary ms-2"></span>
            </div>
          </div>

          <!-- Items Section -->
          <div
            id="itemsContainersale"
            class="p-3 bg-white rounded shadow-sm border mb-4"
          >
            <h4 class="text-secondary fw-semibold">Items</h4>
            <div id="itemsContainersale2" class="table-responsive">
              <!-- Dynamic items will be added here -->
            </div>
            <button
              id="saleButton"
              type="button"
              class="btn btn-success mt-3 w-100 fw-semibold"
            >
              + Add Item
            </button>
          </div>

          <!-- Grand Total -->
          <div class="p-3 bg-white rounded shadow-sm border text-center">
            <h4 class="text-dark fw-bold">
              Grand Total:
              <span id="salegrandTotal" class="text-success fw-bold ms-2"
                >0</span
              >
            </h4>
          </div>

          <!-- Submit Button -->
          <div class="mt-4 text-center">
            <button
              type="submit"
              class="btn btn-primary btn-lg px-5 fw-semibold"
            >
              Submit Sale
            </button>
          </div>
        </form>
      </div>
    </div>

    <script src="<%=request.getContextPath()%>/js/sale.js"></script>
    <%@ include file="footer_link.jsp" %>
  </body>
</html>
