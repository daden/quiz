(function (ng, mod) {
    'use strict';

    mod.controller('QuizCtrl', QuizCtrl );

    // QuizCtrl.$inject = ['$rootScope', '$scope','$firebase', '$timeout', '$location', 'QZ', 'fbDataService', 'qzUiDataService'];
    // function QuizCtrl($rootScope, $scope, $firebase, $timeout, $location, QZ, fbDataService, qzUiDataService) {

    // 'quiz' and 'takenQuiz' injected from 'resolve'
    QuizCtrl.$inject = ['$scope','$location', 'QZ', 'qzUiDataService','takenQuiz','quiz'];
    function QuizCtrl($scope, $location, QZ, qzUiDataService, takenQuiz, quiz) {

        var quiz, quizState;
        $scope.SHOW_ALL_QUESTIONS = QZ.SHOW_ALL_QUESTIONS;

        $scope.quiz = quiz;
        $scope.quizState = quizState = { currQ: 0, quizLength: quiz.questionsFull.length };

        // create an empty record for the quiz we're about to take.
        $scope.takenQuiz = takenQuiz;

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
