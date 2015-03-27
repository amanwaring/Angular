angular.module('weatherNews', ['ui.router'])
.factory('postFactory', ['$http', function($http){
  var o = {
    posts: [
     // {title:'Post 1', upvotes:5, comments:[{upvotes:0,body:'hi'},{upvotes:1,body:'hello'}]},
     // {title:'Post 2', upvotes:6, comments:[]},
     // {title:'Post 3', upvotes:1, comments:[]},
     // {title:'Post 4', upvotes:4, comments:[]},
     // {title:'Post 5', upvotes:3, comments:[]}
    ]
  };
  o.getAll = function() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, o.posts);
    });
  };
  o.create = function(post) {
    return $http.post('/posts', post).success(function(data) {
      o.posts.push(data);
    });
  };
  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote')
      .success(function(data) {
	post.upvotes += 1;
      });
  };
  return o;
}])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
	url: '/home',
	templateUrl: '/home.html',
	controller: 'MainCtrl'
      })
      .state('posts', {
	url: '/posts/{id}',
	templateUrl: '/posts.html',
	controller: 'PostCtrl'
      });
    $urlRouterProvider.otherwise('home');}
])
.controller('MainCtrl', [
  '$scope',
  'postFactory',
  function($scope, postFactory) {
    postFactory.getAll();
    $scope.test = 'Hello world!';
    $scope.posts = postFactory.posts;
    $scope.addPost = function() {
      if($scope.formContent === '') {return;}
      //$scope.posts.push({
	//title:$scope.formContent,
	//upvotes:0,
	//comments: []
      //});
      postFactory.create({
        title:$scope.formContent,
        upvotes:0,
        comments: []
      });
      $scope.formContent='';
    };
    $scope.incrementUpvotes = function(post) {
      postFactory.upvote(post);
    };
  }
])
.controller('PostCtrl', [
  '$scope',
  '$stateParams',
  'postFactory',
  function($scope, $stateParams, postFactory) {
    $scope.post = postFactory.posts[$stateParams.id];
    $scope.addComment = function() {
      if ($scope.body === '') {return; }
      $scope.post.comments.push({
	body: $scope.body,
	upvotes: 0
      });
      $scope.body = '';
    };
  $scope.incrementUpvotes = function(comment) {
    comment.upvotes += 1;
  };
}]);
