"use strict";

import Request       from "superagent";
import User          from "../stores/user";
import Constants     from "../constants";
import Dispatcher    from "../dispatcher";
import SettingsStore from '../stores/settings';
import _             from "lodash";

const TIMEOUT = 10000;

var _pendingRequests = {};
var _cache = {};

function abortPendingRequests(url) {
  if(_pendingRequests[url]) {
    _pendingRequests[url]._callback = function() {};
    _pendingRequests[url].abort();
    _pendingRequests[url] = null;
  }
}

// Get the JWT from the user
function jwt() {
  return User.jwt();
}

function csrfToken() {
  return SettingsStore.current().csrfToken;
}

function makeUrl(part){
  if(part.indexOf("http") >= 0){
    return part;
  } else {
    var slash = _.last(SettingsStore.current().apiUrl.split("")) == "/" ? "" :"/";
    if(part[0] == "/"){
      part = part.slice(1);
    }
    return SettingsStore.current().apiUrl + slash + part;
  }
}

// GET request with a JWT token and CSRF token
function get(url) {
  return Request
    .get(url)
    .timeout(TIMEOUT)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + jwt())
    .set('X-CSRF-Token', csrfToken());
}

// POST request with a JWT token and CSRF token
function post(url, body) {
  return Request
    .post(url)
    .send(body)
    .set('Accept', 'application/json')
    .timeout(TIMEOUT)
    .set('Authorization', 'Bearer ' + jwt())
    .set('X-CSRF-Token', csrfToken());
}

// PUT request with a JWT token and CSRF token
function put(url, body) {
  return Request
    .put(url)
    .send(body)
    .set('Accept', 'application/json')
    .timeout(TIMEOUT)
    .set('Authorization', 'Bearer ' + jwt())
    .set('X-CSRF-Token', csrfToken());
}

// DELETER request with a JWT token and CSRF token
function del(url) {
  return Request
    .del(url)
    .set('Accept', 'application/json')
    .timeout(TIMEOUT)
    .set('Authorization', 'Bearer ' + jwt())
    .set('X-CSRF-Token', csrfToken());
}

function dispatch(key, response) {
  Dispatcher.dispatch({
    action: key,
    data: response
  });
  return true;
}

// Dispatch a response based on the server response
function dispatchResponse(key) {
  return (err, response) => {
    if(err && err.timeout === TIMEOUT) {
      return dispatch(Constants.TIMEOUT, response);
    } else if(response.status === 401) {
      return dispatch(Constants.NOT_AUTHORIZED, response);
    } else if(response.status === 400) {
      return dispatch(Constants.ERROR, response);
    } else if(response.status === 302) {
      window.location = response.body.url;
    } else if(!response.ok) {
      return dispatch(Constants.ERROR, response);
    } else if(key) {
      return dispatch(key, response);
    }
    return false;
  };
}

function doRequest(key, url, requestMethod){
  
  var requestContainer = buildRequest(url, requestMethod);
  if(requestContainer.promise){
    return requestContainer.promise;
  }

  var promise = new Promise((resolve, reject) => {
    requestContainer.request.end((error, res) => {
      disposeRequest(url);
      var handled = dispatchResponse(key)(error, res);
      if(error && !handled){
        reject(error);
      } else {
        resolve(res);
      }
    });
  });

  requestContainer.promise = promise;
  return promise;
}

function buildRequest(url, requestMethod){
  //abortPendingRequests(url);
  if (!_pendingRequests[url]) {
    _pendingRequests[url] = {
      request: requestMethod(makeUrl(url))
    };
  }
  return _pendingRequests[url];
}

function disposeRequest(url){
  delete _pendingRequests[url];
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.end((error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function *doCacheRequest(url, key, requestMethod){
  
  var promise;  
  var fullUrl = makeUrl(url);

  if (_cache[fullUrl]) {
    setTimeout(() => {
      dispatchResponse(key)(null, _cache[fullUrl]);
    }, 1);

    promise = new Promise((resolve, reject) => {
      resolve(_cache[fullUrl]);
    });

    yield promise;
  };
  
  var requestContainer = buildRequest(url, requestMethod);
  if(requestContainer.promise){
    yield requestContainer.promise;
  } else {
    promise = promisify(requestContainer.request);
    requestContainer.promise = promise;
    promise.then((result) => {
      disposeRequest(url);
      dispatchResponse(key)(null, result);
      _cache[fullUrl] = result;
      _cache[fullUrl].isCached = true;
      return result;
    }, (err) => {
      dispatchResponse(key)(err, err.response);
    });
    yield promise;
  }

}

var API = {

  get(key, url){
    return doRequest(key, url, (fullUrl) => {
      return get(fullUrl);
    });
  },

  post(key, url, body){
    return doRequest(key, url, (fullUrl) => {
      return post(fullUrl, body);
    });
  },

  put(key, url, body){
    return doRequest(key, url, (fullUrl) => {
      return put(fullUrl, body);
    });
  },

  del(key, url){
    return doRequest(key, url, (fullUrl) => {
      return del(fullUrl);
    });
  },

  async cacheGet(url, params, key, refresh){
    url = `${url}${API.queryStringFrom(params)}`;
    var request = doCacheRequest(url, key, (fullUrl) => {
      return get(fullUrl);
    });
    if (key) {
      // We have a key. Invoke the generate to get data and dispatch.
      var response = request.next();
      while (refresh && !response.done){
        response = request.next();
      }
    } else {
      // Return the generator and let the calling code invoke it.
      return request;
    }
  },

  queryStringFrom(params){
    var query = _.chain(params)
      .map((val, key) => {
        if(val){
          return `${key}=${val}`;  
        } else {
          return "";
        }
      })
      .compact()
      .value();

    if(query.length > 0){
      return `?${query.join("&")}`;
    } else {
      return "";
    }

  }

};

export default API;
