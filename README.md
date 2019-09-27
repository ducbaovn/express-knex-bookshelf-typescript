# Template

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
### API