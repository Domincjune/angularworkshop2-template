(function () {

'use strict';

  angular.module('workshopApp',
    [
    'ngRoute',
    'ngAnimate',
    'workshopApp.core.services.rest',
    'workshopApp.config',
    'workshopApp.features.user',
    'ui.bootstrap'
    ])
  .config([
    '$locationProvider',
    '$routeProvider',

    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      //routing goes here

    }
  ]);

}());
