MeetingModule.directive('onPageEnd', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            function onScroll () {
                if (angular.element(document).height() - angular.element(window).height() === window.scrollY) {
                    scope.$apply(attributes.onPageEnd);
                }
            }

            angular.element(window).on('scroll', onScroll);

            element.on('$destroy', function () {
                angular.element(window).off('scroll', onScroll);
            });

        }
    };
}]);