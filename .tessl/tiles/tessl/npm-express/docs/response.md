# Response Generation

Response object enhancements for sending various types of responses, setting headers, managing cookies, and handling redirects.

## Capabilities

### Response Sending

Send responses with automatic content-type detection and format handling.

```javascript { .api }
/**
 * Send response with automatic content-type detection
 * @param {any} body - Response body (string, Buffer, object, array)
 * @returns {Response} Response object for chaining
 */
send(body?: any): Response;

/**
 * Send JSON response
 * @param {any} obj - Object to serialize as JSON
 * @returns {Response} Response object for chaining
 */
json(obj: any): Response;

/**
 * Send JSON response with JSONP callback support
 * @param {any} obj - Object to serialize as JSON
 * @returns {Response} Response object for chaining
 */
jsonp(obj: any): Response;

/**
 * Send status code with default message as response body
 * @param {number} statusCode - HTTP status code
 * @returns {Response} Response object for chaining
 */
sendStatus(statusCode: number): Response;
```

**Usage Examples:**

```javascript
app.get('/', (req, res) => {
  // Send string response
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  // Send JSON response
  res.json({
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  });
});

app.get('/jsonp-data', (req, res) => {
  // Send JSONP response (checks for callback query parameter)
  res.jsonp({ message: 'JSONP response' });
  // If ?callback=myFunc, sends: myFunc({"message":"JSONP response"});
});

app.delete('/users/:id', (req, res) => {
  // Send status with default message
  res.sendStatus(204); // Sends "No Content"
});

app.get('/data', (req, res) => {
  // send() handles different types automatically
  res.send({ key: 'value' }); // Sets Content-Type: application/json
  res.send('<h1>HTML</h1>'); // Sets Content-Type: text/html
  res.send(Buffer.from('binary data')); // Sets Content-Type: application/octet-stream
});
```

### File Operations

Send files and handle file downloads.

```javascript { .api }
/**
 * Transfer file at given path
 * @param {string} path - File path
 * @param {object} options - Transfer options (optional)
 * @param {Function} callback - Callback function (optional)
 */
sendFile(path: string, options?: object, callback?: Function): void;

/**
 * Transfer file as attachment (forces download)
 * @param {string} path - File path
 * @param {string} filename - Download filename (optional)
 * @param {object} options - Transfer options (optional)
 * @param {Function} callback - Callback function (optional)
 */
download(path: string, filename?: string, options?: object, callback?: Function): void;
```

**Usage Examples:**

```javascript
const path = require('path');

app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  // Send file with automatic content-type detection
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'downloads', filename);
  
  // Force download with custom filename
  res.download(filePath, 'custom-name.pdf', (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});
```

### Status and Headers

Manage HTTP status codes and response headers.

```javascript { .api }
/**
 * Set HTTP status code
 * @param {number} code - HTTP status code
 * @returns {Response} Response object for chaining
 */
status(code: number): Response;

/**
 * Set response header field
 * @param {string} field - Header field name
 * @param {string|string[]} val - Header value(s)
 * @returns {Response} Response object for chaining
 */
set(field: string, val: string | string[]): Response;

/**
 * Set multiple response header fields with object
 * @param {object} fields - Object with header field names and values
 * @returns {Response} Response object for chaining
 */
set(fields: { [key: string]: string | string[] }): Response;

/**
 * Set response header field (alias for set)
 * @param {string} field - Header field name
 * @param {string|string[]} val - Header value(s)
 * @returns {Response} Response object for chaining
 */
header(field: string, val: string | string[]): Response;

/**
 * Set multiple response header fields with object (alias for set)
 * @param {object} fields - Object with header field names and values
 * @returns {Response} Response object for chaining
 */
header(fields: { [key: string]: string | string[] }): Response;

/**
 * Get response header field value
 * @param {string} field - Header field name
 * @returns {string|undefined} Header value or undefined
 */
get(field: string): string | undefined;

/**
 * Append additional header values
 * @param {string} field - Header field name
 * @param {string|string[]} val - Value(s) to append
 * @returns {Response} Response object for chaining
 */
append(field: string, val: string | string[]): Response;

/**
 * Add field to Vary header
 * @param {string} field - Field name to add to Vary
 * @returns {Response} Response object for chaining
 */
vary(field: string): Response;
```

**Usage Examples:**

```javascript
app.get('/api/data', (req, res) => {
  // Set status and headers
  res.status(200)
     .set('Content-Type', 'application/json')
     .set('X-API-Version', '1.0')
     .json({ data: 'response' });
});

app.get('/custom-headers', (req, res) => {
  // Multiple ways to set headers
  res.header('X-Custom', 'value');
  res.set({
    'X-Multiple': 'header1',
    'X-Another': 'header2'
  });
  
  // Append to existing headers
  res.append('Set-Cookie', 'cookie1=value1');
  res.append('Set-Cookie', 'cookie2=value2');
  
  // Add to Vary header for caching
  res.vary('User-Agent');
  
  res.send('Response with custom headers');
});
```

### Content Type Management

Set and manage response content types.

```javascript { .api }
/**
 * Set Content-Type HTTP header
 * @param {string} type - MIME type or file extension
 * @returns {Response} Response object for chaining
 */
type(type: string): Response;

/**
 * Alias for type() method
 * @param {string} type - MIME type or file extension
 * @returns {Response} Response object for chaining
 */
contentType(type: string): Response;

/**
 * Respond based on Accept header using callback object
 * @param {object} obj - Object with content type keys and handler functions
 * @returns {Response} Response object for chaining
 */
format(obj: object): Response;
```

**Usage Examples:**

