(function (ng, mod) {
    'use strict';

    mod.controller('testingGroundCtrl', testingGroundCtrl);

    /* Because Karma/Jasmine is such a PITA about handling async requests making it sort of pointless
     *   to use as a real testing tool for developing FB-related code, the following is a down-and-dirty
     *   way to set up tests for the FB-related methods. Sort of inbetween unit and e2e testing.
     *  I'll set up methods to test each of the FB related methods, both the low-level services and the
     *  UI Data Services that are going to aggregate data together for easier use in the UI.
     *  Ideally, as I'm working on them on page reloads, I'll see errors as they show up. Will also
     *   put the data into $scope so I can visualize it in the 'testingGroup' partial. */
    /* Actually, this should be generalized so a service can be configured with info on the tests to run and
    *   the comparisons to do -- could be made to look like Jasmine, but for now, just want to use it to move
    *   development forward. */
    testingGroundCtrl.$inject = ['$scope', '$firebase', 'QZ', 'fbDataService'];
    function testingGroundCtrl($scope, $firebase, QZ, fbDataService) {

        var tests = {

            fbQuizzes: {
                service: 'quizzes',
                data: {
                    length: 2,
                    propExists: "FirstQuiz"
                }
            },
            fbQuestions: {
                service: 'questions',
                data: {
                    length: 3,
                    propExists: "q1"
                }
            },
            fbAnswers: {
                service: 'answers',
                data: {
                    length: 5,
                    propExists: "q1"
                }
            }


        }

        // invoke the tests
        testServices(tests)

        function testServices( tests ) {
            for( var test in tests ) {
                runTest( tests[test], test );
            }

            function runTest (currTest, name ) {
                var currService = fbDataService[ currTest.service];

                currService.$on("loaded", function(data) {
                    if( currTest.data ) {
                        for( var dt in currTest.data ) {
                            var currD = currTest.data[dt]
                            // console.log("currD", currD, data );
                            switch( dt ) {
                                case 'length':
                                    if( currService.$getIndex().length !== currD ) {
                                        console.log("ERROR in length for " + name +  ": Expecting " +  currD + " but got " + currService.$getIndex().length);
                                    } else {
                                        console.log("PASSED in length for " + name );
                                    }
                                    break;
                            }
                        }
                    }
                })
            }

        }


    }

}(angular, angular.module('testingGroundModule', ['DataServices'])));
