var AJAX = (function () {
  var AJAX = function AJAX(uri) {
    if (!(this instanceof AJAX)) {
      return new AJAX(uri);
    }
    this.uri = uri;
    this.jsonData = {};
    this.xhr = new XMLHttpRequest();
    this.requestSuccess = function () {
      console.log('Request OK!');
    }
    this.requestError = function () {
      console.log('Request Error :(');
    }
  }

  AJAX.prototype.get = function (callbackSuccess = this.requestSuccess, callbackError = this.requestError) {
    this.requestSuccess = callbackSuccess;
    this.requestError = callbackError;
    this.startRequest('GET');
  }

  AJAX.prototype.post = function (jsonData, callbackSuccess = this.requestSuccess, callbackError = this.requestError) {
    this.requestSuccess = callbackSuccess;
    this.requestError = callbackError;
    this.jsonData = jsonData;
    this.startRequest('POST', jsonData);
  }

  AJAX.prototype.delete = function (jsonData, callbackSuccess = this.requestSuccess, callbackError = this.requestError) {
    this.requestSuccess = callbackSuccess;
    this.requestError = callbackError;
    this.jsonData = jsonData;
    this.startRequest('DELETE', jsonData);
  }

  AJAX.prototype.startRequest = function (method) {
    this.xhr.open(method, this.uri);
    this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    this.xhr.send(this.toQueryString(this.jsonData));
    this.xhr.onreadystatechange = this.handleReadyStateChange.bind(this);
  }

  AJAX.prototype.handleReadyStateChange = function () {
    if (this.isReady()) {
      var response = JSON.parse(this.xhr.responseText);
      return this.isSuccess() ? this.requestSuccess(response) : this.requestError();
    }
  }

  AJAX.prototype.toQueryString = function (json) {
    return Object.keys(json).map(function (key) {
      return key + '=' + json[key];
    }).join('&');
  }

  AJAX.prototype.isReady = function () {
    return this.xhr.readyState === 4;
  }

  AJAX.prototype.isSuccess = function () {
    return this.xhr.status === 200;
  }

  return AJAX;
})();
