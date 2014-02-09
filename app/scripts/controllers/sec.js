(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

    mod.controller('SecCtrl', SecCtrl);


    SecCtrl.$inject = ['$rootScope', '$scope','$firebase', '$timeout', 'QZ', 'fbDataService', 'qzUiDataService','$firebaseSimpleLogin'];
    function SecCtrl($rootScope, $scope, $firebase, $timeout, QZ, fbDataService, qzUiDataService, $firebaseSimpleLogin) {

            var quiz;

            console.log("$firebaseSimpleLogin", $firebaseSimpleLogin );


            // TODO: When security is added, update to pass in the logged in user.
            // TODO: When the selection is added for which quiz to take, update to pass in selected quiz.
            // create an empty record for the quiz we're about to take.
            $scope.takenQuiz = qzUiDataService.createTakenQuiz( 'daden', 'FirstQuiz' );

            $scope.saveQuiz = function( takenQuiz, questionsFull ) {
                qzUiDataService.saveTakenQuiz( takenQuiz, questionsFull );

                // Repopulate the form after a little delay to avoid double submissions.
                $timeout( function() {
                    $scope.takenQuiz = qzUiDataService.createTakenQuiz( 'daden', 'FirstQuiz' );
                },100)
            }

            // ****** Temp methods
            // $scope.quiz = fbDataService.quizzes['FirstQuiz'];

            $scope.setQuizName = function() {
                fbDataService.quizzes.$save('FirstQuiz')
            }

            $scope.getQuiz = function( quiz, inDepth ) {
                $scope.result = qzUiDataService.getQuiz(quiz, inDepth);
            }
            $scope.getQuestions = function( quiz, inDepth ) {
                $scope.result = qzUiDataService.getQuestions(quiz, inDepth);
            }
            $scope.getAnswers = function(question) {
                $scope.result = qzUiDataService.getAnswers(question);
            }
            // ****** End Temp methods
            // console.log("quiz", fbDataService );


    }

}(angular, angular.module('SecModule',[])));
