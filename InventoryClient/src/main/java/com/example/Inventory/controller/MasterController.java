package com.example.Inventory.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MasterController {

    @GetMapping("/")
    public String getDashboard(Model model) {

        return "index";
    }

    @GetMapping("/category")
    public String getIndex(Model model) {

        return "category";
    }

    @GetMapping("/product")
    public String getProduct(Model model) {

        return "product";
    }

    @GetMapping("/purchase")
    public String getPurchase(Model model) {

        return "purchase";
    }

    @GetMapping("/sales")
    public String getSale(Model model) {

        return "sale";
    }

    @GetMapping("/supplier")
    public String getSupplier(Model model) {

        return "supplier";
    }

    @GetMapping("/stocks")
    public String getStock(Model model) {

        return "stock";
    }

    @GetMapping("/purchase_report")
    public String getPurchaseReport(Model model) {

        return "purchase_report";
    }

    @GetMapping("/sale_report")
    public String getSaleReport(Model model) {

        return "sale_report";
    }

    @GetMapping("/out_of_stock")
    public String getOutOfStock(Model model) {
        return "out_of_stock";
    }

    @GetMapping("/low_stock")
    public String getLowStock(Model model) {
        return "low_stock";
    }

    @GetMapping("/total_products")
    public String getTotalProducts(Model model) {
        return "total_products";
    }

    @GetMapping("/total_profit")
    public String getTotalProfit(Model model) {
        return "total_profit";
    }

    @GetMapping("/websocket")
    public String getWebSocket(Model model) {
        return "websocket";
    }
}
