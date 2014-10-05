'use strict';


angular.module('calhacks', [
  'ngAnimate',
  'ngCookies',

  'restangular',

  'ui.router',
  'ui.ace',
  'ui.bootstrap',

  'btford.socket-io',
])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('home', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })

      .state('login', {
        url: '/login?tok',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      });

    $urlRouterProvider.otherwise('/');
  });

