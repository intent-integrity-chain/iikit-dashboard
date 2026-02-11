# WebSocket Server

Server implementation for hosting WebSocket connections with comprehensive configuration options, connection management, and upgrade handling.

## Capabilities

### WebSocketServer Constructor

Creates a WebSocket server that can handle multiple concurrent connections.

```javascript { .api }
/**
 * Create a WebSocket server
 * @param {Object} options - Server configuration options
 * @param {Function} [callback] - Optional callback for 'listening' event
 */
constructor(options, callback);
```

**Server Creation Examples:**

```javascript
import { WebSocketServer } from 'ws';

// Basic server on specific port
const wss = new WebSocketServer({ port: 8080 });

// Server with existing HTTP server
import { createServer } from 'http';
const server = createServer();
const wss = new WebSocketServer({ server });

// No-server mode (manual upgrade handling)
const wss = new WebSocketServer({ noServer: true });

// Server with callback
const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log('WebSocket server listening on port 8080');
});
```

### Server Information

Get information about the running server.

```javascript { .api }
/**
 * Get server address information
 * @returns {Object} Address information with address, family, port
 */
address(): Object;
```

**Usage Example:**

```javascript
const wss = new WebSocketServer({ port: 8080 });

wss.on('listening', () => {
  const address = wss.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});
```

### Server Lifecycle

Control server startup and shutdown.

```javascript { .api }
/**
 * Close the server and all connections
 * @param {Function} [cb] - Callback when server is closed
 */
close(cb);
```

**Server Lifecycle Examples:**

```javascript
const wss = new WebSocketServer({ port: 8080 });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  wss.close((error) => {
    if (error) {
      console.error('Error closing server:', error);
    } else {
      console.log('Server closed successfully');
    }
    process.exit(error ? 1 : 0);
  });
});
```

### Connection Handling

Methods for handling WebSocket upgrade requests and connection management.

```javascript { .api }
/**
 * Check if a request should be handled by this server
 * @param {IncomingMessage} req - HTTP request object
 * @returns {boolean} Whether the request should be handled
 */
shouldHandle(req): boolean;

/**
 * Handle WebSocket upgrade request
 * @param {IncomingMessage} req - HTTP request object
 * @param {Socket} socket - Network socket
 * @param {Buffer} head - First packet of upgrade stream
 * @param {Function} cb - Callback with WebSocket instance and request
 */
handleUpgrade(req, socket, head, cb);
```

**Connection Handling Examples:**

```javascript
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  // Custom upgrade logic
  if (wss.shouldHandle(request)) {
    wss.handleUpgrade(request, socket, head, (ws, req) => {
      console.log('Client connected from:', req.socket.remoteAddress);
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

// Handle new connections
wss.on('connection', (ws, request) => {
  console.log('New connection from:', request.headers.origin);
  
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
  });
});
```

### Client Verification

Implement custom client verification logic before accepting connections.

```javascript { .api }
/**
 * Client verification function type
 * @param {Object} info - Connection information
 * @param {IncomingMessage} info.req - HTTP request
 * @param {string} info.origin - Client origin
 * @param {boolean} info.secure - Whether connection is secure
 * @param {Function} cb - Callback with (result, code, name, headers)
 */
type VerifyClientFunction = (info, cb) => void;
```

**Client Verification Examples:**

```javascript
const wss = new WebSocketServer({
  port: 8080,
  verifyClient: (info, cb) => {
    // Verify origin
    const allowedOrigins = ['http://localhost:3000', 'https://myapp.com'];
    if (!allowedOrigins.includes(info.origin)) {
      cb(false, 403, 'Forbidden origin');
      return;
    }
    
    // Verify authentication token
    const url = new URL(info.req.url, 'http://localhost');
    const token = url.searchParams.get('token');
    
    if (!isValidToken(token)) {
      cb(false, 401, 'Unauthorized');
      return;
    }
    
    cb(true);
  }
});

// Async verification
const wss = new WebSocketServer({
  port: 8080,
  verifyClient: (info, cb) => {
    verifyTokenAsync(info.req.headers.authorization)
      .then(isValid => cb(isValid))
      .catch(() => cb(false, 500, 'Internal Server Error'));
  }
});
```

