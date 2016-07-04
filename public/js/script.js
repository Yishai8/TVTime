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
	$scope.empty=function() {

		var value=$.trim($("#search").val());

		if(value.length==0)
		{
			$http.get('http://localhost:3000/explore').success(function(data) {
				$scope.cart = data;
			});
		}
	};

	$scope.submit = function() {

		$http.get('http://localhost:3000/search?query='+this.text).success(function(data) {
			$scope.cart = data;
		})

	};
	$http.get('http://localhost:3000/explore').success(function(data) {
		$scope.cart = data;
	})

});


var airing = angular.module('airing',[]);

airing.controller("today",function ($scope,$http){		//index.html page

	
	//getting today's schedule
	$http.get('http://localhost:3000/airing?date='+today).success(function(data) {
		$scope.cart = removeDbl(data);
		

	})});

airing.controller("tomorrow",function ($scope,$http){	//index.html page
	
	//getting tomorrow's schedule
	$http.get('http://localhost:3000/airing?date='+tomorrow).success(function(data) {
		
		$scope.cart = removeDbl(data);
	})});

airing.directive('sibs', function($http) { //open/close hidden show div and check if show is tracked
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				scope.text = attrs["sibs"];
				if(element.parent().children('p').hasClass('after'))
				{
					$http.get('http://localhost:3000/checkShow?userID=1&&showID='+scope.text).success(function(data) {
						
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
				$http.get('http://localhost:3000/youtube?name='+target.innerHTML).success(function(data) {


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
						$http.get('http://localhost:3000/insertUserShow?name='+showName+'&&id='+showID+
							'&&img='+showImg+'&&user=1').success(function(data) {


							});



						}
						else {
							element[0].innerHTML="Add to Download List";
							$http.get('http://localhost:3000/removeUserShow?name='+showName+'&&id='+showID+
								'&&user=1').success(function(data) {


								});
							}
							e.stopPropagation();
						})
		},
	}
});


var list = angular.module('List',['ngTouch','ui.bootstrap']);
list.controller("listData",function ($scope,$http){
	var arr=[];
	$scope.d=function(index,el){
		$http.get('http://localhost:3000/showdata?id='+arr[index].id).success(function(data) {
			el.details =  data;
			var castArray=[];
			angular.forEach (el.details._embedded.cast,function(val,key){
				castArray.push(val.person.image.medium);

			});
			
			el.slides=castArray;
			
		});

		return !this.showDiv;
		

	};

	var div;
	var section;
	var plus;
	$scope.swipdir = function (dir,index,el) { 
		div = document.getElementById('item-'+index);
		section = document.getElementById('section-'+index);
		if(el.active==undefined)
			el.active=true;

		if(dir=="left")
		{
			if(el.active)
			{
				div.className="hidden_gar";
				section.className="hidden_sec";
			}
		}
		else
		{
			if(el.active)
			{
				div.className="display_gar";
				section.className="display_sec";
			}
			
		}
	};

	$scope.del = function (el,ind,showName,showID) {
		div = document.getElementById('item-'+ind);
		section = document.getElementById('section-'+ind);
		plus = document.getElementById('plus-'+ind);
		if(confirm("are you sure you want to remove this series?"))
		{
			div.className="hidden_gar";
			section.className="sec_del";
			plus.className="display_plus";
			el.active=false;
			$http.get('http://localhost:3000/removeUserShow?name='+showName+'&&id='+showID+
				'&&user=1').success(function(data) {


				});

			}
			
		};	

		$scope.active_sec = function (el,ind,showName,showID) {
			div = document.getElementById('item-'+ind);
			section = document.getElementById('section-'+ind);
			plus = document.getElementById('plus-'+ind);
			
			el.active=true;
			div.className="hidden_gar";
			section.className="hidden_sec";
			plus.className="hidden_plus";
			$http.get('http://localhost:3000/insertUserShow?name='+showName+'&&id='+showID+
				'&&img='+""+'&&user=1').success(function(data) {


				});
				
			};	
//get user's  shows
$http.get('http://localhost:3000/getUserShows?userID='+1).success(function(data) {

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


})

});


airing.directive('toggle', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			$(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
		}
	};
});



function removeDbl(data){
	var arr=[];
	var name=[];
	for(var i in data)
	{
		if(name.indexOf(data[i].show.name)==-1)
		{
			data[i].show.summary=data[i].show.summary.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ''); 
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

