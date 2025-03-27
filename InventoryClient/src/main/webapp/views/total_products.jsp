<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Total Products</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <%@ include file="nav.jsp" %>
    <div class="container">
      <h2 class="text-center text-info my-4">Total Products</h2>
      <button onclick="history.back()" class="btn btn-primary mb-3">
        Back
      </button>
      <div class="alert alert-info" role="alert">
        <h4 class="alert-heading">Total Products Available:</h4>
        <p class="display-4">1,200</p>
      </div>
    </div>
    <%@ include file="footer_link.jsp" %>
  </body>
</html>