### Protocol Selection

Handle WebSocket subprotocol negotiation.

```javascript { .api }
/**
 * Protocol selection function type
 * @param {Set<string>} protocols - Client-requested protocols
 * @param {IncomingMessage} req - HTTP request
 * @returns {string|false} Selected protocol or false to reject
 */
type HandleProtocolsFunction = (protocols, req) => string | false;
```

**Protocol Selection Example:**

```javascript
const wss = new WebSocketServer({
  port: 8080,
  handleProtocols: (protocols, request) => {
    console.log('Client requested protocols:', Array.from(protocols));
    
    // Priority-based protocol selection
    const supportedProtocols = ['chat-v2', 'chat-v1', 'echo'];
    
    for (const protocol of supportedProtocols) {
      if (protocols.has(protocol)) {
        return protocol;
      }
    }
    
    // Reject if no supported protocol
    return false;
  }
});
```

### Connection Broadcasting

Manage and broadcast to multiple connected clients.

```javascript { .api }
/**
 * Server clients set (when clientTracking is enabled)
 * @type {Set<WebSocket>}
 */
clients: Set<WebSocket>;
```

**Broadcasting Examples:**

```javascript
const wss = new WebSocketServer({ 
  port: 8080,
  clientTracking: true  // Enable client tracking
});

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = data.toString();
    
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });
});

// Periodic broadcast
setInterval(() => {
  const timestamp = new Date().toISOString();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`Server time: ${timestamp}`);
    }
  });
}, 10000);
```

### Server Events

WebSocketServer extends EventEmitter and provides server-specific events.

```javascript { .api }
/**
 * WebSocketServer events:
 * - 'connection': New WebSocket connection established
 * - 'error': Server error occurred
 * - 'headers': Before response headers are written during handshake
 * - 'listening': Server started listening
 * - 'wsClientError': WebSocket client error before connection established
 */
```

**Event Handling Examples:**

```javascript
const wss = new WebSocketServer({ port: 8080 });

wss.on('listening', () => {
  console.log('Server is listening on port 8080');
});

wss.on('connection', (ws, request) => {
  console.log('New connection from:', request.socket.remoteAddress);
  
  ws.on('error', (error) => {
    console.error('Client error:', error);
  });
});

wss.on('error', (error) => {
  console.error('Server error:', error);
});

wss.on('headers', (headers, request) => {
  // Modify headers before sending handshake response
  headers.push('X-Custom-Header: MyValue');
});

wss.on('wsClientError', (error, socket, request) => {
  console.error('Client error before connection:', error);
  socket.destroy();
});
```

## Configuration Options

```javascript { .api }
interface ServerOptions {
  // Server setup (mutually exclusive)
  port?: number;                    // Port to bind to
  server?: Server;                  // Existing HTTP/HTTPS server
  noServer?: boolean;               // No-server mode for manual upgrade handling
  
  // Network settings
  host?: string;                    // Hostname to bind to
  backlog?: number;                 // Maximum pending connections (default: 511)
  
  // Connection settings
  clientTracking?: boolean;         // Track client connections (default: true)
  maxPayload?: number;             // Maximum message size (default: 100MB)
  skipUTF8Validation?: boolean;    // Skip UTF-8 validation (default: false)
  
  // Event behavior
  allowSynchronousEvents?: boolean; // Allow sync event emission (default: true)
  autoPong?: boolean;              // Auto-respond to pings (default: true)
  
  // Request filtering
  path?: string;                   // Accept only connections matching this path
  
  // Compression
  perMessageDeflate?: boolean | {  // Enable/configure compression
    threshold?: number;              // Minimum message size to compress
    concurrencyLimit?: number;       // Limit concurrent compression operations
    serverMaxWindowBits?: number;    // Server compression window size
    clientMaxWindowBits?: number;    // Client compression window size
    serverNoContextTakeover?: boolean;
    clientNoContextTakeover?: boolean;
  };
  
  // Custom handlers
  verifyClient?: VerifyClientFunction;     // Client verification
  handleProtocols?: HandleProtocolsFunction; // Protocol selection
  WebSocket?: Function;                    // Custom WebSocket class
}
```