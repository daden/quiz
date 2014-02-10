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
        FB_QUIZZES_TAKEN: config.FB_ROOT + 'quizzestaken'
    })

    // Basic module
    ng.module('quizApp', ['ngCookies','ngResource','ngSanitize','ngRoute','firebase',
            'SecModule','quizModule','adminModule','DataServices','testingGroundModule'])

        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/login', {
                    templateUrl: 'views/sec.html',
                    controller: 'SecCtrl'
                })
                .when('/quiz', {
                    templateUrl: 'views/quiz.html',
                    controller: 'quizCtrl'
                })
                .when('/admin', {
                    templateUrl: 'views/admin.html',
                    controller: 'adminCtrl'
                })
                .when('/testingGround', {
                    templateUrl: 'views/testingGround.html',
                    controller: 'testingGroundCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        })
        .constant('QZ', config)

        .run( function($rootScope, $location, QZ, $firebaseSimpleLogin) {

            if( ! ng.isDefined($rootScope.loginObj) ) {
                var dataRef = new Firebase(QZ.FB_ROOT);
                $rootScope.loginObj = $firebaseSimpleLogin(dataRef);
            }

            // register listener to watch route changes
            $rootScope.$on( "$routeChangeStart", function(event, next, current) {
                console.log("in a routechange", $rootScope.loginObj );

                if ( ! ng.isDefined($rootScope.loginObj) || $rootScope.loginObj.user == null ) {
                    // no logged user, we should be going to #login
                    if ( next.templateUrl == "views/sec.html" ) {
                        // already going to #login, no redirect needed
                    } else {
                        // not going to #login, we should redirect now
                        $location.path( "/login" );
                    }
                }
            });
        })


}(angular));