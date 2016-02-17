MeetingModule.controller('newTimeCtrl', ['$scope', '$filter', '$translate', 'time', 'helper',
function ($scope, $filter, $translate, time, helper) {

    $scope.time = time;
    $scope.helper = helper;

    $scope.newTimeModel = {
        showMonth: false,
        selectedDays: 0,
        currentDate: new Date(2015, 8, 10, 8, 5),
        weekDataArray: [],
        monthsDataArray: []
    };

    var minutes = Math.round(($scope.newTimeModel.currentDate.getMinutes() + 60)/5)*5;
    $scope.newTimeModel.currentDate.setMinutes(minutes);
    $scope.newTimeModel.currentDate.setSeconds(0);

    $scope.timeRange = {
        currentDate: $scope.newTimeModel.currentDate,
        hourStart: new Date($scope.newTimeModel.currentDate),
        hourEnd: null
    };

    $scope.newTimeModel.monthsDataArray.push(time.getMonthDateArray($scope.newTimeModel.currentDate, $scope.newTimeModel.currentDate));
    $scope.newTimeModel.monthsDataArray.push(time.nextMonthDataArray($scope.newTimeModel.monthsDataArray[0][0]));
    $scope.newTimeModel.weekDataArray = time.getWeekDateArray($scope.newTimeModel.monthsDataArray);

    $scope.selectCurrentDay = function () {
        for (var c = 0; c < $scope.newTimeModel.monthsDataArray[0].length; c++)
            if ($scope.newTimeModel.monthsDataArray[0][c].getDate() === $scope.newTimeModel.currentDate.getDate()) {
                $scope.newTimeModel.monthsDataArray[0][c].selected = true;
                $scope.newTimeModel.selectedDays++;
            }
    };

    $scope.selectCurrentDay();

    $scope.selectDay = function (date) {

        if (date.selected) {
            date.selected = false;
            $scope.newTimeModel.selectedDays--;

            if ($scope.newTimeModel.selectedDays === 0)
                $scope.selectCurrentDay();

        } else {

            var cd = $scope.newTimeModel.currentDate;

            if (new Date(cd.getFullYear(), cd.getMonth(), cd.getDate()) <=
                new Date(date.getFullYear(), date.getMonth(), date.getDate())) {

                date.selected = true;
                $scope.newTimeModel.selectedDays++;

            }

        }

    };

    $scope.nextMonth = function () {

        if ($scope.newTimeModel.showMonth === false) {
            $scope.newTimeModel.showMonth = true;
            return 0;
        }

        for (var c = 0; c < 2; c++) {
            $scope
                .newTimeModel
                .monthsDataArray
                .push(time.nextMonthDataArray($scope.newTimeModel.monthsDataArray[$scope.newTimeModel.monthsDataArray.length - 1][0]));
        }

    };

    $scope.getMonthName = function (date) {

        if ($translate.preferredLanguage('ru')) {
            return $filter('translate')('MONTH_' + date.getMonth());
        }

        return $filter('date')(date, 'MMMM');
    };

    $scope.getShortDayName = function (date) {

        if ($translate.preferredLanguage('ru')) {
            return $filter('translate')('SHORT_DAY_' + date.getDay());
        }

        return $filter('date')(date, 'EEE');
    };

}]);