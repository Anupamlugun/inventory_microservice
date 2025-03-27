package com.micro.SupplierStock.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.micro.SupplierStock.dto.StockSaleUpdateRequest;
import com.micro.SupplierStock.dto.StockUpdateRequest;
import com.micro.SupplierStock.dto.profit;
import com.micro.SupplierStock.entity.StockEntity;
import com.micro.SupplierStock.model.Stock;
import com.micro.SupplierStock.repository.StockRepository;
import com.micro.SupplierStock.service.StockService;

@RestController
public class StockController {
    @Autowired
    private StockService stockservice;

    @Autowired
    private StockRepository stockRepository;

    @GetMapping("stock")
    public List<Stock> getStk() {
        return stockservice.getStock();
    }

    @GetMapping("getstockavailablity/{productId}")
    public Optional<StockEntity> getStockAvailablity(@PathVariable Long productId) {

        return stockRepository.findByProductIdStockAvailable(productId);

    }

    @PostMapping("/updatestock")
    public String updateStock(@RequestBody StockUpdateRequest stock) {
        return stockservice.updateStock(stock);
    }

    @PostMapping("/updatesalestock")
    public String updateSaleStock(@RequestBody StockSaleUpdateRequest stock) {
        return stockservice.udateForSaleStock(stock);
    }

    @GetMapping("/updatestockstatus")
    public String updateStockStatus() {
        return stockservice.sendmessagewithwebsocket();
    }

    @GetMapping("gettotalprofit")
    public profit getTotalProfit() {
        return stockservice.getTotalProfit();
    }

    @GetMapping("gettopandleastproduct")
    public String getTopAndLeastProduct() {
        return stockservice.getTopAndLeastProduct();
    }

    @GetMapping("getlistoflowstock")
    public List<Stock> getListOfLowStock() {
        return stockservice.getListofLowStock();
    }

    @GetMapping("getListofoutofstock")
    public List<Stock> getListofOutofStock() {
        return stockservice.getListofOutofStock();
    }
}
