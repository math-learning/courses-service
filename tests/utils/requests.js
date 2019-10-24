const fetch = require('node-fetch');

const doRequest = async ({ requestUrl, params, token }) => {
  const requestParams = !params ? {} : params;
  requestParams.headers = {
    authorization: token,
    'Content-Type': 'application/json',
  };
  const response = await fetch(requestUrl, requestParams);
  return { status: response.status, body: await response.json() };
};

module.exports = {
  doRequest,
};
