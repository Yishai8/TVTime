var header;
var header_height;
//airing dates (today,tomorrow)
var day = new Date();
var today= day.getFullYear()+'-'+(((day.getMonth()+1) < 10 ? "0" : "") + (day.getMonth()+1))+'-'+(((day.getDate()) < 10 ? "0" : "") + (day.getDate()));
var numberOfDaysToAdd = 1;
day.setDate(day.getDate() + numberOfDaysToAdd); 
var tomorrow = day.getFullYear()+'-'+(((day.getMonth()+1) < 10 ? "0" : "") + (day.getMonth()+1))+'-'+(((day.getDate()) < 10 ? "0" : "") + (day.getDate()));

//gets recommended shows
var recommended = angular.module('recommended',[]).controller("popular",function ($scope,$http,$window, $timeout){
	$scope.Oldkeys=0; //if field already empty
		$scope.Newkeys=0; //if field already empty
		
		$scope.empty=function() {
			var value=$.trim($("#search").val());
			$scope.Oldkeys=$scope.Newkeys;
			$scope.Newkeys=value.length;
			if(value.length==0|| !$scope.size)
			{	
				if($scope.Newkeys==0 &&$scope.Oldkeys>0) //check if input was already empty on keyup(no refresh)
				{
					if(!$scope.size)
						$(".sb-search-input").val('');
					$http.get('http://localhost:3000/explore').success(function(data) {
						$scope.cart = limitRes(data);
					});
				}
			}
		};

		$scope.submit = function() { console.log("here");
		if($scope.Oldkeys>0)
			$http.get('http://localhost:3000/search?query='+this.text).success(function(data) {
				$scope.cart = searchRes(data);
			})

	};
	$http.get('http://localhost:3000/explore').success(function(data) {
		$scope.cart = limitRes(data);
	});

	$scope.size=true;

	$scope.showme = function()
	{
		$scope.size=!$scope.size;	
			//$scope.empty();
		};


		$window.onresize = function(event) {
			$timeout(function() {
				if($window.innerWidth<768)
				{

					$scope.size=false;
				}
				else
					$scope.size=true;
			});
		};

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


var list = angular.module('List',['ngTouch']);
list.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);

		for (var i=0; i<total; i++) {
			input.push(i);
		}

		return input;
	};
});

