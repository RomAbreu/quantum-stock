CREATE TABLE min_quantity_notification
(
    id                BIGINT   NOT NULL,
    product_id        BIGINT   NOT NULL,
    notification_date datetime NOT NULL,
    CONSTRAINT pk_min_quantity_notification PRIMARY KEY (id)
);

ALTER TABLE min_quantity_notification
    ADD CONSTRAINT uc_min_quantity_notification_product UNIQUE (product_id);

ALTER TABLE min_quantity_notification
    ADD CONSTRAINT FK_MIN_QUANTITY_NOTIFICATION_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);