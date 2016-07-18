angular.module('workshopApp.core.services.rest',[]).
factory('restService',
    ['$http', '$q', '$window',
        function ($http, $q,  $window) { 'use strict';

    function makeRequest(method, url, data, headers) {
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: data,
            headers: headers
        }).then(function (response) {
            deferred.resolve(response.data);
        }).catch(function (response) {
          //suppose the catch the error here..
        });

        return deferred.promise;
    }

    function get(url) {
    	return makeRequest('GET', url);
    }

    function post(url, data, headers) {
    	return makeRequest('POST', url, data, headers);
    }

    function put(url, data) {
    	return makeRequest('PUT', url, data);
    }

    function _delete(url) {
    	return makeRequest('DELETE', url);
    }

    return {
    	get: get,
      put: put,
      post: post,
      delete: _delete
	  };

}]);


