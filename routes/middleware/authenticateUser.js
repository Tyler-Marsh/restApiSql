const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const User = require('../../models').User;
const authenticateUser = async (req, res, next) => {
  let message = null;
  // pull user credentials from request
  const credentials = auth(req);

  // if they exist retrieve the info from the database
  if (credentials) {

    const user =  await User.findOne({
     where: {emailAddress: credentials.name}
    });
 
    // If a user was successfully retrieved from the data store...
    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);
      // If the passwords match...
      if (authenticated) {
        // store the result so that following middleware knows
        // that the user is authenticated
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};

module.exports = authenticateUser;