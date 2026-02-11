# Built-in Middleware

Express includes several built-in middleware functions for common web application needs including body parsing and static file serving.

## Capabilities

### JSON Body Parser

Parse JSON request bodies and populate `req.body`.

```javascript { .api }
/**
 * Parse JSON request bodies
 * @param {object} options - Parser configuration options (optional)
 * @returns {Function} Middleware function
 */
express.json(options?: object): Function;
```

**JSON Parser Options:**

```javascript { .api }
interface JsonOptions {
  /**
   * Controls maximum request body size (default: '100kb')
   */
  limit?: string | number;
  
  /**
   * JSON reviver function passed to JSON.parse()
   */
  reviver?: Function;
  
  /**
   * Enable strict mode - only parse arrays and objects (default: true)
   */
  strict?: boolean;
  
  /**
   * Content-Type verification function or false to skip
   */
  type?: string | string[] | Function | false;
  
  /**
   * Custom error verification function
   */
  verify?: Function;
}
```

**Usage Examples:**

```javascript
const express = require('express');
const app = express();

// Basic JSON parsing
app.use(express.json());

// JSON parsing with options
app.use(express.json({
  limit: '10mb',                    // Allow larger payloads
  type: 'application/json',         // Only parse application/json
  strict: true                      // Only parse objects and arrays
}));

// Custom content type
app.use(express.json({
  type: 'application/vnd.api+json'  // Parse custom JSON content type
}));

// With verification
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    // Verify request signature, log raw body, etc.
    req.rawBody = buf;
  }
}));

// Route using parsed JSON
app.post('/api/users', (req, res) => {
  console.log(req.body); // Parsed JSON object
  res.json({ received: req.body });
});
```

### URL-Encoded Body Parser

Parse URL-encoded request bodies (form data) and populate `req.body`.

```javascript { .api }
/**
 * Parse URL-encoded request bodies
 * @param {object} options - Parser configuration options (optional)
 * @returns {Function} Middleware function
 */
express.urlencoded(options?: object): Function;
```

**URL-Encoded Parser Options:**

```javascript { .api }
interface UrlencodedOptions {
  /**
   * Parse extended syntax with rich objects (default: true)
   */
  extended?: boolean;
  
  /**
   * Controls maximum request body size (default: '100kb')
   */
  limit?: string | number;
  
  /**
   * Maximum number of parameters (default: 1000)
   */
  parameterLimit?: number;
  
  /**
   * Content-Type verification function or false to skip
   */
  type?: string | string[] | Function | false;
  
  /**
   * Custom error verification function
   */
  verify?: Function;
}
```

**Usage Examples:**

```javascript
// Basic URL-encoded parsing
app.use(express.urlencoded({ extended: true }));

// Simple parsing (querystring library)
app.use(express.urlencoded({ extended: false }));

// URL-encoded parsing with options
app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
  parameterLimit: 2000
}));

// Handle form submissions
app.post('/contact', (req, res) => {
  console.log(req.body); // { name: 'John', email: 'john@example.com', message: '...' }
  res.send('Form received');
});
```

### Raw Body Parser

Parse raw request bodies into Buffer and populate `req.body`.

```javascript { .api }
/**
 * Parse raw request bodies into Buffer
 * @param {object} options - Parser configuration options (optional)
 * @returns {Function} Middleware function
 */
express.raw(options?: object): Function;
```

**Raw Parser Options:**

```javascript { .api }
interface RawOptions {
  /**
   * Controls maximum request body size (default: '100kb')
   */
  limit?: string | number;
  
  /**
   * Content-Type verification function or false to skip
   */
  type?: string | string[] | Function | false;
  
  /**
   * Custom error verification function
   */
  verify?: Function;
}
```

**Usage Examples:**

```javascript
// Parse all requests as raw buffers
app.use(express.raw());

// Parse specific content types as raw
app.use(express.raw({ 
  type: 'application/octet-stream',
  limit: '5mb'
}));

// Handle binary uploads
app.post('/upload', (req, res) => {
  console.log(req.body); // Buffer containing raw data
  console.log('Received', req.body.length, 'bytes');
  res.send('Binary data received');
});
```

### Text Body Parser

Parse text request bodies into string and populate `req.body`.

```javascript { .api }
/**
 * Parse text request bodies into string
 * @param {object} options - Parser configuration options (optional)
 * @returns {Function} Middleware function
 */
express.text(options?: object): Function;
```

**Text Parser Options:**

```javascript { .api }
interface TextOptions {
  /**
   * Controls maximum request body size (default: '100kb')
   */
  limit?: string | number;
  
  /**
   * Content-Type verification function or false to skip (default: 'text/plain')
   */
  type?: string | string[] | Function | false;
  
  /**
   * Custom error verification function
   */
  verify?: Function;
  
  /**
   * Default charset when not specified (default: 'utf-8')
   */
  defaultCharset?: string;
}
```

**Usage Examples:**

```javascript
// Parse text/plain requests
app.use(express.text());

// Parse custom text types
app.use(express.text({ 
  type: 'text/csv',
  limit: '2mb'
}));

// Handle text uploads
app.post('/data', (req, res) => {
  console.log(req.body); // String containing text data
  console.log('Text length:', req.body.length);
  res.send('Text data received');
});
```

### Static File Serving

Serve static files from specified directory.

```javascript { .api }
/**
 * Serve static files from specified directory
 * @param {string} root - Root directory for static files
 * @param {object} options - Static serving options (optional)
 * @returns {Function} Middleware function
 */
express.static(root: string, options?: object): Function;
```

**Static Options:**

