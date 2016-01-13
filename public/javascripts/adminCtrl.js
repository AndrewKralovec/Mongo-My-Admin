var app = angular.module('myApp', []);


app.controller('customersCtrl', function($scope, $http) {
	console.log("controller connected");

function refresh(){ 
$http.get('/databases').success(function(response) {
    console.log("recived data requested");
    // Re-init scope vars on refresh 
    $scope.databases = response;             
    $scope.DB_NAME = 'Select a Database' ;  
    $scope.DB_INPUT="" ; 
    $scope.COLLECTION_INPUT="" ;  
    $scope.objs=""; 
    $scope.items=""; 
    $scope.DB_COLLECTION =""; 
  });
}

function listRefresh(obj){
$http.post('/viewcollection',obj).success(function(response) {
      console.log("----- posted: -----");
      console.log("response: "+response);
      $scope.items = response ; 
      console.log("------------");
      /* 
      array.forEach(function(entry) {
          console.log(entry);
      });
      */
  });
}

// Call refresh to init cantacklist 
refresh(); 


$scope.editDB = function(collection) {
  console.log(collection);
    $http.post('/collection', JSON.stringify({'collection': collection})).success(function(response) {
      $scope.DB_NAME = collection; 
      $scope.objs = response ; 
      console.log("posted: "+response);
    });
  };

$scope.dropDB = function(collection) {
  console.log("drop : "+collection);
    $http.post('/dropDB', JSON.stringify({'collection': collection})).success(function(response) {
      console.log("DB Deleted: ");
    });
    refresh(); 
};

$scope.addDB = function(collection) {
  console.log("add : "+collection);
  $http.post('/addDB', JSON.stringify({'collection': collection})).success(function(response) {
      console.log("DB Added: ");
    });
  refresh();
};

$scope.updateDB = function(collection) {
  console.log("udpate : "+collection);
};


$scope.viewCollection = function(collection) {
  console.log("View: "+collection);
  $scope.DB_COLLECTION = collection ; 
  var objson = {'DB':$scope.DB_NAME,'collection':collection};  
   listRefresh(objson);
  };

$scope.addCollection = function(collection) {
  console.log("add Collection: "+collection);
  var objson = {'DB':$scope.DB_NAME,'collection':collection}; 
  $http.post('/addcollection', objson).success(function(response){
      console.log("----- posted: -----");
      console.log("Collection Added: ");
  }); 
  refresh(); // Make a list refresh at a later time 
};

$scope.testIndex = function(collection) {
  console.log("index number: "+collection); 
  //alert("object count: "+$scope.objs.length); // object count 
};

$scope.dropCollection = function(collection) {
  console.log("drop Collection: "+collection);
  var objson = {'DB':$scope.DB_NAME,'collection':collection}; 

  $http.post('/dropcollection', objson).success(function(response){
      console.log("----- posted: -----");
      console.log("Collection Dropped: ");
  }); 
  refresh(); // Make a list refresh at a later time 
};

$scope.insertData = function(data,collection){
    console.log(data);
    console.log(collection);
      var objson = {'DB':$scope.DB_NAME,'collection':collection,'data':data}; 
      $http.post('/insertData', objson).success(function(response){
        alert("response");
        console.log("----- posted: -----");
        console.log("Data inserted: ");
        listRefresh(objson);
  });
};

$scope.dropData = function(data,collection) {
    console.log(data);
    console.log(collection);
    var objson = {'DB':$scope.DB_NAME,'collection':collection,'data':data}; 
    $http.post('/dropData', objson).success(function(response){
        console.log("----- posted: -----");
        console.log("Data Droped: ");
        listRefresh(objson);
  });
}; 

  /*
  $scope.numberRange = function(count){
    return new Array(count);
  };
  */


});// Controller 