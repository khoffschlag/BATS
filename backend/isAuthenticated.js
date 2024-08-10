const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    req.isAuthenticated = true;
    return next();
  } else {
    req.isAuthenticated = false;
    res.status(401).json({ message: " You must be logged in to access this" });
  }
};

module.exports = isAuthenticated;
