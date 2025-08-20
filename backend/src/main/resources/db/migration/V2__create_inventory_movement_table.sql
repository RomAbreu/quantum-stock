CREATE TABLE inventory_movement
(
    id              BIGINT AUTO_INCREMENT NOT NULL,
    product_id      BIGINT       NOT NULL,
    quantity_change INT          NOT NULL,
    type            VARCHAR(255) NULL,
    user            VARCHAR(255) NOT NULL,
    date            datetime     NOT NULL,
    CONSTRAINT pk_inventory_movement PRIMARY KEY (id)
);

ALTER TABLE inventory_movement
    ADD CONSTRAINT FK_INVENTORY_MOVEMENT_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);