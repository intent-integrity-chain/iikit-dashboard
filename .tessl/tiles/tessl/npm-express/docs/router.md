# Routing System

Router and Route classes for organizing application endpoints, handling HTTP methods, and managing route parameters.

## Capabilities

### Router Creation

Create modular route handlers that can be mounted on applications or other routers.

```javascript { .api }
/**
 * Create new router instance
 * @param {object} options - Router configuration options (optional)
 * @returns {Router} Router instance
 */
function Router(options?: object): Router;
```

**Router Options:**

```javascript { .api }
interface RouterOptions {
  /**
   * Enable case sensitivity (disabled by default)
   */
  caseSensitive?: boolean;
  
  /**
   * Preserve req.params values from parent router
   */
  mergeParams?: boolean;
  
  /**
   * Enable strict routing (disabled by default)
   */
  strict?: boolean;
}
```

**Usage Examples:**

```javascript
const express = require('express');
const router = express.Router();

// Basic router creation
const apiRouter = express.Router();
const userRouter = express.Router({ mergeParams: true });

// Router with options
const strictRouter = express.Router({
  strict: true,        // /foo and /foo/ are different
  caseSensitive: true, // /Foo and /foo are different
  mergeParams: true    // Preserve parent route params
});
```

### Router Middleware and Routing

Mount middleware and define routes on router instances.

```javascript { .api }
/**
 * Mount middleware function(s) on router
 * @param {...Function} handlers - Middleware functions
 * @returns {Router} Router instance for chaining
 */
use(...handlers: Function[]): Router;

/**
 * Mount middleware function(s) at specific path
 * @param {string} path - Path pattern
 * @param {...Function} handlers - Middleware functions
 * @returns {Router} Router instance for chaining
 */
use(path: string, ...handlers: Function[]): Router;

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
 * @returns {Router} Router instance for chaining
 */
all(path: string, ...handlers: Function[]): Router;

// HTTP method handlers
get(path: string, ...handlers: Function[]): Router;
post(path: string, ...handlers: Function[]): Router;
put(path: string, ...handlers: Function[]): Router;
delete(path: string, ...handlers: Function[]): Router;
patch(path: string, ...handlers: Function[]): Router;
options(path: string, ...handlers: Function[]): Router;
head(path: string, ...handlers: Function[]): Router;
```

**Usage Examples:**

```javascript
const express = require('express');
const router = express.Router();

// Router-level middleware
router.use((req, res, next) => {
  console.log('Router middleware executed');
  next();
});

// Path-specific middleware
router.use('/protected', authenticateMiddleware);

// Route handlers
router.get('/', (req, res) => {
  res.send('Router home');
});

router.post('/users', (req, res) => {
  res.json({ message: 'User created' });
});

// Route chaining
router.route('/books')
  .get((req, res) => res.send('Get books'))
  .post((req, res) => res.send('Create book'))
  .put((req, res) => res.send('Update book'));

// Mount router on application
const app = express();
app.use('/api', router);
```

### Router Parameter Processing

Add callbacks that trigger when route parameters are present in router paths.

```javascript { .api }
/**
 * Add callback for route parameter
 * @param {string} name - Parameter name
 * @param {Function} fn - Callback function
 * @returns {Router} Router instance for chaining
 */
param(name: string, fn: Function): Router;

/**
 * Add callback for multiple route parameters
 * @param {string[]} names - Array of parameter names
 * @param {Function} fn - Callback function
 * @returns {Router} Router instance for chaining
 */
param(names: string[], fn: Function): Router;
```

**Usage Examples:**

```javascript
const userRouter = express.Router();

// Parameter callback for user ID
userRouter.param('userId', (req, res, next, id) => {
  // Load user data
  User.findById(id, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new Error('User not found'));
    req.user = user;
    next();
  });
});

// Routes using the parameter
userRouter.get('/:userId', (req, res) => {
  res.json(req.user); // User loaded by param callback
});

userRouter.put('/:userId', (req, res) => {
  // Update req.user with req.body data
  req.user.update(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(req.user);
  });
});

// Mount the router
app.use('/users', userRouter);
```

