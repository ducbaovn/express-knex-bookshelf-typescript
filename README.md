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
### Auth
POST /api/v1/auth/register
- Body: userName, password
- Response: Session Model with id is refrestToken, token is accessToken

POST /api/v1/auth/login
- Body: userName, password
- Response: Session Model with id is refrestToken, token is accessToken

POST /api/v1/auth/refresh
- Body: refreshToken
- Response: Session Model with new accessToken

POST /api/v1/auth/logout
- Body: refreshToken
- Response: no body with HTTP status 200