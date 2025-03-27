-- Converting the data type of the column item_total_price to DECIMAL(10,2)
ALTER TABLE
    saleitems
ALTER COLUMN
    item_total_price TYPE DECIMAL(10, 2);

ALTER TABLE
    purchase_order_items
ALTER COLUMN
    item_total_price TYPE DECIMAL(10, 2);