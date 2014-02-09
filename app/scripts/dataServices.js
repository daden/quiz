(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

    mod.factory('fbUsers', fbUsers);
    mod.factory('fbQuizzes', fbQuizzes);
    mod.factory('fbQuestions', fbQuestions);
    mod.factory('fbAnswers', fbAnswers);
    mod.factory('fbQuizzesTaken', fbQuizzesTaken);
    mod.factory('fbDataService', fbDataService);
    mod.factory('qzUiDataService', qzUiDataService);

/*
    .factory("sampleService", ["$firebase", function($firebase) {
        var ref = new Firebase("https://<my-firebase>.firebaseio.com/text");
        return $firebase(ref);
    }])
        .controller("SampleController", ["$scope", "sampleService",
            function($scope, service) {
                service.$bind($scope, "text");
            }
*/

    // TODO: Consider automating this to create the items based on configuration.

    fbUsers.$inject = ['$firebase','QZ'];
    function fbUsers( $firebase, QZ) {
        var ref = new Firebase(QZ.FB_USERS);
        return $firebase(ref);
    }

    fbQuizzes.$inject = ['$firebase','QZ'];
    function fbQuizzes($firebase, QZ) {
        var ref = new Firebase(QZ.FB_QUIZZES);
        return $firebase(ref);
    }

    fbQuestions.$inject = ['$firebase','QZ'];
    function fbQuestions($firebase, QZ) {
        var ref = new Firebase(QZ.FB_QUESTIONS);
        return $firebase(ref);
    }

    fbAnswers.$inject = ['$firebase','QZ'];
    function fbAnswers($firebase, QZ) {
        var ref = new Firebase(QZ.FB_ANSWERS);
        return $firebase(ref);
    }

    fbQuizzesTaken.$inject = ['$firebase','QZ'];
    function fbQuizzesTaken($firebase, QZ) {
        var ref = new Firebase(QZ.FB_QUIZZES_TAKEN);
        return $firebase(ref);
    }

    // TODO: This might be unnecessary since the UI should only be using the qzUiDataService
    // TODO: OR might have this generate the individual keys programmatically instead of having the
    //  Bring together all the FB references into one spot.
    fbDataService.$inject = ['$rootScope','fbUsers', 'fbQuizzes', 'fbQuestions', 'fbAnswers', 'fbQuizzesTaken'];
    function fbDataService($rootScope, fbUsers, fbQuizzes, fbQuestions, fbAnswers, fbQuizzesTaken ) {

        /*var scope = $rootScope,
            users, quizzes, questions;*/

        // public props
        return {
            users: fbUsers,
            quizzes: fbQuizzes,
            questions: fbQuestions,
            answers: fbAnswers,
            quizzesTaken: fbQuizzesTaken
        }

    }

    qzUiDataService.$inject = ['fbDataService'];
    function qzUiDataService(fbDataService) {

        // Get a questions' answers
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

        // Get a quiz's questions
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

        // get a Quiz's data
        function getQuiz( quiz, inDepth ) {
            var qz = fbDataService.quizzes[ quiz ];
            return angular.extend(qz, {id: quiz, questionsFull: getQuestions(quiz, inDepth) });
        }

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

            console.log("in saveTakenQuiz", takenQuiz );


            // Add the data to FB
            // var id = fbDataService.quizzesTaken.$add(takenQuiz);
            // console.log("newtakenid", id );
        }

        // Compare the answers given to the correct answers taking into account the type of question (text or
        //  multiple choice. If the didn't answer a question, it will be counted as wrong
        // For now we'll assume the display type will tell us whether it is single or multiple choice, probably
        //  should specify that separately if this was going to be used.
        function gradeQuiz( takenQuiz, questionsFull ) {
            // ng.forEach(questionsFull, function(question) {
            for( var k=0; k < questionsFull.length; k++ ) {
                var question = questionsFull[k];

                if( ! ng.isDefined(takenQuiz.answers[question.id]) ) {
                    grade(takenQuiz, false);
                    continue;
                }

                var type = question.type;
                switch( type ) {

                    case 'radio':
                        if( takenQuiz.answers[question.id] !== question.correctAnswer ) {
                            grade(takenQuiz, false);
                        } else {
                            grade(takenQuiz, true);
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
                            grade(takenQuiz,true);
                        } else {
                            grade(takenQuiz,false);
                        }
                        break;

                    case 'text':
                    case 'textarea':
                        // TODO

                        break;
                }
            }

            function grade( takenQuiz, correct ) {
                takenQuiz.result.total++
                if( correct ) {
                    takenQuiz.result.rights++;
                } else {
                    takenQuiz.result.wrongs++;
                }
            }
            // return takenQuiz;

        }

        return {
            getQuiz: getQuiz,
            getQuestions: getQuestions,
            getAnswers: getAnswers,
            createTakenQuiz: createTakenQuiz,
            saveTakenQuiz: saveTakenQuiz
        }


    }


    /*fbDataService.$inject = ['$rootScope','fbUsers', 'fbQuizzes'];
    function fbDataService($rootScope, fbUsers,fbQuizzes) {

        var scope = $rootScope,
            users, quizzes;

        fbUsers.$bind(scope, 'users');
        fbQuizzes.$bind(scope, 'quizzes')
            .then(function(data) {
                console.log("resolved promise", arguments );
                quizzes = data;
            });

        // public props
        return {
            users: scope,
            quizzes: quizzes

        }

    }*/

    /*function qzUsers() {
        .controller("SampleController", ["$scope", "sampleService",
            function($scope, service) {
                service.$bind($scope, "text");
            }
    }*/

}(angular, angular.module('DataServices',[])));
