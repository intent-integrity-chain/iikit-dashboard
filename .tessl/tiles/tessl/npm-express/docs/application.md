# Application Management

Core application creation, configuration, and server management functionality for Express applications.

## Capabilities

### Application Creation

Creates an Express application instance that can handle HTTP requests.

```javascript { .api }
/**
 * Creates an Express application instance
 * @returns {Function} Express application function that handles HTTP requests
 */
function express();
```

**Usage Example:**

```javascript
const express = require('express');
const app = express();

// The app is now a function that can handle HTTP requests
// and has methods for routing, middleware, and configuration
```

### Settings Management

Configure application behavior through settings that control various aspects of Express operation.

```javascript { .api }
/**
 * Set application setting to value, or return setting value if no value provided
 * @param {string} setting - Setting name
 * @param {any} val - Setting value (optional)
 * @returns {Application|any} Application instance for chaining, or setting value
 */
set(setting: string, val?: any): Application | any;

/**
 * Get application setting value
 * @param {string} setting - Setting name
 * @returns {any} Setting value
 */
get(setting: string): any;

/**
 * Enable boolean setting (set to true)
 * @param {string} setting - Setting name
 * @returns {Application} Application instance for chaining
 */
enable(setting: string): Application;

/**
 * Disable boolean setting (set to false)
 * @param {string} setting - Setting name
 * @returns {Application} Application instance for chaining
 */
disable(setting: string): Application;

/**
 * Check if boolean setting is enabled
 * @param {string} setting - Setting name
 * @returns {boolean} True if setting is enabled
 */
enabled(setting: string): boolean;

/**
 * Check if boolean setting is disabled
 * @param {string} setting - Setting name
 * @returns {boolean} True if setting is disabled
 */
disabled(setting: string): boolean;
```

**Usage Examples:**

```javascript
// Configure application settings
app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', './views');

// Get setting values
const port = app.get('port'); // 3000
const viewEngine = app.get('view engine'); // 'ejs'

// Enable/disable boolean settings
app.enable('trust proxy');
app.disable('x-powered-by');

// Check setting status
if (app.enabled('trust proxy')) {
  console.log('Trust proxy is enabled');
}
```

### Server Lifecycle

Start HTTP server and handle incoming requests.

```javascript { .api }
/**
 * Start HTTP server listening on specified port
 * @param {number} port - Port number (optional, defaults to 80)
 * @param {string} hostname - Hostname (optional)
 * @param {number} backlog - Connection backlog (optional)
 * @param {Function} callback - Callback when server starts (optional)
 * @returns {Server} Node.js HTTP Server instance
 */
listen(port?: number, hostname?: string, backlog?: number, callback?: Function): Server;
listen(port?: number, hostname?: string, callback?: Function): Server;
listen(port?: number, callback?: Function): Server;
listen(callback?: Function): Server;
```

**Usage Examples:**

```javascript
// Basic server startup
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// With hostname
app.listen(3000, 'localhost', () => {
  console.log('Server running on localhost:3000');
});

// Store server reference for later use
const server = app.listen(3000);
server.close(() => {
  console.log('Server closed');
});
```

### Middleware System

Mount middleware functions that process requests and responses.

```javascript { .api }
/**
 * Mount middleware function(s) at application level
 * @param {...Function} handlers - Middleware functions
 * @returns {Application} Application instance for chaining
 */
use(...handlers: Function[]): Application;

/**
 * Mount middleware function(s) at specific path
 * @param {string} path - Path pattern
 * @param {...Function} handlers - Middleware functions
 * @returns {Application} Application instance for chaining
 */
use(path: string, ...handlers: Function[]): Application;
```

**Usage Examples:**

```javascript
// Application-level middleware
app.use(express.json());
app.use(express.static('public'));

// Path-specific middleware
app.use('/api', authenticateMiddleware);
app.use('/admin', authMiddleware, adminMiddleware);

// Multiple middleware functions
app.use(loggingMiddleware, corsMiddleware, securityMiddleware);
```

### Routing Methods

Handle HTTP requests for specific paths and methods.

