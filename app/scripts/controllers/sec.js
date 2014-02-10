(function (ng, mod) {
    'use strict';

    mod.controller('SecCtrl', SecCtrl);

    SecCtrl.$inject = ['$rootScope', '$scope', '$location', '$firebase', '$timeout', 'QZ', 'fbDataService', 'qzUiDataService', '$firebaseSimpleLogin'];
    function SecCtrl($rootScope, $scope, $location, $firebase, $timeout, QZ, fbDataService, qzUiDataService, $firebaseSimpleLogin) {

        var formTypes = {
            registration: {
                title: "Please Register",
                button: "Register",
                type: "register"
            },
            login: {
                title: "Please login",
                button: "Login",
                type: "login"
            }
        }

        $scope.sec = {};
        $scope.alerts = [];

        $scope.formType = formTypes['registration'];
        $scope.chooseForm = function (type) {
            $scope.formType = formTypes[type];
        }

        $scope.doSec = function (type, email, password) {
            // register
            if (type === 'register') {
                $rootScope.loginObj.$createUser(email, password)
                    .then( function(data) {

                        var ref = new Firebase(QZ.FB_USERS);
                        var newUser = {
                            email: data.email,
                            quizzes: []
                        }
                        // push the new user to FB and set priority
                        var user = ref.push(newUser);
                        user.setPriority( data.email );
                        user.on('value', function( snap ) {
                            $rootScope.currUser = { email: snap.val().email, key: snap.name() };
                            $location.path( "/quiz" );
                        });

                    // Error
                    }, function(error) {
                        $scope.alerts.push( { type: 'danger', msg: error.message } );
                        $timeout(function() {
                            $scope.alerts.splice(0,1);
                        },3000)

                    })

            // login
            } else if (type === 'login') {
                $rootScope.loginObj.$login('password', {
                    email: email,
                    password: password
                }).then(
                    // succeeded
                    function (user) {
                        // need to get the user and set it into the $rootScope
                        var ref = new Firebase(QZ.FB_USERS);
                        ref.startAt(user.email)
                            .endAt(user.email)
                            .on('value', function(snap) {
                                var user = _.keys(snap.val())[0],
                                    email = snap.val()[user].email;

                                $rootScope.currUser = { user: user, email:email } ;
                            })

                        $location.path( "/quiz" );
                    },
                    // error
                    function (error) {
                        $scope.alerts.push( { type: 'danger', msg: error.message } );
                        $timeout(function() {
                            $scope.alerts.splice(0,1);
                        },3000)
                    });
            }

        }

        $scope.startQuiz = function() {
            $location.path("/quiz");
        }
        $scope.seeQuizResults = function() {
            $location.path("/quizResults");
        }

        $rootScope.logout = function() {
            $rootScope.currUser = {};
            $rootScope.loginObj.$logout()
            $location.path('/login');
        }
    }

}(angular, angular.module('SecModule', [])));
