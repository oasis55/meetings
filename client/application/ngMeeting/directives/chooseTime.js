MeetingModule.directive('chooseTime', ['$document', function ($document) {

/**

options = {
    mode: 'hoursRange' | 'minutesDelay'
}

*/

return {
    restrict: 'E',
    scope: {
        sync: '=',
        options: '='
    },
    replace: true,
    templateUrl: 'templates/chooseTime.html',
    link: function (scope, element) {

        var svg           = element.find('svg'),
            points        = element.find('.time__point'),
            dash          = element.find('.time__dash'),
            $window       = angular.element(window),
            radius        = 150,
            offset        = null,
            width         = null,
            height        = null,
            windowWidth   = null,
            windowHeight  = null,
            X             = null,
            Y             = null,
            oldRad        = [],
            onClickPoint  = false,
            onClickCircle = false,
            rangeSelected = false,
            strokeWidth   = 50,
            dashArray     = null,
            dashOffset    = Number(dash.eq(0).css('stroke-dashoffset').replace('px', '')),
            dashRotate    = null,
            pointDelete   = false;

        scope.sync.currentDate.hours   = scope.sync.currentDate.getHours();
        scope.sync.currentDate.minutes = scope.sync.currentDate.getMinutes();

        function onResize () {
            console.log('onResize');

            offset         = element.offset();
            width          = element.width();
            height         = element.height();
            X              = offset.left + width/2;
            Y              = offset.top + height/2;
            windowWidth    = $window.width();
            windowHeight   = $window.height();

            //svg
            //    .width(width - 32 < 340 ? width - 32 : 340)
            //    .height(width - 32 < 340 ? width - 32 : 340);
        }

        function getHoursMinutes (rad, oldDate) {
            var hours   = 6*rad/Math.PI,
                minutes = Math.round( (hours - Math.floor(hours))*12 )*5;

            hours = Math.floor(hours);

            if (minutes === 60) {
                hours += 1;
                minutes = 0;
            }

            if (oldDate) {
                var hoursOld   = oldDate.getHours();

                if (hoursOld > 12 || (hoursOld > 6 && hours < 6))
                    hours += 12;

                if (hours === 24 || (hoursOld > 18 && hours < 18)) {
                    hours = 23;
                    minutes = 59;
                }
            }

            return {
                hours: hours,
                minutes: minutes
            }
        }

        function getRadians () {
            // date
            // hours, minutes

            var date;

            if (typeof arguments[0] === 'object')
                date = arguments[0];
            if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number'){
                date = new Date();
                date.setHours(arguments[0]);
                date.setMinutes(arguments[1]);
            }

            var rad,
                hours = date.getHours(),
                minutes = date.getMinutes();

            hours = hours > 12 ? hours - 12 : hours;
            rad = 2*Math.PI*((hours*60 + minutes)/720);

            return rad;
        }

        function getDashArray (hoursStart, hoursEnd) {
            return Math.abs(hoursStart.getHours()*60 + hoursStart.getMinutes() -
                            hoursEnd.getHours()*60  - hoursEnd.getMinutes())/(12*60)*dashOffset + dashOffset;
        }

        onResize();

        if (scope.options.mode === 'hoursRange') {

            var rad =  getRadians(scope.sync.hourStart);

            points
                .hide()
                .eq(0)
                .show()
                .css({
                    'transform': 'rotate(' + rad + 'rad)'
                });
            dash
                .css({
                    'transform': 'rotate(' + rad + 'rad)'
                })
                .hide();

            oldRad[0] = rad;
        }

        if (scope.options.mode === 'minutesDelay') {}

        function onTouchStart (event) {
            console.log('onTouchStart');
            onResize(); //TODO: optimize

            // Событые: нажатие бегунок
            var element = event.originalEvent.touches[0].target.parentNode;
            if (element.classList[0] === 'time__point') {
                console.log('in_point');

                for (var c = 0; c < points.length; c++)
                    if (element === points.eq(c)[0]) {
                        points
                            .eq(c)
                            .attr('class', 'time__point time__point_selected');

                        onClickPoint = c;
                    }

                return 0;
            }

            // Событие: нажатие внешней дуги
            if (scope.options.mode === 'hoursRange' && !rangeSelected) {

                var x = event.originalEvent.touches[0].pageX - X,
                    y = Y - event.originalEvent.touches[0].pageY,
                    atan = Math.atan2(x, y),
                    rad  = atan < 0 ? atan + 2*Math.PI : atan;

                if (Math.pow(radius, 2) > Math.pow(x, 2) + Math.pow(y, 2) &&
                    Math.pow(radius - strokeWidth, 2) < Math.pow(x, 2) + Math.pow(y, 2)) {

                    console.log('in_round');

                    var hoursMinutes   = getHoursMinutes(rad),
                        hoursStart     = scope.sync.hourStart.getHours(),
                        minutesStart   = scope.sync.hourStart.getMinutes(),
                        hoursCurrent   = scope.sync.currentDate.getHours(),
                        minutesCurrent = scope.sync.currentDate.getMinutes();

                    if (hoursStart < 12) {
                        //console.log('AM');
                        if (hoursStart*60 + minutesStart < hoursMinutes.hours*60 + hoursMinutes.minutes) {
                            //console.log('>');
                            if (hoursMinutes.hours*60 + hoursMinutes.minutes - hoursStart*60 - minutesStart < 60) {
                                //console.log('< 60');
                                return 0;
                            } else {
                                //console.log('> 60');
                                // OK
                            }
                        } else {
                            //console.log('<');
                            if (hoursStart*60 + minutesCurrent - hoursMinutes.hours*60 - hoursMinutes.minutes < 60) {
                                //console.log('< 60');
                                return 0;
                            } else {
                                //console.log('> 60');
                                if (hoursCurrent*60 + minutesCurrent < hoursMinutes.hours*60 + hoursMinutes.minutes) {
                                    //console.log('+');
                                } else {
                                    //console.log('-');
                                    hoursMinutes.hours += 12;
                                    if (hoursMinutes.hours*60 + hoursMinutes.minutes - hoursStart*60 - minutesStart < 60) {
                                        //console.log('< 60');
                                        return 0;
                                    } else {
                                        //console.log('> 60');
                                        // OK
                                    }
                                }
                            }
                        }
                    } else {
                        //console.log('PM');
                        if (hoursStart*60 + minutesStart < (hoursMinutes.hours + 12)*60 + hoursMinutes.minutes) {
                            //console.log('>');
                            if ((hoursMinutes.hours + 12)*60 + hoursMinutes.minutes - hoursStart*60 - minutesStart < 60) {
                                //console.log('< 60');
                                return 0;
                            } else {
                                //console.log('> 60');
                                if (hoursStart*60 + minutesStart - hoursMinutes.hours*60 - hoursMinutes.minutes < 60) {
                                    //console.log('< 60');
                                    return 0;
                                } else {
                                    //console.log('> 60');
                                    hoursMinutes.hours += 12;
                                }
                            }
                        } else {
                            //console.log('<');
                            if (hoursStart*60 + minutesStart - (hoursMinutes.hours + 12)*60 - hoursMinutes.minutes < 60) {
                                //console.log('< 60');
                                return 0;
                            } else {
                                //console.log('> 60');
                                hoursMinutes.hours += 12;
                            }
                        }
                    }

                    if (hoursStart*60 + minutesStart > hoursMinutes.hours*60 + hoursMinutes.minutes) {
                        scope.sync.hourStart.setHours(hoursMinutes.hours);
                        scope.sync.hourStart.setMinutes(hoursMinutes.minutes);

                        points
                            .eq(0)
                            .attr('class', 'time__point time__point_selected')
                            .css('transform', 'rotate(' + rad + 'rad)');

                        hoursMinutes.hours = hoursStart;
                        hoursMinutes.minutes = minutesStart;
                        oldRad[0] = rad;
                        rad = getRadians(hoursMinutes.hours, hoursMinutes.minutes);
                        onClickPoint = 0;
                    } else {

                        points
                            .eq(1)
                            .attr('class', 'time__point time__point_selected');

                        onClickPoint = 1;
                    }

                    scope.sync.hourEnd = new Date(scope.sync.hourStart);
                    scope.sync.hourEnd.setHours(hoursMinutes.hours);
                    scope.sync.hourEnd.setMinutes(hoursMinutes.minutes);
                    scope.$applyAsync();

                    points
                        .eq(1)
                        .show()
                        .css('transform', 'rotate(' + rad + 'rad)');

                    oldRad[1] = rad;

                    dash
                        .css({
                            'transform': 'rotate(' + (oldRad[0] - Math.PI/2) + 'rad)',
                            'stroke-dasharray': getDashArray(scope.sync.hourStart, scope.sync.hourEnd) + 'px'
                        })
                        .show();

                    rangeSelected = true;
                    onClickCircle = true;
                    return 0;
                }

            }

        }

        function onTouchMove (event) {
            var x    = event.originalEvent.touches[0].pageX - X,
                y    = Y - event.originalEvent.touches[0].pageY,
                atan = Math.atan2(x, y),
                rad  = atan < 0 ? atan + 2*Math.PI : atan;

            if (onClickPoint !== false) {
                event.preventDefault();

                if (scope.options.mode === 'hoursRange') {

                    var date = onClickPoint === 0 ? scope.sync.hourStart : scope.sync.hourEnd,
                        cssClass = pointDelete ? 'time__point_delete' : 'time__point_selected',
                        hoursMinutes = getHoursMinutes(rad, date);

                    if (((hoursMinutes.hours - scope.sync.currentDate.hours)*60 +
                          hoursMinutes.minutes - scope.sync.currentDate.minutes < 0) ||
                         (hoursMinutes.hours <= 12 && hoursMinutes.hours > 5 && date.getHours() < 5))
                        return 0;

                    if (hoursMinutes.hours === 23 && hoursMinutes.minutes === 59)
                        rad = 0;

                    if (rangeSelected) {

                        var nextPointDate = onClickPoint === 0 ? scope.sync.hourEnd : scope.sync.hourStart,
                            dRad          = rad - getRadians(nextPointDate),
                            dRadAbs       = Math.abs(dRad);

                        if (dRadAbs < Math.PI/6 ||
                            dRadAbs > 2*Math.PI - Math.PI/6) {

                            var hours,
                                minutes,
                                radians,
                                point,
                                exit;

                            if (onClickPoint === 0) {
                                if (((dRad < 0 && dRad > -Math.PI) || dRad >= 2*Math.PI - Math.PI/6)) {
                                    if ((hoursMinutes.hours + 1)*60 + hoursMinutes.minutes >= 23*60 + 59) {
                                        hours = 23;
                                        minutes = 59;
                                        radians = 0;
                                        point = 1;
                                        exit = true;
                                    } else {
                                        hours = hoursMinutes.hours + 1;
                                        minutes = hoursMinutes.minutes;
                                        radians = rad + Math.PI/6;
                                        point = 1;
                                        exit = false;
                                    }
                                } else {
                                    if (nextPointDate.getHours() - hoursMinutes.hours < 11)
                                        return 0;
                                    hours = hoursMinutes.hours - 1 + 12;
                                    minutes = hoursMinutes.minutes;
                                    radians = rad - Math.PI/6;
                                    point = 1;
                                    exit = false;
                                }
                            } else {
                                if ((dRad > 0 && dRad < Math.PI) || (dRad <= Math.PI/6 - 2*Math.PI && dRad > - 2*Math.PI)) {
                                    if ((hoursMinutes.hours - 1)*60 + hoursMinutes.minutes <=
                                        scope.sync.currentDate.hours*60 + scope.sync.currentDate.minutes) {
                                        hours = scope.sync.currentDate.hours;
                                        minutes = scope.sync.currentDate.minutes;
                                        radians = getRadians(scope.sync.currentDate);
                                        point = 0;
                                        exit = true;
                                    } else {
                                        hours = hoursMinutes.hours - 1;
                                        minutes = hoursMinutes.minutes;
                                        radians = rad - Math.PI/6;
                                        point = 0;
                                        exit = false
                                    }
                                } else {
                                    if (hoursMinutes.hours - nextPointDate.getHours() < 11)
                                        return 0;
                                    if (hoursMinutes.hours === 23 && hoursMinutes.minutes === 59) {
                                        hours = 13;
                                        minutes = 0;
                                    } else {
                                        hours = hoursMinutes.hours + 1 - 12;
                                        minutes = hoursMinutes.minutes;
                                    }
                                    radians = rad + Math.PI/6;
                                    point = 0;
                                    exit = false
                                }
                            }

                            nextPointDate.setHours(hours);
                            nextPointDate.setMinutes(minutes);
                            points
                                .eq(point)
                                .css({
                                    'transform': 'rotate(' + radians + 'rad)'
                                });
                            oldRad[point] = radians;
                            if (exit){
                                scope.$applyAsync();
                                return 0;
                            }
                        }
                    }

                    date.setHours(hoursMinutes.hours);
                    date.setMinutes(hoursMinutes.minutes);
                    scope.$applyAsync();

                    points
                        .eq(onClickPoint)
                        .attr('class', 'time__point ' + cssClass)
                        .css({
                            'transform': 'rotate(' + rad + 'rad)'
                        });

                    if (scope.sync.hourEnd) {
                        dash
                            .css({
                                'transform': 'rotate(' + ((onClickPoint === 0 ? rad : oldRad[0]) - Math.PI/2) + 'rad)',
                                'stroke-dasharray': getDashArray(scope.sync.hourStart, scope.sync.hourEnd) + 'px'
                            });
                    }

                }

                if (scope.options.mode === 'minutesDelay') {}

                oldRad[onClickPoint] = rad;
            }

        }

        function documentOnTouchMove (event) {
            if (!rangeSelected) return 0;

            var x = event.originalEvent.touches[0].clientX,
                y = event.originalEvent.touches[0].clientY;

            pointDelete = x <= 16 || x >= windowWidth - 16 || y <= 16 || y >= windowHeight - 16;
        }

        function onTouchEnd () {
            console.log('onTouchEnd');

            if (onClickPoint !== false) {

                if (pointDelete !== false) {
                    //console.log('delete')
                    if (onClickPoint === 0) {
                        var hours   = scope.sync.hourEnd.getHours(),
                            minutes = scope.sync.hourEnd.getMinutes();

                        scope.sync.hourStart.setHours(hours);
                        scope.sync.hourStart.setMinutes(minutes);

                        points
                            .eq(0)
                            .css({
                                'transform': 'rotate(' + oldRad[1] + 'rad)'
                            })
                            .end()
                            .eq(1)
                            .hide();

                        oldRad[0] = oldRad[1];

                    } else {

                        points
                            .eq(1)
                            .hide();

                    }

                    dash
                        .css({
                            'transform': 'rotate(' + oldRad[0] + 'rad)',
                            'stroke-dasharray': dashOffset + 'px'
                        })
                        .hide();

                    oldRad[1] = null;
                    scope.sync.hourEnd = null;
                    rangeSelected = false;
                    scope.$applyAsync();
                }

                points
                    .attr('class', 'time__point time__point_none');
            }

            pointDelete   = false;
            onClickPoint  = false;
            onClickCircle = false;
        }

        function destroy () {
            $document.off('touchmove',  documentOnTouchMove);
            element.off('touchstart', onTouchStart);
            element.off('touchmove', onTouchMove);
            element.off('touchend', onTouchEnd);
            $window.off('resize', onResize);
        }

        $document.on('touchmove', documentOnTouchMove);
        element.on('touchstart', onTouchStart);
        element.on('touchmove', onTouchMove);
        element.on('touchend', onTouchEnd);
        element.on('$destroy', destroy);
        $window.on('resize', onResize);
    }
}

}]);
