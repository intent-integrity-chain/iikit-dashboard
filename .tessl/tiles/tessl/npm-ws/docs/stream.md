# Stream Integration

Node.js streams compatibility allowing WebSocket connections to be used as Duplex streams for integration with Node.js stream pipelines, enabling powerful data processing workflows.

## Capabilities

### createWebSocketStream Function

Wraps a WebSocket connection in a Node.js Duplex stream, enabling seamless integration with Node.js stream ecosystem.

```javascript { .api }
/**
 * Creates a Duplex stream from a WebSocket connection
 * @param {WebSocket} ws - The WebSocket instance to wrap
 * @param {Object} [options] - Options for the Duplex constructor
 * @param {string} [options.encoding] - Default string encoding
 * @param {boolean} [options.objectMode] - Whether to operate in object mode
 * @param {number} [options.highWaterMark] - Buffer size for backpressure
 * @param {boolean} [options.allowHalfOpen] - Allow half-open connections
 * @returns {Duplex} The duplex stream wrapping the WebSocket
 */
function createWebSocketStream(ws, options);
```

**Basic Stream Creation:**

```javascript
import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('ws://localhost:8080');
const stream = createWebSocketStream(ws);

// Stream is now a standard Node.js Duplex stream
stream.write('Hello from stream!');

stream.on('data', (chunk) => {
  console.log('Stream received:', chunk.toString());
});
```

### Stream Pipeline Integration

Use WebSocket streams in Node.js pipeline operations for data transformation and processing.

**Pipeline Examples:**

```javascript
import { pipeline, Transform } from 'stream';
import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('ws://localhost:8080');
const wsStream = createWebSocketStream(ws);

// Create a transform stream
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// Use in pipeline
pipeline(
  process.stdin,
  upperCaseTransform,
  wsStream,
  (error) => {
    if (error) {
      console.error('Pipeline failed:', error);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

### Stream with JSON Processing

Process JSON data using streams for real-time data handling.

**JSON Stream Example:**

```javascript
import { Transform } from 'stream';
import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('ws://localhost:8080');
const wsStream = createWebSocketStream(ws);

// JSON parsing transform
const jsonParser = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    try {
      const data = JSON.parse(chunk.toString());
      this.push(data);
      callback();
    } catch (error) {
      callback(error);
    }
  }
});

// JSON stringifying transform
const jsonStringifier = new Transform({
  objectMode: true,
  transform(obj, encoding, callback) {
    try {
      const json = JSON.stringify(obj) + '\n';
      this.push(json);
      callback();
    } catch (error) {
      callback(error);
    }
  }
});

// Process incoming JSON
wsStream
  .pipe(jsonParser)
  .on('data', (data) => {
    console.log('Parsed JSON:', data);
    
    // Send response back through stream
    const response = { echo: data, timestamp: Date.now() };
    jsonStringifier.write(response);
  });

// Send JSON responses back
jsonStringifier.pipe(wsStream);
```

### File Transfer via Streams

Use WebSocket streams for efficient file transfer operations.

**File Transfer Example:**

```javascript
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import WebSocket, { createWebSocketStream } from 'ws';

// Client: Send file
const ws = new WebSocket('ws://localhost:8080');
const wsStream = createWebSocketStream(ws);

ws.on('open', () => {
  const fileStream = createReadStream('large-file.txt');
  
  pipeline(fileStream, wsStream, (error) => {
    if (error) {
      console.error('File send failed:', error);
    } else {
      console.log('File sent successfully');
    }
  });
});

// Server: Receive file
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  const wsStream = createWebSocketStream(ws);
  const outputFile = createWriteStream('received-file.txt');
  
  pipeline(wsStream, outputFile, (error) => {
    if (error) {
      console.error('File receive failed:', error);
    } else {
      console.log('File received successfully');
    }
  });
});
```

### Stream Event Handling

Handle stream-specific events and errors in addition to WebSocket events.

```javascript { .api }
/**
 * Stream events (in addition to standard Duplex stream events):
 * - 'data': Data received from WebSocket
 * - 'end': Stream ended (WebSocket closed)
 * - 'error': Stream or WebSocket error
 * - 'finish': All data written to WebSocket
 * - 'close': Stream and WebSocket closed
 */
```

**Event Handling Example:**

```javascript
import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('ws://localhost:8080');
const stream = createWebSocketStream(ws);

// Handle stream events
stream.on('data', (chunk) => {
  console.log('Data received:', chunk.length, 'bytes');
});

stream.on('end', () => {
  console.log('Stream ended');
});

stream.on('finish', () => {
  console.log('Stream finished writing');
});

stream.on('error', (error) => {
  console.error('Stream error:', error);
});

stream.on('close', () => {
  console.log('Stream closed');
});

// Write data to stream
stream.write('Hello World!');
stream.end(); // Signal end of writing
```

### Stream Backpressure Handling

Properly handle backpressure in stream operations to prevent memory issues.

**Backpressure Example:**

```javascript
import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('ws://localhost:8080');
const stream = createWebSocketStream(ws, {
  highWaterMark: 16 * 1024 // 16KB buffer
});

function writeWithBackpressure(data) {
  return new Promise((resolve, reject) => {
    const canContinue = stream.write(data);
    
    if (canContinue) {
      resolve();
    } else {
      // Wait for drain event
      stream.once('drain', resolve);
      stream.once('error', reject);
    }
  });
}

// Send large amounts of data with backpressure handling
async function sendLargeData() {
  try {
    for (let i = 0; i < 1000; i++) {
      const data = `Message ${i}: ${'x'.repeat(1024)}\n`;
      await writeWithBackpressure(data);
    }
    console.log('All data sent');
  } catch (error) {
    console.error('Send failed:', error);
  }
}

ws.on('open', sendLargeData);
```

### Server-Side Stream Processing

Use streams on the server side for processing client data.

**Server Stream Processing:**

```javascript
import { Transform } from 'stream';
import { WebSocketServer, createWebSocketStream } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  const wsStream = createWebSocketStream(ws);
  
  // Create processing pipeline
  const processor = new Transform({
    transform(chunk, encoding, callback) {
      // Process each chunk (e.g., word count)
      const text = chunk.toString();
      const wordCount = text.split(/\s+/).length;
      const result = `Processed: ${wordCount} words\n`;
      this.push(result);
      callback();
    }
  });
  
  // Bidirectional processing
  wsStream.pipe(processor).pipe(wsStream);
  
  console.log('Client connected with stream processing');
});
```

## Stream Configuration Options

```javascript { .api }
interface StreamOptions {
  // Standard Duplex stream options
  encoding?: string;           // Default string encoding
  objectMode?: boolean;        // Whether to operate in object mode
  highWaterMark?: number;      // Buffer size for backpressure (default: 16384)
  allowHalfOpen?: boolean;     // Allow half-open connections (default: true)
  
  // Stream behavior
  readableObjectMode?: boolean; // Object mode for readable side
  writableObjectMode?: boolean; // Object mode for writable side
  readableHighWaterMark?: number; // Readable buffer size
  writableHighWaterMark?: number; // Writable buffer size
}
```