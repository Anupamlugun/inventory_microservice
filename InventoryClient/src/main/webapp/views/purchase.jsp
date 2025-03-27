<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>purchase</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <!-- Nav bar  -->
    <%@ include file="nav.jsp" %>
    <div class="container mt-5">
      <div id="purchaseOrderSection" class="container-fluid">
        <form
          id="purchaseOrderForm"
          class="p-4 bg-light rounded shadow-sm border"
        >
          <h2 class="mb-4 text-center text-primary fw-bold">
            Purchase Products
          </h2>

          <!-- Supplier & Invoice Section -->
          <div class="mb-4 p-3 bg-white rounded shadow-sm border">
            <div class="row align-items-center">
              <div class="col-md-6">
                <label class="fw-bold">Invoice:</label>
                <span id="purchaseInvoice" class="text-secondary ms-2"
                  >#12345</span
                >
              </div>
              <div class="col-md-6 text-md-end">
                <label class="fw-bold">Date:</label>
                <input
                  type="date"
                  name="purchaseDate"
                  id="purchaseDate"
                  class="form-control d-inline-block w-auto"
                  required
                />
              </div>
            </div>
            <div class="mt-3">
              <label for="supplier" class="form-label fw-bold">Supplier:</label>
              <select id="supplier" class="form-select border" required>
                <option value="" disabled selected>Select Supplier</option>
                <!-- Supplier options dynamically added here -->
              </select>
            </div>
          </div>

          <!-- Items Section -->
          <div
            id="itemsContainer"
            class="p-3 bg-white rounded shadow-sm border mb-4"
          >
            <h4 class="text-secondary fw-semibold">Items</h4>
            <div id="itemsContainer2" class="table-responsive">
              <!-- Dynamic items will be added here -->
            </div>
            <button
              id="purchaseButton"
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
              <span id="grandTotal" class="text-success fw-bold ms-2">0</span>
            </h4>
          </div>

          <!-- Purchase Order Button -->
          <div class="mt-4 text-center">
            <button
              type="submit"
              class="btn btn-primary btn-lg px-5 fw-semibold"
            >
              Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>

    <script src="<%=request.getContextPath()%>/js/purchase.js"></script>
    <%@ include file="footer_link.jsp" %>
  </body>
</html>
