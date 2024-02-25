const express = require("express");
const bodyParser = require("body-parser");
const { detailMessage, isValidEnv } = require("./validate/validate");
const { connectDB } = require("../../config/database");
const config = require("../../config/config");
const authRoutes = require("./routes/auth/index");
const userProfileRoutes = require("./routes/profile/index");
const userSettingsRoutes = require("./routes/settings/index");
const userFriendsRoutes = require("./routes/friend/index");
const userPostsRoutes = require("./routes/post/index");
const userStorysRoutes = require("./routes/story/index");
const userMessageRoutes = require("./routes/message/index");
const userFriendProfileRoutes = require("./routes/userprofile/index");
const { v2: cloudinary } = require("cloudinary");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const path = require("path");

// Check if environment variables are provided
if (isValidEnv()) {
  // Connect to the database
  connectDB();

  // Initialize the app
  const app = express();
  // Enable trust proxy
  app.set("trust proxy", true);

  app.use(mongoSanitize());
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 300, // limit each IP to 100 requests per windowMs
  //   })
  // );
  app.use(helmet());
  // Set Content Security Policy
  const CSP_SRC_SELF = "'self'";
  const CSP_SRC_UNSAFE_INLINE = "'unsafe-inline'";
  const CSP_SRC_UNSAFE_EVAL = "'unsafe-eval'";
  const CSP_GOOGLE_FONTS = "https://fonts.googleapis.com";
  const CSP_CLOUDINARY = "https://res.cloudinary.com";
  const CSP_MEDIA = "https://res.cloudinary.com"; // Update this with the actual source of your media content

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [CSP_SRC_SELF],
        scriptSrc: [CSP_SRC_SELF, CSP_SRC_UNSAFE_INLINE, CSP_SRC_UNSAFE_EVAL],
        styleSrc: [CSP_SRC_SELF, CSP_SRC_UNSAFE_INLINE, CSP_GOOGLE_FONTS],
        imgSrc: [CSP_SRC_SELF, "data:", CSP_CLOUDINARY],
        mediaSrc: [CSP_SRC_SELF, CSP_MEDIA], // Add media-src directive and specify allowed sources
      },
    })
  );

  app.use(hpp());

  // Set up Cloudinary configuration
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  // Parse incoming request bodies in a middleware before your handlers
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const configApiUser = "/api/user"; // Use camelCase for variable names

  // Define routes
  app.use(`${configApiUser}/auth`, authRoutes);
  app.use(`${configApiUser}/profile`, userProfileRoutes);
  app.use(`${configApiUser}/post`, userPostsRoutes);
  app.use(`${configApiUser}/story`, userStorysRoutes);
  app.use(`${configApiUser}/friend`, userFriendsRoutes);
  app.use(`${configApiUser}/settings`, userSettingsRoutes);
  app.use(`${configApiUser}/message`, userMessageRoutes);
  app.use(`${configApiUser}/userprofile`, userFriendProfileRoutes);

  app.use(express.static(path.join(__dirname, "../../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../../frontend/build", "index.html"))
  );

  // Start the server
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
} else {
  // Configuration validation failed, display error message
  detailMessage();
  process.exit(1);
}
