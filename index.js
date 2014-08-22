(function () {

  var application = angular.module('qa', []);

  var questions;
  var question_data;
  var quiz;

  function initialiseQuiz() {
    quiz = [];
    for (var i = 0; i < Object.keys(question_data).length; i++) {
      quiz.push(i);
    }
  }

  function randomQuestionNumber() {
    return Math.round(Math.random() * quiz.length) - 1;
  }

  application.controller('QaController', function ($scope, $http) {

    function createQuestion() {
      var number = randomQuestionNumber();
      var key = Object.keys(question_data)[ quiz[ number ] ];
      var value = question_data[ key ];
      $scope.actualQuestion = {
        question: questions[ 0 ].replace('#', key),
        answer: value
      };
      quiz.splice(number, 1);
    }

    $http.get('data.json').then(function (result) {
      questions = result.data.questions;
      question_data = result.data.question_data;
      $scope.state = 'init';
    });

    $scope.start = function () {
      $scope.state = 'started';
      $scope.wrongAnsweredQuestions = 0;
      $scope.correctAnsweredQuestions = 0;
      initialiseQuiz();
      createQuestion();
    };

    $scope.showAnswer = function () {
      $scope.answerVisible = true;
    };

    $scope.answerIsWrong = function () {
      $scope.wrongAnsweredQuestions++;
      if (quiz.length == 0) {
        $scope.stop();
        return;
      }
      createQuestion();
      $scope.state = 'started';
      $scope.answerVisible = false;
    };

    $scope.answerIsCorrect = function () {
      $scope.correctAnsweredQuestions++;
      if (quiz.length == 0) {
        $scope.stop();
        return;
      }
      createQuestion();
      $scope.state = 'started';
      $scope.answerVisible = false;
    };

    $scope.stop = function () {
      $scope.answerVisible = false;
      $scope.totalNumberOfQuestions = Object.keys(question_data).length;
      $scope.state = 'ended';
    };

    $scope.init = function () {
      $scope.state = 'init';
    };

  });

})();
