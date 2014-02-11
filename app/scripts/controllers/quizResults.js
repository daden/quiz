(function (ng, mod) {
    'use strict';

    mod.controller('QuizResultsCtrl', QuizResultsCtrl);

    QuizResultsCtrl.$inject = ['$scope', 'QZ', 'qzUiDataService', 'currUserQuiz'];
    function QuizResultsCtrl($scope, QZ, qzUiDataService, currUserQuiz) {

        $scope.currUserQuiz = currUserQuiz;
        $scope.quiz = qzUiDataService.getQuiz(QZ.CURRENT_QUIZ, true);

        $scope.showAnswer = function( question, answer ) {

            // show the 'val' in the answer associated with the question
            if( ~['text'].indexOf(question.type) ) {
                return question.answersFull[0].val || 'No Answer';
            }

            var ans = _.find(question.answersFull, function(ans) {
                        return ans.id == question.correctAnswer;
                    })
            return (ans && ans.body) || '';
        }

        $scope.showUserAnswer = function ( question, currUserQuiz ) {

            // should only be one answer for a text type
            if( ~['text'].indexOf( question.type ) ) {
                var key = _.keys( currUserQuiz.answers[question.id] )[0];
                return currUserQuiz.answers[question.id][key];
            }

            var userAnswer = currUserQuiz.answers && currUserQuiz.answers[question.id] ? currUserQuiz.answers[question.id] : -1;
            var ans = _.find(question.answersFull, function(answer) {
                return answer.id = userAnswer;
            })
            return (ans && ans.body) || '';
        }
    }

}(angular, angular.module('quizModule')));
