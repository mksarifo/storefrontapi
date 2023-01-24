# Storefront API

This project written in nodejs (typescript) exposes APIs for a storefront

## Startup

### `npm install`

Install all NPM dependencies

## Available Scripts

In the project directory, you can run:

### `npm start`

Start the dev server. Runs the app on port 3000


### `npm run prettier`

Format code with prettier

### `npm test`

Runs jasmine tests.
Make sure to replace the configuration on database.json test database connection settings before running the tests


## Configuration

### Database
#### Create the database
Run below SQL query on your psql terminal to create the dev and test databases

Creates the development database  
`CREATE DATABASE storefront_dev;`

Creates the test database  
`CREATE DATABASE storefront_test;`

Create a user to authenticate  
`CREATE USER storefront_user WITH PASSWORD 'password123';`

Grant access privileges on both databases to the created user  
`GRANT ALL PRIVILEGES ON DATABASE storefront_dev TO storefront_user;`  
`GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;`

#### Configure database connection
Create a .env file with the following config

POSTGRES_HOST=[database host]

POSTGRES_DB=[database name]

POSTGRES_USER=[database user]

POSTGRES_PASSWORD=[database password]

TOKEN_SECRET=[generate a jwt secret]

PEPPER=[a pepper random string]



## Endpoints

`/` - Health check, to see if server is up

`/api/authenticate` - Authenticate user, returns a JWT token that must be passed as Authentication Header for required resources

#### User Resource

`/api/users` - [GET] Returns a list of created users (authentication required)

`/api/users/:id` - [GET] Returns one user based on id parameter (authentication required)

`/api/users` - [POST] Creates a new user (authentication required)

#### Product Resource

`/api/products/:id` - [GET] Returns one product based on id parameter

`/api/products` - [GET] Returns a list of products

`/api/products` - [POST] Creates a new product (authentication required)

`/api/search/top` - [GET] Returns the top 5 products

`/api/search?category=:category` - [GET] Returns a list of products by category

Example:
`/api/search?category=cars` - Returns products for cars category

#### Order Resource

`/api/orders` - [POST] Creates a new order for authenticated user

`/api/orders/:status` -[GET] Returns the orders by status for the authenticated user (authentication required)

Example: 
`/api/orders/active` - Returns active orders

`/api/orders/completed` - Returns completed orders
