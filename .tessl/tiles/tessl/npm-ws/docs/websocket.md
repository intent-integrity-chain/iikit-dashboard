# WebSocket Client/Server

Core WebSocket connection functionality providing both client and server-side WebSocket connections with full protocol compliance and comprehensive event handling.

## Capabilities

### WebSocket Constructor

Creates a new WebSocket connection as either a client (with address) or server connection (without address).

```javascript { .api }
/**
 * Create a new WebSocket connection
 * @param {string|URL} address - WebSocket URL to connect to (null for server connections)
 * @param {string|string[]} [protocols] - WebSocket subprotocols to negotiate
 * @param {Object} [options] - Connection configuration options
 */
constructor(address, protocols, options);
```

**Client Connection Example:**

```javascript
import WebSocket from 'ws';

// Basic client connection
const ws = new WebSocket('ws://localhost:8080');

// With subprotocols
const ws = new WebSocket('ws://localhost:8080', ['protocol1', 'protocol2']);

// With options
const ws = new WebSocket('ws://localhost:8080', [], {
  handshakeTimeout: 5000,
  maxPayload: 1024 * 1024,
  origin: 'https://example.com'
});
```

### Connection Properties

Access connection state and metadata through getter properties.

```javascript { .api }
/**
 * Binary data type for received messages
 * @type {string} - 'nodebuffer', 'arraybuffer', 'fragments', or 'blob'
 */
get binaryType(): string;
set binaryType(type: string);

/**
 * Number of bytes queued to be transmitted over the network
 * @type {number}
 */
get bufferedAmount(): number;

/**
 * Negotiated WebSocket extensions
 * @type {Object}
 */
get extensions(): Object;

/**
 * Whether receiving of messages is paused
 * @type {boolean}
 */
get isPaused(): boolean;

/**
 * Selected WebSocket subprotocol
 * @type {string}
 */
get protocol(): string;

/**
 * Current connection state
 * @type {number} - WebSocket.CONNECTING (0), OPEN (1), CLOSING (2), or CLOSED (3)
 */
get readyState(): number;

/**
 * WebSocket connection URL
 * @type {string}
 */
get url(): string;
```

**Property Usage Example:**

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connection state:', ws.readyState); // 1 (OPEN)
  console.log('Selected protocol:', ws.protocol);
  console.log('Negotiated extensions:', ws.extensions);
  
  // Set binary data handling
  ws.binaryType = 'arraybuffer';
});
```

### Connection State Constants

WebSocket connection state constants available on both class and instance.

```javascript { .api }
/**
 * Connection state constants
 */
static CONNECTING: 0;  // Connection is being established
static OPEN: 1;        // Connection is open and ready
static CLOSING: 2;     // Connection is being closed
static CLOSED: 3;      // Connection is closed

// Also available on instances
WebSocket.prototype.CONNECTING: 0;
WebSocket.prototype.OPEN: 1;
WebSocket.prototype.CLOSING: 2;
WebSocket.prototype.CLOSED: 3;
```

### Message Sending

Send data over the WebSocket connection with various data types and options.

```javascript { .api }
/**
 * Send data over the WebSocket connection
 * @param {any} data - Data to send (string, Buffer, ArrayBuffer, Array, or stream)
 * @param {Object} [options] - Send options
 * @param {boolean} [options.binary] - Send as binary message
 * @param {boolean} [options.compress] - Apply compression
 * @param {boolean} [options.fin] - Set FIN bit (for fragmented messages)
 * @param {boolean} [options.mask] - Apply masking (client-side only)
 * @param {Function} [cb] - Completion callback
 */
send(data, options, cb);
```

**Send Examples:**

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  // Send text message
  ws.send('Hello World!');
  
  // Send JSON data
  ws.send(JSON.stringify({ type: 'message', data: 'Hello' }));
  
  // Send binary data
  const buffer = Buffer.from('binary data');
  ws.send(buffer, { binary: true });
  
  // Send with compression
  ws.send('Large message...', { compress: true });
  
  // Send with callback
  ws.send('Message', (error) => {
    if (error) {
      console.error('Send failed:', error);
    } else {
      console.log('Message sent successfully');
    }
  });
});
```

### Connection Control

Methods for controlling the WebSocket connection lifecycle.

```javascript { .api }
/**
 * Close the WebSocket connection
 * @param {number} [code] - Close status code (default: 1005)
 * @param {string} [data] - Close reason (max 123 bytes UTF-8)
 */
close(code, data);

/**
 * Forcibly close the connection without proper WebSocket close handshake
 */
terminate();

/**
 * Pause receiving of messages
 */
pause();

/**
 * Resume receiving of messages
 */
resume();
```

