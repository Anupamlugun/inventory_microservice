package com.micro.SupplierStock.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.micro.SupplierStock.dto.StockSaleUpdateRequest;
import com.micro.SupplierStock.dto.StockUpdateRequest;
import com.micro.SupplierStock.dto.profit;
import com.micro.SupplierStock.entity.StockEntity;
import com.micro.SupplierStock.model.ProCatDtls;
import com.micro.SupplierStock.model.Stock;
import com.micro.SupplierStock.repository.StockRepository;

@Service
public class StockServiceImpli implements StockService {
    @Autowired
    private StockRepository stockRepository;

    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;
    private final SimpMessagingTemplate messagingTemplate;

    StockServiceImpli(RestTemplate restTemplate, ObjectMapper mapper, SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        this.mapper = mapper;
        this.restTemplate = restTemplate;
    }

    @Override
    public List<Stock> getStock() {
        List<StockEntity> stockEntities = stockRepository.findAll();

        List<Stock> stocks = new ArrayList<>();
        for (StockEntity stockEntity : stockEntities) {
            Stock stock = new Stock();
            BeanUtils.copyProperties(stockEntity, stock);

            ProCatDtls proCatDtls = restTemplate.getForObject(
                    "http://PRODUCTCATEGORY/getproductdetailsbyproid/" + stockEntity.getProductId(),
                    ProCatDtls.class);

            stock.setCategory_name(proCatDtls.getCategory_name());
            stock.setProduct_name(proCatDtls.getProduct_name());
            stock.setProduct_price(proCatDtls.getProduct_price());
            stock.setSale(stockEntity.getSaleId());
            stock.setPurchase(stockEntity.getPurchaseId());
            stocks.add(stock);

        }
        return stocks;
    }

    @Override
    public String updateStock(StockUpdateRequest stock) {
        if (stock.getProductId() == null || stock.getPurchase() == null) {
            return "Product ID, Purchase quantity and Update time cannot be null";
        }

        Optional<StockEntity> existingStock = stockRepository.findByProductId(stock.getProductId());

        if (existingStock.isPresent()) {
            // If product exists, update stock quantity
            StockEntity stockEntityExist = existingStock.get();
            stockEntityExist.purchaseStock(stock.getPurchase());
            stockRepository.save(stockEntityExist);
        } else {
            // If product does not exist, create a new stock entry
            StockEntity newStockEntity = new StockEntity();
            newStockEntity.setProductId(stock.getProductId());
            newStockEntity.purchaseStock(stock.getPurchase());
            stockRepository.save(newStockEntity);
        }

        return "Purchase stock updated";
    }

    @Override
    public String udateForSaleStock(StockSaleUpdateRequest stock) {
        if (stock.getProductId() == null || stock.getSale() == null) {
            return "Product ID and Purchase quantity cannot be null";
        }

        Optional<StockEntity> existingStock = stockRepository.findByProductId(stock.getProductId());

        if (existingStock.isPresent()) {
            // If product exists, update stock quantity
            StockEntity stockEntityExist = existingStock.get();
            stockEntityExist.saleStock(stock.getSale());
            stockRepository.save(stockEntityExist);
        } else {
            // If product does not exist, create a new stock entry
            StockEntity newStockEntity = new StockEntity();
            newStockEntity.setProductId(stock.getProductId());
            newStockEntity.saleStock(stock.getSale());
            stockRepository.save(newStockEntity);
        }

        return "Sale stock updated";
    }

    @KafkaListener(topics = "purchaseupdatestock", groupId = "supplier-stock")
    public void consume(String record) {
        System.out.println("RAW: " + record);
        try {
            String json = mapper.readValue(record, String.class);
            StockUpdateRequest stockUpdateRequest = mapper.readValue(json, StockUpdateRequest.class);
            System.out.println("JSON: " + json);
            System.out.println("stockUpdateRequest: " + stockUpdateRequest);
            updateStock(stockUpdateRequest);

            // Send message to WebSocket
            sendmessagewithwebsocket();
        } catch (Exception e) {
            System.err.println("Error processing Kafka message: " + e.getMessage());
        }
    }

    @KafkaListener(topics = "saleupdatestock", groupId = "supplier-stock")
    public void consumeSale(String record) {
        System.out.println("RAW: " + record);
        try {
            String json = mapper.readValue(record, String.class);
            StockSaleUpdateRequest stockSaleUpdateRequest = mapper.readValue(json, StockSaleUpdateRequest.class);
            System.out.println("JSON: " + json);
            System.out.println("stockSaleUpdateRequest: " + stockSaleUpdateRequest);
            udateForSaleStock(stockSaleUpdateRequest);
            // Send message to WebSocket
            sendmessagewithwebsocket();
            getTotalProfit();
        } catch (Exception e) {
            System.err.println("Error processing Kafka message: " + e.getMessage());
        }
    }

    @Override
    public String sendmessagewithwebsocket() {
        Long outOfStock = stockRepository.findByOutOfStock();
        Long lowOfStock = stockRepository.findByLowOfStock();

        Map<String, Long> stockStatus = Map.of("outOfStock", outOfStock,
                "lowOfStock", lowOfStock);

        messagingTemplate.convertAndSend("/topic/stockStatus", stockStatus);

        return "Stock status sent to WebSocket";
    }

