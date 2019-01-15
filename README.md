[![CircleCI](https://circleci.com/gh/artemkv/kaboom-web-service.svg?style=svg)](https://circleci.com/gh/artemkv/kaboom-web-service)

Kaboom Web Service

Provides user app registration and statistic endpoints

# REST endpoints:

POST /signin

Initializes the client session

POST /signout

Closes the client session

GET /crashes

Returns

```
{
	crashes: [
		{
			id: 427348768723,
			message: "NullReference...",
			count: 3
		},
		{
			id: 398475983443,
			message: "IllegalArgument...",
			count: 1
		}
	]
}
```

GET /crash?id=398475983443

Returns

```
{
	id: 427348768723,
	message: "NullReference...",
	count: 3,
	details: "amF2YS5sYW5nLklsbGVnYWxTdGF0..."
}
```

GET /crashstats

GET /uniqueuserstats

# Environment Variables

```
NODE_PORT=8700
NODE_IP=localhost
SESSION_SECRET_KEY=secret
MONGODB_CONNECTION_STRING=mongodb://localhost:27017
DB_NAME=kaboom
```
