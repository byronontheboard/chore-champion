const withAuth = (req, res, next) => {
  // TODO: Add a comment describing the functionality of this if statement
  // Middleware to check if you're logged in. If not, directed to login page.
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuth;
