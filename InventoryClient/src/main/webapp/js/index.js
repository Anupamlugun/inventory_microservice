const out_of_stock = document.getElementById("out_of_stock");
const total_profit = document.getElementById("total_profit");
const total_products = document.getElementById("total_products");
const low_stock = document.getElementById("low_stock");
const topSellingProductsTable = document.getElementById(
  "topSellingProductsTable"
);
const leastSellingProductsTable = document.getElementById(
  "leastSellingProductsTable"
);

// Array of element IDs that need the spinner
const elements = [
  "out_of_stock",
  "total_profit",
  "total_products",
  "low_stock",
];

// Function to set the spinner
function showSpinner(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML =
      '<div class="spinner-border text-dark" role="status">' +
      '<span class="visually-hidden">Loading...</span>' +
      "</div>";
  }
}

// Apply spinner to all elements
elements.forEach(showSpinner);

async function connectWebSocket() {
  return new Promise((resolve, reject) => {
    var socket1 = new SockJS("http://localhost:8082/ws");
    var stompClient1 = Stomp.over(socket1);

    var socket2 = new SockJS("http://localhost:8081/ws");
    var stompClient2 = Stomp.over(socket2);

    let connectionsEstablished = 0;
    let clients = { stompClient1, stompClient2 };

    const handleConnect = () => {
      connectionsEstablished++;
      if (connectionsEstablished === 2) {
        resolve(clients);
      }
    };

    const handleError = (error) => {
      console.error("WebSocket connection error:", error);
      reject(error);
    };

    stompClient1.connect(
      {},
      () => {
        stompClient1.subscribe("/topic/stockStatus", (message) => {
          console.log("Stock Status:", JSON.parse(message.body));
          const stockStatus = JSON.parse(message.body);
          out_of_stock.innerHTML = stockStatus.outOfStock;
          low_stock.innerHTML = stockStatus.lowOfStock;
        });

        stompClient1.subscribe("/topic/totalProfit", (message) => {
          console.log("Total Profit:", JSON.parse(message.body));
          const profit = JSON.parse(message.body);
          total_profit.innerHTML =
            "<span>₹" + profit.total_profit_after_gst + "</span>";
        });

        stompClient1.subscribe("/topic/topLeastProducts", (message) => {
          const topLeastProducts = JSON.parse(message.body);
          console.log(topLeastProducts);

          topLeastProducts.topProducts.forEach((product) => {
            topSellingProductsTable.innerHTML +=
              "<tr>" +
              "<td>" +
              product.product_name +
              "</td>" +
              "<td>" +
              product.category_name +
              "</td>" +
              "<td>" +
              product.sale +
              "</td>" +
              "</tr>";
          });

          topLeastProducts.leastProducts.forEach((product) => {
            leastSellingProductsTable.innerHTML +=
              "<tr>" +
              "<td>" +
              product.product_name +
              "</td>" +
              "<td>" +
              product.category_name +
              "</td>" +
              "<td>" +
              product.sale +
              "</td>" +
              "</tr>";
          });
        });

        handleConnect();
      },
      handleError
    );

    stompClient2.connect(
      {},
      () => {
        stompClient2.subscribe("/topic/totalProducts", (message) => {
          console.log("Total Products:", JSON.parse(message.body));
          total_products.innerHTML = JSON.parse(message.body);
        });
        handleConnect();
      },
      handleError
    );
  });
}

async function updateDashboard() {
  try {
    const endpoints = [
      {
        url: "http://localhost:8888/supplierstock/updatestockstatus",
        label: "Stock Status",
      },
      {
        url: "http://localhost:8888/productcategory/gettotalproducts",
        label: "Total Products",
      },
      {
        url: "http://localhost:8888/supplierstock/gettotalprofit",
        label: "Total Profit",
      },
      {
        url: "http://localhost:8888/supplierstock/gettopandleastproduct",
        label: "Top and Least Products",
      },
    ];

    const fetchPromises = endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint.url);
        const data = await response.text();
        console.log(`${endpoint.label}: ${data}`);
      } catch (error) {
        console.error(`Error fetching ${endpoint.label}:`, error);
      }
    });

    await Promise.allSettled(fetchPromises);
  } catch (error) {
    console.error("Error updating dashboard:", error);
  }
}

async function main() {
  try {
    console.log("Connecting WebSocket...");
    await connectWebSocket();
    console.log("WebSocket connected. Fetching dashboard data...");
    await updateDashboard();
  } catch (error) {
    console.error("Error in execution:", error);
  }
}

main();
