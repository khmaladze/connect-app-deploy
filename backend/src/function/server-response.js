// Function to determine success based on the response status
const successMessage = (res_status) => {
  // If the response status is 200 or 201, consider it a success
  if (res_status == 200 || res_status == 201) {
    return true;
  }
  return false;
};

// Function for constructing and sending a custom server response
exports.custom_server_response = (res, res_status, res_message, res_data) => {
  // Construct the response data object
  const responseData = {
    success: successMessage(res_status),
    message: res_message,
  };

  // If additional data is provided, include it in the response data
  if (res_data) {
    responseData.data = res_data;
  }

  // Send the response with the constructed data and the specified status
  return res.status(res_status).json(responseData);
};
