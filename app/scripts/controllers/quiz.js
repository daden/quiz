(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

    mod.controller('QuizCtrl', quizCtrl);

    quizCtrl.$inject = ['$scope','$firebase','QZ', 'fbDataService'];
    function quizCtrl($scope, $firebase, QZ, fbDataService) {

            // var quizRef = new Firebase("https://surveyamoeba.firebaseio.com/quizzes");
            var quizRef = new Firebase(QZ.FB_QUIZZES);
            // Automatically syncs everywhere in realtime
            // $scope.quiz = $firebase(quizRef);

            $scope.quiz = fbDataService.quizzes;

            $scope.setQuizName = function() {
                fbDataService.quizzes.$save('FirstQuiz')
            }

            console.log("quiz", fbDataService );


    }

}(angular, angular.module('quizModule',['DataServices'])));