**Connection Control Examples:**

```javascript
// Graceful close
ws.close(1000, 'Normal closure');

// Close with custom code
ws.close(4000, 'Custom application error');

// Force close immediately
ws.terminate();

// Pause/resume message handling
ws.pause();
setTimeout(() => ws.resume(), 1000);
```

### Ping/Pong Operations

WebSocket keep-alive and connectivity testing through ping/pong frames.

```javascript { .api }
/**
 * Send a ping frame
 * @param {any} [data] - Optional ping payload
 * @param {boolean} [mask] - Whether to mask the frame
 * @param {Function} [cb] - Completion callback
 */
ping(data, mask, cb);

/**
 * Send a pong frame (usually in response to ping)
 * @param {any} [data] - Optional pong payload
 * @param {boolean} [mask] - Whether to mask the frame
 * @param {Function} [cb] - Completion callback
 */
pong(data, mask, cb);
```

**Ping/Pong Examples:**

```javascript
// Send ping to test connectivity
ws.ping('ping-data');

// Respond to ping with pong
ws.on('ping', (data) => {
  console.log('Received ping:', data);
  ws.pong(data); // Echo the ping data back
});

// Handle pong responses
ws.on('pong', (data) => {
  console.log('Received pong:', data);
});

// Ping with callback
ws.ping('test', false, (error) => {
  if (error) {
    console.error('Ping failed:', error);
  }
});
```

### Event Handling

WebSocket extends EventEmitter and provides comprehensive event handling.

```javascript { .api }
/**
 * WebSocket events:
 * - 'open': Connection established
 * - 'close': Connection closed
 * - 'message': Message received
 * - 'error': Error occurred
 * - 'ping': Ping frame received
 * - 'pong': Pong frame received
 * - 'unexpected-response': Unexpected HTTP response during handshake
 */

// Event handler properties (DOM-style)
get onopen(): Function;
set onopen(handler: Function);
get onclose(): Function;
set onclose(handler: Function);
get onmessage(): Function;
set onmessage(handler: Function);
get onerror(): Function;
set onerror(handler: Function);
```

**Event Handling Examples:**

```javascript
const ws = new WebSocket('ws://localhost:8080');

// EventEmitter-style handlers
ws.on('open', () => {
  console.log('Connection opened');
});

ws.on('message', (data, isBinary) => {
  if (isBinary) {
    console.log('Received binary:', data);
  } else {
    console.log('Received text:', data.toString());
  }
});

ws.on('close', (code, reason) => {
  console.log('Connection closed:', code, reason.toString());
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// DOM-style handlers
ws.onmessage = (event) => {
  console.log('Message received:', event.data);
};

// Handle unexpected responses during handshake
ws.on('unexpected-response', (request, response) => {
  console.log('Unexpected response:', response.statusCode);
});
```

## Configuration Options

```javascript { .api }
interface WebSocketOptions {
  // Event behavior
  allowSynchronousEvents?: boolean;  // Allow sync event emission (default: true)
  autoPong?: boolean;               // Auto-respond to pings (default: true)
  
  // Connection settings
  followRedirects?: boolean;        // Follow HTTP redirects (default: false)
  handshakeTimeout?: number;        // Handshake timeout in ms (default: no timeout)
  timeout?: number;                 // Alias for handshakeTimeout
  maxRedirects?: number;           // Max redirect count (default: 10)
  
  // Protocol settings
  protocolVersion?: number;         // WebSocket protocol version (8 or 13)
  origin?: string;                 // Origin header value
  
  // Performance settings
  maxPayload?: number;             // Max message size (default: 100MB)
  skipUTF8Validation?: boolean;    // Skip UTF-8 validation (default: false)
  perMessageDeflate?: boolean | {  // Compression settings
    threshold?: number;
    concurrencyLimit?: number;
    serverMaxWindowBits?: number;
    clientMaxWindowBits?: number;
    serverNoContextTakeover?: boolean;
    clientNoContextTakeover?: boolean;
  };
  
  // HTTP/HTTPS client options (passed through to http.request/https.request)
  agent?: http.Agent | https.Agent; // Custom HTTP/HTTPS agent for connection pooling
  createConnection?: Function;      // Custom connection creator function
  auth?: string;                   // Basic authentication in 'user:pass' format
  localAddress?: string;           // Local interface to bind for network connections
  family?: number;                 // IP version (4 or 6) for hostname resolution
  lookup?: Function;               // Custom DNS lookup function
  finishRequest?: Function;        // Function to customize request before sending
  headers?: Object;                // Custom HTTP headers for the handshake request
  host?: string;                   // Override hostname (usually auto-detected)
  port?: number;                   // Override port (usually auto-detected)
  hostname?: string;               // Override hostname resolution
  defaultPort?: number;            // Fallback port if not specified in URL
  socketPath?: string;             // Unix domain socket path for local connections
  
  // TLS/SSL security options (for wss:// connections)
  ca?: string | Buffer | Array;        // Certificate authority certificates
  cert?: string | Buffer | Array;      // Client certificate chains
  key?: string | Buffer | Array;       // Client private keys
  passphrase?: string;                 // Passphrase for private key
  pfx?: string | Buffer | Array;       // Client certificate, private key and CA certs
  rejectUnauthorized?: boolean;        // Verify server certificate against CA list
  servername?: string;                 // Server name for SNI TLS extension
  checkServerIdentity?: Function;      // Custom server identity verification
  ciphers?: string;                    // Cipher suite specification
  secureProtocol?: string;            // SSL method to use (e.g., 'TLSv1_2_method')
  
  // Custom functions
  generateMask?: Function;         // Custom mask generator for security
}
```

