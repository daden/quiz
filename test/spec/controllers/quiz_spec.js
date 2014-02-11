'use strict';

describe('The quiz controller', function () {

    // load the controller's module
    beforeEach(module('quizApp'));

    var $rootScope, scope, $controller, $location, QuizCtrl,
        questionsFull = [{},{},{}],
        quiz = { questionsFull: questionsFull },
        takenQuiz = {
            user: {},
            quiz: quiz,
            answers: {},
            result: {
                rights: 0,
                wrongs: 0,
                total: 0,
                percent: 0
            }
        };

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$rootScope_, _$controller_, _$location_) {
        $rootScope = _$rootScope_;
        $location = _$location_;
        scope = $rootScope.$new();

        $controller = _$controller_;

        $rootScope.showLoading = angular.noop;
        $rootScope.currUser = {email: 'myfoobar@gbar.com'};

        QuizCtrl = $controller('QuizCtrl', {
            $scope: scope,
            takenQuiz: takenQuiz,
            questionsFull: questionsFull,
            quiz: quiz      // mocking that we have 3 questions

        })

    }));

    it("current question should be initialized to 0", function() {
        expect(scope.quizState.currQ).toEqual(0);
    })

    it("nextQuestion() should increment the counter", function() {
        expect(scope.quizState.currQ).toEqual(0);
        scope.nextQuestion(1);
        expect(scope.quizState.currQ).toEqual(1);
    })

    it("nextQuestion() should not increment counter passed the number of questions", function() {
        expect(scope.quizState.currQ).toEqual(0);
        scope.nextQuestion(4);
        expect(scope.quizState.currQ).toEqual(0);
    })

    it("previousQuestion() should decrement the question counter", function() {
        scope.quizState.currQ = 3;
        scope.previousQuestion(2);
        expect(scope.quizState.currQ).toEqual(2);
    })

    it('should change location when setting it via show function', function() {
        $location.path('/quiz');
        $rootScope.$apply();
        expect($location.path()).toBe('/quiz');

        // test whatever the service should do...
        scope.saveQuiz(takenQuiz,questionsFull);
        expect($location.path()).toBe('/quizResults');
    });

});
