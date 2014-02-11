'use strict';

// NOTE: This tests the non-FB related methods in sec.js. The FB-related
//  methods will take a midway testing approach or with e2e tests --
//  didn't find a way to test them with unit tests as the FB objects
//  behave very oddly when running under testing.

describe('The security/login controller', function () {

    // load the controller's module
    beforeEach(module('quizApp'));

    var $rootScope, scope, $controller, $location, QuizResultCtrl,
        QZ,
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
    beforeEach(inject(function (_$rootScope_, _$controller_, _$location_, _QZ_) {
        $rootScope = _$rootScope_;
        $location = _$location_;
        QZ = _QZ_;
        scope = $rootScope.$new();

        $controller = _$controller_;

        $rootScope.showLoading = angular.noop;
        $rootScope.currUser = {email: 'myfoobar@gbar.com'};

        QuizResultCtrl = $controller('SecCtrl', {
            $scope: scope,
            takenQuiz: takenQuiz,
            questionsFull: questionsFull,
            quiz: quiz,      // mocking that we have 3 questions
            qzUiDataService: { getQuiz: angular.noop}

        })

    }));


    it('startQuiz() should route to the quiz', function() {
        $location.path('/');
        $rootScope.$apply();
        expect($location.path()).toBe('/');

        // test whatever the service should do...
        scope.startQuiz();
        expect($location.path()).toBe('/quiz');
    });

    it('seeQuizResults() should route to the quiz results', function() {
        $location.path('/');
        $rootScope.$apply();
        expect($location.path()).toBe('/');

        // test whatever the service should do...
        scope.seeQuizResults();
        expect($location.path()).toBe('/quizResults');
    });

    it('logout() should log the user out and route to login', function() {
        $location.path('/quiz');
        $rootScope.$apply();
        expect($location.path()).toBe('/quiz');
        expect($rootScope.currUser.email).toBe('myfoobar@gbar.com');

        // test whatever the service should do...
        scope.logout();
        expect($rootScope.currUser.email).not.toBeDefined();
        expect($location.path()).toBe('/login');
    });

});
