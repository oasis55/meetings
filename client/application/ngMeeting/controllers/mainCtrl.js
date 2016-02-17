MeetingModule.controller('mainCtrl', ['$scope', '$cordovaDevice', 'tmhDynamicLocale', '$location',
function ($scope, $cordovaDevice, tmhDynamicLocale, $location) {

    $scope.$location = $location;

    $scope.mainModel = {
        bodyCssClass: 'default',
        backgroundLight: true
    };

    $scope.$watch('$location.$$path', function (value) {
        $scope.mainModel.backgroundLight =
            !(value === "/meetings" ||
              value === "/invitations" ||
              value === "/opportunities");
    });

    document.addEventListener("deviceready", function () {

        $scope.mainModel.bodyCssClass = $cordovaDevice.getPlatform();
        $scope.$apply();

    }, false);

    tmhDynamicLocale.set(window.navigator.language);

}]);