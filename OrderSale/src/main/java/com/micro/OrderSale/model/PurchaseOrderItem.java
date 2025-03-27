package com.micro.OrderSale.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderItem {
    private Long product_id;
    private Long item_qty;
    private Double item_total_price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
