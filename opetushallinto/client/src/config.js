const { REACT_APP_API_URL, NODE_ENV } = process.env;

export const API_URL = REACT_APP_API_URL;

export const IS_DEVELOPMENT = NODE_ENV === 'development';
