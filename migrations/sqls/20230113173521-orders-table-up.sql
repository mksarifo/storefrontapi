CREATE TABLE orders (id serial primary key, user_id INT NOT NULL, completed BOOLEAN,
CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id));