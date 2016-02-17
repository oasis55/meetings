MeetingModule.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/users', {
            templateUrl: 'templates/users.html',
            controller: 'usersCtrl'
        })
        .when('/import', {
            templateUrl: 'templates/import.html',
            controller: 'importCtrl'
        })
        .when('/dialogs', {
            templateUrl: 'templates/dialogs.html',
            controller: 'dialogsCtrl'
        })
        .when('/dialog/:id', {
            templateUrl: 'templates/dialog.html',
            controller: 'dialogCtrl'
        })
        .when('/new/contacts', {
            templateUrl: 'templates/newContacts.html',
            controller: 'newContactsCtrl'
        })
        .when('/new/time', {
            templateUrl: 'templates/newTime.html',
            controller: 'newTimeCtrl'
        })
        .when('/new/place', {
            templateUrl: 'templates/newPlace.html',
            controller: 'newPlaceCtrl'
        })
        .when('/new/name', {
            templateUrl: 'templates/newName.html',
            controller: 'newNameCtrl'
        })
        .when('/meetings', {
            templateUrl: 'templates/meetings.html',
            controller: 'meetingsCtrl'
        })
        .when('/invitations', {
            templateUrl: 'templates/invitations.html',
            controller: 'invitationsCtrl'
        })
        .when('/opportunities', {
            templateUrl: 'templates/opportunities.html',
            controller: 'opportunitiesCtrl'
        })
        .when('/transfer-meeting', {
            templateUrl: 'templates/transferMeeting.html',
            controller: 'transferMeetingCtrl'
        })
        .when('/map', {
            templateUrl: 'templates/map.html',
            controller: 'mapCtrl'
        })

}]);