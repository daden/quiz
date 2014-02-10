(function (ng, mod) {
    'use strict';

    mod.factory('fbDataService', fbDataService);
    mod.factory('qzUiDataService', qzUiDataService);

    //  Bring together all the FB references into one spot.
    fbDataService.$inject = ['$rootScope', '$q', '$timeout', '$firebase', 'QZ'];
    function fbDataService($rootScope, $q, $timeout, $firebase, QZ ) {

        var users = {}, quizzes = {}, questions = {}, answers = {}, quizzesTaken = {};

        $rootScope.loading = true;
        $rootScope.showLoading();

        // Wrap a $firebase reference in a promise
        function mkFbRef( type ) {
            var deferred = $q.defer();
            var ref = $firebase( new Firebase(QZ[type]) );
            ref.$on("loaded", function() {
                deferred.resolve(ref);
            })
            return deferred.promise;
        }

        // Wait until they've all finished
        $q.all( [mkFbRef('FB_USERS'), mkFbRef('FB_QUIZZES'), mkFbRef('FB_QUESTIONS'), mkFbRef('FB_ANSWERS'), mkFbRef('FB_QUIZZES_TAKEN')] )
            .then( function( values ) {

                ng.extend( users, values[0] );
                ng.extend( quizzes, values[1] );
                ng.extend( questions, values[2] );
                ng.extend( answers, values[3] );
                ng.extend( quizzesTaken, values[4] );

                // turn off the loading image
                $rootScope.loading = false;
                $rootScope.hideLoading();
            })

        // public props
        return {
            users: users,
            quizzes: quizzes,
            questions: questions,
            answers: answers,
            quizzesTaken: quizzesTaken
        }

    }

    qzUiDataService.$inject = ['fbDataService','$rootScope','QZ'];
    function qzUiDataService(fbDataService,$rootScope,QZ) {


        // Quiz's data
        function getQuiz( quiz, inDepth ) {
            // console.log("fbDataService", fbDataService );

            var qz = fbDataService.quizzes[ quiz ];
            var questionsFull = getQuestions(quiz, inDepth);
            return angular.extend(qz, {id: quiz, questionsFull: questionsFull });
        }

        // Questions
        function getQuestions( quiz, inDepth ) {
            var ret = [];
            var questions = fbDataService.quizzes[ quiz ] && fbDataService.quizzes[ quiz ].questions;

            // Get the questions objects and optionally nested answer objects
            angular.forEach( questions, function(question) {
                if( inDepth ) {
                    var answersFull = getAnswers(question);
                    ret.push( angular.extend(fbDataService.questions[question],{id:question, answersFull:answersFull}) );
                } else {
                    ret.push( fbDataService.questions[question] );
                }
            })
            return ret;
        }

        // Answers
        function getAnswers( question ) {
            var ret = [];
            var ans = fbDataService.questions[ question ] && fbDataService.questions[ question ].answers;
            if( ans ) {
                angular.forEach( ans, function(val) {
                    ret.push( angular.extend(fbDataService.answers[val],{id:val}));
                })
            }
            return ret;
        }

        // Empty object for handling quiz answers
        function createTakenQuiz( user, quiz ) {
            return {
                user: user,
                quiz: quiz,
                answers: {},
                result: {
                    rights: 0,
                    wrongs: 0,
                    total: 0,
                    percent: 0
                }
            }
        }

        function saveTakenQuiz( takenQuiz, questionsFull ) {
            // Let's grade it now
            gradeQuiz(takenQuiz, questionsFull );

            if( takenQuiz.result.total && takenQuiz.result.total > 0 ) {
                takenQuiz.result.percent = takenQuiz.result.rights/takenQuiz.result.total;
            }

            takenQuiz.createDt = (new Date()).toString();
            console.log("takenQuiz", takenQuiz );
            // Originally did this with $firebase but it is a total PITA on some things
            // Add the quiz results to FB
            // var id = fbDataService.quizzesTaken.$add(takenQuiz);

            var ref = new Firebase(QZ.FB_QUIZZES_TAKEN);
            var qt = ref.push(takenQuiz);
            qt.setPriority( $rootScope.currUser.email );
            qt.on('value', function( snap ) {
                $rootScope.lastQuiz = snap.val();
                console.log("snap", snap.val() );
                // $rootScope.currUser = { email: snap.val(), key: snap.name() };
                // $location.path( "/quiz" );
            });
            
        }

        // Compare the answers given to the correct answers taking into account the type of question (text or
        //  multiple choice. If the didn't answer a question, it will be counted as wrong
        // For now we'll assume the display type will tell us whether it is single or multiple choice, probably
        //  should specify that separately if this was going to be used.
        function gradeQuiz( takenQuiz, questionsFull ) {
            for( var k=0; k < questionsFull.length; k++ ) {
                var question = questionsFull[k];

                if( ! ng.isDefined(takenQuiz.answers[question.id]) ) {
                    grade(takenQuiz, false, question.id);
                    continue;
                }

                var type = question.type;
                switch( type ) {
                    case 'radio':
                        if( takenQuiz.answers[question.id] !== question.correctAnswer ) {
                            grade(takenQuiz, false, question.id);
                        } else {
                            grade(takenQuiz, true, question.id);
                        }
                        break;
                    case 'checkbox':
                        var correct = true;
                        question.correctAnswer = ng.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];

                        // remove all items set to false
                        for( var p in takenQuiz.answers[question.id] ) {
                            if( ! takenQuiz.answers[question.id][p] ) {
                                delete( takenQuiz.answers[question.id][p] );
                            }
                        }

                        // difference the arrays both ways -- there shouldn't be any differences
                        var keys = _.keys( takenQuiz.answers[question.id] );
                        if(_.difference(question.correctAnswer, keys ).length == 0
                            && _.difference(keys, question.correctAnswer).length == 0) {
                            grade(takenQuiz,true, question.id);
                        } else {
                            grade(takenQuiz,false, question.id);
                        }
                        break;

                    case 'text':
                    case 'textarea':
                        // For now, just check if the text response contains the string that is the correct answer.
                        //  Would need to be a much more involved check.
                        if( ! ~takenQuiz.answers[question.id].search(question.correctAnswer) ) {
                            grade(takenQuiz,false, question.id);
                        } else {
                            grade(takenQuiz,true, question.id);
                        }
                        break;
                }
            }

            function grade( takenQuiz, correct, questionId ) {
                takenQuiz.answersRight = takenQuiz.answersRight || {};
                takenQuiz.result.total++
                if( correct ) {
                    takenQuiz.result.rights++;
                    takenQuiz.answersRight[questionId] = true;
                } else {
                    takenQuiz.result.wrongs++;
                    takenQuiz.answersRight[questionId] = false;
                }
            }
        }

        return {
            getQuiz: getQuiz,
            getQuestions: getQuestions,
            getAnswers: getAnswers,
            createTakenQuiz: createTakenQuiz,
            saveTakenQuiz: saveTakenQuiz
        }
    }

}(angular, angular.module('DataServices',[])));
