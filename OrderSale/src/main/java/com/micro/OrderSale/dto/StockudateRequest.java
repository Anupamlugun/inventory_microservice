package com.micro.OrderSale.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockudateRequest {

    private Long productId;
    private Long purchase;

}
