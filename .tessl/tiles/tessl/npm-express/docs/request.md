# Request Processing

Request object enhancements providing access to headers, query parameters, content negotiation, and request metadata analysis.

## Capabilities

### Header Access

Retrieve request headers with case-insensitive lookup.

```javascript { .api }
/**
 * Get request header field value (case-insensitive)
 * @param {string} name - Header field name
 * @returns {string|undefined} Header value or undefined if not found
 */
get(name: string): string | undefined;

/**
 * Alias for get() method
 * @param {string} name - Header field name
 * @returns {string|undefined} Header value or undefined if not found
 */
header(name: string): string | undefined;
```

**Usage Examples:**

```javascript
app.get('/api/data', (req, res) => {
  // Get headers
  const contentType = req.get('Content-Type');
  const userAgent = req.header('User-Agent');
  const authorization = req.get('authorization'); // Case insensitive
  
  console.log('Content-Type:', contentType);
  console.log('User-Agent:', userAgent);
  
  res.json({ received: true });
});
```

### Content Negotiation

Determine the best response format based on client Accept headers.

```javascript { .api }
/**
 * Check if given types are acceptable based on Accept header
 * @param {string|string[]} types - MIME type(s) to check
 * @returns {string|false} Best match or false if none acceptable
 */
accepts(types: string | string[]): string | false;

/**
 * Check if given encodings are acceptable based on Accept-Encoding header
 * @param {string|string[]} encodings - Encoding(s) to check
 * @returns {string|false} Best match or false if none acceptable
 */
acceptsEncodings(encodings: string | string[]): string | false;

/**
 * Check if given charsets are acceptable based on Accept-Charset header
 * @param {string|string[]} charsets - Charset(s) to check
 * @returns {string|false} Best match or false if none acceptable
 */
acceptsCharsets(charsets: string | string[]): string | false;

/**
 * Check if given languages are acceptable based on Accept-Language header
 * @param {string|string[]} langs - Language(s) to check
 * @returns {string|false} Best match or false if none acceptable
 */
acceptsLanguages(langs: string | string[]): string | false;
```

**Usage Examples:**

```javascript
app.get('/api/data', (req, res) => {
  // Content type negotiation
  const format = req.accepts(['json', 'xml', 'html']);
  
  switch (format) {
    case 'json':
      res.json({ data: 'JSON response' });
      break;
    case 'xml':
      res.type('xml').send('<data>XML response</data>');
      break;
    case 'html':
      res.send('<h1>HTML response</h1>');
      break;
    default:
      res.status(406).send('Not Acceptable');
  }
});

app.get('/compressed', (req, res) => {
  // Check encoding support
  if (req.acceptsEncodings('gzip')) {
    // Send compressed response
    res.set('Content-Encoding', 'gzip');
    // ... compress and send
  } else {
    // Send uncompressed
  }
});
```

### Request Analysis

Analyze request content and characteristics.

```javascript { .api }
/**
 * Check if request contains given Content-Type
 * @param {string|string[]} types - Content type(s) to check
 * @returns {string|false} Matching type or false if no match
 */
is(types: string | string[]): string | false;

/**
 * Parse Range header field
 * @param {number} size - Total size of resource
 * @param {object} options - Parsing options (optional)
 * @returns {object|number} Parsed ranges or -1 if malformed, -2 if unsatisfiable
 */
range(size: number, options?: object): object | number;
```

**Usage Examples:**

```javascript
app.post('/upload', (req, res) => {
  // Check content type
  if (req.is('multipart/form-data')) {
    // Handle file upload
  } else if (req.is('application/json')) {
    // Handle JSON data
  } else {
    res.status(415).send('Unsupported Media Type');
  }
});

app.get('/video/:id', (req, res) => {
  const videoSize = getVideoSize(req.params.id);
  
  // Handle range requests for video streaming
  const ranges = req.range(videoSize);
  if (ranges && ranges !== -1 && ranges !== -2) {
    // Send partial content
    res.status(206);
    // ... send range
  } else {
    // Send full video
    res.status(200);
    // ... send complete file
  }
});
```

### Request Properties

Access various request metadata and parsed data.

```javascript { .api }
/**
 * Parsed query string parameters
 */
query: { [key: string]: any };

/**
 * Route parameters from URL path
 */
params: { [key: string]: string };

/**
 * Request body (populated by body-parser middleware)
 */
body: any;

/**
 * Request protocol ('http' or 'https')
 */
protocol: string;

/**
 * True if protocol is https
 */
secure: boolean;

/**
 * Remote IP address (respects trust proxy setting)
 */
ip: string;

/**
 * Array of IP addresses when using proxy (trust proxy must be enabled)
 */
ips: string[];

/**
 * Array of subdomains
 */
subdomains: string[];

/**
 * Request URL pathname
 */
path: string;

/**
 * Original request URL (before any internal redirects)
 */
originalUrl: string;

/**
 * Base URL path on which app is mounted
 */
baseUrl: string;

/**
 * Host header field with port number
 */
host: string;

/**
 * Hostname without port number
 */
hostname: string;

/**
 * True if request is fresh (cache validation)
 */
fresh: boolean;

/**
 * True if request is stale (opposite of fresh)
 */
stale: boolean;

/**
 * True if X-Requested-With header indicates XMLHttpRequest
 */
xhr: boolean;

/**
 * Reference to the Express application instance
 */
app: Application;

/**
 * Reference to the response object for this request
 */
res: Response;

/**
 * Currently matched route object
 */
route: Route;
```

**Usage Examples:**

```javascript
app.get('/users/:id', (req, res) => {
  // Route parameters
  const userId = req.params.id;
  
  // Query parameters
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  
  console.log(`Getting user ${userId}, page ${page}, limit ${limit}`);
  
  res.json({ userId, page, limit });
});

app.post('/api/data', (req, res) => {
  // Request body (requires body parser middleware)
  const data = req.body;
  
  // Request metadata
  console.log('Protocol:', req.protocol);
  console.log('Secure:', req.secure);
  console.log('IP:', req.ip);
  console.log('Hostname:', req.hostname);
  console.log('Path:', req.path);
  
  // Check if AJAX request
  if (req.xhr) {
    res.json({ message: 'AJAX request processed' });
  } else {
    res.redirect('/success');
  }
});

app.get('/cache-demo', (req, res) => {
  if (req.fresh) {
    // Client cache is fresh, send 304
    res.status(304).end();
  } else {
    // Send fresh content
    res.set('ETag', '"12345"');
    res.send('Fresh content');
  }
});

// Subdomain routing
app.get('/', (req, res) => {
  const subdomain = req.subdomains[0];
  
  if (subdomain === 'api') {
    res.json({ message: 'API subdomain' });
  } else if (subdomain === 'admin') {
    res.send('Admin panel');
  } else {
    res.send('Main site');
  }
});
```

### Standard Node.js Properties

The Express request object extends Node.js IncomingMessage, providing access to all standard HTTP request properties:

```javascript { .api }
/**
 * HTTP method (GET, POST, etc.)
 */
method: string;

/**
 * Request URL string
 */
url: string;

/**
 * HTTP headers object
 */
headers: { [key: string]: string | string[] };

/**
 * HTTP version
 */
httpVersion: string;

/**
 * Raw HTTP headers as array
 */
rawHeaders: string[];
```

**Usage Examples:**

```javascript
app.use((req, res, next) => {
  // Log request details
  console.log(`${req.method} ${req.url}`);
  console.log('HTTP Version:', req.httpVersion);
  console.log('Headers:', req.headers);
  
  next();
});
```