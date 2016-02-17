MeetingModule.config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('en', {
        IMPORT_CONTACTS: 'Import contacts',
        INVITE: 'Invite',
    });
    $translateProvider.translations('ru', {
        IMPORT_CONTACTS: 'Импорт контактов',
        INVITE: 'Пригласить',
        SHORT_DAY_0: 'ВС',
        SHORT_DAY_1: 'ПН',
        SHORT_DAY_2: 'ВТ',
        SHORT_DAY_3: 'СР',
        SHORT_DAY_4: 'ЧТ',
        SHORT_DAY_5: 'ПТ',
        SHORT_DAY_6: 'СБ',
        MONTH_0: 'Январь',
        MONTH_1: 'Февраль',
        MONTH_2: 'Март',
        MONTH_3: 'Апрель',
        MONTH_4: 'Май',
        MONTH_5: 'Июнь',
        MONTH_6: 'Июль',
        MONTH_7: 'Август',
        MONTH_8: 'Сентябрь',
        MONTH_9: 'Октябрь',
        MONTH_10: 'Ноябрь',
        MONTH_11: 'Декабрь'
    });

    var supportLanguages = ['en', 'ru'],
        supported = false,
        language = window.navigator.language.slice(0,2);

    supported = supportLanguages.some(function (element) {
        return element === language;
    });

    if (!supported) language = supportLanguages[0];

    $translateProvider.preferredLanguage(language);
    $translateProvider.useSanitizeValueStrategy('escape');

}]);