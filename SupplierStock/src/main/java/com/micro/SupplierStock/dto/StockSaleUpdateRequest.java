package com.micro.SupplierStock.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockSaleUpdateRequest {

    private Long productId;
    private Long sale;
}
