var dc = angular.module('dc', ['ngRoute']);

dc.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

dc.config(function($routeProvider) {
    $routeProvider

        .when('/login', {
            templateUrl : '/pages/login',
            controller  : 'bodyCtrl'
        })
        .when('/register', {
            templateUrl : '/pages/register',
            controller  : 'bodyCtrl'
        });
});


dc.controller("bodyCtrl", function($scope, $http, $location){

});