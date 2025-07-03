CREATE TABLE product
(
    id            BIGINT AUTO_INCREMENT NOT NULL,
    name          VARCHAR(100) NULL,
    `description` VARCHAR(150) NULL,
    category      VARCHAR(255) NULL,
    price         DECIMAL NOT NULL,
    quantity      INT     NOT NULL,
    min_quantity  INT     NOT NULL,
    CONSTRAINT pk_product PRIMARY KEY (id)
);