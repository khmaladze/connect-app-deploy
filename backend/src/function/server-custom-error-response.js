const { custom_server_response } = require("./server-response"); // Importing custom server response function
const fs = require("fs");

// Object containing a generic server error message
const serverErrorMessage = {
  server_error: "server error",
};

// Function to handle custom server errors, including cleanup (e.g., deleting uploaded files)
exports.customServerError = async (res, joi_error_message, req) => {
  // If a request object is provided and it contains a file, delete the file
  if (req && req.file) {
    const file = req.file;
    if (file) {
      await fs.unlinkSync(file.path);
    }
  }

  // If the error is a Joi validation error, handle it with a specific function
  if (joi_error_message.details) {
    if (joi_error_message.details[0].message) {
      return customJoiValidationResponse(
        res,
        joi_error_message.details[0].message
      );
    }
  }

  // If it's not a Joi validation error, respond with a generic server error
  return custom_server_response(res, 500, serverErrorMessage.server_error);
};

// Function to handle custom Joi validation error responses
const customJoiValidationResponse = (res, joi_message) => {
  // Respond with a 400 Bad Request status and the provided Joi error message
  return custom_server_response(res, 400, joi_message);
};
