(function (ng, mod) {
    'use strict';

    // mod.factory('cpCriteriaFormCtrl', cpCriteriaFormCtrl);
    // mod.directive('cpCriteriaForm', cpCriteriaForm);

    mod.controller('quizResultsCtrl', quizResultsCtrl);

    quizResultsCtrl.$inject = ['$rootScope', '$scope','$firebase', '$timeout', 'QZ', 'fbDataService', 'qzUiDataService'];
    function quizResultsCtrl($rootScope, $scope, $firebase, $timeout, QZ, fbDataService, qzUiDataService) {


        var ref = new Firebase(QZ.FB_QUIZZES_TAKEN);
        ref.startAt( $rootScope.currUser.email )
            .endAt( $rootScope.currUser.email )
            .on('value', function(snap) {
                $scope.currUserQuizzes = snap.val()
            })


    }

}(angular, angular.module('quizModule')));
