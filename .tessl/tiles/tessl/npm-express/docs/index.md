# Express

Express is a fast, unopinionated, minimalist web framework for Node.js. It provides a robust set of features for web and mobile applications, including HTTP utilities, middleware support, routing, and template engine integration.

## Package Information

- **Package Name**: express
- **Package Type**: npm
- **Language**: JavaScript
- **Installation**: `npm install express`

## Core Imports

```javascript
const express = require('express');
```

For ES modules:

```javascript
import express from 'express';
```

## Basic Usage

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users', (req, res) => {
  res.json({ message: 'User created', data: req.body });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Architecture

Express is built around several core concepts:

- **Application**: The main Express application instance that handles HTTP requests
- **Middleware**: Functions that process requests and responses in a pipeline
- **Routing**: URL pattern matching and HTTP method handling
- **Request/Response Objects**: Enhanced Node.js IncomingMessage and ServerResponse objects
- **Template Engine Integration**: Support for various view engines like EJS, Handlebars, Pug

## Capabilities

### Application Management

Core application creation, configuration, and server management functionality. Handles application settings, middleware mounting, and HTTP server lifecycle.

```javascript { .api }
/**
 * Creates an Express application instance
 * @returns {Function} Express application function
 */
function express();

/**
 * Application prototype with routing and middleware methods
 */
interface Application extends Function {
  // Settings
  set(setting: string, val: any): this;
  get(setting: string): any;
  enable(setting: string): this;
  disable(setting: string): this;
  enabled(setting: string): boolean;
  disabled(setting: string): boolean;
  
  // Server lifecycle
  listen(port?: number, hostname?: string, callback?: Function): Server;
  
  // Middleware and routing
  use(...handlers: Handler[]): this;
  use(path: string, ...handlers: Handler[]): this;
  route(path: string): Route;
}

/**
 * Express prototypes - accessible for extending functionality
 */
express.application: Application;  // Application prototype
express.request: Request;          // Request prototype
express.response: Response;        // Response prototype

/**
 * Express constructors
 */
express.Route: typeof Route;       // Route constructor
express.Router: typeof Router;     // Router constructor
```

[Application Management](./application.md)

### HTTP Request Processing

Request object enhancements providing access to headers, query parameters, content negotiation, and request metadata analysis.

```javascript { .api }
/**
 * Enhanced request object with Express-specific properties and methods
 */
interface Request extends IncomingMessage {
  // Header access
  get(name: string): string | undefined;
  header(name: string): string | undefined;
  
  // Content negotiation
  accepts(types: string | string[]): string | false;
  acceptsEncodings(encodings: string | string[]): string | false;
  acceptsCharsets(charsets: string | string[]): string | false;
  acceptsLanguages(langs: string | string[]): string | false;
  
  // Request analysis
  is(type: string | string[]): string | false;
  
  // Properties
  query: { [key: string]: any };
  params: { [key: string]: string };
  body: any;
  protocol: string;
  secure: boolean;
  ip: string;
  hostname: string;
  path: string;
  fresh: boolean;
  stale: boolean;
  xhr: boolean;
}
```

[Request Processing](./request.md)

### HTTP Response Generation

Response object enhancements for sending various types of responses, setting headers, managing cookies, and handling redirects.

```javascript { .api }
/**
 * Enhanced response object with Express-specific methods
 */
interface Response extends ServerResponse {
  // Response sending
  send(body?: any): this;
  json(obj: any): this;
  jsonp(obj: any): this;
  sendStatus(statusCode: number): this;
  sendFile(path: string, options?: object, callback?: Function): void;
  
  // Headers and status
  status(code: number): this;
  set(field: string, val: string | string[]): this;
  get(field: string): string | undefined;
  
  // Cookies
  cookie(name: string, val: any, options?: object): this;
  clearCookie(name: string, options?: object): this;
  
  // Redirects
  redirect(url: string): void;
  redirect(status: number, url: string): void;
}
```

[Response Generation](./response.md)

### Routing System

Router and Route classes for organizing application endpoints, handling HTTP methods, and managing route parameters.

```javascript { .api }
/**
 * Router constructor for creating modular route handlers
 * @param {object} options - Router configuration options
 * @returns {Router} Router instance
 */
function Router(options?: object): Router;

/**
 * Route constructor for individual route management
 * @param {string} path - Route path pattern
 * @returns {Route} Route instance
 */
function Route(path: string): Route;
```

[Routing System](./router.md)

### Built-in Middleware

Express includes several built-in middleware functions for common web application needs including body parsing and static file serving.

```javascript { .api }
// Body parsing middleware
express.json(options?: object): Function;
express.urlencoded(options?: object): Function;
express.raw(options?: object): Function;
express.text(options?: object): Function;

// Static file serving
express.static(root: string, options?: object): Function;
```

[Built-in Middleware](./middleware.md)

## Types

```javascript { .api }
/**
 * Generic middleware function signature
 */
type Handler = (req: Request, res: Response, next: NextFunction) => void;

/**
 * Next function for middleware chain continuation
 */
type NextFunction = (err?: any) => void;

/**
 * HTTP Server instance from Node.js
 */
interface Server {
  listen(port?: number, hostname?: string, callback?: Function): this;
  close(callback?: Function): this;
}
```