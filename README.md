# Food Ordering
The system is meant to assist restaurants in processing the​ orders ​of the c​ustomers.​ Using the mobile device, each customer ​will be able to select a number of d​ishes from the menu to place the o​rder.​ The ​dishes ​will then be grouped and forwarded to chefs ​by thesystem. Whenever a c​hef​ finish cooking a d​ish,​ the c​hef ​would click to see what should be his next ​dish.​ Interestingly, these ​chefs​ find that the cooking duration​ is constant regardless of the number of p​ortions; ​andhence, the system should be able to figure out the fastest possible solution to serve the d​ishes ​to the customers​.

## Installation
```
docker-compose up -d
npm install
```
docker-compose will setup Postgres and Redis firstly
## Build app (compile typescript to javascript)
```
npm run build
```
You MUST build app BEFORE run the server OR run the test
## Running the server
```
npm start
```
## Running the test
```
npm run rollback
npm run latest
npm run test
```
NO NEED to run the server before test
You can add more test case to folder ./test
## Documentation
### Model
#### Session Model
- id: string - Use as refreshToken
- userId: string
- roleId: string
#### User Model
- id: string
- userName: string
- password: string
- roleId: string
#### Role Model
- id: string - We have 3 role: "admin", "chef", "user"
#### Dish Model
- id: string
- description: string
- images: string[]
- price: float - Format numeric(8, 2)
- cookingMinutes: integer
#### Order Model
- id: string
- userId: string
- items: OrderDishModel[]
- totalAmount: float - Format numeric(8, 2)
- estimatedServedMinutes: integer
- notes: string
#### Order Dish Model
- id: string
- orderId: string
- dishId: string
- quantity: integer
- totalAmount: float - Format numeric(8, 2)
- status: string - We have 3 status: "new", "in-progress", "served"
- servedBy: string
- dish: Dish Model

### API
#### Auth
POST /api/v1/auth/register
- Body: userName (required), password (required)
- Response: Session Model with id is refrestToken, token is accessToken

POST /api/v1/auth/login
- Body: userName (required), password (required)
- Response: Session Model with id is refrestToken, token is accessToken

POST /api/v1/auth/refresh
- Body: refreshToken (required)
- Response: Session Model with new accessToken

POST /api/v1/auth/logout
- Body: refreshToken (required)
- Response: no body with HTTP status 200

#### Profile API
GET /api/v1/profile
- Headers: { "authorization": "Bearer " + accessToken }
- Response: User Model with roleId (We have 3 roles: "admin", "user", "chef")

PUT /api/v1/profile
- Headers: { "authorization": "Bearer " + accessToken }
- Body: id (required), userName, password
- Response: User Model
- Note: change password will be revoke refreshToken

### Users API (for admin only)
GET /api/v1/users
- Headers: { "authorization": "Bearer " + accessToken }
- Query Params: key (for searching), roleId, offset, limit
- Response: array of User Model

POST /api/v1/users
- Headers: { "authorization": "Bearer " + accessToken }
- Body: userName (required), password (required), roleId (defaults is "user")
- Response: User Model

GET /api/v1/users/:userId
- Headers: { "authorization": "Bearer " + accessToken }
- Response: User Model

PUT /api/v1/users/:userId
- Headers: { "authorization": "Bearer " + accessToken }
- Body: id (required), userName, password, roleId
- Response: User Model
- Note: change password or roleId will be revoke refreshToken of that user

DELETE /api/v1/users/:userId
- Headers: { "authorization": "Bearer " + accessToken }
- Response: no body with HTTP status 200
- Note: do not allow delete yourself

### Dishes API
GET /api/v1/dishes (for all roles)
- Headers: { "authorization": "Bearer " + accessToken }
- Query Params: key (for searching), offset, limit
- Response: array of Dish Model

POST /api/v1/dishes (for admin only)
- Headers: { "authorization": "Bearer " + accessToken }
- Body: description (required), images (string array - required), price (required), cookingMinutes (required)
- Response: Dish Model

GET /api/v1/dishes/:dishId (for all roles)
- Headers: { "authorization": "Bearer " + accessToken }
- Response: Dish Model

PUT /api/v1/dishes/:dishesId (for admin only)
- Headers: { "authorization": "Bearer " + accessToken }
- Body: id (required), description, images (string array), price, cookingMinutes
- Response: Dish Model

DELETE /api/v1/dishes/:dishesId
- Headers: { "authorization": "Bearer " + accessToken }
- Response: no body with HTTP status 200 (for admin only)

### Order API
GET /api/v1/orders (for admin, user)
- Headers: { "authorization": "Bearer " + accessToken }
- Query Params: key (for searching), userId, offset, limit
- Response: array of Order Model

POST /api/v1/orders (for user)
- Headers: { "authorization": "Bearer " + accessToken }
- Body: items (required), notes, userId
- Response: Order Model

GET /api/v1/orders/:orderId (for admin, user)
- Headers: { "authorization": "Bearer " + accessToken }
- Response: Order Model

DELETE /api/v1/orders/:orderId
- Headers: { "authorization": "Bearer " + accessToken }
- Response: no body with HTTP status 200 (for admin only)

### Order Dish API
GET /api/v1/order-dish/dequeue (for chef)
- Headers: { "authorization": "Bearer " + accessToken }
- Response: Order Dish Model

PUT /api/v1/order-dish/status (for chef)
- Headers: { "authorization": "Bearer " + accessToken }
- Body: id (required), status (required)
- Response: Order Dish Model