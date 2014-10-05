'use strict';


/*jshint multistr: true */
var defaultCode = {};
defaultCode.ruby = 'puts 10';

angular.module('calhacks')

.factory('apiWS', function(socketFactory, $cookies) {
  return function(scope, router) {
    var socket = new WebSocket("ws://calhacks.ngrok.com/connect\?access_token=" + $cookies.tok)

    socket.onmessage = function(message) {
      var data = JSON.parse(message.data);
      scope.$apply(function() {
        router[data.type](data.body, data.user_id);
      });
    };

    return socket;
  };
})

.controller('MainCtrl', function (
  $scope,
  $rootScope,
  $cookies,
  $location,
  apiWS
) {
  if (!$cookies.tok) {
    return $location.url('/login');
  }

  var socket = apiWS($scope, {
    0: function userJoined(message, user_id) {
      console.log('user joined', message);
      $scope.users[user_id] = message.user;
    },
    1: function userLeft(message, user_id) {
      console.log('user left', message);
      delete $scope.users[user_id];
    },
    2: function timerChanged(time) {
      console.log('timer changed', time);
      $scope.timePercent = Math.floor(100 *
        ((time.total - time.remaining) / time.total));
    },
    3: function timerFinished(message) {
      console.log('timer finished', message);
      $scope.timePercent = 100;
    },
    4: function challengeSet(message) {
      console.log('challenge set', message);
      $scope.challenge = message.challenge;
    },
    5: function breakStarted(message) {
      console.log('break started', message);
      $scope.challenge = {
        title: 'Take a short break :)',
        description: 'Get ready for more hacking . . .',
      };
    },
    6: function runCode(message) {
      console.log('run code', message);
    },
    7: function codeRan(message) {
      console.log('code ran', message);
      $rootScope.$broadcast('term:message', message.output);
    },
    8: function initial(message) {
      console.log('initial', message);
      var remaining = message.time_remaining,
          total     = message.time_total;
      $scope.timePercent = Math.floor(100 *
        ((total - remaining) / total));
      $scope.challenge = message.current_challenge;
      message.current_users.forEach(function(u) {
        $scope.users[u.id] = u;
      })
    },
  });

  $scope.run = function() {
    socket.send(JSON.stringify({
      type: 6, // run code
      body: {
        lang: $scope.lang,
        code: btoa($scope._editor.getValue()),
      }
    }));
  };

  $scope.users = {};

  $scope.tests = [{
    inputs:  [-1, 5, 0],
    expected: [0, 3, 0],
    actual: [1, 3, 0],
  }, {
    inputs:  [0, 5, 11],
    expected: [0, 3, 23],
    actual: [0, 3, 23],
  },];

  $scope.testResultClass = function(n) {
    return {
      'true': 'danger',
      'false': 'success',
    }[n];
  };

  $scope.langs = [
    'ruby',
    'python',
    'go',
    'c++',
    'javascript',
    'coffeescript',
    'haskell',
  ];
  $scope.lang = $scope.langs[0];

  $scope.changeLang = function(lang) {
    $scope.lang = lang;
    $scope._editor.setValue(defaultCode[lang]);
    $scope.$broadcast('term:reset', lang);
  };

  var aceLoaded = function (_editor) {
    _editor.setValue(defaultCode[$scope.lang]);
    $scope._editor = _editor;
    $scope.changeLang($scope.lang);
  };

  $scope.aceOptions = {
    useWrapMode     : true,
    showGutter      : true,
    theme           : 'twilight',
    mode            : 'ruby',
    onLoad          : aceLoaded,
  };

  $scope.termOptions = {};

  $scope.sortUser = function(user) { return user.score; };
})


.directive('user', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/user.html',
    scope: {u: '=',},
    controller: function($scope) {
    },
  };
})

