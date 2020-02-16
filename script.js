var today = moment().format('DD/MM/YYYY');
var cities = [];
let weatherKey = "&units=imperial&APPID=23a93f0c63be881c562c283b7ffab133";
let APIKey = "23a93f0c63be881c562c283b7ffab133";
var forecastIndex = 0;

//API Searches
//The function that will changes the weather info with each city chosen
function displayWeatherInfo(city) {//Display all weather info
    $("#current").empty();
    $(".five-day").empty();
    $(".forecast-head").empty();

    console.log(city)

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + weatherKey;//Get the current weather
    console.log(queryURL + " is the OpenWeather City response for today's weather")

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response, lat, long) {
        var lat = response.coord.lat;
        var long = response.coord.lon;
        console.log(city + long + " and " + lat)
        var cityTemp = Math.round(response.main.temp);
        var cityTempIcon = response.weather[0].icon;
        var cityTempIconURL = "http://openweathermap.org/img/w/" + cityTempIcon + ".png";
        var cityHumidity = response.main.humidity;
        var cityWindSpeed = response.wind.speed;
        $("#current").empty();//
        var CityLat = lat;
        var CityLong = long;
        console.log(city + CityLong + " and " + CityLat)

//API call for Longitude and latitude for UV Index Info
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + CityLat + "&lon=" + CityLong;
        console.log(queryURL + " is the OpenWeather City response for the uv index")
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            $("#current")
                .append($("<h2>").html(city + " (" + today + ")" + "<img src=" + cityTempIconURL + ">")) //add the city name, weather icon and date to the curent weather display
                .append($("<p>").html("Temperature: " + cityTemp + " °F")) //add the temperature
                .append($("<p>").html("Humidity: " + cityHumidity + "%"))//add the humidity
                .append($("<p>").html("Windspeed: " + cityWindSpeed + " MPH"))//add the windspeed
                .append($("<p>").html("<p>UV Index: <span id = current-UV><nbsp>" + response.value + "<nbsp></span></p>"))
        });
    });


//5 Day Forecast

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + weatherKey;
    console.log(queryURL + " is the OpenWeather City response for 5 day forecast")

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        $(".five-day").empty();//
        $(".forecast-head").empty();//
        $(".forecast-head")

            .append($("<h2>").text("5-Day Forecast:"))
        for (i = 0; i <= 4; i++) {
            console.log(i)
            var nextDay = moment().add(1 + i, 'days').format('DD/MM/YYYY');
            var cityIconForecast = response.list[i].weather[0].icon;
            var cityIconURLForecast = "http://openweathermap.org/img/w/" + cityIconForecast + ".png";
            var cityTempForecast = Math.round(response.list[i].main.temp);
            var cityHumidityForecast = response.list[i].main.humidity;
            $(".five-day")
                .append($("<div>").addClass("col-sm-2 days")
                    .append($("<p>").html(nextDay))//Add the day for the forecast
                    .append($("<img src=" + cityIconURLForecast + ">")) //add the weather icon
                    .append($("<p>").html("Temp: " + cityTempForecast + " °F"))//add the temperature
                    .append($("<p>").html("Humidity: " + cityHumidityForecast + "%")))//add the humidity
            console.log(nextDay + ", " + cityHumidityForecast + ", " + cityTempForecast)

        }
    });

}


//Make the city search history buttons
function renderButtons() {
    var cityInitial = $("#city-input").val().trim();
    var citySearch=cityInitial.charAt(0).toUpperCase() + cityInitial.substring(1);//Sets the the first character as a capital
    if (cities.indexOf($("#city-input").val().trim()) === -1) {// Avoids repeat search history buttons
        $("#search-history").append($("<button>").addClass("past-city").attr("city-name",citySearch ).text(citySearch))
        cities.push(citySearch);
    }

    $(".past-city").on("click", function () { //Button click function to advance to
        console.log($(this).attr("city-name"))
        displayWeatherInfo($(this).attr("city-name"));
    })
}

$("#add-city").on("click", function (event) {
    event.preventDefault();
    var city = $("#city-input").val().trim();
    displayWeatherInfo(city);
    renderButtons();


});

function newFunction() {
    console.log("new function");
    displayWeatherInfo();
}

