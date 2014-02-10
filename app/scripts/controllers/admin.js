(function (ng, mod) {
    'use strict';

    /*********
     * NOTE: This started as an idea of making a very simple admin interface for administering the quizzes,
     *  questions, etc. but it really wasn't needed. It ended up as a convenient place for me to do some
     *  stuff on the FB database that it turned out couldn't be done through their web UI. It is only somewhat
     *  a controller as it does put some data into $scope to be displayed, but is really a spot for some
     *  utility code. All the data in here should end up in services, etc. left as-is while working on the
     *  rest of the app.
     *
     * At this point, mostly just used to update the survey with code in one shot.
     */

    mod.controller('adminCtrl', adminCtrl);

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


    adminCtrl.$inject = ['$scope','$firebase','QZ', 'fbDataService'];
    function adminCtrl($scope, $firebase, QZ, fbDataService) {

            // turn on items in repop to run them when the /admin page is requested.
            var currRef, child,
                repop = {
                    quizzes: false,
                    questions: false,
                    answers: false,
                    users: false,
                    quizzesTaken: false,
                    realQuiz: true
                },
                deleteStuff = {
                    quizzesTaken: false
                }

            if( repop.realQuiz ) {
                // create the quiz
                currRef = $firebase(new Firebase(QZ.FB_QUIZZES));
                currRef["RealQuiz"] = {name:"Real Quiz",questions:['sfq1','sfq2','sfq3', 'sfq4', 'sfq5','sfq6'], description:"This is the straightforward test"};
                // currRef["RealQuiz"] = {name:"Real Quiz",questions:['sfq4','sfq1'], description:"This is the straightforward test"};
                currRef.$save("RealQuiz");

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
                        correctAnswer: "4a"
                    }, {
                        body: "Given &lt;div id=”outer”&gt;&lt;div class=”inner”&gt;&lt;/div&gt;&lt;/div&gt;, which of these two is the most performant way to select the inner div?",
                        answers: ["5a","5b"],
                        type: "radio",
                        hasHTML: true,
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
                    val: "<dd><dt>",
                    name: "4a"
                }, {
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
                    if( currAnswer.val ) {
                        child.val = currAnswer.val;
                    }
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

            if( currRef ) {
                currRef.$on('loaded', function(data) {
                    $scope.data = data;
                    console.log("in the loaded", $scope.data );
                    $scope.idx = currRef.$getIndex();
                })
            }

    }

}(angular, angular.module('adminModule',['DataServices'])));
