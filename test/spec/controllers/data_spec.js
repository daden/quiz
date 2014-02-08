'use strict';

xdescribe('Service: DataServices', function () {

    // load the controller's module
    beforeEach(module('quizApp'));
    beforeEach(module('DataServices'));

    var fbDataServices,
        scope, $timeout, QZ, $firebase, $httpBackend,
        quizzes;

    // var async = new AsyncSpec(this);

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, _$timeout_, fbDataService, _QZ_, _$firebase_, $httpBackend) {
        scope = $rootScope.$new();
        fbDataServices = fbDataService;
        $timeout = _$timeout_;
        // $httpBackend.flush();

        quizzes = fbDataService.quizzes;

        /*waitsFor( function() {
            var finished = false;
            quizzes.$on("loaded", function (finished) {
                finished = true;
            }, "the loading is done", 4000 );
            return finished;
        })

        runs(function() {
            console.log("Into the runs!", quizzes.FirstQuiz );
        })*/


        QZ = _QZ_;
        $firebase = _$firebase_;
    }));

    it("did stuff", function() {
        console.log("did stuff", quizzes );
    })

    xit('should attach a list of awesomeThings to the scope', function () {
        // expect(scope.awesomeThings.length).toBe(3);
        // console.log("QZ!!", quizzes.FirstQuiz);

        // $timeout( function() {
            console.log("in the timeout", quizzes.FirstQuiz );
        // },100 );

        // $timeout.flush();
        // var currRef = $firebase( new Firebase( QZ.FB_QUIZZES) );
        fbDataServices.quizzes.$on("loaded", function(data) {
            // expect( data.length).toBe
            console.log("after the load", data );
            expect(data).toBe(3);
        })
        // console.log("fbDataServices.quizzes", fbDataServices.quizzes.FirstQuiz );
        // expect( QZ.FB_USERS ).toBe(2);
        // expect(fbDataServices.quizzes).toBe(2);
    });


    xit("scrap from before using async -- did not work", function() {

        async.beforeEach(function(done){
            /*setTimeout(function(){

             // more code here
             quizzes = fbDataServices.quizzes;

             // when the async stuff is done, call `done()`
             done();

             }, 500);*/

            var child = fbDataServices.quizzes;
            // child = currRef.$child('First');

            /*child.$on("loaded", function(data){
             console.log('loaded finally');
             done();
             })*/

            child;

            child.forceTest = new Date();
            child.$save('forceTest');

            // child.$remove('answers');

            // quizzes = child;
            setTimeout(function(){
                quizzes = child;
                done();
            }, 2000)
            // done();

            /*fbDataServices.quizzes.$on("loaded", function(data) {
             // expect( data.length).toBe
             quizzes = data;
             console.log("after the load", data );
             // expect(data).toBe(3);
             done();
             })*/

        });

        async.it('should have some data', function(done) {
            console.log("in the async it", quizzes.forceTest );
            done();
        })

    })


});
