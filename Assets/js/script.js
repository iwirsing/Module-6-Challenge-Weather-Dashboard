//capture the DOM in variables
var cityIDEl=document.querySelector("#cityID");
var todayWeatherEl=document.querySelector("#todayWeather");
var searchBtnEl=$("#searchBtn");            
var cityArray=[];
var fromSaved=false;


//search weather
function searchWeather(event){
    event.preventDefault();
    
    var city=cityIDEl.value;
    //making sure the entered format of cities matches the format saves in the array
    const cityName=    city.split(' ')
                        .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
                        .join(' ');
    
    console.log("city array has "+ cityArray)

    if (cityArray.includes(cityName)){
        alert("The city is already saved. Click "+cityName+" button to check the weather");
    }
    else{
    fromSaved=false;
    fetchCoordinates(cityName,fromSaved);
    }
    //empty input
    cityIDEl.value="";
}
// FUNCTION 1: get the coordinates of the cities
function fetchCoordinates(cityName,isItSaved){
     //get coordinates of place
     var coordinatesURL="https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid=c8a02479b2ade74cf8b10337c300e1d5";
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

//FUNCTION 2: get weather using the coordinates, isItSaved is boolean for whether the user clicked on search or saved cities
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
                var i=(j*7);
                
                //set date
                var daysAfter=momentToday;
                daysAfter.setDate(daysAfter.getDate()+j);
                
                //display date
                displayForecast(daysAfter.toLocaleDateString(),weather.list[i].weather[0].main,weather.list[i].main.temp,weather.list[i].wind.speed,weather.list[i].main.humidity,dayID,weather.list[i].weather[0].icon);
                console.log(weather.list[i].dt_txt.substring(0,10));
                
                //reset date 
                momentToday=new Date(today*1000);

            }
            //if the search is not from the saved cities button, create new city icon
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

//FUNCTION 3: display Today's weather
function displayToday(city,date,weather,temp, wind,humidity,icon){
    console.log(city,date,weather,temp, wind,humidity, icon)

    //clear display
    todayWeatherEl.textContent="";

    //variables
    var weatherIcon=document.createElement("img");
    var getIconURL="https://openweathermap.org/img/wn/"+icon+"@2x.png"
    weatherIcon.setAttribute("src",getIconURL);

    //check weather and set background color for the element to reflect weather
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

    //display today's weather
    var todayHeader=document.createElement("h3");
    var headerContent=document.createTextNode(city+" ("+date+") ");
    todayHeader.appendChild(headerContent);
    console.log(todayHeader);
    //append element to DOM
    todayWeatherEl.appendChild(todayHeader);
    todayWeatherEl.appendChild(weatherIcon);

    //populate weather parameters in a list
    var weatherList=document.createElement("ul");
    weatherList.setAttribute("style","list-style-type: none; margin: 0; padding:0");
    //weather in words
    var weatherWords=document.createElement("li");
    weatherWords.textContent=weather;
    //temperature
    var temperature=document.createElement("li");
    temperature.textContent="Temp: "+tempF+" F";
    //wind
    var windSpeed=document.createElement("li");
    windSpeed.textContent="Wind: "+speedMPH+" MPH";
    //humidity
    var humidData=document.createElement("li");
    humidData.textContent="Humidity: "+humidity+"%";

    //append list elements to DOM
    weatherList.appendChild(weatherWords);
    weatherList.appendChild(temperature);
    weatherList.appendChild(windSpeed);
    weatherList.appendChild(humidData);
    todayWeatherEl.appendChild(weatherList);
}

//FUNCTION 4: display the next five days of weather
function displayForecast(date,weather,temp, wind,humidity,id,icon){
    console.log(id);

    //clear container
    $(id).empty();

    //variables
    var weatherList=document.createElement("ul");
    var forecastHeader=document.createElement("h6");
    var weatherIcon=document.createElement("img");
    var getIconURL="https://openweathermap.org/img/wn/"+icon+".png"
    weatherIcon.setAttribute("src",getIconURL);

    //check weather
    if (weather!=null){
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
    }
    
    //convert Kelvin to F
    var tempF=Math.round(1.8*(Number(temp)-273)+32);

    //convert speed to MPH
    var speedMPH=Math.round(3.280*wind);
    
    //display
    var forecastContent=document.createTextNode(date);
    forecastHeader.appendChild(forecastContent);
    //append to DOM
    document.querySelector(id).appendChild(forecastHeader);
    document.querySelector(id).appendChild(weatherIcon);

    //populate weather parameters
    weatherList.setAttribute("style","list-style-type: none; margin: 0; padding:0");
    //weather in words
    var weatherWords=document.createElement("li");
    weatherWords.textContent=weather;
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
    weatherList.appendChild(weatherWords);
    weatherList.appendChild(temperature);
    weatherList.appendChild(windSpeed);
    weatherList.appendChild(humidData);
    document.querySelector(id).appendChild(weatherList);
}

//FUNCTION 5: save city to local Storage
function saveCity(city){
    //display the city button
    displayCityButtons (city);

    //display delete button now that there is city button/s
    document.querySelector("#delBtn").setAttribute("style","display:visible");

    //save data into local Storage
    cityArray.push(city);
    localStorage.setItem("savedCities",JSON.stringify(cityArray));
}

//FUNCTION 6: display saved cities
function displayCityButtons(city){
    //create city button
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

//FUNCTION 7: initialize page
function initializePage(){
    //check if there is any in the storage
   if(JSON.parse(localStorage.getItem("savedCities"))!=null){

    //get file from local storage
    var getCities=JSON.parse(localStorage.getItem("savedCities"));

    //display
    for (var i=0;i<getCities.length;i++){
        displayCityButtons(getCities[i]);
    }
    //set stored data to city array
    cityArray=getCities;

    //display delete button
    document.querySelector("#delBtn").setAttribute("style","display:visible");
    }
}

//initialize
initializePage();

//search button
searchBtnEl.on("click", searchWeather);

//delete cities button click
$(document).on("click",".delBtn",function(event){
    event.preventDefault();
    
    //delete local storage
    localStorage.removeItem("savedCities");
    //hide delete button
    document.querySelector("#delBtn").setAttribute("style","display:none");
    //delete the cities and empty array 
    document.querySelector("#savedCities").innerHTML="";
    cityArray=[];
    //clear display
    todayWeatherEl.innerHTML="";
    $("#5Day").empty();
    initializePage();
});

//saved city buttons click
$(document).on("click",".cityBtn",function(event)
{
    event.preventDefault();
    var city = event.currentTarget.innerText;
    console.log(event.currentTarget.innerText);
    fetchCoordinates(city,true);
})