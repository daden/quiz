(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

    mod.controller('quizResultsCtrl', quizResultsCtrl);

    quizResultsCtrl.$inject = ['$rootScope', '$scope','$firebase', '$timeout', 'QZ', 'fbDataService', 'qzUiDataService'];
    function quizResultsCtrl($rootScope, $scope, $firebase, $timeout, QZ, fbDataService, qzUiDataService) {


        var ref = new Firebase(QZ.FB_QUIZZES_TAKEN);
        ref.startAt( $rootScope.currUser.email )
            .endAt( $rootScope.currUser.email )
            .on('value', function(snap) {
                var key = _.keys( snap.val() )[0];
                $scope.currUserQuiz = snap.val()[key];
            })

        $scope.quiz = qzUiDataService.getQuiz(QZ.CURRENT_QUIZ, true);

        $scope.showAnswer = function( question, answer ) {

            var ans = _.find(question.answersFull, function(ans) {
                        return ans.id == question.correctAnswer;
                    })
            return (ans && ans.body) || '';
        }

        $scope.showUserAnswer = function ( question, currUserQuiz ) {
            var userAnswer = currUserQuiz.answers[question.id];
            var ans = _.find(question.answersFull, function(answer) {
                return answer.id = userAnswer;
            })
            return (ans && ans.body) || '';
        }
    }

}(angular, angular.module('quizModule')));
