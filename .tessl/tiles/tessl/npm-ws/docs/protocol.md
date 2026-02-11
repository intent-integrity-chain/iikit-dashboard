# Protocol Implementation

Low-level protocol implementation components for advanced use cases including custom frame processing, protocol extensions, and direct manipulation of WebSocket protocol features.

## Capabilities

### Receiver Class

WebSocket frame receiver for processing incoming data with comprehensive frame parsing and validation.

```javascript { .api }
/**
 * HyBi Receiver implementation for processing WebSocket frames
 * @extends Writable
 * @param {Object} [options] - Receiver configuration options
 */
class Receiver extends Writable {
  constructor(options);
  
  // Error handler property
  onerror: Function | null;
}
```

**Receiver Configuration:**

```javascript { .api }
interface ReceiverOptions {
  // Event behavior
  allowSynchronousEvents?: boolean;  // Allow sync event emission (default: true)
  
  // Data handling
  binaryType?: string;              // Binary data type: 'nodebuffer', 'arraybuffer', 'fragments', 'blob'
  maxPayload?: number;              // Maximum message size (default: unlimited)
  skipUTF8Validation?: boolean;     // Skip UTF-8 validation (default: false)
  
  // Protocol settings
  isServer?: boolean;               // Server or client mode (default: false)
  extensions?: Object;              // Negotiated extensions
}
```

**Receiver Usage Example:**

```javascript
import { Receiver } from 'ws';

const receiver = new Receiver({
  binaryType: 'arraybuffer',
  maxPayload: 1024 * 1024, // 1MB limit
  skipUTF8Validation: false
});

// Handle received messages
receiver.on('message', (data, isBinary) => {
  if (isBinary) {
    console.log('Binary message:', data.byteLength, 'bytes');
  } else {
    console.log('Text message:', data.toString());
  }
});

// Handle control frames
receiver.on('ping', (data) => {
  console.log('Ping received:', data);
});

receiver.on('pong', (data) => {
  console.log('Pong received:', data);
});

receiver.on('close', (code, reason) => {
  console.log('Close frame:', code, reason.toString());
});

receiver.on('conclude', (code, reason) => {
  console.log('Connection concluded:', code, reason.toString());
});

// Error handler property
receiver.onerror = (error) => {
  console.error('Receiver error:', error);
};
```

### Sender Class

WebSocket frame sender for outgoing data with frame construction and masking capabilities.

```javascript { .api }
/**
 * HyBi Sender implementation for sending WebSocket frames
 * @param {Duplex} socket - The connection socket
 * @param {Object} [extensions] - Negotiated extensions
 * @param {Function} [generateMask] - Function to generate masking keys
 */
class Sender {
  constructor(socket, extensions, generateMask);
  
  // Error handler property
  onerror: Function | null;
  
  // Static methods
  static frame(data: any, options: Object): Buffer[];
}
```

**Sender Methods:**

```javascript { .api }
/**
 * Send a text or binary message
 * @param {any} data - Data to send
 * @param {Object} options - Send options
 * @param {Function} cb - Completion callback
 */
send(data, options, cb);

/**
 * Send a close frame
 * @param {number} code - Close status code
 * @param {string} data - Close reason
 * @param {boolean} mask - Whether to mask the frame
 * @param {Function} cb - Completion callback
 */
close(code, data, mask, cb);

/**
 * Send a ping frame
 * @param {any} data - Ping payload
 * @param {boolean} mask - Whether to mask the frame
 * @param {Function} cb - Completion callback
 */
ping(data, mask, cb);

/**
 * Send a pong frame
 * @param {any} data - Pong payload
 * @param {boolean} mask - Whether to mask the frame
 * @param {Function} cb - Completion callback
 */
pong(data, mask, cb);

/**
 * Static method to frame data according to WebSocket protocol
 * @param {Buffer|string} data - Data to frame
 * @param {Object} options - Framing options
 * @param {boolean} [options.fin] - Whether this is the final frame
 * @param {number} [options.opcode] - WebSocket opcode
 * @param {boolean} [options.mask] - Whether to mask the frame
 * @param {Buffer} [options.maskKey] - Masking key to use
 * @returns {Buffer[]} Array containing framed data buffers
 */
static frame(data, options): Buffer[];
```

**Sender Usage Example:**

```javascript
import { Sender } from 'ws';
import { createConnection } from 'net';

const socket = createConnection({ port: 8080 });
const sender = new Sender(socket);

socket.on('connect', () => {
  // Set error handler
  sender.onerror = (error) => {
    console.error('Sender error:', error);
  };
  
  // Send various frame types
  sender.send('Hello World!', { binary: false }, (error) => {
    if (error) console.error('Send failed:', error);
  });
  
  sender.ping(Buffer.from('ping-data'), true, (error) => {
    if (error) console.error('Ping failed:', error);
  });
  
  sender.close(1000, 'Normal closure', true, (error) => {
    if (error) console.error('Close failed:', error);
  });
  
  // Use static frame method for custom frame construction
  const frameData = Sender.frame('Custom message', {
    fin: true,
    opcode: 1, // Text frame
    mask: true
  });
  // frameData is array of Buffer objects ready to send
});
```

