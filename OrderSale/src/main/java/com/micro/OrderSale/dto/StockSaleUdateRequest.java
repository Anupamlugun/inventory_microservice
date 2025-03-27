package com.micro.OrderSale.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockSaleUdateRequest {

    private Long productId;
    private Long sale;
}
