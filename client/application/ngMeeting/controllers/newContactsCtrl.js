MeetingModule.controller('newContactsCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.selected = [];

    $http
        .get('../www/test-data/contacts.json')
        .success(function(data, status) {
            if (status === 200) {

                function sort (a, b) {
                    if ( a.name > b.name ) return 1;
                    if ( a.name < b.name ) return -1;
                    return 0;
                }

                $scope.users = data
                    .filter(function (element) {
                        return element.registered;
                    })
                    .sort(sort);

            }
        });

    $scope.select = function (id) {
        if (!$scope.isSelected(id))
            $scope.selected.push(id);
        else
            $scope.selected.splice($scope.selected.indexOf(id), 1);
    };

    $scope.isSelected = function (id) {
        return $scope.selected.some(function (element) {
            return element === id;
        });
    };

}]);