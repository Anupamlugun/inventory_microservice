package com.micro.SupplierStock.service;

import java.util.List;

import com.micro.SupplierStock.dto.StockSaleUpdateRequest;
import com.micro.SupplierStock.dto.StockUpdateRequest;
import com.micro.SupplierStock.dto.profit;
import com.micro.SupplierStock.model.Stock;

public interface StockService {
    List<Stock> getStock();

    String updateStock(StockUpdateRequest stock);

    String udateForSaleStock(StockSaleUpdateRequest stock);

    String sendmessagewithwebsocket();

    profit getTotalProfit();

    String getTopAndLeastProduct();

    List<Stock> getListofLowStock();

    List<Stock> getListofOutofStock();
}
