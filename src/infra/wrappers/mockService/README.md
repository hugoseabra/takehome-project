# Mock Service

This mock service simulates an external service you might integrate with in your project. It is designed to simulate an integration you are working with for the takehome project.

## User Endpoints

### [Process User](/src/infra/wrappers/mockServiceers/mockService/server.ts)

- **URL:** `/api/process`
- **Method:** `POST`
- **Description:** Processes a user and returns a success message with the user id and processed value.

#### Request Params

```json
{
  "id": number
}
```

#### Response Body

```typescript
{
  "id": number,
  "status": "processed"
}
```

## Pitfalls

1. **Rate Limiting:**

   - The service has a rate limiter in place. If you exceed this limit, you will receive a `429 Too Many Requests` response with the message "Too many requests, please try again later."

2. **Intermittent Failures:**

   - The `/process` endpoint is designed to fail randomly to simulate real-world scenarios. Approximately 10% of the requests to this endpoint will return a `500 Internal Server Error` with the message "Internal server error, please retry." This is to test your application's ability to handle and retry failed requests.

## Running the Mock Service

Running the main application should also spin up an instance of this mock server. Please refer to the top level [Readme](/README.md) for instructions on how to run the application.
