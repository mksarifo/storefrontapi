# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index /api/products [GET]
- Show /api/products/:id [GET]
- Create [token required] /api/products [POST]
- [OPTIONAL] Top 5 most popular products  /api/search/top [GET]
- [OPTIONAL] Products by category (args: product category) /api/search/category?:category [GET]

#### Users
- Index [token required] /api/users [GET]
- Show [token required] /api/users/:id [GET]
- Create N[token required] /api/users [POST]

#### Orders
- Current Order by user (args: user id)[token required] /api/orders/:status [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] /api/orders/:status [GET]

## Data Shapes
#### Product
- id
- name
- price
- [OPTIONAL] category

#### User
- id
- email (used for authentication)
- firstName
- lastName
- password

#### Orders
- id
- items: List of
  - id of each product in the order
  - quantity of each product in the order
- user_id
- completed: status of order (active or complete)

## Database Tables
#### Product
- id: primary key
- name: varchar
- price: number
- category_id: foreign key
#### Category
- id: Primary key
- name: varchar
- active: boolean
#### User
- id: Primary key
- email: varchar
- firstName: varchar
- lastName: varchar
- password: varchar
#### Orders
- id: Primary key
- user_id: Foreign key to users table
- completed: boolean
- (items: List)
#### Order Items
- id: Primary key
- order_id: Foreign key to orders table
- quantity: number
- product_id: Foreign key to products table
- date_added: Date
