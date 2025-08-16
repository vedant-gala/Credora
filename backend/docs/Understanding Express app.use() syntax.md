# Express `app.use` - Detailed Syntaxes and Usage Patterns

## 1. Global Middleware

```javascript
app.use(middlewareFunction)
```

Registers a middleware function that runs for every incoming request, regardless of the path or HTTP method. Common for body parsers, logging, CORS, etc.

**Example:**
```javascript
app.use(express.json());
app.use(cors());
```

## 2. Path-Specific Middleware

```javascript
app.use(path, middlewareFunction)
```

The middleware only runs for requests whose path starts with the given string. The path can be a string, a string pattern, a regular expression, or an array of these.

**Example:**
```javascript
app.use('/api', apiLogger);
app.use(/^\/admin/, adminAuth);
app.use(['/foo', '/bar'], someMiddleware);
```

## 3. Multiple Middleware Functions

```javascript
app.use(middleware1, middleware2, ...)
```

You can pass multiple middleware functions as arguments. They are executed in order, and each must call `next()` to pass control to the next.

**Example:**
```javascript
app.use(middleware1, middleware2, middleware3);
```

## 4. Path + Multiple Middleware

```javascript
app.use(path, middleware1, middleware2, ...)
```

Combines path restriction with multiple middleware. All middleware apply to requests matching the path.

**Example:**
```javascript
app.use('/admin', authMiddleware, adminRoutes);
```

## 5. Router Mounting

```javascript
app.use(path, router)
```

Mounts an instance of an Express Router on a path. All routes defined in the router are now accessible under the given path.

**Example:**
```javascript
import userRouter from './routes/user';
app.use('/users', userRouter);
```

## 6. Arrays of Middleware

```javascript
app.use([middleware1, middleware2])
```

You can pass an array of middleware functions, which will be executed in order. Can be combined with a path.

**Example:**
```javascript
app.use('/api', [mw1, mw2]);
```

## 7. Error-Handling Middleware

```javascript
app.use(function (err, req, res, next) { ... })
```

Middleware with four arguments is treated as an error handler. Should be defined after all other `app.use`/`app.get`/`app.post` calls.

**Example:**
```javascript
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

## 8. Regular Expression Paths

```javascript
app.use(/\/api\/v[0-9]+/, versionedApiMiddleware)
```

Middleware applies to any path matching the regex.

**Example:**
```javascript
app.use(/^\/data\/[a-z]+$/, dataMiddleware);
```

## 9. Subdomain Routing (using custom middleware)

While Express does not natively support subdomain routing in `app.use`, you can write middleware to check `req.hostname` and conditionally handle subdomains.

**Example:**
```javascript
app.use((req, res, next) => {
  if (req.hostname.startsWith('admin.')) {
    // handle admin subdomain
  }
  next();
});
```

## Additional Notes

- The order of `app.use` calls is significant; middleware is executed in the order it is registered.
- If a middleware does not call `next()`, the request will not proceed further.
- Middleware can modify `req` and `res` objects, end the response, or pass control to the next middleware.
- `app.use` can be used for static file serving: `app.use(express.static('public'))`
- You can nest routers and middleware for modular app structure.

---

*End of Express `app.use` usage notes.*