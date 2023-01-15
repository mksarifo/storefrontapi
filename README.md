# Storefront API

This project written in nodejs (typescript) exposes APIs for a storefront

## Startup

### `npm install`

Install all NPM dependencies

## Available Scripts

In the project directory, you can run:

### `npm start`

Start the dev server. Runs the app on port 3000

### `npm run lint`

Checks the app from lint errors

### `npm run prettier`

Format code with prettier

### `npm run test`

Runs jasmine tests

### `npm run build`

Builds the application and saves to build directory


## Endpoints

✅ `/` - Health check, to see if server is up
`/authenticate` - Authenticate user, returns a JWT token that must be passed as Authentication Header for required resources

#### User Resource

✅ `/api/users` - [GET] Returns a list of created users (authentication required)

✅ `/api/users/:id` - [GET] Returns one user based on id parameter (authentication required)

`/api/users` - [POST] Creates a new user (authentication required)

#### Product Resource

✅ `/api/products/:id` - [GET] Returns one product based on id parameter

✅ `/api/products` - [GET] Returns a list of products

✅ `/api/products` - [POST] Creates a new product (authentication required)

✅ `/api/search/top` - [GET] Returns the top 5 products

✅ `/api/search?category=:category` - [GET] Returns a list of products by category

Example:
`/api/search?category=cars` - Returns products for cars category

#### Order Resource

`/api/orders/:status` - Returns the orders by status for the authenticated user (authentication required)

Example: 
`/api/orders/active` - Returns active orders

`/api/orders/completed` - Returns completed orders