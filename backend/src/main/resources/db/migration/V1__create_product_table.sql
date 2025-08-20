CREATE TABLE product
(
    id            BIGINT AUTO_INCREMENT NOT NULL,
    name          VARCHAR(100) NOT NULL,
    `description` VARCHAR(250) NOT NULL,
    category      VARCHAR(255) NOT NULL,
    price         DECIMAL      NOT NULL,
    quantity      INT          NOT NULL,
    min_quantity  INT          NOT NULL,
    is_active      BIT(1)       NOT NULL DEFAULT 1,
    CONSTRAINT pk_product PRIMARY KEY (id)
);