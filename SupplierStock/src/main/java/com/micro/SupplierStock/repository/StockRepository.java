package com.micro.SupplierStock.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.micro.SupplierStock.entity.StockEntity;

@Repository
public interface StockRepository extends JpaRepository<StockEntity, Long> {
    @Query(value = "SELECT * FROM stock WHERE product_id = :productId LIMIT 1", nativeQuery = true)
    Optional<StockEntity> findByProductId(@Param("productId") Long productId);

    @Query(value = "SELECT * FROM stock WHERE product_id = :productId LIMIT 1", nativeQuery = true)
    Optional<StockEntity> findByProductIdStockAvailable(@Param("productId") Long productId);

    @Query(value = "SELECT COUNT(*) FROM stock  WHERE available = 0", nativeQuery = true)
    Long findByOutOfStock();

    @Query(value = "SELECT COUNT(*) FROM stock  WHERE available < 5", nativeQuery = true)
    Long findByLowOfStock();

    @Query(value = "SELECT * FROM stock  ORDER BY sale_id DESC LIMIT 5", nativeQuery = true)
    List<StockEntity> findTop5Products();

    @Query(value = "SELECT * FROM stock  ORDER BY sale_id ASC LIMIT 5", nativeQuery = true)
    List<StockEntity> findLeast5Products();

    @Query(value = "SELECT * FROM stock  WHERE available = 0", nativeQuery = true)
    List<StockEntity> findListByOutOfStock();

    @Query(value = "SELECT * FROM stock  WHERE available < 5", nativeQuery = true)
    List<StockEntity> findListByLowOfStock();

}
