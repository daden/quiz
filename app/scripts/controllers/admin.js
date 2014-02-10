(function (ng, mod) {
    'use strict';

    mod.controller('adminCtrl', adminCtrl);

    adminCtrl.$inject = ['$scope','$firebase','QZ', 'fbDataService'];
    function adminCtrl($scope, $firebase, QZ, fbDataService) {

            var currRef, child,
                repop = {
                    quizzes: false,
                    questions: false,
                    answers: false,
                    users: false,
                    quizzesTaken: false
                },
                deleteStuff = {
                    quizzesTaken: false
                }

            if( repop.users ) {
                currRef = $firebase(new Firebase(QZ.FB_USERS));
                currRef.$remove();
                /*child = currRef.$child('daden');
                child.email = 'dadeng@gmail.com';
                child.username = 'daden';
                child.name = 'David Aden';
                child.quizzes = ['-JFNh84Dx5bYngGUxk96'];

                child.priority = "dadeng@gmail.com";
                child.$save();*/
            }

            if( repop.quizzes ) {
                currRef = $firebase(new Firebase(QZ.FB_QUIZZES));
                // console.log("premature", currRef.FirstQuiz );
                // currRef["FirstQuiz"] = {name:"Here is my first quiz!",questions:['q1','q2','q3'], description:"this is my first quiz!"};
                // currRef.$save("FirstQuiz");
            }
            if( repop.questions ) {

                currRef = $firebase(new Firebase(QZ.FB_QUESTIONS));
                child = currRef.$child('q1');
                child.answers = ['a1','a2'];
                child.$save('answers');

                child = currRef.$child('q2');
                child.answers = ['a3','a4'];
                child.$save('answers');

                child = currRef.$child('q3');
                child.answers = ['a5'];
                child.$save('answers');
                // currRef.$child('q1').$save('answers');
            }

            if( repop.quizzestaken ) {
                currRef = $firebase( new Firebase(QZ.FB_ROOT));
                // TODO: Add code to populate
            }

            // DELETING THING
            if( deleteStuff.quizzesTaken )  {
                currRef = $firebase(new Firebase(QZ.FB_QUIZZES_TAKEN) );
                child = currRef.$remove();
            }


            /*var child = quizRef.$child("FirstQuiz");
            child['foo'] = 'bear';
            child.$save('foo');*/

            // console.log("getindex", quizRef );
            // dump(quizRef);

            // quizRef.$remove("SecondQuiz")

            if( currRef ) {
                currRef.$on('loaded', function(data) {
                    $scope.data = data;
                    console.log("in the loaded", $scope.data );
                    $scope.idx = currRef.$getIndex();
                })
            }



            // console.log("currQuiz", $scope.quizzes );


    }

}(angular, angular.module('adminModule',['DataServices'])));
