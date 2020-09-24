$(document).ready(function () {


    $(document).on("click", "list-group-item", function () {

        let location = $(this).text()
        let apiKey = "e8664dc30f2e35b7b932b76dbaceedcc";
        let searchQuery = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + apiKey + "&units=imperial";

        $.ajax({
            url: searchQuery,
            method: "GET"
        }).then(function (result) {

            $("#city").text(result.name);
            $("#temp").html("Temperature " + result.main.temp + "&#176; F");
            $("#wind").text("Wind Speed: " + result.wind.speed + "mph");
            $("#humidity").text("Humidity: " + result.main.humidity + "%");
        })


    })

    $("#searchBtn").click(function () {

        let location = $("#userText").val();

        let apiKey = "e8664dc30f2e35b7b932b76dbaceedcc";
        let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + apiKey + "&units=imperial";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            $("#city").text(response.name);
            $("#temp").html("Temperature " + response.main.temp + "&#176; F");
            $("#wind").text("Wind Speed: " + response.wind.speed + "mph");
            $("#humidity").text("Humidity: " + response.main.humidity + "%");

            let uvQuery = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;

            console.log("uvQuery")


            $.ajax({
                url: uvQuery,
                method: "GET"
            }).then(function (res) {
                console.log(res)

                $("#uv").text("UV Index: " + res.value);

                let currentQuery = "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=" + apiKey + "&units=imperial";

                console.log(currentQuery)

                $.ajax({
                    url: currentQuery,
                    method: "GET"
                })
                    .then(function (current) {
                        console.log(current)

                        let list = current.list
                        console.log(list);
                        $("#current-list").empty();
                        for (let i = 7; i < list.length; i += 8) {

                            let divTag = $("<div class='col text-center align-items-center'>");
                            let dateTag = $("<h4 class='card-title'>").text(list[i].dt_txt.split(" ")[0]);
                            let humidityTag = $("<p class='card-subtitle'>").text("Humidity: " + list[i].main.humidity + " %");
                            let tempTag = $("<p class='card-subtitle'>").html("Temp: " + list[i].main.temp + " &#176; F");
                            let weatherImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + list[i].weather[0].icon + "@2x.png");



                            divTag.append(dateTag);
                            divTag.append(tempTag);
                            divTag.append(humidityTag);
                            divTag.append(weatherImg);


                            $("#current-list").append(divTag);

                        }
                        /*
                        replacing below with for loop and append method.
                        $("#city2").html("<h1>" + current.city.name + "</h1>");
                        $("#wind2").text("Wind Speed: " + current.list[8].wind.speed);
                        $("#humidity2").text("Humidity: " + current.list[8].main.humidity + "%");
                        let temp2 = (current.list[8].main.temp - 273.15) * 1.80 + 32;
                        $("#temp2").text("Temperature (F) " + temp2.toFixed(2));
 
                        $("#city3").html("<h1>" + current.city.name + "</h1>");
                        $("#wind3").text("Wind Speed: " + current.list[16].wind.speed);
                        $("#humidity3").text("Humidity: " + current.list[16].main.humidity + "%");
                        let temp3 = (current.list[16].main.temp - 273.15) * 1.80 + 32;
                        $("#temp3").text("Temperature (F) " + temp3.toFixed(2));
 
                        $("#city4").html("<h1>" + current.city.name + "</h1>");
                        $("#wind4").text("Wind Speed: " + current.list[24].wind.speed);
                        $("#humidity4").text("Humidity: " + current.list[24].main.humidity + "%");
                        let temp4 = (current.list[24].main.temp - 273.15) * 1.80 + 32;
                        $("#temp4").text("Temperature (F) " + temp4.toFixed(2));
 
                        $("#city5").html("<h1>" + current.city.name + "</h1>");
                        $("#wind5").text("Wind Speed: " + current.list[32].wind.speed);
                        $("#humidity5").text("Humidity: " + current.list[32].main.humidity + "%");
                        let temp5 = (current.list[32].main.temp - 273.15) * 1.80 + 32;
                        $("#temp5").text("Temperature (F) " + temp5.toFixed(2));
 
                        $("#city6").html("<h1>" + current.city.name + "</h1>");
                        $("#wind6").text("Wind Speed: " + current.list[40].wind.speed);
                        $("#humidity6").text("Humidity: " + current.list[40].main.humidity + "%");
                        let temp6 = (current.list[40].main.temp - 273.15) * 1.80 + 32;
                        $("#temp6").text("Temperature (F) " + temp6.toFixed(2));*/


                    });
            });


        })

    });
});