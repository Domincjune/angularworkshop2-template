(function () {
    'use strict';
    function urlListProvider() {
        var self = this;

        self.urlList = {
            testendpoint: '{{config.testEndPoint}}/testtable/',
            groups: '{{config.testEndPoint}}/groups/'
        };

        this.addUrl = function addUrl(name, url) {
            self.urlList[name] = url;
            return self;
        };

        this.$get = [function() {
            return _.clone(self.urlList);
        }];
    }

    angular.module('workshopApp.core.services.rest').provider('urlList', [urlListProvider]);

}());