```javascript
app.get('/api/data', (req, res) => {
  res.type('json').send('{"message": "JSON string"}');
  // Sets Content-Type: application/json
});

app.get('/file.xml', (req, res) => {
  res.contentType('xml');
  res.send('<root><data>XML content</data></root>');
});

app.get('/multi-format', (req, res) => {
  // Respond with different formats based on Accept header
  res.format({
    'text/plain': () => {
      res.send('Plain text response');
    },
    'text/html': () => {
      res.send('<h1>HTML response</h1>');
    },
    'application/json': () => {
      res.json({ message: 'JSON response' });
    },
    'default': () => {
      res.status(406).send('Not Acceptable');
    }
  });
});
```

### Cookie Management

Set and clear HTTP cookies.

```javascript { .api }
/**
 * Set cookie with name and value
 * @param {string} name - Cookie name
 * @param {any} value - Cookie value
 * @param {object} options - Cookie options (optional)
 * @returns {Response} Response object for chaining
 */
cookie(name: string, value: any, options?: object): Response;

/**
 * Clear cookie by name
 * @param {string} name - Cookie name
 * @param {object} options - Cookie options (optional)
 * @returns {Response} Response object for chaining
 */
clearCookie(name: string, options?: object): Response;
```

**Usage Examples:**

```javascript
app.post('/login', (req, res) => {
  // Set authentication cookie
  res.cookie('token', 'jwt-token-here', {
    httpOnly: true,
    secure: true,
    maxAge: 86400000, // 24 hours
    sameSite: 'strict'
  });
  
  res.json({ message: 'Logged in successfully' });
});

app.post('/logout', (req, res) => {
  // Clear authentication cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  
  res.json({ message: 'Logged out successfully' });
});

app.get('/preferences', (req, res) => {
  // Set preference cookies
  res.cookie('theme', 'dark');
  res.cookie('language', 'en', { maxAge: 31536000000 }); // 1 year
  
  res.send('Preferences saved');
});
```

### Navigation and Redirects

Handle URL redirections and set location headers.

```javascript { .api }
/**
 * Set Location header
 * @param {string} url - URL for Location header
 * @returns {Response} Response object for chaining
 */
location(url: string): Response;

/**
 * Redirect to URL with optional status code
 * @param {string} url - Redirect URL
 */
redirect(url: string): void;

/**
 * Redirect to URL with specific status code
 * @param {number} status - HTTP status code (3xx)
 * @param {string} url - Redirect URL
 */
redirect(status: number, url: string): void;

/**
 * Set Content-Disposition header to attachment
 * @param {string} filename - Attachment filename (optional)
 * @returns {Response} Response object for chaining
 */
attachment(filename?: string): Response;
```

**Usage Examples:**

```javascript
app.post('/login', (req, res) => {
  if (authenticateUser(req.body)) {
    // Redirect to dashboard after successful login
    res.redirect('/dashboard');
  } else {
    res.redirect(401, '/login?error=invalid');
  }
});

app.get('/old-page', (req, res) => {
  // Permanent redirect
  res.redirect(301, '/new-page');
});

app.get('/download-report', (req, res) => {
  // Set as downloadable attachment
  res.attachment('monthly-report.pdf');
  // Could follow with res.sendFile() or res.send()
});

app.get('/external-link', (req, res) => {
  // Set location without redirecting
  res.location('https://example.com');
  res.send('Link available in Location header');
});
```

### Link Headers

Manage Link HTTP headers for resource relationships.

```javascript { .api }
/**
 * Set Link header with given link object
 * @param {object} links - Object with link relationships
 * @returns {Response} Response object for chaining
 */
links(links: object): Response;
```

**Usage Examples:**

```javascript
app.get('/api/users', (req, res) => {
  // Set pagination links
  res.links({
    next: '/api/users?page=2',
    prev: '/api/users?page=1',
    last: '/api/users?page=10'
  });
  
  res.json({ users: [], page: 1 });
});
```

### Template Rendering

Render view templates with local variables.

```javascript { .api }
/**
 * Render view template with local variables
 * @param {string} view - View name
 * @param {object} locals - Local variables for template (optional)
 * @param {Function} callback - Callback function (optional)
 */
render(view: string, locals?: object, callback?: Function): void;
```

**Usage Examples:**

```javascript
app.get('/', (req, res) => {
  // Render template with data
  res.render('index', {
    title: 'Home Page',
    user: req.user,
    posts: getPosts()
  });
});

app.get('/error', (req, res) => {
  // Render with callback
  res.render('error', { message: 'Something went wrong' }, (err, html) => {
    if (err) {
      res.status(500).send('Render error');
    } else {
      res.send(html);
    }
  });
});
```

### Response Properties

```javascript { .api }
/**
 * Local variables scoped to the request, useful for exposing request-level information to templates
 */
locals: { [key: string]: any };

/**
 * Reference to the Express application instance
 */
app: Application;

/**
 * Reference to the request object for this response
 */
req: Request;
```

### Standard Node.js Properties

The Express response object extends Node.js ServerResponse, providing access to all standard HTTP response properties and methods:

```javascript { .api }
/**
 * HTTP status code
 */
statusCode: number;

/**
 * HTTP status message
 */
statusMessage: string;

/**
 * Response headers object
 */
headers: { [key: string]: string | string[] };

/**
 * True if headers have been sent
 */
headersSent: boolean;
```

**Usage Examples:**

```javascript
app.get('/status-check', (req, res) => {
  console.log('Current status:', res.statusCode); // 200 (default)
  console.log('Headers sent:', res.headersSent); // false
  
  res.status(204).send();
  
  console.log('Headers sent:', res.headersSent); // true
});
```