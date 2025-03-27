package com.micro.OrderSale.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.micro.OrderSale.model.PurchaseOrder;
import com.micro.OrderSale.model.PurchaseOrderItem;
import com.micro.OrderSale.service.PurchaseOrderServiceImpli;

@RestController
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderServiceImpli purchaseOrderServiceImli;

    @GetMapping("getpurchasecount")
    public Long getcount() {
        return purchaseOrderServiceImli.getPurchaseCount();
    }

    @GetMapping("getpurchasereport")
    public Page<PurchaseOrder> getPurRpt(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate,
            @RequestParam int page, @RequestParam int size) {
        return purchaseOrderServiceImli.getPurchaseReport(startDate, endDate, page, size);

    }

    @GetMapping("getpurchasereport/{purchase_id}")
    public List<PurchaseOrderItem> getPurchaseDtl(@PathVariable Long purchase_id) {

        return purchaseOrderServiceImli.getPurchaseDetail(purchase_id);

    }

    @PostMapping("/savepurchaseorder")
    public String savePurchaseOrd(@RequestBody PurchaseOrder purchaseOrder) {
        return purchaseOrderServiceImli.savePurchaseOrder(purchaseOrder);
    }

    @GetMapping("/purchasereportbyinvoice")
    public PurchaseOrder getPurchaseInv(@RequestParam String purchase_invoice) {
        return purchaseOrderServiceImli.getPurchaseByInvoice(purchase_invoice);

    }
}
