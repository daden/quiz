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
                    quizzesTaken: false,
                    realQuiz: false
                },
                deleteStuff = {
                    quizzesTaken: false
                }

            if( repop.realQuiz ) {
                // create the quiz
                currRef = $firebase(new Firebase(QZ.FB_QUIZZES));
                currRef["RealQuiz"] = {name:"Real Quiz",questions:['sfq1','sfq2','sfq3','sfq5','sfq6'], description:"This is the straightforward test"};
                currRef.$save("RealQuiz");

                // return;

                // create the answers
                /*currRef = $firebase(new Firebase(QZ.FB_ANSWERS));
                child = currRef.$child('q1');
                child.answers = ['a1','a2'];
                child.$save('answers');*/

var code =
'angular.module("myModule",[]).service("myService",(function() { \n' +
'    var message = "Message one!" \n' +
'    var getMessage = function() { \n' +
'        return this.message; \n' +
'    } \n' +
'    this.message = "Message two!"; \n' +
'    this.getMessage = function() { return message } \n' +
'    return function() { \n' +
'        return { \n' +
'            getMessage: getMessage, \n' +
'            message: "Message three!" \n' +
'        } \n' +
'    } \n' +
'})()) \n';

                // Questions
                var questions = [{
                        body: "Which is not an advantage of using a closure?",
                        answers: ["1a","1b","1c","1d"],
                        type: "radio",
                        correctAnswer: "1d"
                    }, {
                        body: "To create a columned list of two­line email subjects and dates for a master­detail view, which are the most semantically correct?",
                        answers: ["2a","2b","2c","2d","2e","2f"],
                        type: "radio",
                        correctAnswer: "2b"
                    }, {
                        body: "To pass an array of strings to a function, you should not use...",
                        answers: ["3a","3b","3c"],
                        type: "radio",
                        correctAnswer: "3c"
                    }, {
                        body: "____ and ____ would be the HTML tags you would use to display a menu item and its description.",
                        // answers: ["4a","4b"],
                        answers: ["4a"],
                        type: "text",
                        correctAnswer: "<dt><dd>"
                    }, {
                        body: "Given &lt;div id=”outer”&gt;&lt;div class=”inner”&gt;&lt;/div&gt;&lt;/div&gt;, which of these two is the most performant way to select the inner div?",
                        answers: ["5a","5b"],
                        type: "radio",
                        hasHTML: false,
                        correctAnswer: "5a"
                    }, {
                        body: "Given this: <pre><code>" + code + "</code></pre> Which message wioll be returned by injecting this service and executing 'myService.getMessage()'",
                        answers: ["6a","6b","6c"],
                        type: "radio",
                        hasHTML: true,
                        correctAnswer: "6c"
                    }
                ]

                currRef = $firebase(new Firebase(QZ.FB_QUESTIONS));
                for( var i=0; i < questions.length; i++ ) {
                    var currQuestion = questions[i];
                    var questionName = "sfq" + (i+1);
                    child = currRef.$child( questionName );
                    child.body = currQuestion.body;

                    // prefix the answers
                    var newAnswers = [];
                    _.forEach(currQuestion.answers, function(val) { newAnswers.push("sfa"+ val) })
                    currQuestion.answers = newAnswers;
                    child.answers = currQuestion.answers;
                    child.type = currQuestion.type;
                    child.correctAnswer = 'sfa' + currQuestion.correctAnswer;
                    child.hasHTML = currQuestion.hasHTML || false;
                    child.$save();
                }

                // ANSWERS
                // Questions
                var answers = [{
                    body: "Prevent pollution of global scope",
                    name: "1a"
                }, {
                    body: "Encapsulation",
                    name: "1b"
                }, {
                    body: "Private properties and methods",
                    name: "1c"
                }, {
                    body: "Allow conditional use of ‘strict mode'",
                    name: "1d"
                }, {
                    body: "<div>+<span>",
                    name: "2a"
                }, {
                    body: "<tr>+<td>",
                    name: "2b"
                }, {
                    body: "<ul>+<li>",
                    name: "2c"
                }, {
                    body: "<p>+<br>",
                    name: "2d"
                }, {
                    body: "none of these",
                    name: "2e"
                }, {
                    body: "all of these",
                    name: "2f"
                }, {
                    body: "fn.apply(this, stringsArray)",
                    name: "3a"
                }, {
                    body: "fn.call(this, stringsArray)",
                    name: "3b"
                }, {
                    body: "fn.bind(this, stringsArray)",
                    name: "3c"
                }, {
                    body: "",
                    name: "4a"
                },
                    /* {
                    body: "<dd>",
                    name: "4b"
                }, */
                    {
                    body: 'getElementById("outer").children[0]',
                    name: "5a"
                }, {
                    body: 'getElementsByClassName("inner")[0]',
                    name: "5b"
                }, {
                    body: "1",
                    name: "6a"
                }, {
                    body: "2",
                    name: "6b"
                }, {
                    body: "3",
                    name: "6c"
                }]

                currRef = $firebase(new Firebase(QZ.FB_ANSWERS));
                for( var i=0; i < answers.length; i++ ) {
                    var currAnswer = answers[i];
                    var answerName = "sfa" + currAnswer.name;
                    child = currRef.$child( answerName );
                    child.body = currAnswer.body;
                    child.$save();
                }


            }

            if( repop.users ) {
                currRef = $firebase(new Firebase(QZ.FB_USERS));
                currRef.$remove();
            }

            if( repop.quizzes ) {
                currRef = $firebase(new Firebase(QZ.FB_QUIZZES));
                // console.log("premature", currRef.FirstQuiz );
                currRef["FirstQuiz"] = {name:"Here is my first quiz!",questions:['q1','q2','q3'], description:"this is my first quiz!"};
                currRef.$save("FirstQuiz");
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
