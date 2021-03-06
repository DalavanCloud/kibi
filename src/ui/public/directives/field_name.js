import $ from 'jquery';
import 'ui/filters/short_dots';
import uiModules from 'ui/modules';
const module = uiModules.get('kibana');

module.directive('fieldName', function ($compile, $rootScope, $filter) {
  return {
    restrict: 'AE',
    scope: {
      'field': '=',
      'fieldName': '=',
      'fieldType': '=',
      'fieldAlias': '=?' // kibi: added fieldAlias to support column renaming in kibi-doc-table
    },
    link: function ($scope, $el) {

      const typeIcon = function (fieldType) {
        switch (fieldType) {
          case 'source':
            return '<i title="source" class="fa fa-file-text-o "></i>';
          case 'string':
            return '<i title="string"><strong>t</strong></i>';
          case 'murmur3':
            return '<i title="murmur3"><strong>h</strong></i>';
          case 'number':
            return '<i title="number"><strong>#</strong></i>';
          case 'date':
            return '<i title="date" class="fa fa-clock-o"></i>';
          case 'ip':
            return '<i title="ip" class="fa fa-laptop"></i>';
          case 'geo_point':
            return '<i title="geo_point" class="fa fa-globe"></i>';
          case 'boolean':
            return '<i title="boolean" class="fa fa-adjust"></i>';
          case 'conflict':
            return '<i title="conflict" class="fa fa-warning"></i>';
          default:
            return '<i title="unknown"><strong>?</strong></i>';
        }
      };

      $rootScope.$watchMulti.call($scope, [
        'field',
        'fieldName',
        'fieldAlias', // kibi: added fieldAlias to support column renaming in kibi-doc-table
        'fieldType',
        'field.rowCount'
      ], function () {

        const type = $scope.field ? $scope.field.type : $scope.fieldType;
        const name = $scope.field ? $scope.field.name : $scope.fieldName;
        const results = $scope.field ? !$scope.field.rowCount && !$scope.field.scripted : false;
        const scripted = $scope.field ? $scope.field.scripted : false;
        const displayName = $filter('shortDots')(name);

        // kibi: build element structure before setting field name
        $el
          .attr('title', name)
          .toggleClass('no-results', results)
          .toggleClass('scripted', scripted)
          .prepend(typeIcon(type));

        // kibi: support alias for column name
        // check if alias is different than original name to avoid showing
        // the same name in parenthesis
        if ($scope.fieldAlias && $scope.fieldAlias !== name) {
          $el
            .append($('<span>')
              .text($filter('shortDots')($scope.fieldAlias))
              .addClass('discover-field-name')
            );
          $el
            .append($('<span>')
              .text(displayName)
              .addClass('original-field-name')
            );
        } else {
          $el
            .append($('<span>')
              .text(displayName)
              .addClass('discover-field-name')
            );
        }
        // kibi: end
      });
    }
  };
});
