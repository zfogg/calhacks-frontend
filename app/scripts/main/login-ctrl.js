'use strict';


angular.module('calhacks')

.config(['$httpProvider', function($httpProvider) {
   delete $httpProvider.defaults.headers.common["X-Requested-With"];
}])

.controller('LoginCtrl', function ($scope, $cookies, $window, $location, $stateParams) {
  if ($cookies.tok && $cookies.tok === $stateParams.tok) {
    $location.url('/');
  } else if (!$cookies.tok && !$stateParams.tok) {
    $window.location.href = 'http://calhacks.ngrok.com/oauth/login';
  } else if (!$cookies.tok && $stateParams.tok) {
    $cookies.tok = $stateParams.tok;
    $location.url('/');
  } else {
    $window.location.href = 'http://calhacks.ngrok.com/oauth/login';
  }
});

