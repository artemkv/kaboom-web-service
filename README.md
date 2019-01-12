Kaboom Web Service

Provides user app registration and statistic endpoints

# REST endpoints:

POST /signin

Initializes the client session

GET /crashes

Returns

```
{
	crashes: [
		{
			id: 427348768723,
			message: "NullReference...",
			counter: 3
		},
		{
			id: 398475983443,
			message: "IllegalArgument...",
			counter: 1
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
	counter: 3,
	details: "amF2YS5sYW5nLklsbGVnYWxTdGF0..."
}
```

# Environment Variables

```
NODE_PORT=8700
NODE_IP=localhost
SESSION_SECRET_KEY=secret
```