```javascript { .api }
interface StaticOptions {
  /**
   * Enable dotfiles serving ('allow', 'deny', 'ignore') (default: 'ignore')
   */
  dotfiles?: string;
  
  /**
   * Set ETag generation (true, false, 'weak', 'strong') (default: true)
   */
  etag?: boolean | string;
  
  /**
   * Set file extension fallbacks
   */
  extensions?: string[];
  
  /**
   * Fallback file when file not found
   */
  fallthrough?: boolean;
  
  /**
   * Enable immutable directive in Cache-Control (default: false)
   */
  immutable?: boolean;
  
  /**
   * Directory index files (default: ['index.html'])
   */
  index?: string[] | false;
  
  /**
   * Enable lastModified header (default: true)
   */
  lastModified?: boolean;
  
  /**
   * Set max-age for Cache-Control (default: 0)
   */
  maxAge?: number | string;
  
  /**
   * Enable redirect for trailing slash (default: true)
   */
  redirect?: boolean;
  
  /**
   * Function to set custom headers
   */
  setHeaders?: Function;
}
```

**Usage Examples:**

```javascript
// Basic static file serving
app.use(express.static('public'));

// Serve from specific path
app.use('/static', express.static('public'));

// Static serving with options
app.use(express.static('public', {
  dotfiles: 'ignore',           // Ignore dotfiles
  etag: false,                  // Disable ETag generation
  extensions: ['html', 'htm'],  // Try these extensions
  index: ['index.html'],        // Index files
  maxAge: '1d',                 // Cache for 1 day
  redirect: false,              // Don't redirect /foo to /foo/
  setHeaders: (res, path, stat) => {
    res.set('X-Timestamp', Date.now());
  }
}));

// Multiple static directories
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('assets'));

// Virtual path prefix
app.use('/css', express.static('public/stylesheets'));
app.use('/js', express.static('public/javascripts'));
app.use('/images', express.static('public/images'));
```

### Middleware Combination Patterns

Common patterns for combining built-in middleware.

**Usage Examples:**

```javascript
const express = require('express');
const app = express();

// Standard web application middleware stack
app.use(express.json());                    // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static('public'));          // Serve static files

// API server middleware stack
app.use(express.json({ limit: '10mb' }));   // Large JSON payloads
app.use(express.raw({ 
  type: 'application/octet-stream',
  limit: '50mb'
})); // Binary uploads

// Content-type specific parsing
app.use('/api/json', express.json());
app.use('/api/form', express.urlencoded({ extended: true }));
app.use('/api/upload', express.raw({ limit: '100mb' }));
app.use('/api/text', express.text());

// Conditional middleware based on content type
app.use((req, res, next) => {
  if (req.is('application/json')) {
    express.json()(req, res, next);
  } else if (req.is('application/x-www-form-urlencoded')) {
    express.urlencoded({ extended: true })(req, res, next);
  } else {
    next();
  }
});
```

### Error Handling with Built-in Middleware

Handle errors that occur during body parsing.

**Usage Examples:**

```javascript
// JSON parsing with error handling
app.use(express.json());

// Error handler for body parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err.message);
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});

// Size limit error handling
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      error: 'Request entity too large',
      limit: err.limit 
    });
  }
  next(err);
});

// Comprehensive error handling for all body parser middleware
app.use((err, req, res, next) => {
  // Handle different types of body parser errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ 
      error: 'Invalid request body format',
      details: err.message 
    });
  }
  
  if (err.type === 'entity.verify.failed') {
    return res.status(400).json({ 
      error: 'Request body verification failed',
      details: err.message 
    });
  }
  
  if (err.type === 'request.aborted') {
    return res.status(400).json({ 
      error: 'Request aborted',
      details: 'Client closed connection' 
    });
  }
  
  if (err.type === 'request.timeout') {
    return res.status(408).json({ 
      error: 'Request timeout',
      details: 'Request body read timeout' 
    });
  }
  
  if (err.type === 'charset.unsupported') {
    return res.status(415).json({ 
      error: 'Unsupported charset',
      charset: err.charset 
    });
  }
  
  if (err.type === 'encoding.unsupported') {
    return res.status(415).json({ 
      error: 'Unsupported encoding',
      encoding: err.encoding 
    });
  }
  
  // Pass other errors to the next error handler
  next(err);
});
```

### Body Parser Error Types

Common error types thrown by Express built-in middleware:

```javascript { .api }
interface BodyParserError extends Error {
  type: 'entity.too.large' |           // Request body size exceeded limit
        'entity.parse.failed' |         // JSON/form parsing failed
        'entity.verify.failed' |        // Custom verify function failed
        'request.aborted' |             // Client aborted request
        'request.timeout' |             // Request timeout
        'charset.unsupported' |         // Unsupported character set
        'encoding.unsupported' |        // Unsupported content encoding
        'parameters.too.many' |         // Too many parameters (urlencoded)
        'stream.encoding.set';          // Stream encoding already set
  
  status: number;        // HTTP status code
  statusCode: number;    // Alias for status
  expose: boolean;       // Whether error should be exposed to client
  length?: number;       // Content length that caused error
  limit?: number;        // Size limit that was exceeded
  charset?: string;      // Unsupported charset
  encoding?: string;     // Unsupported encoding
}
```

### Custom Body Parser Configuration

Advanced configuration for specific use cases.

**Usage Examples:**

```javascript
// Custom JSON parser for API versioning
app.use('/api/v1', express.json());
app.use('/api/v2', express.json({
  reviver: (key, value) => {
    // Transform v2 data format
    if (key === 'date' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  }
}));

// Different limits for different endpoints
app.use('/api/upload', express.json({ limit: '50mb' }));
app.use('/api/data', express.json({ limit: '1mb' }));

// Content type specific handling
app.use(express.json({ 
  type: ['application/json', 'application/vnd.api+json'] 
}));

app.use(express.text({ 
  type: ['text/plain', 'text/csv', 'application/csv'] 
}));
```