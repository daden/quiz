(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

    mod.controller('quizCtrl', quizCtrl );
    mod.directive('qzAnswer', qzAnswer );
    mod.directive('qzHeader', qzHeader );


    qzHeader.$inject = ['$location'];
    function qzHeader($location) {
        return {
            template: "<!--<div class=\"col-md-6 col-md-offset-3 text-center\" ng-hide=\"loginObj.user == null\">-->\n<div class=\"col-md-8 col-md-offset-2 text-center\">\n    Welcome {{loginObj.user.email }}!!\n    &nbsp;&nbsp;\n    <a href=\"\" ng-click=\"logout(\'logout\')\">Logout</a>\n    &nbsp;&nbsp;\n    <a href=\"\" ng-click=\"login()\">Home</a>\n\n</div>",
            link: function(scope,element,attrs) {
                scope.login = function() {
                    $location.path('/login');
                }
            }
        }
    }

    qzAnswer.$inject = ['$parse','$compile'];
    function qzAnswer($parse, $compile) {
        // TODO: If these diverged a lot or get unweildy, could make them into their own directives and
        //  simplify the templates in this directory. Might also help to cut down on duplication.
        var templates = {
            radio: '<div>\n    <label>\n        <input name="{{question.id}}" type="radio" ng-value="answer.id"\n            ng-model="takenQuiz[question.id]"> {{answer.body}} ({{answer.id}})\n    </label>\n</div>',
            checkbox: '<div>\n    <label>\n        <input name="{{question.id}}" type="checkbox" \n            ng-model="takenQuiz[question.id][answer.id]"> {{answer.body}} ({{answer.id}})\n    </label>\n</div>',
            text: '<div>\n    <label>\n        <input name="{{question.id}}" type="text" \n            ng-model="takenQuiz[question.id][answer.id]"> {{answer.body}} ({{answer.id}})\n    </label>\n</div>',
            textarea: '<div>\n    <label>\n        <textarea name="{{question.id}}" cols="50" rows="3" ng-init="takenQuiz[question.id]=\'\'" \n            data-ng-model="takenQuiz[question.id]"></textarea> ({{answer.id}})\n    </label>\n</div>'
        }
        return {
            scope: {
                takenQuiz: "=qzAnswer",
                data: "=qzAnswerData"
            },
            link: function(scope,element,attrs) {

                // pull out the data
                scope.answer = scope.data.answer;
                scope.question = scope.data.question;

                if( ! (scope.question && scope.question.type) ) {
                    return;
                }
                var tmpl = $compile(templates[scope.question.type])(scope);
                element.append(tmpl);

            }
        }
    }

    quizCtrl.$inject = ['$rootScope', '$scope','$firebase', '$timeout', '$location', 'QZ', 'fbDataService', 'qzUiDataService'];
    function quizCtrl($rootScope, $scope, $firebase, $timeout, $location, QZ, fbDataService, qzUiDataService) {

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

            // navigate when we show one question at a time
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

                // Repopulate the form after a little delay to avoid double submissions.
                /*$timeout( function() {
                    $scope.takenQuiz = qzUiDataService.createTakenQuiz( 'daden', QZ.CURRENT_QUIZ );
                },100)*/

                $location.path("/quizResults");
            }

            // ****** Temp methods
            // $scope.quiz = fbDataService.quizzes['FirstQuiz'];

            $scope.setQuizName = function() {
                fbDataService.quizzes.$save(QZ.CURRENT_QUIZ)
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

}(angular, angular.module('quizModule',['DataServices'])));
