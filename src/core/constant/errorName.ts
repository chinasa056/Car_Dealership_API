export enum Errors {
  NOT_AUTHENTICATED = 'This request is not authenticated',
  UNAUTHORIZED = "'Unauthorized access. Please log in to continue'",
  BAD_REQUEST = 'Invalid data provided for the request',
  FORBIDDEN = 'Forbidden. You do not have permission to access this resource',
  REQUEST_VALIDATION = 'There was an issue with your request. Please check the provided information and try again',
  RESOURCE_NOT_FOUND = 'The resource you are looking for could not be found',
  SERVICE_UNAVAILABLE = 'Service unavailable. Please try again later',
  INVALID_AUTHORIZATION_TOKEN = 'Authorization token is invalid',
  SERVER_ERROR = 'Internal server error. Please try again later or contact support if the issue persists'
};

export enum StatusCodes {
  INTERNAL_SERVER_ERROR = 500,
  RESOURCE_NOT_FOUND = 404,
  UNAUTHORIZED = 403,
  NOT_AUTHENTICATED = 401
};
