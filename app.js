

const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
/* Connect-mongo is a MongoDB session store for Express and Connect.
Specifically designed to store session data in MongoDB.
Used in conjunction with express-session middleware to persist session information in MongoDB instead of in-memory storage.
*/

const homeController = require('./controllers/home');
const accountRoutes = require('./routes/accountRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const packetRoutes = require('./routes/packetRoutes');

/* Passport configuration for authentication*/
// const passportConfig = require('./config/passport')

dotenv.config({ path: '.env' });

const app = express();


app.use(express.static(path.join(__dirname)));


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'see-heroes APIs swagger',
      version: '1.0.0',
      description: 'backend portal for web application see-heroes, exposes all application APIs',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  components: {
    schemas: {
      Figurine: {
        type: 'object',
        properties: {
          id_user: {
            type: 'string',
          },
          id_figurine: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          image_path: {
            type: 'string',
          },
          ext: {
            type: 'string',
          },
          description: {
            type: 'string'
          },
          appearances: {
            type: 'array',
            items: {
              type: 'integer'
            }
          }
        }
      }
    }
  },
  apis: ['./controllers/account.js', './controllers/home.js', './controllers/dashboard.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/* By setting this directory, you can simply refer to view names in your route handlers 
without specifying the full path each time*/
app.use(bodyParser.json());
/* This middleware parses incoming requests with JSON payloads.
It allows you to access the parsed data via req.body in your route handlers.
*/
app.use(bodyParser.urlencoded({ extended: true }));
/* This middleware parses incoming requests with URL-encoded payloads.
The { extended: true } option allows for parsing of rich objects and arrays.
It's commonly used for parsing form submissions.*/
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    name: 'startercookie',
    cookie: {
      maxAge: 1209600000, // Two weeks in milliseconds
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
  }));
/* This middleware manages sessions and cookies for your application.
resave: true: Forces the session to be saved back to the session store, even if the session was never modified during the request. This can be necessary for certain stores.
saveUninitialized: true: Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
secret: process.env.SESSION_SECRET: A secret string used to sign the session ID cookie. This should be a long, unique string stored in your environment variables for security.
It uses the MongoStore store to persist sessions in MongoDB.
Generates a unique session ID for each user
Sets a cookie in the user's browser with the session ID
When a request comes in, the middleware will:
1. Check for a session ID in the request cookies
2. If found, retrieve the corresponding session data from MongoDB
3. If not found or expired, create a new session
The session data is then available in your route handlers via req.session.
*/

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/* Passport works in conjunction with Express sessions to handle authentication
the main purpose is add an addtional leyer with passport that provides persistent login sessions
breakdown of how express-session integrated with passport session management process works :
When a request comes in, Express session middleware retrieves the session based on the session ID cookie, it creates a sessionID cookie on the client and stores session data on the server
if the request doesn't have any sessionID cookies
Then, passport.session() looks at the session data. If it finds a serialized user (usually stored as req.session.passport.user), it triggers the deserialization process.
The deserializeUser function is called with the user ID from the session. It typically queries the database to get the full user object.
If deserialization is successful, Passport attaches the user object to the request as req.user.
In your routes, you can then check req.isAuthenticated() (provided by Passport) to see if a user is logged in
*/

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
/* This makes the user object available to all views rendered during this request cycle.
It's useful for passing the authenticated user's information to your views without having to pass it explicitly in every route.
next() passes control to the next middleware function in the stack.
*/
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user
    && req.path !== '/login'
    && req.path !== '/signup'
    && !req.path.match(/^\/auth/)
    && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user
    && (req.path === '/account')) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});
/* This middleware manages redirects after successful login or signup.
It's used to redirect the user back to the page they were trying to access after successful authentication.
Assigns the original URL to the session variable returnTo if the user is not authenticated and the user is not trying to access the login or signup pages.
or if teh user is logged in and trying to access the account page
This allows the app to redirect users back to the page they were trying to access before being prompted to log in.
*/



app.use('/faq', homeController.getFAQ);
app.use('/account', accountRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/packets', packetRoutes);
app.use('/', homeController.getHome);
// app.use('/addpoints', stripetestpayment)



mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
})
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});







app.listen(app.get('port'), () => {
  console.log('Server is running on port', app.get('port'));
});


module.exports = app;