### Route Creation and Management

Create individual routes for more granular control over HTTP method handling.

```javascript { .api }
/**
 * Create new route instance for specified path
 * @param {string} path - Route path pattern
 * @returns {Route} Route instance
 */
function Route(path: string): Route;
```

**Route Methods:**

```javascript { .api }
/**
 * Handle all HTTP methods for this route
 * @param {...Function} handlers - Route handler functions
 * @returns {Route} Route instance for chaining
 */
all(...handlers: Function[]): Route;

// HTTP method handlers for individual route
get(...handlers: Function[]): Route;
post(...handlers: Function[]): Route;
put(...handlers: Function[]): Route;
delete(...handlers: Function[]): Route;
patch(...handlers: Function[]): Route;
options(...handlers: Function[]): Route;
head(...handlers: Function[]): Route;
```

**Usage Examples:**

```javascript
// Create route directly
const userRoute = new express.Route('/users/:id');

// Add handlers to the route
userRoute
  .get((req, res) => {
    res.json({ message: 'Get user', id: req.params.id });
  })
  .put((req, res) => {
    res.json({ message: 'Update user', id: req.params.id });
  })
  .delete((req, res) => {
    res.json({ message: 'Delete user', id: req.params.id });
  });

// More commonly, routes are created via app.route() or router.route()
app.route('/products/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);
```

### Router Mounting and Organization

Organize routes into modular components and mount them on applications.

**Usage Examples:**

```javascript
// User routes module (users.js)
const express = require('express');
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

// Product routes module (products.js) 
const express = require('express');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);

module.exports = router;

// Main application
const express = require('express');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Nested router mounting
const apiRouter = express.Router();
apiRouter.use('/users', userRoutes);
apiRouter.use('/products', productRoutes);
app.use('/api/v1', apiRouter);
```

### Route Path Patterns

Express routers support various path pattern syntaxes for flexible route matching.

**Path Pattern Examples:**

```javascript
// String patterns
router.get('/users', handler);           // Exact match
router.get('/users/*', handler);         // Wildcard
router.get('/files/*.*', handler);       // File with extension

// String patterns with parameters
router.get('/users/:id', handler);              // Single parameter
router.get('/users/:id/posts/:postId', handler); // Multiple parameters
router.get('/users/:id?', handler);             // Optional parameter

// RegExp patterns
router.get(/.*fly$/, handler);           // Ends with 'fly'
router.get(/users\/(\d+)/, handler);     // Users with numeric ID

// Array of patterns
router.get(['/users', '/people'], handler); // Multiple exact matches
```

**Parameter Access:**

```javascript
router.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  console.log(`User: ${userId}, Post: ${postId}`);
  res.json({ userId, postId });
});

// With optional parameters
router.get('/posts/:year/:month?', (req, res) => {
  const { year, month } = req.params;
  // month will be undefined if not provided
  res.json({ year, month: month || 'all' });
});
```

### Error Handling in Routers

Handle errors within router middleware and route handlers.

```javascript { .api }
/**
 * Error handling middleware signature
 * @param {Error} err - Error object
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 */
type ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => void;
```

**Usage Examples:**

```javascript
const router = express.Router();

// Route with error handling
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }
    res.json(user);
  } catch (error) {
    next(error); // Pass error to error handler
  }
});

// Router-level error handler
router.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});
```

### Router Properties

```javascript { .api }
/**
 * Router parameter callbacks
 */
params: { [key: string]: Function[] };

/**
 * Case sensitivity setting
 */
caseSensitive: boolean;

/**
 * Merge parameters setting
 */
mergeParams: boolean;

/**
 * Strict routing setting
 */
strict: boolean;
```

**Usage Examples:**

```javascript
const router = express.Router({ mergeParams: true });

// Check router configuration
console.log('Merge params:', router.mergeParams); // true
console.log('Case sensitive:', router.caseSensitive); // false (default)
console.log('Strict routing:', router.strict); // false (default)
```