```javascript { .api }
/**
 * Create new route for specified path
 * @param {string} path - Route path pattern
 * @returns {Route} Route instance for method chaining
 */
route(path: string): Route;

/**
 * Handle all HTTP methods for specified path
 * @param {string} path - Route path pattern
 * @param {...Function} handlers - Route handler functions
 * @returns {Application} Application instance for chaining
 */
all(path: string, ...handlers: Function[]): Application;

// Common HTTP method handlers
get(path: string, ...handlers: Function[]): Application;
post(path: string, ...handlers: Function[]): Application;
put(path: string, ...handlers: Function[]): Application;
delete(path: string, ...handlers: Function[]): Application;
patch(path: string, ...handlers: Function[]): Application;
options(path: string, ...handlers: Function[]): Application;
head(path: string, ...handlers: Function[]): Application;

// Additional HTTP methods (Express supports all Node.js HTTP methods)
acl(path: string, ...handlers: Function[]): Application;
bind(path: string, ...handlers: Function[]): Application;
checkout(path: string, ...handlers: Function[]): Application;
connect(path: string, ...handlers: Function[]): Application;
copy(path: string, ...handlers: Function[]): Application;
link(path: string, ...handlers: Function[]): Application;
lock(path: string, ...handlers: Function[]): Application;
merge(path: string, ...handlers: Function[]): Application;
mkactivity(path: string, ...handlers: Function[]): Application;
mkcalendar(path: string, ...handlers: Function[]): Application;
mkcol(path: string, ...handlers: Function[]): Application;
move(path: string, ...handlers: Function[]): Application;
notify(path: string, ...handlers: Function[]): Application;
propfind(path: string, ...handlers: Function[]): Application;
proppatch(path: string, ...handlers: Function[]): Application;
purge(path: string, ...handlers: Function[]): Application;
query(path: string, ...handlers: Function[]): Application;
rebind(path: string, ...handlers: Function[]): Application;
report(path: string, ...handlers: Function[]): Application;
search(path: string, ...handlers: Function[]): Application;
source(path: string, ...handlers: Function[]): Application;
subscribe(path: string, ...handlers: Function[]): Application;
trace(path: string, ...handlers: Function[]): Application;
unbind(path: string, ...handlers: Function[]): Application;
unlink(path: string, ...handlers: Function[]): Application;
unlock(path: string, ...handlers: Function[]): Application;
unsubscribe(path: string, ...handlers: Function[]): Application;
```

**Usage Examples:**

```javascript
// Individual route handlers
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users', (req, res) => {
  res.json({ message: 'User created' });
});

// Route chaining
app.route('/books')
  .get((req, res) => res.send('Get books'))
  .post((req, res) => res.send('Add book'))
  .put((req, res) => res.send('Update book'));

// Handle all methods
app.all('/secret', (req, res) => {
  res.send('Secret area');
});
```

### Template Engine Integration

Configure and use template engines for rendering views.

```javascript { .api }
/**
 * Register template engine for file extension
 * @param {string} ext - File extension (without dot)
 * @param {Function} fn - Template engine function
 * @returns {Application} Application instance for chaining
 */
engine(ext: string, fn: Function): Application;

/**
 * Render view template with local variables
 * @param {string} name - View name
 * @param {object} options - Local variables for view (optional)
 * @param {Function} callback - Callback function (optional)
 */
render(name: string, options?: object, callback?: Function): void;
```

**Usage Examples:**

```javascript
// Register template engine
app.engine('hbs', require('handlebars').__express);

// Set default template engine
app.set('view engine', 'hbs');
app.set('views', './views');

// Render view (typically done in route handlers via res.render)
app.render('index', { title: 'Home' }, (err, html) => {
  if (err) throw err;
  console.log(html);
});
```

### Parameter Processing

Add callbacks that trigger when route parameters are present.

```javascript { .api }
/**
 * Add callback for route parameter
 * @param {string} name - Parameter name
 * @param {Function} fn - Callback function
 * @returns {Application} Application instance for chaining
 */
param(name: string, fn: Function): Application;

/**
 * Add callback for multiple route parameters
 * @param {string[]} names - Array of parameter names
 * @param {Function} fn - Callback function
 * @returns {Application} Application instance for chaining
 */
param(names: string[], fn: Function): Application;
```

**Usage Examples:**

```javascript
// Single parameter callback
app.param('userId', (req, res, next, id) => {
  // Find user by id and attach to request
  User.findById(id, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new Error('User not found'));
    req.user = user;
    next();
  });
});

// Multiple parameters
app.param(['id', 'page'], (req, res, next, value) => {
  // Validate numeric parameters
  if (!/^\d+$/.test(value)) {
    return next(new Error('Invalid parameter'));
  }
  next();
});

// Now routes with :userId will trigger the callback
app.get('/users/:userId', (req, res) => {
  res.json(req.user); // User was loaded by param callback
});
```

### Application Path

Get the absolute pathname of the application based on its mount path.

```javascript { .api }
/**
 * Get absolute pathname based on parent applications mount path
 * @returns {string} Absolute path string
 */
path(): string;
```

**Usage Examples:**

```javascript
// Main application
const mainApp = express();
console.log(mainApp.path()); // ''

// Sub-application mounted on /admin
const adminApp = express();
mainApp.use('/admin', adminApp);
console.log(adminApp.path()); // '/admin'

// Nested sub-application
const userApp = express();
adminApp.use('/users', userApp);
console.log(userApp.path()); // '/admin/users'
```

### Application Properties

```javascript { .api }
/**
 * Application-level local variables available to all templates
 */
locals: object;

/**
 * Path patterns on which app was mounted
 */
mountpath: string | string[];

/**
 * Application settings object
 */
settings: object;

/**
 * Template engine cache
 */
engines: object;

/**
 * Compiled view cache
 */
cache: object;

/**
 * Parent application (when this app is mounted as sub-app)
 */
parent: Application;

/**
 * Reference to lazy-loaded router instance
 */
router: Router;
```

**Usage Examples:**

```javascript
// Set global template variables
app.locals.siteName = 'My Website';
app.locals.version = '1.0.0';

// Check mount path
console.log(app.mountpath); // '/' for main app

// Access settings
console.log(app.settings.env); // 'development' or 'production'
```