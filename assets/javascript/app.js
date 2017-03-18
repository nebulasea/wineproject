  $(document).ready(function(){
// Initialize Firebase
 var config = {
   apiKey: "AIzaSyD7IbZ-o2vDLWouSvl7WevDHXnqiUR1anQ",
   authDomain: "winebuddy-91c37.firebaseapp.com",
   databaseURL: "https://winebuddy-91c37.firebaseio.com",
   storageBucket: "winebuddy-91c37.appspot.com",
   messagingSenderId: "153805399239"
 };
 firebase.initializeApp(config);



//setting up database 

var database = firebase.database();
var name;
var email;
var location;
var winePreference =[];
var categoryFilter = [];


//saving user info to database - this needs additional work once the user object is fully defined in the DB

$('#userLocation').bind('input propertychange focusout', function() {
    $('#userLocation').val($(this).val());
});

function submitUserInfo() {
//need an if statement here
	name = $("#userName").val().trim();
	email = $("#userEmail").val().trim();
	location = $("#userLocation").val().trim();
	userBio = $("#userBio").val().trim();
	

	database.ref().push({
			name: name,
			email: email,
			location: location,
			userBio: userBio,
		});
	};




function clearUserInfo() {
	$("#userName").val('');
	$("#userEmail").val('');
	$("#userLocation").val('');
	$("#userBio").val('');
}


//wine preferences must be saved to the user object in the DB and display properly in the user profile
function submitWineType() {
	winePreference = $("input:checked").map(function(){
		return $(this).val();
	}).get();

	database.ref().push({
			winePreference: winePreference
		});
	};




//setting up ajax call

function checkForMultipleWines() {
	if (winePreference.length > 1) {
		for (var i = 0; i < winePreference.length; i++) {
		categoryFilter.push('categories(' + winePreference[i] + ')');
		}
		categoryFilter = categoryFilter.join('+');
	} else categoryFilter = ['categories(' + winePreference[0] + ')']
}

function getWineRecommendations() {
	checkForMultipleWines();
	var queryURL = "https://services.wine.com/api/beta2/service.svc/json/catalog?filter=" + categoryFilter + "&size=10&sortBy=rating|descending+price|ascending&apikey=0bab0e3079cc594e3fdd6f1c925ce5f1"

	$.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
    	var results = response.Products.List;
    for (var i = 0; i < results.length; i++) {
    	var wineName = results[i].Name;
    	var wineList = $('#wine-list-results')
    	wineList.append("<li>" + wineName + "</li><br>")

    }

	});
}

$("#submitProfile").on("click", function(event) {
	event.preventDefault();
	submitUserInfo();
	clearUserInfo();
	});

$("#submitWineButton").on("click", function(event) {
	event.preventDefault();
	$('#wine-list-results').empty();
	submitWineType();
	getWineRecommendations();
	});
});
