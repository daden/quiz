(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

    mod.factory('fbUsers', fbUsers);
    mod.factory('fbQuizzes', fbQuizzes);
    mod.factory('fbQuestions', fbQuestions);
    mod.factory('fbDataService', fbDataService);
    mod.factory('qzUiDataService', qzUiDataService);

/*
    .factory("sampleService", ["$firebase", function($firebase) {
        var ref = new Firebase("https://<my-firebase>.firebaseio.com/text");
        return $firebase(ref);
    }])
        .controller("SampleController", ["$scope", "sampleService",
            function($scope, service) {
                service.$bind($scope, "text");
            }
*/

    // TODO: Consider automating this to create the items based on configuration.
    fbUsers.$inject = ['$firebase','QZ'];
    function fbUsers( $firebase, QZ) {
        var ref = new Firebase(QZ.FB_USERS);
        return $firebase(ref);
    }

    fbQuizzes.$inject = ['$firebase','QZ'];
    function fbQuizzes($firebase, QZ) {
        var ref = new Firebase(QZ.FB_QUIZZES);
        return $firebase(ref);
    }

    fbQuestions.$inject = ['$firebase','QZ'];
    function fbQuestions($firebase, QZ) {
        var ref = new Firebase(QZ.FB_QUESTIONS);
        return $firebase(ref);
    }

    // TODO: This might be unnecessary since the UI should only be using the qzUiDataService
    // TODO: OR might have this generate the individual keys programmatically instead of having the
    //  individual items above.
    fbDataService.$inject = ['$rootScope','fbUsers', 'fbQuizzes'];
    function fbDataService($rootScope, fbUsers,fbQuizzes) {

        var scope = $rootScope,
            users, quizzes, questions;

        // public props
        return {
            users: fbUsers,
            quizzes: fbQuizzes,
            questions: fbQuestions
        }

    }

    // TODO: Look at the data architecture doc and then set this up appropriately to composite the data

    qzUiDataService.$inject = ['fbDataService'];
    function qzUiDataService(fbDataService) {

        return {

            getQuestions: function( quiz ) {

                // get the questions for a quiz


                // get the answers for each question

                // an object with the questions
                return {

                }

            }


        }


    }


    /*fbDataService.$inject = ['$rootScope','fbUsers', 'fbQuizzes'];
    function fbDataService($rootScope, fbUsers,fbQuizzes) {

        var scope = $rootScope,
            users, quizzes;

        fbUsers.$bind(scope, 'users');
        fbQuizzes.$bind(scope, 'quizzes')
            .then(function(data) {
                console.log("resolved promise", arguments );
                quizzes = data;
            });

        // public props
        return {
            users: scope,
            quizzes: quizzes

        }

    }*/

    /*function qzUsers() {
        .controller("SampleController", ["$scope", "sampleService",
            function($scope, service) {
                service.$bind($scope, "text");
            }
    }*/

}(angular, angular.module('DataServices',[])));
