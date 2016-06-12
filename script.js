var header;
var header_height;
//airing dates (today,tomorrow)
var day = new Date();
var today= day.getFullYear()+'-'+(((day.getMonth()+1) < 10 ? "0" : "") + (day.getMonth()+1))+'-'+(((day.getDate()) < 10 ? "0" : "") + (day.getDate()));
var numberOfDaysToAdd = 1;
day.setDate(day.getDate() + numberOfDaysToAdd); 
var tomorrow = day.getFullYear()+'-'+(((day.getMonth()+1) < 10 ? "0" : "") + (day.getMonth()+1))+'-'+(((day.getDate()) < 10 ? "0" : "") + (day.getDate()));


var recommended = angular.module('recommended',[]).controller("popular",function ($scope,$http){
	$http.get('http://localhost:3000/explore').success(function(data) {
		$scope.cart = data;
	})

});


var airing = angular.module('airing',[]);

airing.factory('randomize', function() {
	return Math.floor((Math.random()*10)+1);
});


airing.controller("today",function ($scope,$http){

	$scope.aler = function($event) {
		if($event.currentTarget.innerHTML=="Add to Download List")
			$event.currentTarget.innerHTML="test";
		else
			$event.currentTarget.innerHTML="Add to Download List";

		$event.stopPropagation();

	};


	$http.get('http://localhost:3000/airing?date='+today).success(function(data) {
		$scope.cart = removeDbl(data);

	})});

airing.controller("tomorrow",function ($scope,$http){
	$scope.callNotify = function() {
		notify();
	};
	$scope.aler = function($event) {
		if($event.currentTarget.innerHTML=="Add to Download List")
			$event.currentTarget.innerHTML="test";
		else
			$event.currentTarget.innerHTML="Add to Download List";

		$event.stopPropagation();

	};



	$http.get('http://localhost:3000/airing?date='+tomorrow).success(function(data) {
		
		$scope.cart = removeDbl(data);
	})});

airing.directive('sibs', function($http) {
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				if(element.parent().children('p').hasClass('after'))
				{
					$http.get('http://localhost:3000/checkShow?userID=1&&showID=157').success(function(data) {
						if(data!=null)
							element.parent().children('p').children('button')[0].innerHTML='a';
					
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


airing.directive('youtube', function($http) {
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				var target = element[0].querySelector('#show');
				$http.get('http://localhost:3000/youtube?name='+target.innerHTML).success(function(data) {


							});
			})
		},
	}
});



airing.directive('click', function($http) {
	return {
		link: function(scope, element, attrs) {
			if(attrs && attrs.click)
				element.bind(attrs.click, function (e) {
					if(element.html()=="Add to Download List") {
						element[0].innerHTML="test";
						$http.get('http://localhost:3000/insertUserShow?name='+element.parent().children('span')[0].innerHTML+
							'&&id=1').success(function(data) {


							});



						}
						else {
							element[0].innerHTML="Add to Download List";

						}
						e.stopPropagation();
					})
		},
	}
});








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

function detectDay() {

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


$(function() {
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


$('.image img').on("click","a,img", function (e) {
	e.preventDefault();
	alert('You Clicked Me');
});

