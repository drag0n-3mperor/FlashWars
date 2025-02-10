class ApiResponse {
  /**
   * a template for sending json response
   */
  constructor(
    statusCode,
    message,
    data,
    success
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }
}

export default ApiResponse;