### PerMessageDeflate Extension

Advanced WebSocket compression extension for bandwidth optimization with configurable parameters and extension negotiation.

```javascript { .api }
/**
 * permessage-deflate extension implementation
 * @param {Object} [options] - Compression configuration
 * @param {boolean} [isServer] - Server or client mode
 * @param {number} [maxPayload] - Maximum allowed message length (default: 0)
 */
class PerMessageDeflate {
  constructor(options, isServer, maxPayload);
  
  // Static property
  static get extensionName(): string; // Returns 'permessage-deflate'
  
  // Instance properties
  params: Object | null; // Negotiated extension parameters
  
  // Public methods
  offer(): Object;
  accept(configurations: Object[]): Object;
  cleanup(): void;
  decompress(data: Buffer, fin: boolean, callback: Function): void;
  compress(data: Buffer, fin: boolean, callback: Function): void;
}
```

**PerMessageDeflate Configuration:**

```javascript { .api }
interface PerMessageDeflateOptions {
  // Window size settings
  serverMaxWindowBits?: boolean | number; // Server compression window (8-15, default: 15)
  clientMaxWindowBits?: boolean | number; // Client compression window (8-15, default: 15)
  
  // Context takeover
  serverNoContextTakeover?: boolean;   // Disable server context takeover
  clientNoContextTakeover?: boolean;   // Disable client context takeover
  
  // Performance settings
  threshold?: number;                  // Minimum size to compress (default: 1024)
  concurrencyLimit?: number;          // Concurrent compression ops (default: 10)
  
  // zlib options
  zlibDeflateOptions?: Object;        // Options passed to zlib deflate
  zlibInflateOptions?: Object;        // Options passed to zlib inflate
}
```

**PerMessageDeflate Methods:**

```javascript { .api }
/**
 * Create extension negotiation offer
 * @returns {Object} Extension offer for WebSocket handshake
 */
offer(): Object;

/**
 * Accept extension negotiation configurations
 * @param {Object[]} configurations - Array of configuration objects from negotiation
 * @returns {Object} Accepted configuration parameters
 */
accept(configurations): Object;

/**
 * Release all resources used by the extension
 */
cleanup(): void;

/**
 * Decompress data with concurrency limiting
 * @param {Buffer} data - Compressed data to decompress
 * @param {boolean} fin - Whether this is the final frame of a message
 * @param {Function} callback - Callback function (error, result)
 */
decompress(data, fin, callback): void;

/**
 * Compress data with concurrency limiting
 * @param {Buffer} data - Data to compress
 * @param {boolean} fin - Whether this is the final frame of a message
 * @param {Function} callback - Callback function (error, result)
 */
compress(data, fin, callback): void;
```

**PerMessageDeflate Example:**

```javascript
import { PerMessageDeflate } from 'ws';

const extension = new PerMessageDeflate({
  threshold: 1024,              // Only compress messages > 1KB
  concurrencyLimit: 10,         // Limit concurrent operations
  serverMaxWindowBits: 15,      // Maximum compression
  clientMaxWindowBits: 15,
  zlibDeflateOptions: {
    chunkSize: 1024,
    memLevel: 7,
    level: 3                    // Balanced compression level
  }
}, true, 1024 * 1024); // isServer = true, maxPayload = 1MB

// Extension negotiation
const offer = extension.offer();
console.log('Extension offer:', offer);

// Accept negotiated configuration
const configs = [{ server_max_window_bits: 15 }];
const accepted = extension.accept(configs);
console.log('Accepted config:', accepted);

// Cleanup when done
extension.cleanup();
```

### Buffer Utilities

Low-level buffer manipulation utilities for WebSocket frame processing.

```javascript { .api }
/**
 * Buffer manipulation utilities
 */

/**
 * Concatenate multiple buffers efficiently
 * @param {Buffer[]} list - Array of buffers to concatenate
 * @param {number} totalLength - Total length of all buffers
 * @returns {Buffer} Concatenated buffer
 */
function concat(list, totalLength): Buffer;

/**
 * Apply WebSocket masking to buffer
 * @param {Buffer} source - Source buffer to mask
 * @param {Buffer} mask - 4-byte masking key
 * @param {Buffer} output - Output buffer for masked data
 * @param {number} offset - Starting offset in output buffer
 * @param {number} length - Number of bytes to mask
 */
function mask(source, mask, output, offset, length): void;

/**
 * Remove WebSocket masking from buffer
 * @param {Buffer} buffer - Buffer with masked data
 * @param {Buffer} mask - 4-byte masking key
 */
function unmask(buffer, mask): void;

/**
 * Convert buffer to ArrayBuffer
 * @param {Buffer} buf - Buffer to convert
 * @returns {ArrayBuffer} Converted ArrayBuffer
 */
function toArrayBuffer(buf): ArrayBuffer;

/**
 * Convert various data types to Buffer
 * @param {any} data - Data to convert (string, ArrayBuffer, etc.)
 * @returns {Buffer} Converted buffer
 */
function toBuffer(data): Buffer;
```

