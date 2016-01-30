var app = angular.module('myApp', []);


app.controller('customersCtrl', function ($scope, $http) {
    

    function refresh() {
        $http.get('/databases').success(function (response) {
            // Re-init scope vars on refresh 
            $scope.databases = response;
            $scope.menu = {
                database:true,
                collection:false,
                data:false
            }; 
            $scope.DB_NAME = 'Select a Database';
            $scope.DB_INPUT = "";
            $scope.COLLECTION_INPUT = "";
            $scope.objs = "";
            $scope.items = "";
            $scope.DB_COLLECTION = "";
        });
    }

    function collectionRefresh() {
        $http.post('/collection', JSON.stringify({ 'DB': $scope.DB_NAME })).success(function (response) {
            $scope.objs = response;
            $scope.DB_COLLECTION = "";
        });
    }

    function listRefresh(obj) {
        $http.post('/viewcollection', obj).success(function (response) {
            $scope.items = response;
        });
    }

    // Call refresh to init cantacklist 
    refresh();
    
    $scope.editDB = function (DB) {
        $scope.menu.collection = true ; 
        $scope.menu.database = false ; 
        $http.post('/collection', JSON.stringify({ 'DB': DB })).success(function (response) {
            $scope.DB_NAME = DB;
            $scope.objs = response;
        });
    };
    $scope.toggleMenu = function() {
        $scope.menu.database = true ; 
        refresh(); 
    }

    $scope.dropDB = function (DB) {
        $http.post('/dropDB', JSON.stringify({ 'DB': DB })).success(function (response) {
            refresh();
        });
    };

    $scope.addDB = function (DB) {
        $http.post('/addDB', JSON.stringify({ 'DB': DB })).success(function (response) {
            console.log("DB Added: ");
            refresh();
        });
    };

    $scope.updateDB = function (DB) {
        console.log("udpate : " + DB);
    };


    $scope.viewCollection = function (collection) {
        $scope.menu.collection = false ; 
        $scope.menu.data = true ; 
        $scope.DB_COLLECTION = collection;
        var objson = { 'DB': $scope.DB_NAME, 'collection': collection };
        listRefresh(objson);
    };
    $scope.minimize = function(){
      $scope.items =  ""; 
    };

    $scope.addCollection = function (collection) {
        var objson = { 'DB': $scope.DB_NAME, 'collection': collection };
        $http.post('/addcollection', objson).success(function (response) {
            collectionRefresh();
        });
    };

    $scope.testIndex = function (collection) {
        console.log("index number: " + collection); 
        //alert("object count: "+$scope.objs.length); // object count 
    };

    $scope.dropCollection = function (collection) {
        var objson = { 'DB': $scope.DB_NAME, 'collection': collection };
        $http.post('/dropcollection', objson).success(function (response) {
            collectionRefresh();
        });
    };

    $scope.insertData = function (data, collection) {
        try {
            JSON.parse(data);
            var objson = { 'DB': $scope.DB_NAME, 'collection': collection, 'data': data };
            $http.post('/insertData', objson).success(function (response) {
                listRefresh(objson);
            });
        } catch (ex) {
            alert("Not valid Json object");
        }
    };

    $scope.dropData = function (data, collection) {
        var objson = { 'DB': $scope.DB_NAME, 'collection': collection, 'data': data };
        $http.post('/dropData', objson).success(function (response) {
            listRefresh(objson);
        });
    };

});


