//capture the DOM in variables
var cityIDEl=document.querySelector("#cityID");
var todayWeatherEl=document.querySelector("#todayWeather");
var searchBtnEl=$("#searchBtn");            
var cityArray=[];
var fromSaved=false;


//search weather
function searchWeather(event){
    event.preventDefault();
    var cityName=cityIDEl.value;
    console.log("city array has "+ cityArray)

    if (cityArray.includes(cityName)){
        alert("The city is already saved. Click "+cityName+" button to check the weather");
    }
    
    else{
    fromSaved=false;
    fetchCoordinates(cityName,fromSaved);
    }

   
}

//function fetch coordinates
function fetchCoordinates(cityName,isItSaved){
     //get coordinates of place
     var coordinatesURL="http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid=c8a02479b2ade74cf8b10337c300e1d5";
     console.log(coordinatesURL);
     
     //fetch coordinates
     fetch(coordinatesURL)
     .then(function (response) {
       if (response.ok) {
         response.json().then(function (coordinates) {
             var lat=coordinates[0].lat;
             var lon=coordinates[0].lon;
             getWeather(lat,lon,isItSaved);
         });
       } else {
         alert('Error: ' + response.statusText);
       }
     })
     .catch(function (error) {
       alert('Unable to connect to GitHub');
     });

}


//get the Weather
function getWeather(lat, lon, isItSaved){
    console.log("latitude: "+lat);
    console.log("longitude: "+lon);
    var weatherURL="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=c8a02479b2ade74cf8b10337c300e1d5";
    console.log(weatherURL);

    //fetch Weather
    fetch(weatherURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (weather) {
            console.log(weather);
            //build weather array
            var city=weather.city.name;

            //get today local to the place
            var today=weather.list[0].dt;
            var momentToday=new Date(today*1000);
            
            //display today
            displayToday(city,momentToday.toLocaleDateString(),weather.list[0].weather[0].main,weather.list[0].main.temp,weather.list[0].wind.speed,weather.list[0].main.humidity, weather.list[0].weather[0].icon);
         
            //display the 5 day forecast
            for (var j=1;j<6;j++){
                var dayID="#Day"+(j);
                var i=(9+(j*6));

                var daysAfter=momentToday;
                daysAfter.setDate(daysAfter.getDate()+j);
                

                displayForecast(daysAfter.toLocaleDateString(),weather.list[i].weather[0].main,weather.list[i].main.temp,weather.list[i].wind.speed,weather.list[i].main.humidity,dayID,weather.list[i].weather[0].icon);
                console.log(weather.list[i].dt_txt.substring(0,10));
                momentToday=new Date(today*1000);

            }

            if (!isItSaved){
            //create button to save data on city name
            saveCity(city);
            }

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });

}

//display Today

function displayToday(city,date,weather,temp, wind,humidity,icon){
    console.log(city,date,weather,temp, wind,humidity, icon)

    //clear display
    todayWeatherEl.textContent="";

    //variables
    var weatherIcon=document.createElement("img");
    var getIconURL="http://openweathermap.org/img/wn/"+icon+"@2x.png"
    weatherIcon.setAttribute("src",getIconURL);

    //check weather and set background color
    if(weather==="Clouds"){
        todayWeatherEl.setAttribute("style","background-color:#c5c5c5");
    }
    if(weather==="Clear"){
        todayWeatherEl.setAttribute("style","background-color:#ffdd76");
    }
    if((weather==="Rain")||(weather==="Thunderstorm")){
        todayWeatherEl.setAttribute("style","background-color:#8989ff");
    }
    if(weather==="Snow"){
        todayWeatherEl.setAttribute("style","background-color:white");
    }



    //convert Kelvin to F
    var tempF=Math.round(1.8*(Number(temp)-273)+32);
    console.log(tempF);

    //convert speed to mph
    var speedMPH=Math.round(2.237*wind);
    console.log(speedMPH);

    //display
    var todayHeader=document.createElement("h3");
    var headerContent=document.createTextNode(city+" ("+date+") ");
    todayHeader.appendChild(headerContent);
    console.log(todayHeader);

    todayWeatherEl.appendChild(todayHeader);
    todayWeatherEl.appendChild(weatherIcon);

    var weatherList=document.createElement("ul");
    weatherList.setAttribute("style","list-style-type: none; margin: 0; padding:0");
    //temperature
    var temperature=document.createElement("li");
    temperature.textContent="Temp: "+tempF+" F";
    //wind
    var windSpeed=document.createElement("li");
    windSpeed.textContent="Wind: "+speedMPH+" MPH";
    //humidity
    var humidData=document.createElement("li");
    humidData.textContent="Humidity: "+humidity+"%";

    //append elements
    weatherList.appendChild(temperature);
    weatherList.appendChild(windSpeed);
    weatherList.appendChild(humidData);
    todayWeatherEl.appendChild(weatherList);
}

