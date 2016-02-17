MeetingModule.controller('usersCtrl', ['$scope', '$http', function ($scope, $http) {

    $http
        .get('../www/test-data/contacts.json')
        .success(function(data, status) {
            if (status === 200) {
                $scope.users = data;

                function sort (a, b) {
                    if ( a.name > b.name ) return 1;
                    if ( a.name < b.name ) return -1;
                    return 0;
                }

                var registered = $scope
                        .users
                        .filter(function (element) {
                            return element.registered;
                        })
                        .sort(sort),
                    unregistered = $scope
                        .users
                        .filter(function (element) {
                            return !element.registered;
                        })
                        .sort(sort);

                $scope.users = registered.concat(unregistered);

            }
        });

    $scope.open = function ($index, enadle) {
        if (enadle) {
            $scope.$index = $index;
        }
    };

    $scope.isOpen = function ($index) {
        return $scope.$index === $index;
    };

}]);