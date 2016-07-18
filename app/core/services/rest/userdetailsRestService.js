angular.module('workshopApp.core.services.rest').
    factory('userdetailsRestService', ['urlFactory', 'restService',
        function (urlFactory, restService) {
            'use strict';
            var getTestData = function (requestData) {
                return restService.get(urlFactory.getUrl('testendpoint', requestData));
            };

            var getGroups = function (requestData) {
                return restService.get(urlFactory.getUrl('groups', requestData));
            };

            var saveUserToGroup = function (requestData) {
                return restService.post(urlFactory.getUrl('testendpoint', requestData));
            };

            return {
                getTestData: getTestData,
                getGroups: getGroups,
                saveUserToGroup: saveUserToGroup
            };
        }]);
