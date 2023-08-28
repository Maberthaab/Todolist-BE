const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  let token = req.headers['authorization'];

  if (token != null && token != undefined) {
    token = token.split(' ')[1]; //Access token

    jwt.verify(token, 'access', async (err, user) => {
      if (user) {
        req.user = user;
        next();
      }
    });
  } else {
    req.user = {
      userId: null,
    };
    next();
  }
};