(function ( ng ) {
    'use strict';

    // if needed could move into a configurable service
    var config = {
        FB_ROOT: "https://surveyamoeba.firebaseio.com/"
    }
    // constants
    config = ng.extend(config, {
        FB_QUIZZES: config.FB_ROOT + 'quizzes',
        FB_USERS: config.FB_ROOT + 'users',
        FB_QUESTIONS: config.FB_ROOT + 'questions',
        FB_ANSWERS: config.FB_ROOT + 'answers',
        FB_QUIZZES_TAKEN: config.FB_ROOT + 'quizzestaken',
        CURRENT_QUIZ: 'RealQuiz',
        SHOW_ALL_QUESTIONS: false           // option to show all questions at once (may not be fully handled in the UI)
    })

    // Basic module
    ng.module('quizApp', ['ngCookies','ngResource','ngSanitize','ngRoute','firebase',
            'SecModule','quizModule','adminModule','DataServices','testingGroundModule'])

        .config(function ($routeProvider) {
            $routeProvider
                .when('/login', {
                    templateUrl: 'views/sec.html',
                    controller: 'SecCtrl'
                })
                .when('/quiz', {
                    templateUrl: 'views/quiz.html',
                    controller: 'quizCtrl'
                })
                .when('/quizResults', {
                    templateUrl: 'views/quizResults.html',
                    controller: 'quizResultsCtrl'
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
                    redirectTo: '/login'
                });
        })
        .constant('QZ', config)

        .run( function($rootScope, $location, $timeout, QZ, $firebaseSimpleLogin) {

            $rootScope.$watch('loginObj.user', function( newVal, oldVal ) {
                if( angular.isObject(newVal) && ! $rootScope.currUser ) {
                    var ref = new Firebase(QZ.FB_USERS);
                    ref.startAt($rootScope.loginObj.user.email)
                        .endAt($rootScope.loginObj.user.email)
                        .on('value', function(snap) {
                            var user = _.keys(snap.val())[0],
                                email = snap.val()[user].email;

                            $rootScope.currUser = { user: user, email:email } ;
                        })
                }

            })

            if( ! ng.isDefined($rootScope.loginObj) ) {
                var dataRef = new Firebase(QZ.FB_ROOT);
                $rootScope.loginObj = $firebaseSimpleLogin(dataRef);
            }

            // register listener to watch route changes
            $rootScope.$on( "$routeChangeStart", function(event, next, current) {
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