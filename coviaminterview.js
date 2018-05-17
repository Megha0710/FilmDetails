var app=angular.module("myApp",[]);
app.controller('myCtrl',function($scope,$http,$q)
{
// Below to fetch and maintain complete filmDetails
var allDetails;
var promises = [];
var filmList =[];

$scope.filmDetails = [];
$scope.showLoader = true;
$scope.filmDetailsFlag=false;
$scope.onLoad=function()
{
  $http({
    method : "GET",
    url : "https://swapi.co/api/people/"
  }).then(function mySuccess(response) {


	// fetching all the details at load time...
	allDetails = response.data;
  $scope.det=allDetails;
	filmList = allDetails.results;
	for(var i=0;i< filmList.length;i++){
		var films = filmList[i].films;
		for(var j=0;j<films.length;j++){
			getFilmDetails(i,j, films[j]);
		}
	}

	checkForCompleteResponse();

  }, function myError(response) {
    $scope.myWelcome = response.statusText;
  });
}


//making a request to fetch filmDetails as per the id...
function getFilmDetails(index,childIndex, url){
  var promiseCall = $http({
    method : "GET",
    url : url
  }).then(function mySuccess(response) {
	 var relatedFilmDetails = response.data;
	 filmList[index]['films'].splice(childIndex, 1,relatedFilmDetails);

	 return response;
  }).catch(function myError(error){
	 return error;
  });

  promises.push(promiseCall);

}

//Handling after all promises are resolved...
function checkForCompleteResponse(){
	$q.all(promises).then( function(){
		$scope.filmDetails = filmList;
		$scope.showLoader = false;
    $scope.filmDetailsFlag=true;
	}).catch(function(){});
}

$scope.nextPage=function(nextPageURL)
{
  $scope.filmDetailsFlag=false;
  if(nextPageURL!==null)
  {
    $scope.prePage=false;
    	$scope.showLoader = true;
      $scope.filmDetails="";
     $http({
      method : "GET",
      url : nextPageURL
    }).then(function mySuccess(response) {
    allDetails=response.data;
    $scope.det=allDetails;
    filmList = allDetails.results;
    for(var i=0;i< filmList.length;i++){
  		var films = filmList[i].films;
  		for(var j=0;j<films.length;j++){
  			getFilmDetails(i,j, films[j]);
  		}
  	}
  checkForCompleteResponse()
  })
}
}

$scope.prePage=true;

$scope.previousPage=function(prePageURL)
{
$scope.filmDetailsFlag=false;
  if(prePageURL!==null)
  {

    $scope.showLoader = true;
    $scope.filmDetails="";
  $http({
    method : "GET",
    url : prePageURL
  }).then(function mySuccess(response) {
    allDetails=response.data;
    $scope.det=allDetails;
    filmList = allDetails.results;
    for(var i=0;i< filmList.length;i++){
  		var films = filmList[i].films;
  		for(var j=0;j<films.length;j++){
  			getFilmDetails(i,j, films[j]);
  		}
  	}
    checkForCompleteResponse()
  })
}
else {
  $scope.prePage=true;
}

}


});
