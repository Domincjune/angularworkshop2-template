describe('workshopApp.core.services.rest', function () { 'use strict';

var $http,
    $q,
    $window,
    restService;


    beforeEach(module(
        'workshopApp.core.services.rest'
    ));

	  beforeEach(inject(function ($injector) {
       $http = $injector.get('$http');
       $window = $injector.get('$window');
       $q = $injector.get('$q');
       restService =  $injector.get('restService');
    }));

    it('should test get', function () {
    	console.log('testing here again');
		  restService.get('testing');
    });

    it('should test SampleApp.test', function () {
    	console.log('testing here 2');
    });

});
