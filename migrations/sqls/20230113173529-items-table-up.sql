CREATE TABLE items (id serial primary key, order_id INT NOT NULL, quantity INT NOT NULL, product_id INT NOT NULL, date_added DATE,
                     CONSTRAINT fk_order_id FOREIGN KEY(order_id) REFERENCES orders(id),
                    CONSTRAINT fk_product_id FOREIGN KEY(product_id) REFERENCES products(id)
                   );