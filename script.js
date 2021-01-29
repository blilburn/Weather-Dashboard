$(document).ready(function () {

    let cities = JSON.parse(window.localStorage.getItem("cities")) || [];
    //Click event to search weather for desired city
    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        let cityValue = $("#userText").val().trim();   
        $("#userText").val("");
        weatherForecast(cityValue);
    });

    //Click event to bring up weather of previously searched cities
    $(".append-list").on("click", "li", function () {
        weatherForecast($(this).text());
    });
    //append searched cities to a page
    if (cities.length > 0) {
        weatherForecast(cities[cities.length - 1]);
    }
    for (let i = 0; i < cities.length; i++) {
        appendCity(cities[i]);
    }

    function appendCity(city) {
        let cityDiv = $("<li>");
        cityDiv.text(city);
        cityDiv.addClass("list-group-item list-group-item-action");
        $(".append-list").append(cityDiv);
        cityDiv.css("background-color", "dodgerblue");
        cityDiv.css("color", "white");
    }


    // This function gets the weather and 5day forecast from openweatherAPI for a searched location
    function weatherForecast(city) {

        let APIKey = "e8664dc30f2e35b7b932b76dbaceedcc";
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            if (cities.indexOf(city) === -1) {
                cities.push(city);
                window.localStorage.setItem("cities", JSON.stringify(cities));
                appendCity(city);
            }

            $("#weatherDisplay").css("display", "block");
            $(".card").css("display", "block");


            console.log(response);
            //Converting the initial temperature to fahrenheit
            let InitTemp = response.main.temp;
            let Fahrenheit = (InitTemp - 273.15) * 1.80 + 32;
            let temperature = $("<p>").html("Temperature: " + Fahrenheit.toFixed(2) + "&#176;F");
            //Retrieve weather icon
            let weatherIcon = response.weather[0].icon;
            //Convert weather icon from results into png file to display on page
            let iconURL = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
            //Append the weather icon to the page
            let icon = $("<img>").attr("src", iconURL);
            //Append the searched city to the page
            let location = $("<h3>").html(response.name + " " + moment().format('L')).append(icon);
            //Append humidity from searched city to the page
            let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
            //converts windspeed from meters/second to Miles per hour
            let windSpeed = $("<p>").html("Wind Speed: " + ((response.wind.speed) * 2.236937).toFixed(2) + " MPH");
            // store latitude and longitude for for UV index call
            let longitude = response.coord.lon;
            let latitude = response.coord.lat;


            //Stored URL to retrieve the UV index result
            let UVURL = "https://api.openweathermap.org/data/2.5/uvi?" + "appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
            //Storded the ID of the searched city for the five day forecast call
            let cityID = response.id;

            $.ajax({
                url: UVURL,
                method: "GET"
            }).then(function (response) {
                //Retrieve UV Index
                let UVValue = response.value;
                //append UV index to page on the same line as the "UV Index" text
                let UVIndex = $("<p>").text(UVValue).addClass("d-inline");
                let UVIndexDiv = $("<p>").text("UV Index: ");
                UVIndexDiv.append(UVIndex);
               //Update color of UV index based on returned value
                if (UVValue >= 0 && UVValue < 3) {
                    UVIndex.css("background-color", "green");
                    UVIndex.css("color", "white");
                   
                }
                else if (UVValue > 2 && UVValue < 8) {
                    UVIndex.css("background-color", "yellow");
              
                }
                else if (UVValue > 8 && UVValue < 20) {
                    UVIndex.css("background-color", "red");
                    UVIndex.css("color", "white");
          
                }
                //Added card to front page to display results
                let card = $("<div>").addClass("card");
                let cardBody = $("<div>").addClass("card-body");
                //Append results to page for the searched city
                cardBody.append(location, temperature, humidity, windSpeed, UVIndexDiv);
                //update card with current weather
                card.append(cardBody);
                $("#weatherUpdate").empty();
                $("#weatherUpdate").append(card);

                // Ajax call for five day forecast
                let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                $.ajax({
                    url: forecastURL,
                    method: "GET"
                }).then(function (response) {
                    $("#weatherFiveday").empty();
                    // Filter the weather forecast to 5 responses
                    let filteredArray = response.list.filter(function (element) {

                        let dateValue = element.dt_txt.split(" ");

                        if (dateValue[1] === "12:00:00") {
                            return dateValue[1];
                        }

                    })

                    for (let i = 0; i < filteredArray.length; i++) {
                        let initialTemp = filteredArray[i].main.temp;
                        //Convert Initial temperature to Fahrenheit
                        let FahrenheitTemp = (initialTemp - 273.15) * 1.80 + 32;
                        //Retrieve five-day weather icon
                        let weatherIconFive = filteredArray[i].weather[0].icon;
                        //Convert weather icon results to png file
                        let iconURL = "https://openweathermap.org/img/w/" + weatherIconFive + ".png";
                        //Display five-day weather icon
                        let icon = $("<img>").attr("src", iconURL);
                        let dateValue = $("<h6>").text(moment(filteredArray[i].dt_txt).format("MM/DD/YYYY"));
                        //Display five-day temperature
                        let temp = $("<p>").html("Temp: " + FahrenheitTemp.toFixed(2) + "&#176;F");
                        //Display five-day humidity
                        let humid = $("<p>").text("Humidity: " + filteredArray[i].main.humidity + "%");
                        //card for five-day forecast
                        let card = $("<div>").addClass("card");
                        let cardBody = $("<div>").addClass("card-body");
                        //Append values to card body
                        cardBody.append(dateValue, icon, temp, humid);
                        card.append(cardBody);
                        //Five day forecast card color
                        card.css("background-color", "dodgerblue");
                        //Five day forecast text color
                        card.css("color", "white");
                        //Append row for five-day forecast
                        $("#weatherFiveday").append(card);
                    }

                })

            })
        })
    }

});