//display weather
function displayForecast(date,weather,temp, wind,humidity,id,icon){
    console.log(id);
    //clear container
    document.querySelector(id).textContent="";

    //variables
    var weatherList=document.createElement("ul");
    var forecastHeader=document.createElement("h6");
    var weatherIcon=document.createElement("img");
    var getIconURL="http://openweathermap.org/img/wn/"+icon+".png"
    weatherIcon.setAttribute("src",getIconURL);

    //check weather
    if(weather==="Clouds"){
        document.querySelector(id).setAttribute("style","background-color:#c5c5c5");
    }
    if(weather==="Clear"){
        document.querySelector(id).setAttribute("style","background-color:#ffdd76");
    }
    if((weather==="Rain")||(weather==="Thunderstorm")){
        document.querySelector(id).setAttribute("style","background-color:#8989ff");
    }
    if(weather==="Snow"){

        document.querySelector(id).setAttribute("style","background-color:white");
    }
    
    //convert Kelvin to F
    var tempF=Math.round(1.8*(Number(temp)-273)+32);
    console.log(tempF);

    //convert speed to ft/second
    var speedFt=Math.round(3.280*wind);
    console.log(speedFt);

      //display
      
      var forecastContent=document.createTextNode(date);
      forecastHeader.appendChild(forecastContent);
    
  
      document.querySelector(id).appendChild(forecastHeader);
      document.querySelector(id).appendChild(weatherIcon);
  
      weatherList.setAttribute("style","list-style-type: none; margin: 0; padding:0");
      //temperature
      var temperature=document.createElement("li");
      temperature.textContent="Temp: "+tempF+" F";
      //wind
      var windSpeed=document.createElement("li");
      windSpeed.textContent="Wind: "+speedFt+" ft/s";
      //humidity
      var humidData=document.createElement("li");
      humidData.textContent="Humidity: "+humidity+"%";
  
      //append elements
      weatherList.appendChild(temperature);
      weatherList.appendChild(windSpeed);
      weatherList.appendChild(humidData);
      document.querySelector(id).appendChild(weatherList);
}

//save weather to local Storage
function saveCity(city){
    displayCityButtons (city);
    //display delete button
    document.querySelector("#delBtn").setAttribute("style","display:visible");

    //save data into local Storage
    cityArray.push(city);
    localStorage.setItem("savedCities",JSON.stringify(cityArray));
}

//display saved cities
function displayCityButtons(city){
     //create button
     var blockContainer=document.createElement("div");
     var cityData= document.createElement("button");
     cityData.setAttribute("class","btn btn-secondary cityBtn");
     cityData.setAttribute("type","button");
     cityData.setAttribute("id",city);
     cityData.setAttribute("style","margin-top:1rem;font-size:0.75rem");
     cityData.textContent=city;
     blockContainer.appendChild(cityData);
     //append button
     document.querySelector("#savedCities").appendChild(blockContainer);

}

//initiate page
function initializePage(){
   
    //check if there is any in the storage
   if(JSON.parse(localStorage.getItem("savedCities"))!=null){

     //get file from local storage
     var getCities=JSON.parse(localStorage.getItem("savedCities"));

    //display
    for (var i=0;i<getCities.length;i++){
        displayCityButtons(getCities[i]);}
    // }

    cityArray=getCities;
    
     //display delete button
     document.querySelector("#delBtn").setAttribute("style","display:visible");
   }

}




initializePage();

//search button
searchBtnEl.on("click", searchWeather);



//delete cities button
$("#delBtn").on("click",function(event){
    event.preventDefault();
    console.log("clicked");
    //delete local storage
    localStorage.removeItem("savedCities");

    //hide delete button
    document.querySelector("#delBtn").setAttribute("style","display:none");

    document.querySelector("#savedCities").innerHTML="";
    initializePage();


});

//city button
$(".cityBtn").on("click",function(event)
{
    event.preventDefault();
    var city = event.currentTarget.innerText;
    console.log(event.currentTarget.innerText);
    fetchCoordinates(city,true);
})