CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name character varying(60),
    last_name character varying(80)
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    street character varying(255),
    city character varying(60),
    state character varying(2),
    zip character varying(12),
    address_type character varying(8),
    customer_id integer REFERENCES customers
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date date,
    total numeric(4,2),
    address_id integer REFERENCES addresses
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    description character varying(255),
    unit_price numeric(3,2)
);

CREATE TABLE line_items (
    id SERIAL PRIMARY KEY,
    unit_price numeric(3,2),
    quantity integer,
    order_id integer REFERENCES orders,
    product_id integer REFERENCES products
);

CREATE TABLE warehouse (
    id SERIAL PRIMARY KEY,
    warehouse character varying(55),
    fulfillment_days integer
);

CREATE TABLE warehouse_product (
    product_id integer NOT NULL REFERENCES products,
    warehouse_id integer NOT NULL REFERENCES warehouse,
    on_hand integer,
    PRIMARY KEY (product_id, warehouse_id)
);

INSERT INTO customers
VALUES (1, 'Lisa', 'Bonet'),
(2, 'Charles', 'Darwin'),
(3, 'George', 'Foreman'),
(4, 'Lucy', 'Liu');

INSERT INTO addresses
VALUES (1, '1 Main St', 'Detroit', 'MI', '31111', 'home', 1),
(2, '555 Some Pl', 'Chicago', 'IL', '60611', 'business', 1),
(3, '8900 Linova Ave', 'Minneapolis', 'MN', '55444', 'home', 2),
(4, 'PO Box 999', 'Minneapolis', 'MN', '55334', 'business', 3),
(5, '3 Charles Dr', 'Los Angeles', 'CA', '00000', 'home', 4),
(6, '934 Superstar Ave', 'Portland', 'OR', '99999', 'business', 4);

INSERT INTO orders
VALUES (1, '2010-03-05', 88.00, 1),
(2, '2012-02-08', 23.50, 2),
(3, '2016-02-07', 4.09, 2),
(4, '2011-03-04', 4.00, 3),
(5, '2012-09-22', 12.99, 5),
(6, '2012-09-23', 23.00, 6),
(7, '2013-05-25', 39.12, 5);

INSERT INTO products
VALUES (1, 'toothbrush', 3.00),
(2, 'nail polish - blue', 4.25),
(3, 'generic beer can', 2.50),
(4, 'lysol', 6.00),
(5, 'cheetos', 0.99),
(6, 'diet pepsi', 1.20),
(7, 'wet ones baby wipes', 8.99);

INSERT INTO line_items
VALUES (1, 5.00, 16, 1, 1),
(2, 3.12, 4, 1, 2),
(3, 4.00, 2, 2, 3),
(4, 7.25, 3, 4, 4),
(5, 6.00, 1, 5, 7),
(6, 2.34, 6, 6, 5),
(7, 1.05, 9, 7, 5);

INSERT INTO warehouse VALUES (1, 'alpha', 2),
(2, 'beta', 3),
(3, 'delta', 4),
(4, 'gamma', 4),
(5, 'epsilon', 5);

INSERT INTO warehouse_product
VALUES (1, 3, 0),
(1, 1, 5),
(2, 4, 20),
(3, 5, 3),
(4, 2, 9),
(4, 3, 12),
(5, 3, 7),
(6, 1, 1),
(7, 2, 4),
(6, 3, 88),
(6, 4, 3);
