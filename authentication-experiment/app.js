var express = require('express');
var app = express();

// Authenticator
app.use(express.basicAuth(function(user, pass) {
    return user === 'testUser' && pass === 'testPass';
}));

app.get('/home', function(req, res) {
    res.send('Hello World');
});

app.listen(process.env.PORT || 3000);