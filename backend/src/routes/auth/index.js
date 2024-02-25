// Import the express module
const express = require("express");

// Import various route handlers for registration, login, and logout
const register = require("./post/post.register");
const login = require("./post/post.login");
const logout = require("./put/put.logout");

// Import the userAuthorization middleware
const userAuthorization = require("../../middleware/user-authorization");

// Create an Express Router instance
let router = express.Router();

// Define routes and corresponding business logic
router.post("/register", register.businessLogic); // Route for user registration
router.post("/login", login.businessLogic); // Route for user login
router.put("/logout", userAuthorization, logout.businessLogic); // Protected route for user logout

// Export the router instance to be used by other parts of the application
module.exports = router;
