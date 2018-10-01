(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.postJSON = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /* eslint-env browser */
  function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }

    return Promise.reject(new Error(response.statusText));
  }

  function retrieval(response) {
    return response.json();
  }

  function postJSON(url, bodyObject, cb, errBack) {
    var dataObject = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    var credentials = 'same-origin',
        statusCb = status,
        retrievalCb = retrieval;

    if (url && _typeof(url) === 'object') {
      bodyObject = url.body || bodyObject;
      cb = url.callback || cb;
      errBack = url.errBack || errBack; // Properties only available via this object argument API

      statusCb = url.status || status;
      retrievalCb = url.retrieval || retrieval;
      credentials = url.credentials || credentials; // "omit" (default), "same-origin", "include"

      dataObject.headers = postJSON.objectAssign(dataObject.headers, url.headers);
      url = url.url;
    }

    if (bodyObject) {
      dataObject.body = JSON.stringify(bodyObject);
    }

    dataObject.credentials = credentials;
    var ret = (typeof fetch !== 'undefined' ? fetch : postJSON.fetch)(url, dataObject).then(statusCb).then(retrievalCb);

    if (cb) {
      ret = ret.then(cb);
    }

    if (errBack) {
      ret = ret.catch(errBack);
    }

    return ret;
  }

  postJSON.retrieval = retrieval;
  postJSON.status = status;

  return postJSON;

})));