list.controller("listData",function ($scope,$http,$window, $timeout){
	$scope.addShowsSearch=function()
	{
		var result = document.getElementsByClassName("image");
		var wrappedResult = angular.element(result);
		var isChecked=wrappedResult.children().find("p input");
		angular.forEach(isChecked, function(value, index) {
			if(value.checked)
			{
				$http.get('http://localhost:3000/insertUserShow?name='+$scope.cart[index].name+'&&id='+$scope.cart[index].id+
					'&&img='+$scope.cart[index].image.medium+'&&user=1').success(function(data) {
						console.log("show "+$scope.cart[index].name+" added successfully");

					});

				}
       //here you can get selected value
   });

	};


	var arr=[];
	$scope.d=function(index,el){

		function createArray(length) {
			var arr = new Array(length || 0),
			i = length;

			if (arguments.length > 1) {
				var args = Array.prototype.slice.call(arguments, 1);
				while(i--) arr[i] = createArray.apply(this, args);
			}        
			return arr;
		};		
		$http.get('http://localhost:3000/showEpisode?id='+arr[index].id+'&&season='+arr[index].season+'&&episode='
			+arr[index].ep_id).success(function(data) {
				data.summary=data.summary.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ''); 
				el.episode=data;
			});


			$http.get('http://localhost:3000/showdata?id='+arr[index].id).success(function(data) {
				data.summary=data.summary.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
				el.details =  data;
				var castArray=[];
				var SeasonsArray=[];
				
				angular.forEach (el.details._embedded.cast,function(val,key){
					if(val.person.image)
						castArray.push(val.person.image.medium);

				});

				angular.forEach (el.details._embedded.seasons,function(val,key){
					SeasonsArray.push(val);

   /*<p>season<select ng-model="selectedSeason" ng-options="item for item in Season" ng-change="update(selectedSeason)"></select>
episode<select  ng-model="selectedEpisode" ng-options="item for item in items2" | range:item.episodeOrder> </select>
  </p>
  */
});
				console.log(SeasonsArray[0]);
				el.Season=SeasonsArray;
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

$scope.Oldkeys=0; //if field already empty
		$scope.Newkeys=0; //if field already empty
		
		$scope.empty=function() {
			var value=$.trim($("#search").val());
			$scope.Oldkeys=$scope.Newkeys;
			$scope.Newkeys=value.length;
			if(value.length==0)
			{	
			if($scope.Newkeys==0 &&$scope.Oldkeys>0) //check if input was already empty on keyup(no refresh)
			{

				$http.get('http://localhost:3000/explore').success(function(data) {
					$scope.cart = limitRes(data);

				});
			}
		}
	};

	$scope.submit = function() {
	var value=$.trim($("#search").val());
console.log("old"+$scope.Oldkeys);
console.log("new"+$scope.Newkeys);
	if($scope.Oldkeys>=0 && $scope.Newkeys>0)
		$http.get('http://localhost:3000/search?query='+this.text).success(function(data) {
			$scope.cart = searchRes(data);
		})

};
$http.get('http://localhost:3000/explore').success(function(data) {
	$scope.cart = limitRes(data);
});

$scope.size=true;

$scope.showme = function()
{
	$scope.size=!$scope.size;	
	$scope.empty();
};

$scope.openNav=function () {
	document.getElementById("myNav").style.height = "100%";
};

$scope.closeNav=function() {
	document.getElementById("myNav").style.height = "0%";
	$(".sb-search-input").val('');
	$scope.empty();
};


$window.onresize = function(event) {
	$timeout(function() {
		if($window.innerWidth<768)
		{

			$scope.size=false;
		}
		else
			$scope.size=true;
	});
};

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

function limitRes(data){
	var arr=[];
	for(var i in data)
	{
		if(data[i].image==null)
			data[i].image={'medium':'http://www.aspneter.com/aspneter/wp-content/uploads/2016/01/no-thumb.jpg'};
		arr.push(data[i]);

		if(arr.length>20)
			break;

	}
	return arr;
}


function searchRes(data){
	var arr=[];
	for(var i in data)
	{	
		
		if(data[i].show.image==null)
			data[i].show.image={'medium':'http://www.aspneter.com/aspneter/wp-content/uploads/2016/01/no-thumb.jpg'};
		arr.push(data[i].show);

		if(arr.length>20)
			break;
	}
	return arr;
}

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

var googleUser = {};
var auth2;
var startApp = function() {
	gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
      	client_id: '437453108837-mve7kprdb6u5mbkv9jvtm05bk11bm14t.apps.googleusercontent.com',
      	cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
    });

      attachSignin(document.getElementById('customBtn'));
  });
};



function attachSignin(element) {

	console.log(element.id);
	auth2.attachClickHandler(element, {},
		function(googleUser) {
			console.log(googleUser);
			console.log(googleUser.getBasicProfile().getName());
			sessionStorage.user1=googleUser;
			var id_token = googleUser.getAuthResponse().id_token;
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/tokensignin?idtoken="+googleUser
			});
			if(!isEmpty(googleUser))
			{
				document.getElementById('name').innerText = "Signed in: " +
				googleUser.getBasicProfile().getName();
			}
			else
			{
				signOut();

			}
		}, function(error) {
			alert(JSON.stringify(error, undefined, 2));
		});
};

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
		document.getElementById('name').innerText = "Login with Google";
	});
}

function isEmpty(object) { console.log("here");
for(var key in object) {
	if(object.hasOwnProperty(key)){
		return false;
	}
}
return true;
}
startApp();




