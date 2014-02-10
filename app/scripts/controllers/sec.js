(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

    mod.controller('SecCtrl', SecCtrl);


    SecCtrl.$inject = ['$rootScope', '$scope', '$firebase', '$timeout', 'QZ', 'fbDataService', 'qzUiDataService', '$firebaseSimpleLogin'];
    function SecCtrl($rootScope, $scope, $firebase, $timeout, QZ, fbDataService, qzUiDataService, $firebaseSimpleLogin) {

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
        var dataRef = new Firebase(QZ.FB_ROOT);

        // TODO: Putting this in scope for convenience but would probably be more secure to put only the
        //  info needed for the UI into $scope.
        $scope.loginObj = $firebaseSimpleLogin(dataRef);


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
                $scope.loginObj.$createUser(email, password)
                    .then( function(data) {
                        console.log("createUser success", data );
                    }, function(error) {
                        console.log("createUser error", error  );
                        $scope.alerts.push( { type: 'danger', msg: error.message } );
                        $timeout(function() {
                            $scope.alerts.splice(0,1);
                        },3000)

                    })

            // login
            } else if (type === 'login') {
                $scope.loginObj.$login('password', {
                    email: email,
                    password: password
                }).then(function (user) {
                        console.log('Logged in as: ', user.uid);
                    }, function (error) {
                        console.error('Login failed: ', error);
                    });
            }

        }

        $scope.logout = function() {
            $scope.loginObj.$logout()
        }


        $scope.addAlert = function() {
            $scope.alerts.push({msg: "Another alert!"});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        console.log("$firebaseSimpleLogin", $firebaseSimpleLogin);


    }

}(angular, angular.module('SecModule', [])));
