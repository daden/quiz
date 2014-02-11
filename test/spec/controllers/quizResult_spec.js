'use strict';

describe('The quiz result controller', function () {

    // load the controller's module
    beforeEach(module('quizApp'));

    var $rootScope, scope, $controller, $location, QuizResultCtrl,
        question = {"answers":["sfa1a","sfa1b","sfa1c","sfa1d"],"body":"Which is not an advantage of using a closure?","correctAnswer":"sfa1d","hasHTML":false,"type":"radio","id":"sfq1","answersFull":[{"body":"Prevent pollution of global scope","id":"sfa1a"},{"body":"Encapsulation","id":"sfa1b"},{"body":"Private properties and methods","id":"sfa1c"},{"body":"Allow conditional use of ‘strict mode'","id":"sfa1d"}],"$$hashKey":"005"},
        answer = "sfa2b",
        currUserQuiz = {"answers":{"sfq1":"sfa1d"},"answersRight":{"sfq1":true,"sfq2":false,"sfq3":false,"sfq4":false,"sfq5":false,"sfq6":false},"createDt":"Tue Feb 11 2014 08:54:30 GMT-0500 (EST)","quiz":"RealQuiz","result":{"percent":0.16666666666666666,"rights":1,"total":6,"wrongs":5},"user":{"email":"d50@gmail.com","user":"-JFWDErr_wkpo2X9XjJG"}},
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

        QuizResultCtrl = $controller('QuizResultsCtrl', {
            $scope: scope,
            takenQuiz: takenQuiz,
            questionsFull: questionsFull,
            quiz: quiz,      // mocking that we have 3 questions
            qzUiDataService: { getQuiz: angular.noop}

        })

    }));

    // NOTE: The following two just test one path through the methods -- this would need to provide
    //  other tests to try other paths such as testing a text response.
    it("showAnswer() should return the actual answer", function() {
        expect(scope.showAnswer(question,answer)).toBe("Allow conditional use of ‘strict mode'");
    })

    it("showUserAnswer() should return the users answer", function() {
        expect(scope.showUserAnswer(question,currUserQuiz)).toBe("Allow conditional use of ‘strict mode'");
    })

});
