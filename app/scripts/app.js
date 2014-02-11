(function ( ng ) {
    'use strict';

    // Could move into a configurable service
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
        CURRENT_QUIZ: 'RealQuiz',     // which quiz to show -- only other one is "FirstQuiz"
        SHOW_ALL_QUESTIONS: false     // option to show all questions at once (should work in UI but not always tested)
    })

    // App module
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
                    controller: 'QuizCtrl',
                    resolve: {
                        takenQuiz: ['$rootScope','$q','QZ','qzUiDataService', function($rootScope,$q,QZ,qzUiDataService) {
                            var deferred = $q.defer();
                            deferred.resolve( qzUiDataService.createTakenQuiz( $rootScope.currUser, QZ.CURRENT_QUIZ ) );
                            return deferred.promise;
                        }],
                        quiz: ['$rootScope','$q', '$timeout','QZ','qzUiDataService', function($rootScope,$q,$timeout,QZ,qzUiDataService) {
                            var deferred = $q.defer();
                            // Sorta hinky thing to make sure FB angularFire isn't still putzing around.
                            var checkIt = function() {
                                var ret = $timeout( function() {
                                    if( ! $rootScope.loading ) {
                                        deferred.resolve( qzUiDataService.getQuiz(QZ.CURRENT_QUIZ, true) );
                                    } else {
                                        checkIt()
                                    }
                                },100)
                                return ret;
                            };
                            checkIt();
                            return deferred.promise;
                        }]
                    }
                })
                .when('/quizResults', {
                    templateUrl: 'views/quizResults.html',
                    controller: 'QuizResultsCtrl'
                    // resolve: {
                        // NOTE: Move this into the resolve as it's better form but an
                        //  intermittent error on $$hashKey not being available showed
                        //  up after putting it here. Might be an FB thing. If the issues
                        //  with FB resolve, then uncomment this and remove the call
                        //  in the controller.
                        /*quiz: ['$q','$timeout','QZ','qzUiDataService', function($q,$timeout,QZ, qzUiDataService) {
                            var deferred = $q.defer();

                            var quiz = qzUiDataService.getQuiz(QZ.CURRENT_QUIZ, true);
                            // giving FB a little time as it seemed to get a little
                            //  knicker twisting going on
                            $timeout( function() {
                                deferred.resolve(quiz);
                            },100);

                            return deferred.promise;
                        }],*/
                        // NOTE: Likewise put this here but due to it needing $rootScope.currUser to be populated
                        //  and could only get FB to do in the watch below in the run section, this fails under
                        //  when refreshing the app from the results page. If the FB issues are sorted out or replaced,
                        //  get the current user's quiz here rather than in the controller.

                        /*currUserQuiz: ['$rootScope', '$q', 'QZ', function( $rootScope, $q, QZ ) {
                            var deferred = $q.defer();

                            var ref = new Firebase(QZ.FB_QUIZZES_TAKEN);
                            ref.startAt( $rootScope.currUser.email )
                                .endAt( $rootScope.currUser.email )
                                .on('value', function(snap) {
                                    var key = _.keys( snap.val() )[0];
                                    deferred.resolve( snap.val()[key] );
                                    // $scope.currUserQuiz = snap.val()[key];
                                })

                            return deferred.promise;
                        }]*/
                        // }
                })
                // just used for down-and-dirty populating of the FB DB
                .when('/admin', {
                    templateUrl: 'views/admin.html',
                    controller: 'AdminCtrl'
                })
                // started to play with how we might test FB services more meaningfully
                .when('/TestingGround', {
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