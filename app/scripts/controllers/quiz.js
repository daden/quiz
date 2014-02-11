(function (ng, mod) {
    'use strict';

    mod.controller('QuizCtrl', QuizCtrl );

    QuizCtrl.$inject = ['$rootScope', '$scope','$firebase', '$timeout', '$location', 'QZ', 'fbDataService', 'qzUiDataService'];
    function QuizCtrl($rootScope, $scope, $firebase, $timeout, $location, QZ, fbDataService, qzUiDataService) {

            var quiz, quizState;
            $scope.SHOW_ALL_QUESTIONS = QZ.SHOW_ALL_QUESTIONS;

            // Sorta hinky thing to make sure FB angularFire isn't still putzing around
            var checkIt = function() {
                var ret = $timeout( function() {
                    if( ! $rootScope.loading ) {
                        $scope.quiz = qzUiDataService.getQuiz(QZ.CURRENT_QUIZ, true);
                        $scope.quizState = quizState = { currQ: 0, quizLength: $scope.quiz.questionsFull.length };
                    } else {
                        checkIt()
                    }
                },100)
                return ret;
            };
            if( ! ng.isDefined( $scope.quiz ) ) {
                checkIt();
            }

            // create an empty record for the quiz we're about to take.
            $scope.takenQuiz = qzUiDataService.createTakenQuiz( $rootScope.currUser, QZ.CURRENT_QUIZ );

            // navigationg when showing one question at a time
            $scope.nextQuestion = function( currIdx ) {
                if ( currIdx > quizState.quizLength ) {
                    // noop
                } else {
                    quizState.currQ++;
                }
            }
            $scope.previousQuestion = function( currIdx ) {
                quizState.currQ--;
            }

            $scope.saveQuiz = function( takenQuiz, questionsFull ) {
                qzUiDataService.saveTakenQuiz( takenQuiz, questionsFull );
                $location.path("/quizResults");
            }
    }

}(angular, angular.module('quizModule',['DataServices'])));
