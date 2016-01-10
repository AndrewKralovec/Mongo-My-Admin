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
  });
}

// Call refresh to init cantacklist 
refresh(); 


$scope.editDB = function(contactItem) {
  console.log(contactItem);
    $http.post('/collection', JSON.stringify({'contactItem': contactItem})).success(function(response) {
      $scope.DB_NAME = contactItem; 
      $scope.objs = response ; 
      console.log("posted: "+response);
    });
  };

$scope.dropDB = function(contactItem) {
  console.log("drop : "+contactItem);
    $http.post('/dropDB', JSON.stringify({'contactItem': contactItem})).success(function(response) {
      console.log("DB Deleted: ");
    });
    refresh(); 
};

$scope.addDB = function(contactItem) {
  console.log("add : "+contactItem);
  $http.post('/addDB', JSON.stringify({'contactItem': contactItem})).success(function(response) {
      console.log("DB Added: ");
    });
  refresh();
};

$scope.updateDB = function(contactItem) {
  console.log("udpate : "+contactItem);
};


$scope.viewCollection = function(contactItem) {
  console.log("View: "+contactItem);
  var objson = {'DB':$scope.DB_NAME,'contactItem':contactItem};  

   $http.post('/viewcollection',objson).success(function(response) {
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
  };


$scope.addCollection = function(contactItem) {
  console.log("add Collection: "+contactItem);
  var objson = {'DB':$scope.DB_NAME,'contactItem':contactItem}; 

  $http.post('/addcollection', objson).success(function(response){
      console.log("----- posted: -----");
      console.log("Collection Added: ");
  }); 
  refresh(); // Make a list refresh at a later time 
};

$scope.testIndex = function(contactItem) {
  console.log("index number: "+contactItem); 
  //alert("object count: "+$scope.objs.length); // object count 
};

$scope.dropCollection = function(contactItem) {
  console.log("drop Collection: "+contactItem);
  var objson = {'DB':$scope.DB_NAME,'contactItem':contactItem}; 

  $http.post('/dropcollection', objson).success(function(response){
      console.log("----- posted: -----");
      console.log("Collection Dropped: ");
  }); 
  refresh(); // Make a list refresh at a later time 
};

$scope.insertData = function(newData,collection){
    console.log();
      var objson = {'DB':$scope.DB_NAME,'collection':collection,'newData':newData}; 
      $http.post('/dropcollection', objson).success(function(response){
      console.log("----- posted: -----");
      console.log("Data inserted: ");
  });
}; 

  /*
  $scope.numberRange = function(count){
    return new Array(count);
  };
  */


});// Controller 