## EventTarget Implementation

WebSocket provides DOM-compatible event handling alongside traditional Node.js EventEmitter functionality.

### Event Handler Properties

Standard DOM-style event handler properties for common events.

```javascript { .api }
/**
 * Event handler properties (DOM-compatible)
 * @type {Function | null}
 */
get onopen(): Function | null;
set onopen(handler: Function | null);

get onclose(): Function | null;
set onclose(handler: Function | null);

get onerror(): Function | null; 
set onerror(handler: Function | null);

get onmessage(): Function | null;
set onmessage(handler: Function | null);
```

### EventTarget Methods

DOM-compatible event listener management methods.

```javascript { .api }
/**
 * Add event listener (DOM-compatible)
 * @param {string} type - Event type ('open', 'close', 'error', 'message')
 * @param {Function|Object} handler - Event handler function or object with handleEvent method
 * @param {Object} [options] - Options object
 * @param {boolean} [options.once] - Remove listener after first invocation
 */
addEventListener(type, handler, options);

/**
 * Remove event listener (DOM-compatible)  
 * @param {string} type - Event type
 * @param {Function|Object} handler - Handler function or object to remove
 */
removeEventListener(type, handler);
```

### Event Classes

DOM-compatible event objects created automatically for EventTarget listeners.

```javascript { .api }
/**
 * Base Event class
 * @param {string} type - Event type
 */
class Event {
  constructor(type);
  
  get target(): any;     // Event target (the WebSocket instance)
  get type(): string;    // Event type string
}

/**
 * WebSocket close event
 * @param {string} type - Event type (typically 'close')
 * @param {Object} [options] - Event options
 */
class CloseEvent extends Event {
  constructor(type, options);
  
  get code(): number;      // Close status code
  get reason(): string;    // Close reason string
  get wasClean(): boolean; // Whether connection closed cleanly
}

/**
 * WebSocket error event
 * @param {string} type - Event type (typically 'error')
 * @param {Object} [options] - Event options
 */
class ErrorEvent extends Event {
  constructor(type, options);
  
  get error(): any;       // Error object
  get message(): string;  // Error message
}

/**
 * WebSocket message event
 * @param {string} type - Event type (typically 'message')
 * @param {Object} [options] - Event options
 */
class MessageEvent extends Event {
  constructor(type, options);
  
  get data(): any;        // Message data
}
```

**EventTarget Usage Example:**

```javascript
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

// DOM-style event handlers
ws.onopen = function(event) {
  console.log('Connected to:', event.target.url);
};

ws.onmessage = function(event) {
  console.log('Message received:', event.data);
};

ws.onclose = function(event) {
  console.log('Connection closed:', event.code, event.reason);
  console.log('Clean close:', event.wasClean);
};

ws.onerror = function(event) {
  console.error('WebSocket error:', event.error);
  console.error('Error message:', event.message);
};

// addEventListener (DOM-compatible)
ws.addEventListener('message', function(event) {
  // Handle message with DOM-style event object
  console.log('Message event:', event.data);
}, { once: true }); // Remove after first message

// Handler objects
const messageHandler = {
  handleEvent(event) {
    console.log('Handler object received:', event.data);
  }
};

ws.addEventListener('message', messageHandler);
ws.removeEventListener('message', messageHandler);
```