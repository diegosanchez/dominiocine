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
		.when('/', {
            templateUrl : '/home',
            controller  : 'bodyCtrl'
        })
		.when('/chat', {
            templateUrl : '/pages/chat',
            controller  : 'bodyCtrl'
        })
		.when('/movie/:title', {
            templateUrl : '/movie/:title',
            controller  : 'bodyCtrl'
        })
        .when('/register', {
            templateUrl : '/pages/register',
            controller  : 'bodyCtrl'
        });
});


dc.controller("bodyCtrl", function($scope, $http, $location){
	console.log("bodyCtrl called");
			var socket = io();
		  $('#sendBtn').click(function(){
					console.log("enviando");	
					socket.emit('chat message', $('#m').val());
					$('#m').val('');
					return false;
			});
			
			
			socket.on('chat message', function(msg){
					$('#messages').append($('<li>').text(msg));
						console.log("llego mensaje: ", new Date().getTime(), msg, diff);
			  });
  
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