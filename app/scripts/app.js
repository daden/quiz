(function ( ng ) {
    'use strict';

    // if needed could move into a configurable service
    var config = {
        FB_ROOT: "https://surveyamoeba.firebaseio.com/"
    }
    config = ng.extend(config, {
        FB_QUIZZES: config.FB_ROOT + 'quizzes',
        FB_USERS: config.FB_ROOT + 'users',
        FB_QUESTIONS: config.FB_ROOT + 'questions',
        FB_ANSWERS: config.FB_ROOT + 'answers',
        FB_QUIZ_RESPONSES: config.FB_ROOT + 'quizzestaken'
    })

    // Basic module
    ng.module('quizApp', ['ngCookies','ngResource','ngSanitize','ngRoute','firebase',
            'quizModule','adminModule','DataServices'])

        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/quiz', {
                    templateUrl: 'views/quiz.html',
                    controller: 'quizCtrl'
                })
                .when('/admin', {
                    templateUrl: 'views/admin.html',
                    controller: 'adminCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        })
        .constant('QZ', config);


}(angular));