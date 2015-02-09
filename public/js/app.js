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


dc.controller("formLogin", function($scope, $http, $location){

    console.log("lanzando login");


    $scope.login = function(credential) {

        $http.post('/rest/login', credential).
            success(function(data, status, headers, config) {
                $scope.response  = data;
                $scope.master = data;
                if(typeof data.error!="undefined" && data.error!=null){
                    $scope.error = true;
                    $scope.errorMsg = data.error;
                }else{
                    window.location.hash = "#/dashboard";
                }//end else
            }).
            error(function(data, status, headers, config) {
                window.location.hash = "#/apperror";
                console.log("error: ", data);
            });


    };

});