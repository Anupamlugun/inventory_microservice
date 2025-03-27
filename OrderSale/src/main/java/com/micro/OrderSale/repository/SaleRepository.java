package com.micro.OrderSale.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.micro.OrderSale.entity.SaleEntity;

@Repository
public interface SaleRepository extends JpaRepository<SaleEntity, Long> {
    @Query(value = "SELECT * FROM sale WHERE created_at BETWEEN :startDate AND :endDate", nativeQuery = true)
    Page<SaleEntity> findAllByUpdatedAtBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query(value = "SELECT * FROM sale WHERE bill = :bill", nativeQuery = true)
    Optional<SaleEntity> findSaleByInvoice(@Param("bill") String bill);
}
