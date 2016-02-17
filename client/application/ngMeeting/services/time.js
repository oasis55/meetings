MeetingModule.factory('time', [function () {
    var time;

    time = {
        isWeekend: function (date) {
            var day = date.getDay();
            return day === 0 || day === 6;
        },
        getWeekDateArray: function (dateArray) {

            var weekDateArray = [];

            if (dateArray[0].length >= 7) {

                var day = dateArray[0][0].getDay(),
                    dayInWeek = day === 0 ? 7 : day,
                    newDay;

                if (day === 1) {
                    weekDateArray = dateArray[0].slice(0,7);
                } else {
                    for (var c = 0; c < 7; c++) {

                        if (dayInWeek > c + 1) {
                            newDay = new Date(dateArray[0][0]);
                            newDay.setDate(-c);
                            weekDateArray.push(newDay);
                        } else {
                            weekDateArray.push(dateArray[0][c + 1 - dayInWeek]);
                        }

                    }
                }

            } else {

                for (c = 0; c < 7; c++) {

                    if (dateArray[0].length > c) {
                        weekDateArray.push(dateArray[0][c]);
                    } else {
                        // v1
                        //weekDateArray.push(dateArray[1][c - dateArray[0].length]);

                        // v2
                        weekDateArray.push(dateArray[1][0]);
                        dateArray[1].splice(0,1);
                    }

                }

            }

            return weekDateArray;
        },
        getMonthDateArray: function (monthDate, fromDate) {
            monthDate = monthDate || new Date();

            var monthDateArray = [],
                daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate(),
                dayInWeek = fromDate ? (fromDate.getDay() === 0 ? 7 : fromDate.getDay()) : null;

            for (var c = 0; c < daysInMonth; c++)
                if (!fromDate || (c >= fromDate.getDate() - dayInWeek))
                    monthDateArray.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), c + 1));

            return monthDateArray;
        },
        nextMonthDataArray: function (date) {

            var firstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

            return this.getMonthDateArray(firstDay);
        }
    };

    return time;
}]);