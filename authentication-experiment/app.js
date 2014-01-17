var express = require('express');
var expressJwt = require('express-jwt');  //https://npmjs.org/package/express-jwt
var jwt = require('jsonwebtoken');  //https://npmjs.org/package/node-jsonwebtoken
var app = express();

var secret = 'this is the secret secret secret 12356';

/*
// Asynchronous
var auth = express.basicAuth(function(user, pass, callback) {
     var result = (user === 'testUser' && pass === 'testPass');
     callback(null , result);
});

//Auth required
app.get('/home', auth, function(req, res) {
    res.send('Hello World');
});

//Not auth required
app.get('/noAuth', function(req, res) {
    res.send('Hello World - No Authentication');
});
*/

// See this: http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/
// And this: https://github.com/auth0/angular-token-auth

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: secret}));

app.use(express.json());
app.use(express.urlencoded());

// Non /api url (authenticate)
app.post('/authenticate', function (req, res) {
    //TODO validate req.body.username and req.body.password
    //if is invalid, return 401
    if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
        res.send(401, 'Wrong user or password');
        return;
    }

    var profile = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        id: 123
    };

    // We are sending the profile inside the token
    var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });
    
    res.json({ token: token });
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Restricted API zone
app.get('/api/restricted', function (req, res) {
    console.log('user ' + req.user.email + ' is calling /api/restricted');
    res.json({
        name: 'foo'
    });
});

app.listen(process.env.PORT || 3000);

console.log("Server is online");