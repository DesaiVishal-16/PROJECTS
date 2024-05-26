
const search = document.getElementById("search-bar");
const reload = document.getElementById("reload");
const cityName = document.getElementById("cityName");
const stateName = document.getElementById("stateName");
const countryName = document.getElementById("countryName");
const tempInC = document.getElementById("cels");
const tempInF = document.getElementById("fehr");
const weatherStatus = document.getElementById("weatherStatus");
const main = document.getElementById("bg-img");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind");
const lastUpdate = document.getElementById("lastUpdate");
const feelsinC = document.getElementById("inCel");
const feelsinF = document.getElementById("infehr");
const visibility = document.getElementById("visibility");
const airIndex = document.getElementById("airIndex");
const currDate = document.getElementById("currDate");
const currTime = document.getElementById("currTime");
const forecastHour = document.querySelectorAll(".forecast-day");
const forecastStatus = document.querySelectorAll(".forecast-status");
const foreinC = document.querySelectorAll(".foreinC");
const foreinF = document.querySelectorAll(".foreinF");

let data;

main.style.backgroundImage = "url(./assets/img/main-img.jpg)";
main.style.backgroundRepeat = "no-repeat";
main.style.backgroundSize = "cover";

const getData = async (event) => {
    event.preventDefault();
    if (!search.value) {
        alert("Please! Enter the City Name");
        return;
    }

    const city = search.value;
    try {
        const fetchData = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=5380f1caada04d03aee192116231102&q=${city}&days=14&aqi=yes`);
        const orgData = await fetchData.json();
        data = orgData;
        console.log(data);

        // Update DOM elements
        countryName.innerHTML = data?.location?.country || 'N/A';
        stateName.innerHTML = data?.location?.region || 'N/A';
        cityName.innerHTML = data?.location?.name || 'N/A';
        tempInC.innerHTML = data?.current?.temp_c || 'N/A';
        tempInF.innerHTML = data?.current?.temp_f || 'N/A';
        humidity.innerHTML = data?.current?.humidity || 'N/A';
        windSpeed.innerHTML = data?.current?.wind_mph || 'N/A';
        weatherStatus.innerHTML = data?.current?.condition?.text || 'N/A';
        lastUpdate.innerHTML = data?.current?.last_updated || 'N/A';
        feelsinC.innerHTML = data?.current?.feelslike_c || 'N/A';
        feelsinF.innerHTML = data?.current?.feelslike_f || 'N/A';
        visibility.innerHTML = data?.current?.vis_miles || 'N/A';
        airIndex.innerHTML = data?.current?.air_quality["us-epa-index"] || 'N/A';

        // Update current date and time
        const updateDateTime = (dateString) => {
            const date = new Date(dateString);
            const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
            const newDate = new Intl.DateTimeFormat(undefined, options).format(date);
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const amPm = hours < 12 ? 'am' : 'pm';
            const formattedTime = `${hours % 12 || 12}:${minutes}${amPm}`;
            return { newDate, formattedTime };
        };

        const { newDate, formattedTime } = updateDateTime(data?.location?.localtime);
        currDate.innerHTML = newDate;
        currTime.innerHTML = formattedTime;

        // Update forecast data
        for (let i = 0; i < 10; i++) {
            // Assuming you want the forecast for the current day, you need to get the correct day's data first
            const forecastData = data?.forecast?.forecastday?.[0]?.hour[i];
            
            if (forecastData) {
                forecastStatus[i].innerHTML = forecastData?.condition?.text || 'N/A';
                foreinC[i].innerText = forecastData?.temp_c || 'N/A';
                foreinF[i].innerText = forecastData?.temp_f || 'N/A';
        
                const forecastDate = new Date(forecastData.time);
                const formattedForecastDate = new Intl.DateTimeFormat(undefined, { 
                    weekday: 'long', 
                    hour: 'numeric', 
                    minute: 'numeric' 
                }).format(forecastDate);
                forecastHour[i].innerHTML = formattedForecastDate;
            } else {
                // Clear the card if there's no forecast data
                forecastStatus[i].innerHTML = 'N/A';
                foreinC[i].innerText = 'N/A';
                foreinF[i].innerText = 'N/A';
                forecastHour[i].innerHTML = 'N/A';
            }
        }

        // Update background image based on weather condition
        const updateBackgroundImage = (conditionCode, isDay) => {
            const timeOfDay = isDay ? 'day' : 'night';
            let weatherType;

            if (conditionCode === 1000) {
                weatherType = 'sunny';
            } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1275, 1276, 1279, 1282].includes(conditionCode)) {
                weatherType = 'cloudy';
            } else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(conditionCode)) {
                weatherType = 'rainy';
            } else {
                weatherType = 'snowy';
            }

            main.style.backgroundImage = `url(./assets/${timeOfDay}/${weatherType}.jpg)`;
            main.style.backgroundSize = "cover";
        };

        const currentConditionCode = data?.current?.condition?.code;
        const isDay = data?.current?.is_day;
        updateBackgroundImage(currentConditionCode, isDay);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Please try again.");
    }
};
