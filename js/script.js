let $time = document.querySelector('#time');
let $date = document.querySelector('#date');
let $current_weather = document.querySelector('#current-weather-items');
let $time_zone = document.querySelector('#time-zone');
let $weather_forecast = document.querySelector('#weather-forecast');
let $current_temp = document.querySelector('#current-temp');
let body = document.querySelector('#page');
let $current_input = document.querySelector('.current__input');
let $search__btn = document.querySelector('.search__btn');
let API = '41d850260923691a317633c9b968ea5a';

let months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December',
]
let days = [
   'Понедельник',
   'Tuesday',
   'Wednesday',
   'Thursday',
   'Friday',
   'Saturday',
   'Sunday',
];

// time
   let time = new Date();
   let month = time.getMonth();
   let date = time.getDate();
   let day = time.getDay();
   $date.innerHTML = days[day] + ' , ' + date + ' ' + months[month];

getWeather();
function getWeather() {
   let current_city = $current_input.value;
   let api1 = `https://api.openweathermap.org/data/2.5/weather?q=${current_city}&lang=ru&appid=${API}`;
   fetch(api1)
      .then(function (response) { return response.json() })
      .then(function (data) {
         let {lat, lon} = data.coord;
         let api2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&lang=ru&lang=ru&units=metric&appid=${API}`;
         fetch(api2)
            .then(function (res) { return res.json() })
            .then(function (data) {
               console.log(data);
               showWeather(data);
            })
      })
}

$search__btn.addEventListener('click', ()=>{
   getWeather();
});

let otherDay = '';

function showWeather(data) {
   let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
   let $sunrise = window.moment(sunrise * 1000).format('HH:mm');
   let $sunset = window.moment(sunset * 1000).format('HH:mm');

   // bg change

   let currentTime = Date.now();
   if (body) {
      if (sunrise <= currentTime && currentTime < sunset) {
         body.classList.add('page-night');
      }
      else {
         body.classList.add('page-day');
      }
   }

   // timezone

   $time_zone.innerHTML = data.timezone;

   // currents now

   $current_weather.innerHTML =
      `<div class="weather-item">
      <div>Humidity</div>
         <div>${humidity}%</div>
      </div>
      <div class="weather-item">
         <div>Pressure</div>
         <div>${pressure}</div>
      </div>
      <div class="weather-item">
         <div>Wind speed</div>
         <div>${wind_speed}</div>
      </div>
      <div class="weather-item">
         <div>Sunrise</div>
         <div>${$sunrise}</div>
      </div>
      <div class="weather-item">
         <div>Sunset</div>
         <div>${$sunset}</div>
      </div>`;

   // currents daily
   otherDay = '';
   $weather_forecast.innerHTML = '';
   data.daily.forEach((day, index) => {
      if (index == 0) {
         $current_temp.innerHTML = `
         <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
         <div class="other">
            <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
            <div class="temp">Night - ${day.temp.night}&#176; C</div>
            <div class="temp">Day - ${day.temp.day}&#176; C</div>
         </div>
         `
      } else {
         otherDay +=`<div class="weather-forecast-item">
         <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Night - ${day.temp.night}&#176; C</div>
            <div class="temp">Day - ${day.temp.day}&#176; C</div>
         </div>`;
      }
      $weather_forecast.innerHTML = otherDay;
   })
}