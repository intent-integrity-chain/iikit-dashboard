# ws

ws is a simple to use, blazing fast, and thoroughly tested WebSocket client and server implementation for Node.js. It supports the complete WebSocket protocol including HyBi drafts 07-12 and 13-17, passes the extensive Autobahn test suite, and offers advanced features like WebSocket compression through permessage-deflate extension.

## Package Information

- **Package Name**: ws
- **Package Type**: npm
- **Language**: JavaScript (Node.js)
- **Installation**: `npm install ws`

## Core Imports

```javascript
const WebSocket = require('ws');
const { WebSocketServer } = require('ws');
```

For ES modules:

```javascript
import WebSocket, { WebSocketServer } from 'ws';
```

## Basic Usage

```javascript
import WebSocket, { WebSocketServer } from 'ws';

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    ws.send('echo: ' + data);
  });

  ws.send('Welcome!');
});

// Create a WebSocket client
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  ws.send('Hello Server!');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
```

## Architecture

The ws library is built around several core components:

- **WebSocket Class**: Main client/server connection handler extending EventEmitter with DOM-compatible EventTarget support
- **WebSocketServer Class**: Server for handling multiple WebSocket connections
- **Protocol Implementation**: Complete HyBi protocol support with frame processing and low-level utilities
- **Compression Support**: Optional permessage-deflate extension for bandwidth optimization
- **Stream Integration**: Node.js streams compatibility through createWebSocketStream
- **EventTarget Implementation**: DOM-compatible event handling with Event, CloseEvent, ErrorEvent, and MessageEvent classes
- **Performance Optimizations**: Optional native modules (bufferutil, utf-8-validate)

## Capabilities

### WebSocket Client/Server

Core WebSocket connection functionality providing both client and server-side WebSocket connections with full protocol compliance.

```javascript { .api }
/**
 * WebSocket client/server connection class
 * @param {string|URL} address - WebSocket URL for client connections
 * @param {string|string[]} [protocols] - WebSocket subprotocols
 * @param {Object} [options] - Connection options
 */
class WebSocket extends EventEmitter {
  constructor(address, protocols, options);
  
  // Connection state constants
  static CONNECTING: 0;
  static OPEN: 1;
  static CLOSING: 2;
  static CLOSED: 3;
  
  // Properties
  get binaryType(): string;
  set binaryType(type: string);
  get bufferedAmount(): number;
  get extensions(): Object;
  get isPaused(): boolean;
  get protocol(): string;
  get readyState(): number;
  get url(): string;
  
  // Methods
  close(code?: number, data?: string): void;
  pause(): void;
  ping(data?: any, mask?: boolean, cb?: Function): void;
  pong(data?: any, mask?: boolean, cb?: Function): void;
  resume(): void;
  send(data: any, options?: Object, cb?: Function): void;
  terminate(): void;
}
```

[WebSocket Client/Server](./websocket.md)

### WebSocket Server

Server implementation for hosting WebSocket connections with comprehensive configuration options and connection management.

```javascript { .api }
/**
 * WebSocket server class for handling multiple connections
 * @param {Object} options - Server configuration options
 * @param {Function} [callback] - Optional listening callback
 */
class WebSocketServer extends EventEmitter {
  constructor(options, callback);
  
  // Methods
  address(): Object;
  close(cb?: Function): void;
  shouldHandle(req: IncomingMessage): boolean;
  handleUpgrade(req: IncomingMessage, socket: Socket, head: Buffer, cb: Function): void;
}
```

[WebSocket Server](./websocket-server.md)

### Stream Integration

Node.js streams compatibility allowing WebSocket connections to be used as Duplex streams for integration with Node.js stream pipelines.

```javascript { .api }
/**
 * Creates a Duplex stream from a WebSocket connection
 * @param {WebSocket} ws - The WebSocket instance to wrap
 * @param {Object} [options] - Options for the Duplex constructor
 * @returns {Duplex} The duplex stream
 */
function createWebSocketStream(ws: WebSocket, options?: Object): Duplex;
```

[Stream Integration](./stream.md)

### Protocol Implementation

Low-level protocol implementation components for advanced use cases including custom frame processing and protocol extensions.

```javascript { .api }
/**
 * WebSocket frame receiver for processing incoming data
 */
class Receiver extends Writable {
  constructor(options?: Object);
}

/**
 * WebSocket frame sender for outgoing data
 */
class Sender {
  constructor(socket: Duplex, extensions?: Object, generateMask?: Function);
}
```

[Protocol Implementation](./protocol.md)

## Types

```javascript { .api }
// Node.js built-in types referenced in this documentation:
// - Buffer: Node.js Buffer class
// - Duplex: Node.js stream.Duplex class  
// - EventEmitter: Node.js events.EventEmitter class
// - IncomingMessage: Node.js http.IncomingMessage class
// - Server: Node.js http.Server or https.Server class
// - Socket: Node.js net.Socket class
// Event handler types
type MessageHandler = (data: Buffer | string, isBinary: boolean) => void;
type CloseHandler = (code: number, reason: Buffer) => void;
type ErrorHandler = (error: Error) => void;
type OpenHandler = () => void;
type PingPongHandler = (data: Buffer) => void;

// Configuration types
interface WebSocketOptions {
  allowSynchronousEvents?: boolean;
  autoPong?: boolean;
  followRedirects?: boolean;
  generateMask?: Function;
  handshakeTimeout?: number;
  maxPayload?: number;
  maxRedirects?: number;
  origin?: string;
  perMessageDeflate?: boolean | Object;
  protocolVersion?: number;
  skipUTF8Validation?: boolean;
}

interface ServerOptions {
  allowSynchronousEvents?: boolean;
  autoPong?: boolean;
  backlog?: number;
  clientTracking?: boolean;
  handleProtocols?: Function;
  host?: string;
  maxPayload?: number;
  noServer?: boolean;
  path?: string;
  perMessageDeflate?: boolean | Object;
  port?: number;
  server?: Server;
  skipUTF8Validation?: boolean;
  verifyClient?: Function;
  WebSocket?: Function;
}
```