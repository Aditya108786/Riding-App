
# /user/register Endpoint Documentation

# /captain/register Endpoint Documentation

## Endpoint

`POST /captain/register`

## Description

This endpoint is used to register a new captain (driver) in the system. It accepts captain details, vehicle information, and creates a new captain account if the data is valid and the email is not already registered.

## Request Body

The request body must be in JSON format and include the following fields:

```
{
  "fullname": {
    "firstname": "string",   // Required. Captain's first name (min 3 characters)
    "lastname": "string"     // Required. Captain's last name (min 3 characters)
  },
  "email": "string",         // Required. Captain's email address (must be unique)
  "password": "string",      // Required. Captain's password
  "phone": "string",         // Required. Captain's phone number
  "vehicle": {
    "color": "string",       // Required. Vehicle color
    "plate": "string",       // Required. Vehicle plate number
    "capacity": "number",    // Required. Vehicle capacity
    "vehicleType": "string"  // Required. Type of vehicle (e.g., car, van)
  }
}
```

### Example

```
POST /captain/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Ali",
    "lastname": "Khan"
  },
  "email": "ali.khan@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "vehicle": {
    "color": "White",
    "plate": "ABC-1234",
    "capacity": 4,
    "vehicleType": "Car"
  }
}
```

## Responses

- **201 Created**
  - Captain registered successfully.
  - Response body example:
    ```json
    {
      "token": "<jwt_token>",
      "captain": {
        "id": "<captain_id>",
        "fullname": {
          "firstname": "Ali",
          "lastname": "Khan"
        },
        "email": "ali.khan@example.com",
        "phone": "+1234567890",
        "vehicle": {
          "color": "White",
          "plate": "ABC-1234",
          "capacity": 4,
          "vehicleType": "Car"
        }
      }
    }
    ```

- **400 Bad Request**
  - Missing or invalid fields in the request body.
  - Example:
    ```json
    {
      "errors": [
        { "msg": "First name must be at least 3 characters", "param": "fullname.firstname", ... },
        { "msg": "Invalid email", "param": "email", ... },
        { "msg": "Password is required", "param": "password", ... }
      ]
    }
    ```
  - Captain already registered with this email.
  - Example:
    ```json
    {
      "message": "Captain already registered"
    }
    ```

- **500 Internal Server Error**
  - Unexpected server error.
  - Example:
    ```json
    {
      "error": "An error occurred while registering the captain."
    }
    ```

## Notes
- All fields are required unless specified otherwise.
- Passwords are hashed before storage.
- The endpoint returns appropriate status codes and error messages for different failure scenarios.

## Endpoint

`POST /user/register`

## Description

This endpoint is used to register a new user in the system. It accepts user details in the request body and creates a new user account if the data is valid and the user does not already exist.

## Request Body

The request body must be in JSON format and include the following fields:

```
{
  `fullname` (object):
    
}
```

### Example

```
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "yourpassword123"
}
```

## Responses

- **201 Created**
  - User registered successfully.
  - Response body example:
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": "<user_id>",
        "name": "John Doe",
        "email": "john.doe@example.com"
      }
    }
    ```

- **400 Bad Request**
  - Missing or invalid fields in the request body.
  - Example:
    ```json
    {
      "error": "Email, name, and password are required."
    }
    ```

  - Email already exists.
  - Example:
    ```json
    {
      "error": "User with this email already exists."
    }
    ```

- **500 Internal Server Error**
  - Unexpected server error.
  - Example:
    ```json
    {
    }
    ```

## Notes
- All fields are required.
- Passwords should be sent securely and will be hashed before storage.
- The endpoint returns appropriate status codes and error messages for different failure scenarios.


# /user/login Endpoint Documentation
## Endpoint

`POST /user/login`

## Description

This endpoint is used to authenticate an existing user. It accepts the user's email and password, verifies the credentials, and returns an authentication token if successful.


The request body must be in JSON format and include the following fields:

```
{
  "email": "string",       // Required. The user's email address.
  "password": "string"     // Required. The user's password.
}
```
```
# /user/profile Endpoint Documentation

## Endpoint

`GET /user/profile`

## Description

Returns the authenticated user's profile information. Requires a valid JWT token in the cookie or Authorization header.

## Authentication

- Requires JWT token (cookie or `Authorization: Bearer <token>` header).

## Request

No request body required.

### Example

```
GET /user/profile
Authorization: Bearer <jwt_token>
```

## Responses

- **200 OK**
  - Returns the user's profile information.
  - Example:
    ```json
    {
      "user": {
        "id": "<user_id>",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **401 Unauthorized**
  - Missing or invalid authentication token.
  - Example:
    ```json
    {
      "message": "Unauthorized access"
    }
    ```

- **500 Internal Server Error**
  - Unexpected server error.
  - Example:
    ```json
    {
      "error": "An error occurred while retrieving the profile."
    }
    ```

## Notes
- Requires a valid JWT token for authentication.
- Returns the user's profile if authenticated.

# /user/logout Endpoint Documentation

## Endpoint

`POST /user/logout`

## Description

Logs out the authenticated user by clearing the authentication token and blacklisting it. Requires a valid JWT token in the cookie or Authorization header.

## Authentication

- Requires JWT token (cookie or `Authorization: Bearer <token>` header).

## Request

No request body required.

### Example

```
POST /user/logout
Authorization: Bearer <jwt_token>
```

## Responses

- **200 OK**
  - User logged out successfully.
  - Example:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

- **401 Unauthorized**
  - Missing or invalid authentication token.
  - Example:
    ```json
    {
      "message": "Unauthorized access"
    }
    ```

- **500 Internal Server Error**
  - Unexpected server error.
  - Example:
    ```json
    {
      "error": "An error occurred while logging out."
    }
    ```

## Notes
- Requires a valid JWT token for authentication.
- The token is blacklisted after logout to prevent reuse.
POST /user/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "yourpassword123"
}
```

## Responses

- **200 OK**
  - User authenticated successfully.
  - Response body example:
    ```json
    {
      "token": "<jwt_token>",
      "user": {
        "id": "<user_id>",
        "email": "john.doe@example.com",
        // other user fields
      }
    }
    ```

- **400 Bad Request**
  - Missing or invalid fields in the request body.
  - Example:
    ```json
    {
      "errors": [
        { "msg": "Invalid email", "param": "email", ... }
      ]
    }
    ```

- **401 Unauthorized**
  - Invalid email or password.
  - Example:
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

- **500 Internal Server Error**
  - Unexpected server error.
  - Example:
    ```json
    {
      "error": "An error occurred while logging in."
    }
    ```

## Notes
- Both fields are required.
- Returns a JWT token on successful authentication.
- Returns appropriate status codes and error messages for different failure scenarios.
