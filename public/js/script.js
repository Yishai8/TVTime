var header;
var header_height;
//airing dates (today,tomorrow)
var day = new Date();
var today= day.getFullYear()+'-'+(((day.getMonth()+1) < 10 ? "0" : "") + (day.getMonth()+1))+'-'+(((day.getDate()) < 10 ? "0" : "") + (day.getDate()));
var numberOfDaysToAdd = 1;
day.setDate(day.getDate() + numberOfDaysToAdd); 
var tomorrow = day.getFullYear()+'-'+(((day.getMonth()+1) < 10 ? "0" : "") + (day.getMonth()+1))+'-'+(((day.getDate()) < 10 ? "0" : "") + (day.getDate()));

//gets recommended shows
var recommended = angular.module('recommended',[]).controller("popular",function ($scope,$http){
	$http.get('https://tvtime.herokuapp.com/explore').success(function(data) {
		$scope.cart = data;
	})

});


var airing = angular.module('airing',[]);

airing.controller("today",function ($scope,$http){		//index.html page

	
	//getting today's schedule
	$http.get('https://tvtime.herokuapp.com/airing?date='+today).success(function(data) {
		$scope.cart = removeDbl(data);
		

	})});

airing.controller("tomorrow",function ($scope,$http){	//index.html page
	
	//getting tomorrow's schedule
	$http.get('https://tvtime.herokuapp.com/airing?date='+tomorrow).success(function(data) {
		
		$scope.cart = removeDbl(data);
	})});

airing.directive('sibs', function($http) { //open/close hidden show div and check if show is tracked
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				scope.text = attrs["sibs"];
				if(element.parent().children('p').hasClass('after'))
				{
					$http.get('https://tvtime.herokuapp.com/checkShow?userID=1&&showID='+scope.text).success(function(data) {
						
						if(data!="null")
							element.parent().children('p').children('button')[0].innerHTML='Show is being followed';
						else
							element.parent().children('p').children('button')[0].innerHTML='Add to Download List';

					});
					element.parent().children('p').removeClass('after');
					element.parent().children('p').addClass('toggle');
				}
				else
				{

					element.parent().children('p').removeClass('toggle');
					element.parent().children('p').addClass('after');
				}
				
			})
		},
	}
});


airing.directive('youtube', function($http) { // future use
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				var target = element[0].querySelector('#show');
				$http.get('https://tvtime.herokuapp.com/youtube?name='+target.innerHTML).success(function(data) {


				});
			})
		},
	}
});



airing.directive('click', function($http) { //adding/removing show to/from DB
	return {
		link: function(scope, element, attrs) {
			if(attrs)
				element.bind('click', function (e) {
					scope.text = attrs["click"];
					var arr=scope.text.split(",");
					var showID=arr[0];
					var showName=arr[1];
					var showImg=arr[2];
					if(element.html()=="Add to Download List") {
						element[0].innerHTML="Show is being followed";
						$http.get('https://tvtime.herokuapp.com/insertUserShow?name='+showName+'&&id='+showID+
							'&&img='+showImg+'&&user=1').success(function(data) {


							});



						}
						else {
							element[0].innerHTML="Add to Download List";
							$http.get('https://tvtime.herokuapp.com/removeUserShow?name='+showName+'&&id='+showID+
								'&&user=1').success(function(data) {


								});
							}
							e.stopPropagation();
						})
		},
	}
});


var list = angular.module('List',[]);
list.controller("listData",function ($scope,$http){

//get user's  shows
	$http.get('https://tvtime.herokuapp.com/getUserShows?userID='+1).success(function(data) {
		var arr=[];
		var name=[];
		for(var i in data)
		{
			for(var j in data[i].shows)
			{
				if(data[i].shows[j].active==true)
				{
					
					arr.push(data[i].shows[j]);
				}
			}
		}

		$scope.shows =arr;
		

	})});




function removeDbl(data){
	var arr=[];
	var name=[];
	for(var i in data)
	{
		if(name.indexOf(data[i].show.name)==-1)
		{
			name.push(data[i].show.name);
			arr.push(data[i]);
		}
		if(arr.length>20)
			break;

	}
	return arr;
}

function detectDay() {	//today/tomorrow strip index.html

	var header = document.getElementsByClassName("ShowsScreen")[0];
	if (header!=undefined)
	{
		var header_height= window.getComputedStyle(header, "").height.split('px')[0];
		header_height-=100;
		var opp_header=header_height-300;
		if( window.pageYOffset > header_height) {
			$('#strip').text('Tomorrow');


		}

		if( window.pageYOffset < opp_header ) {
			$('#strip').text('Today');

		}
	}
}
window.addEventListener('scroll', detectDay, false);


$(function() { //future use
	var availableTags = [
	"ActionScript",
	"AppleScript",
	"Asp",
	"BASIC",
	"C",
	"C++",
	"Clojure",
	"COBOL",
	"ColdFusion",
	"Erlang",
	"Fortran",
	"Groovy",
	"Haskell",
	"Java",
	"JavaScript",
	"Lisp",
	"Perl",
	"PHP",
	"Python",
	"Ruby",
	"Scala",
	"Scheme"
	];
	$( "#tags" ).autocomplete({
		source: availableTags
	});
});

