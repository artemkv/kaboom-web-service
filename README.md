[![CircleCI](https://circleci.com/gh/artemkv/kaboom-web-service.svg?style=svg)](https://circleci.com/gh/artemkv/kaboom-web-service)

Kaboom Web Service

Provides user app registration and statistic endpoints

# REST endpoints:

POST /signin

Initializes the client session

POST /signout

Closes the client session

GET /crashes?appcode=<APP_CODE>

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

GET /crash?appcode=<APP_CODE>&id=<CRASH_ID>

Returns

```
{
	id: 427348768723,
	message: "NullReference...",
	count: 3,
	details: "amF2YS5sYW5nLklsbGVnYWxTdGF0..."
}
```

GET /crashstats?appcode=<APP_CODE>&period=month&dt=201901

Returns

```
[
	{
		"dt": "20190113",
		"count": 3
	},
	{
		"dt": "20190114",
		"count": 2
	}
]
```

GET /uniqueuserstats?appcode=<APP_CODE>&period=day&dt=20190114

Returns

```
[
	{
		"dt": "2019011412",
		"count": 2
	},
	{
		"dt": "2019011420",
		"count": 1
	}
]
```

# Environment Variables

```
NODE_PORT=8700
NODE_IP=localhost
SESSION_SECRET_KEY=secret
MONGODB_CONNECTION_STRING=mongodb://localhost:27017
DB_NAME=kaboom
REPLICA_SET_NAME=rs0
```
