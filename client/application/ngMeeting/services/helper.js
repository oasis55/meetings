MeetingModule.factory('helper', [function () {
    var helper;

    helper = {
        getEmptyArray: function (n) {
            n = n || 0;

            for (var c = 0, array = []; c < n; c++) {
                array.push(c);
            }

            return array;
        }
    };

    return helper;
}]);