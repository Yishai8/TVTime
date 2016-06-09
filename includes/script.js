/* Formatting function for row details - modify as you need */
function format(d, id) {
	// `d` is the original data object for the row
	if (sessionStorage['name'] != undefined)
		return '<img src="images/photo.jpg" id="photo" />' + '<p>Session created by:' + d[1] + '</p>' + '<p>LOCATION:' + d[2] + '</p>' + '<p>Extra info:' + d[3] + '</p>' + "<button class='btn btn-default' id='joinbutton'>Join Session</button>";
	else
		return '<div>' + '<img src="images/photo.jpg" id="photo" />' + '<p>Session created by:' + d[1] + '</p>' + '<p>LOCATION:' + d[2] + '</p>' + '<p>Extra info:' + d[3] + '</p>' + '</div>';

}

var app = angular.module('booksInventoryApp', []);

app.controller('booksCtrl', function($scope, $http) {

  $http.get("https://whispering-woodland-9020.herokuapp.com/getAllBooks")
    .then(function(response) {
      $scope.data = response.data;
    });
});


$(document).ready(function() {
	 $(".navbar-toggle").on("click", function () {
				    $(this).toggleClass("active");
			  });
	var tr;
	var table = $('#shop table').DataTable({
		"ajax" : "includes/partners.json",
		"columns" : [{
			"data" : "name"
		}, {
			"data" : "city"
		}, {
			"data" : "extn"
		}, {
			"data" : "partners"
		}],
		"order" : [[1, 'asc']],
		"autoWidth" : false
	});


	// update badge
	if (sessionStorage['name'] != "") {
		$.ajax({
			url : 'includes/functions.php?f=GetBadge',
			data : {
				"userid" : sessionStorage['id']
			},
			type : 'get',
			success : function(result) {
				$("#Bwait").text(result);
			}
		});

	}
	if (sessionStorage['name']) {
		$('#welcome').html('<img src="images/loggedusser.jpeg" id="photo" />' + "<span> Hi! " + sessionStorage['name'] + "</span>" + "<span> you are logged in!</span>");
		$('#login').html('<input type="button" class="btn btn-default navbar-btn" value="Logout" id="LogoutBut"/>');
		$('#LogoutBut').click(function() {
			sessionStorage.clear();
			window.location.href = "index.php";
		});
		$('#sidebar').css("display", "block");
	}


	$(".cross").hide();
	$(".menu-hamburger").hide();
	$(".hamburger").click(function() {
	  $(".menu-hamburger").slideToggle("slow", function() {
	    $(".hamburger").hide();
	    $(".cross").show();
	    $("#login").show();
	  });
	});
	
	$(".cross").click(function() {
	  $(".menu-hamburger").slideToggle("slow", function() {
	  	$("#login").hide();
	    $(".cross").hide();
	    $(".hamburger").show();
	  });
	  
	});

	
if($('#recent').length != 0) {
	
	var table=$('#recent').DataTable({
		"order" : [[0, 'desc']],
		"autoWidth" : false,
	});
	var table1=$('#se').DataTable();
	$.ajax({
					url : 'includes/functions.php?f=RegisteredTo',
					data : {
						"userid" : sessionStorage['id']
						},
					type : 'get',
					success : function(result) {
							$( table.tables().body().to$().html(result));
					}
				});


$.ajax({
					url : 'includes/functions.php?f=Created',
					data : {
						"userid" : sessionStorage['id']
						},
					type : 'get',
					success : function(result) {
					$( table1.tables().body().to$().html(result));
					}
				});
}

if($('#d').length != 0) {
	
	
	$.ajax({
					url : 'includes/functions.php?f=Closed',
					data : {
						"userid" : sessionStorage['id']
						},
					type : 'get',
					success : function(result) {
					$( "#h").html(result);
					}
				});
}
	// Add event listener for opening and closing details
	$('tbody').on('click', 'td', function(e) {
		if ($(e.target).is(':not(td)'))
			return;
		 tr = $(this).closest('tr');
		id = $(this).closest('table').attr('id');
		table = $('#' + id).DataTable();
		var row = table.row(tr);
		if (row.child.isShown()) {
			// This row is already open - close it
			$('#joinbutton').removeClass('butSelected');
			row.child.hide();
			tr.removeClass('shown');

		} else {
			// Open this row
			row.child(format(row.data(), id)).show();
			tr.addClass('shown');
			if (sessionStorage['name'] != undefined)// check if user is registered to this activity
			{
				$.ajax({
					url : 'includes/functions.php?f=checkAct',
					data : {
						"userid" : sessionStorage['id'],
						"activityId" : $(tr).children(":first").text()
					},
					type : 'get',
					success : function(result) {
						if (result == "registered") {
							$('#joinbutton').addClass('butSelected');
							$('#joinbutton').text("Leave Session");
						} else
							$('#joinbutton').removeClass('butSelected');
					}
				});

			}

		}
	});

	$('#results').DataTable({
		"order" : [[0, 'desc']],
		"autoWidth" : false,
	});

	$("#LoginBut").click(function() {

		var usr = $("#username").val();
		var pass = $("#Password").val();
		if (usr == "" || pass == "") {
			alert("empty fields");
		} else {
			$.ajax({
				url : 'includes/functions.php?f=login',
				data : {
					"username" : usr,
					"password" : pass
				},
				type : 'get',
				success : function(result) {
					if (result == 'Invalid username or password')
						alert(result);
					else {
						values = result.split(',');
						// result comes back as username,id
						sessionStorage.setItem("name", values[0]);
						sessionStorage.setItem("id", values[1]);
						location.reload();
					}
				}
			});
		}

	});

	$("#UploadBut").click(function(e) {
		var id = sessionStorage['id'];

		$("#creatorid").attr("value", id);
	});

	$('tbody').on('click', 'td > button', function(e) {
		$text = $(this).text();
		if ($text == "Join Session") {
			$.ajax({
					url : 'includes/functions.php?f=Join_act',
					data : {
						"userid" : sessionStorage['id'],
						"activityId" : $(tr).children(":first").text()
					},
					type : 'get',
					success : function(result) {
						if (result == "Joined") {
							$('#joinbutton').addClass('butSelected');
							$('#joinbutton').text("Leave Session");
						} 
					}
				});
		} else {
			$.ajax({
					url : 'includes/functions.php?f=Remove',
					data : {
						"userid" : sessionStorage['id'],
						"activityId" : $(tr).children(":first").text()
					},
					type : 'get',
					success : function(result) {
						if (result == "Removed") {
							$('#joinbutton').removeClass('butSelected');
							$('#joinbutton').text("Join Session");
						}			}
				});
		}
		return false;
	});
	
	$("#seabutton").click(function(){alert($( "#cityList option:selected" ).text());
		$city=$( "#cityList option:selected" ).text();
		$category=$( "#categoryList option:selected" ).text();
		$branch=$( "#branchList option:selected" ).text();
		if($("#cityList")[0].selectedIndex==0 ||$("#categoryList")[0].selectedIndex==0 ||$("#branchList")[0].selectedIndex==0)
		alert("search params not complete");
		else
		{
			window.location.href = "shopping.php";
		}
		
	
	});

	$("#wait").load(function() {

		alert("here");
	});


});

