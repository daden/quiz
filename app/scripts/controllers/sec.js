(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

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

        // get a reference to FB simple authentication
        /*var dataRef = new Firebase(QZ.FB_ROOT);

        // TODO: Putting this in $rootScope for convenience as we're using simple login. Should this be updated
        // TODO:  would might want to put it into an injectable service. In either case, would use something more
        // TODO:  than FB's simple authentication.
        $rootScope.loginObj = $firebaseSimpleLogin(dataRef);*/

        $scope.sec = {};
        $scope.alerts = [];

        $scope.formType = formTypes['registration'];
        $scope.chooseForm = function (type) {
            $scope.formType = formTypes[type];
        }

        $scope.doSec = function (type, email, password) {
            console.log("in the doSec", type);
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
                        // Get the user back and set for use
                        user.on('value', function( snap ) {
                            $rootScope.currUser = snap.val();
                            $location.path( "/quiz" );
                        });

                        // using $firebase which seems to be a PITA!
                        /*fbDataService.users.$add(newUser)
                            .then(function(data) {
                                // $rootScope.currUser = data.val();
                                console.log("currUser", arguments );

                            });*/

                    // Error
                    }, function(error) {
                        // console.log("createUser error", error  );
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
                        console.log('Logged in as: ', user.uid);

                        // TODO: need to get the user and set it somewhere so we can tie the quizzes to the user.
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
        $scope.logout = function() {
            $rootScope.loginObj.$logout()
        }

        // console.log("$firebaseSimpleLogin", $firebaseSimpleLogin);

    }

}(angular, angular.module('SecModule', [])));
