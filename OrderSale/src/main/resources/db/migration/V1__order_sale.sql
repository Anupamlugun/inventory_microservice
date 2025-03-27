CREATE TABLE purchase_order (
    id SERIAL PRIMARY KEY,
    purchase_invoice VARCHAR(255),
    purchase_date DATE NOT NULL,
    supplier_id BIGINT NOT NULL,
    grand_total BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    item_qty BIGINT,
    item_total_price BIGINT,
    purchase_order_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_purchase_order FOREIGN KEY (purchase_order_id) REFERENCES purchase_order(id) ON DELETE CASCADE
);

CREATE TABLE sale (
    id SERIAL PRIMARY KEY,
    bill VARCHAR(255) NOT NULL,
    sale_date DATE DEFAULT CURRENT_DATE,
    customer_name VARCHAR(255),
    sale_grand_total DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saleitems (
    id SERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    item_qty BIGINT,
    item_total_price BIGINT,
    sale_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sale FOREIGN KEY (sale_id) REFERENCES sale(id) ON DELETE CASCADE
);