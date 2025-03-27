<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inventory Dashboard</title>
    <%@ include file="header_link.jsp" %>

    <style>
      .card {
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease-in-out;
      }
      .card:hover {
        transform: scale(1.1);
      }
      .table-responsive {
        border-radius: 12px;
        overflow: hidden;
      }
      h4 {
        border-bottom: 3px solid #007bff;
        padding-bottom: 8px;
        margin-bottom: 20px;
      }
      .dashboard-title {
        font-weight: bold;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <%@ include file="nav.jsp" %>
    <div class="container">
      <h2 class="text-center text-primary my-4 dashboard-title">
        Inventory Dashboard
      </h2>

      <div class="row text-center">
        <div class="col-md-3">
          <a href="out_of_stock" class="text-decoration-none">
            <div class="card text-white bg-warning mb-3">
              <div class="card-body">
                <h5 class="card-title">Out of Stock</h5>
                <p id="out_of_stock" class="card-text display-6"></p>
              </div>
            </div>
          </a>
        </div>
        <div class="col-md-3">
          <a href="total_profit" class="text-decoration-none">
            <div class="card text-white bg-success mb-3">
              <div class="card-body">
                <h5 class="card-title">Total Profit</h5>
                <p id="total_profit" class="card-text display-6"></p>
              </div>
            </div>
          </a>
        </div>
        <div class="col-md-3">
          <a href="product#product_details" class="text-decoration-none">
            <div class="card text-white bg-info mb-3">
              <div class="card-body">
                <h5 class="card-title">Total Products</h5>
                <p id="total_products" class="card-text display-6"></p>
              </div>
            </div>
          </a>
        </div>
        <div class="col-md-3">
          <a href="low_stock" class="text-decoration-none">
            <div class="card text-white bg-danger mb-3">
              <div class="card-body">
                <h5 class="card-title">Low Stock</h5>
                <p id="low_stock" class="card-text display-6"></p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div class="table-responsive bg-white p-4 rounded shadow-sm mt-4">
        <h4 class="text-dark">Top Selling Products</h4>
        <table class="table table-hover table-bordered text-center">
          <thead class="table-dark">
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sold Quantity</th>
            </tr>
          </thead>
          <tbody id="topSellingProductsTable">
            <!-- dynamic data will be inserted here -->
          </tbody>
        </table>
      </div>

      <div class="table-responsive bg-white p-4 rounded shadow-sm mt-4">
        <h4 class="text-dark">Least Selling Products</h4>
        <table class="table table-hover table-bordered text-center">
          <thead class="table-dark">
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sold Quantity</th>
            </tr>
          </thead>
          <tbody id="leastSellingProductsTable">
            <!-- dynamic data will be inserted here -->
          </tbody>
        </table>
      </div>
    </div>

    <%@ include file="footer_link.jsp" %>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.1/sockjs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
    <script src="<%=request.getContextPath()%>/js/index.js"></script>
  </body>
</html>