**Buffer Utilities Example:**

```javascript
import { concat, mask, unmask, toArrayBuffer, toBuffer } from 'ws';

// Concatenate multiple message fragments
const fragments = [
  Buffer.from('Hello '),
  Buffer.from('World!'),
  Buffer.from(' How are you?')
];
const totalLength = fragments.reduce((sum, buf) => sum + buf.length, 0);
const combined = concat(fragments, totalLength);
console.log('Combined message:', combined.toString());

// Apply masking (client-side)
const message = Buffer.from('Secret message');
const maskKey = Buffer.from([0x12, 0x34, 0x56, 0x78]);
const masked = Buffer.alloc(message.length);
mask(message, maskKey, masked, 0, message.length);

// Remove masking (server-side)
unmask(masked, maskKey);
console.log('Unmasked:', masked.toString());

// Convert between buffer types
const arrayBuffer = toArrayBuffer(message);
const backToBuffer = toBuffer(arrayBuffer);
```

### Validation Utilities

Protocol validation functions for ensuring WebSocket compliance.

```javascript { .api }
/**
 * Validation utilities for WebSocket protocol
 */

/**
 * Check if close status code is valid
 * @param {number} code - Status code to validate
 * @returns {boolean} Whether the status code is valid
 */
function isValidStatusCode(code): boolean;

/**
 * Check if buffer contains valid UTF-8
 * @param {Buffer} buf - Buffer to validate
 * @returns {boolean} Whether buffer contains valid UTF-8
 */
function isValidUTF8(buf): boolean;

/**
 * Check if value is a Blob object
 * @param {any} value - Value to test
 * @returns {boolean} Whether value is a Blob
 */
function isBlob(value): boolean;
```

**Validation Example:**

```javascript
import { isValidStatusCode, isValidUTF8, isBlob } from 'ws';

// Validate close codes
console.log(isValidStatusCode(1000)); // true - normal closure
console.log(isValidStatusCode(1001)); // true - going away
console.log(isValidStatusCode(1005)); // false - reserved code

// Validate UTF-8 content
const validUtf8 = Buffer.from('Hello 世界', 'utf8');
const invalidUtf8 = Buffer.from([0xFF, 0xFE, 0xFD]);
console.log(isValidUTF8(validUtf8));   // true
console.log(isValidUTF8(invalidUtf8)); // false

// Check for Blob objects
console.log(isBlob(new Blob(['data']))); // true (in environments with Blob)
console.log(isBlob('string'));          // false
```

### Custom Frame Processing

Advanced example of custom frame processing using low-level components.

**Custom Frame Processor:**

```javascript
import { Receiver, Sender } from 'ws';
import { createConnection } from 'net';

class CustomWebSocket {
  constructor(url) {
    this.url = url;
    this.socket = createConnection({ port: 8080 });
    this.receiver = new Receiver({ isServer: false });
    this.sender = new Sender(this.socket);
    
    this.setupReceiver();
    this.setupSocket();
  }
  
  setupReceiver() {
    // Custom message processing
    this.receiver.on('message', (data, isBinary) => {
      if (isBinary) {
        this.handleBinaryMessage(data);
      } else {
        this.handleTextMessage(data.toString());
      }
    });
    
    // Handle control frames
    this.receiver.on('ping', (data) => {
      this.sender.pong(data, false, (error) => {
        if (error) console.error('Pong failed:', error);
      });
    });
    
    this.receiver.on('close', (code, reason) => {
      console.log('Connection closed:', code, reason.toString());
      this.socket.end();
    });
  }
  
  setupSocket() {
    this.socket.on('data', (data) => {
      this.receiver.write(data);
    });
    
    this.socket.on('close', () => {
      console.log('Socket closed');
    });
  }
  
  handleTextMessage(text) {
    console.log('Text message:', text);
  }
  
  handleBinaryMessage(data) {
    console.log('Binary message:', data.length, 'bytes');
  }
  
  send(data) {
    this.sender.send(data, { binary: Buffer.isBuffer(data) }, (error) => {
      if (error) console.error('Send failed:', error);
    });
  }
  
  close(code = 1000, reason = '') {
    this.sender.close(code, reason, false, () => {
      this.socket.end();
    });
  }
}
```