angular.module('workshopApp.config', [])
    .factory('config', [function () { 'use strict';
        var defaultConfig = {
                testEndPoint: '/testendpoint'
        	};

        return defaultConfig;
    }]);