    @Override
    public profit getTotalProfit() {

        Double total_purchase_amount = 0.0;
        Double total_sale_amount = 0.0;

        // profit and tax calculation
        Double MIN_GST = 0.05;
        Double MAX_GST = 0.18;
        Double MAX_PROFIT = 0.1;
        Double MIN_PROFIT = 0.05;
        Double GST = 0.1;

        List<StockEntity> stockEntities = stockRepository.findAll();
        for (StockEntity stockEntity : stockEntities) {
            ProCatDtls proCatDtls = restTemplate.getForObject(
                    "http://PRODUCTCATEGORY/getproductdetailsbyproid/" + stockEntity.getProductId(),
                    ProCatDtls.class);

            total_purchase_amount += proCatDtls.getProduct_price() * stockEntity.getSaleId();
            total_sale_amount += proCatDtls.getProduct_price() > 1000
                    ? (proCatDtls.getProduct_price() * MAX_GST) + (proCatDtls.getProduct_price() * MAX_PROFIT)
                            + proCatDtls.getProduct_price() * stockEntity.getSaleId()
                    : (proCatDtls.getProduct_price() * MIN_GST) + (proCatDtls.getProduct_price() * MIN_PROFIT)
                            + proCatDtls.getProduct_price() * stockEntity.getSaleId();

        }

        profit profit = new profit();
        profit.setTotal_purchase_amount(total_purchase_amount);
        profit.setTotal_sale_amount(total_sale_amount);
        profit.setTotal_profit(total_sale_amount - total_purchase_amount);
        profit.setGst_deduction(GST * total_sale_amount);
        profit.setTotal_profit_after_gst(total_sale_amount - total_purchase_amount - profit.getGst_deduction());

        messagingTemplate.convertAndSend("/topic/totalProfit", profit);
        return profit;
    }

    @Override
    public String getTopAndLeastProduct() {

        List<StockEntity> topproducts = stockRepository.findTop5Products();
        List<StockEntity> leastproducts = stockRepository.findLeast5Products();

        List<Stock> topProducts = new ArrayList<>();
        List<Stock> leastProducts = new ArrayList<>();

        for (StockEntity top : topproducts) {
            Stock stock = new Stock();
            BeanUtils.copyProperties(top, stock);

            ProCatDtls proCatDtls = restTemplate.getForObject(
                    "http://PRODUCTCATEGORY/getproductdetailsbyproid/" + top.getProductId(),
                    ProCatDtls.class);

            stock.setCategory_name(proCatDtls.getCategory_name());
            stock.setProduct_name(proCatDtls.getProduct_name());
            stock.setProduct_price(proCatDtls.getProduct_price());
            stock.setSale(top.getSaleId());
            stock.setPurchase(top.getPurchaseId());
            topProducts.add(stock);

        }
        for (StockEntity least : leastproducts) {
            Stock stock = new Stock();
            BeanUtils.copyProperties(least, stock);

            ProCatDtls proCatDtls = restTemplate.getForObject(
                    "http://PRODUCTCATEGORY/getproductdetailsbyproid/" + least.getProductId(),
                    ProCatDtls.class);

            stock.setCategory_name(proCatDtls.getCategory_name());
            stock.setProduct_name(proCatDtls.getProduct_name());
            stock.setProduct_price(proCatDtls.getProduct_price());
            stock.setSale(least.getSaleId());
            stock.setPurchase(least.getPurchaseId());
            leastProducts.add(stock);

        }

        Map<String, List<Stock>> topLeastProducts = Map.of("topProducts", topProducts,
                "leastProducts", leastProducts);

        messagingTemplate.convertAndSend("/topic/topLeastProducts", topLeastProducts);

        return "Top and least product sent to WebSocket";
    }

    @Override
    public List<Stock> getListofLowStock() {
        List<StockEntity> stockEntities = stockRepository.findListByLowOfStock();

        List<Stock> stocks = new ArrayList<>();
        for (StockEntity stockEntity : stockEntities) {
            Stock stock = new Stock();
            BeanUtils.copyProperties(stockEntity, stock);

            ProCatDtls proCatDtls = restTemplate.getForObject(
                    "http://PRODUCTCATEGORY/getproductdetailsbyproid/" + stockEntity.getProductId(),
                    ProCatDtls.class);

            stock.setCategory_name(proCatDtls.getCategory_name());
            stock.setProduct_name(proCatDtls.getProduct_name());
            stock.setProduct_price(proCatDtls.getProduct_price());
            stock.setSale(stockEntity.getSaleId());
            stock.setPurchase(stockEntity.getPurchaseId());
            stocks.add(stock);

        }
        return stocks;
    }

    @Override
    public List<Stock> getListofOutofStock() {
        List<StockEntity> stockEntities = stockRepository.findListByOutOfStock();

        List<Stock> stocks = new ArrayList<>();
        for (StockEntity stockEntity : stockEntities) {
            Stock stock = new Stock();
            BeanUtils.copyProperties(stockEntity, stock);

            ProCatDtls proCatDtls = restTemplate.getForObject(
                    "http://PRODUCTCATEGORY/getproductdetailsbyproid/" + stockEntity.getProductId(),
                    ProCatDtls.class);

            stock.setCategory_name(proCatDtls.getCategory_name());
            stock.setProduct_name(proCatDtls.getProduct_name());
            stock.setProduct_price(proCatDtls.getProduct_price());
            stock.setSale(stockEntity.getSaleId());
            stock.setPurchase(stockEntity.getPurchaseId());
            stocks.add(stock);

        }
        return stocks;
    }

}
