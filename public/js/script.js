var header;
var header_height;
//airing dates (today,tomorrow)
var day = new Date();
var today= day.getFullYear()+'-'+(((day.getMonth()+1) < 10 ? "0" : "") + (day.getMonth()+1))+'-'+(((day.getDate()) < 10 ? "0" : "") + (day.getDate()));
var numberOfDaysToAdd = 1;
day.setDate(day.getDate() + numberOfDaysToAdd); 
var tomorrow = day.getFullYear()+'-'+(((day.getMonth()+1) < 10 ? "0" : "") + (day.getMonth()+1))+'-'+(((day.getDate()) < 10 ? "0" : "") + (day.getDate()));

//gets recommended shows
var recommended = angular.module('recommended',[]).controller("popular",function ($scope,$http,$window, $timeout,$document){
	
	if(localStorage.sub=="" || localStorage.sub==undefined ||localStorage.sub=="undefined")
	{
		$scope.login=false;
	}
	else
		$scope.login=true;

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
					$http.get('https://tvtime.herokuapp.com/explore').success(function(data) {
						$scope.cart = limitRes(data);
					});
				}
			}
		};

		$scope.submit = function() { console.log("here");
		if($scope.Oldkeys>0)
			$http.get('https://tvtime.herokuapp.com/search?query='+this.text).success(function(data) {
				$scope.cart = searchRes(data);
			})

	};
	$http.get('https://tvtime.herokuapp.com/explore').success(function(data) {
		$scope.cart = limitRes(data);
	});


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
				if(localStorage.sub=="" || localStorage.sub==undefined ||localStorage.sub=="undefined")		
					scope.login=false;
				else
					scope.login=true;
				if(element.parent().children('p').hasClass('after'))
				{
					if(localStorage.sub!="" && localStorage.sub!="undefined" && localStorage.sub!=undefined)
					{ 
						$http.get('https://tvtime.herokuapp.com/checkShow?userID='+parseInt(localStorage.sub)+'&&showID='+scope.text).success(function(data) {

							if(data!="null")
								element.parent().children('p').children('button')[0].innerHTML='Show is being followed';
							else
								element.parent().children('p').children('button')[0].innerHTML='Add to Download List';

						});
					}
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

						if(localStorage.sub!="" && localStorage.sub!=undefined && localStorage!="undefined") {
							$http.get('https://tvtime.herokuapp.com/insertUserShow?name='+showName+'&&id='+showID+
								'&&img='+showImg+'&&user='+parseInt(localStorage.sub)).success(function(data) {
									element[0].innerHTML="Show is being followed";
									//elem.className='but';
								});

							}

						}
						else {
							$http.get('https://tvtime.herokuapp.com/removeUserShow?name='+showName+'&&id='+showID+
								'&&user='+parseInt(localStorage.sub)).success(function(data) {
									element[0].innerHTML="Add to Download List";


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
	if(localStorage.sub=="" || localStorage.sub==undefined ||localStorage.sub=="undefined")		
		$scope.login=false;
	else
		$scope.login=true;

	$scope.nextEpisode=function(el)
		{
			var index=-1;
			for(i=0;i<el.showarr.length;i++)
			{
				if(el.episode.number==el.showarr[i].number)
				{
					index=i+1;
				}
			}
			if(index!=-1 && el.showarr.length!=index)
				el.episode=el.showarr[index];

		};

		$scope.previousEpisode=function(el)
		{
			var index=-1;
			for(i=0;i<el.showarr.length;i++)
			{
				if(el.episode.number==el.showarr[i].number)
				{
					index=i-1;
				}
			}
			if(index!=-1)
				el.episode=el.showarr[index];

		};

		$scope.saveEpisode=function(el)
		{
			
			$http.get('https://tvtime.herokuapp.com/updateUserShowEpisode?id='+parseInt(localStorage.sub)+'&&showId='+el.details.id+
					'&&season='+el.episode.season+'&&episode='+el.episode.number).success(function(data) {
						console.log("episode on show "+el.details.name+" updated successfully");
						

					});
		};

		$scope.getIndex=function(arr,episode)
		{
			var i=0;
			var index=-1;
			for (i=0;i<arr.length;i++)
			{
				if(arr[i].number==episode)
					index=i;
			}
			return index;
		
		};

	$scope.getSeason=function(item,type)	
	{	
		var filter_season;
		var episode;
		if(type==null)
		{
			filter_season=item.selectedSeason.number;
			episode=item.item.ep_id;
		}
		else
		{
			filter_season=item.episode.season;
			episode=item.episode.number;
		}
		var showarr=[];
		angular.forEach(item.details._embedded.episodes,function(val,key){
				
			if(val.season==filter_season)
			{

						if(val.image==null &&(val.summary==null || val.summary=='') ) //if episode data is missing fill from show
						{
							val.image=item.episode.image;
							val.summary=item.episode.summary;
        } // Print the json response
        else
        {
        	if(val.image==null)
        	{
        		val.image=item.episode.image;
        	}
        	else
        		if(val.summary==null)
        			val.summary=item.episode.summary;
        	}
        	val.summary=val.summary.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
        	showarr.push(val);
        }
    });
		if(type==null)
		{
			item.showarr=showarr;
			item.episode=showarr[0];
		}
		else
		return showarr;
	};
	$scope.addShowsSearch=function()
	{	
		var result = document.getElementsByClassName("image");
		var wrappedResult = angular.element(result);
		var isChecked=wrappedResult.children().find("p input");
		angular.forEach(isChecked, function(value, index) {
			if(value.checked)
			{
				$http.get('https://tvtime.herokuapp.com/insertUserShow?name='+$scope.cart[index].name+'&&id='+$scope.cart[index].id+
					'&&img='+$scope.cart[index].image.medium+'&&user='+parseInt(localStorage.sub)).success(function(data) {
						console.log("show "+$scope.cart[index].name+" added successfully");

					});

				}
       //here you can get selected value
   });

	};


	var arr=[];
	$scope.opendiv=function(index,el){



		function createArray(length) {
			var arr = new Array(length || 0),
			i = length;

			if (arguments.length > 1) {
				var args = Array.prototype.slice.call(arguments, 1);
				while(i--) arr[i] = createArray.apply(this, args);
			}        
			return arr;
		};		


		if(el.episode==undefined)
		{
			$http.get('https://tvtime.herokuapp.com/showEpisode?id='+arr[index].id+'&&season='+arr[index].season+'&&episode='
				+arr[index].ep_id).success(function(data) {
					data.summary=data.summary.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ''); 
					el.episode=data;
					
				});


				$http.get('https://tvtime.herokuapp.com/showdata?id='+arr[index].id).success(function(data) {
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

					});	
					el.Season=SeasonsArray;
					el.slides=castArray;
					el.showarr=$scope.getSeason(el,1);
					el.episode=el.showarr[$scope.getIndex(el.showarr,el.item.ep_id)];
								
					$scope.slide = function(dir){
						var vehArr = el.slides;
						vehicle = {};
						if (dir === 'left') {
							first_item = vehArr[0];
							vehArr.shift();
							vehArr.push(first_item);

						} else {
							vehicle = vehArr.pop();
							vehArr.unshift(vehicle);
						}


					};

				});}

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
					$http.get('https://tvtime.herokuapp.com/removeUserShow?name='+showName+'&&id='+showID+
						'&&user='+parseInt(localStorage.sub)).success(function(data) {


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
					$http.get('https://tvtime.herokuapp.com/insertUserShow?name='+showName+'&&id='+showID+
						'&&img='+""+'&&user='+parseInt(localStorage.sub)).success(function(data) {


						});

					};	
//get user's  shows
$http.get('https://tvtime.herokuapp.com/getUserShows?userID='+parseInt(localStorage.sub)).success(function(data) {

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

				$http.get('https://tvtime.herokuapp.com/explore').success(function(data) {
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
			$http.get('https://tvtime.herokuapp.com/search?query='+this.text).success(function(data) {
				$scope.cart = searchRes(data);
			})

	};
	$http.get('https://tvtime.herokuapp.com/explore').success(function(data) {
		$scope.cart = limitRes(data);
	});


	$scope.openNav=function () {
		document.getElementById("myNav").style.height = "100%";
	};

	$scope.closeNav=function() {
		document.getElementById("myNav").style.height = "0%";
		$(".sb-search-input").val('');
		$scope.empty();
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
			var id_token = googleUser.getAuthResponse().id_token;
			
			if(localStorage.login!="ok")
			{
				localStorage.login="ok";
				localStorage.name=googleUser.getBasicProfile().getName();
				localStorage.email=googleUser.getBasicProfile().getEmail();
				$.ajax({
					type: "POST",
					url: "https://tvtime.herokuapp.com/Usersignin?idtoken="+id_token
				}).success(function(res) {
					localStorage.sub=res;
					console.log(googleUser);
					window.location.href="./index.html";
					window.location.assign("./index.html");
				});
				
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
		localStorage.login="out";
		localStorage.name="";
		localStorage.email="";
		localStorage.sub="";
		console.log('User signed out.');
		document.getElementById('name').innerText = "Login with Google";
		window.location.href="./index.html";
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



$( document ).ready(function(){


	if(localStorage.login=="ok")
		document.getElementById('name').innerText = localStorage.name+" |Logout";
	else
		document.getElementById('name').innerText = "Login with Google";
});	