<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Low Stock</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <%@ include file="nav.jsp" %>
    <div class="container">
      <h2 class="text-center text-danger my-4">Low Stock Items</h2>
      <button onclick="history.back()" class="btn btn-primary mb-3">
        Back
      </button>
      <table class="table table-hover table-bordered text-center">
        <thead class="table-dark">
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody id="lowStockTable"></tbody>
      </table>
    </div>
    <%@ include file="footer_link.jsp" %>
    <script src="<%=request.getContextPath()%>js/lowandoutofstock.js"></script>
  </body>
</html>
