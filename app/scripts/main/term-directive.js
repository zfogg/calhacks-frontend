angular.module('calhacks')

.directive('term', function($compile) {
  var message = function(msg, type) {
    return {
      msg: msg,
      className: 'jquery-console-message-'+type,
    }
  };

  return {
    restrict: 'E',
    template: '<div class="_term-wrapper"></div>',
    scope: {
      termOptions: '=',
      termLang: '=',
      reset: '=',
    },

    link: function(scope, elem, attrs) {
      var _message = function(ev, msg) {
        var inner = $('.jquery-console-inner');
        var mesg = $('<div class="jquery-console-message jquery-console-message-error"></div>');
        mesg.filledText(msg).hide();
        inner.append(mesg);
        mesg.show();
      };

      var reset = function(ev, lang) {
        $(elem).find('._term-wrapper').empty();

        scope._el = $('<div class="_term"></div>')
          .appendTo($(elem).find('._term-wrapper'));

        scope._el.console($.extend({
          promptLabel: lang+'> ',
          animateScroll: true,
          promptHistory: true,
          commandValidate: function() {
            return true;
          },
          commandHandle: function(line) {
            return [];
          },
        }, scope.termOptions));
      };
      reset(null, scope.termLang);

      scope.$on('term:reset', reset);
      scope.$on('term:message', _message);
    },

    controller: function($scope) {
      $scope.termOptions = $scope.termOptions || {};
    },
  };
});

