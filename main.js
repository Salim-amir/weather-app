const API_KEY = "78f335ba44634b8ca6b62712251307";
const city = document.querySelector(".city").textContent;

function getIconEmoji(code, isNight) {
  if ([1000].includes(code)) return isNight ? "🌙" : "☀️";
  if ([1003].includes(code)) return isNight ? "🌤️" : "🌤️";
  if ([1006, 1009].includes(code)) return "☁️";
  if ([1030, 1135, 1147].includes(code)) return "🌫️";
  if ([1063, 1150, 1153, 1180, 1183, 1240].includes(code))
    return isNight ? "🌧️" : "🌦️";
  if ([1186, 1189, 1192, 1195, 1243, 1246].includes(code)) return "🌧️";
  if ([1066, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code))
    return "❄️";
  if (
    [1069, 1072, 1168, 1171, 1204, 1207, 1237, 1249, 1252, 1261, 1264].includes(
      code
    )
  )
    return "🌨️";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "⛈️";
  return "🌡️";
}

function isNight(hour) {
  return hour >= 18 || hour < 6;
}

function getWeatherByCity(city) {
  const URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`;

  fetch(URL)
    .then((response) => response.json())
    .then((result) => {
      // Data dari API
      const location = result.location;

      const current = result.current;
      console.log(current);
      const forecast = result.forecast;

      const localHour = new Date(location.localtime).getHours();
      // const localHour = 6;
      const nightMode = isNight(localHour);
      const emoji = getIconEmoji(current.condition.code, nightMode);

      //   diambil dari tag HTML
      const body = document.body;
      const card = document.querySelector(".weather-card");
      const sun = document.querySelector(".sun");
      const moon = document.querySelector(".moon");

      // Cek kondisi malam
      if (nightMode) {
        body.dataset.mode = "night";
        card.dataset.mode = "night";
        sun.style.display = "none";
        moon.style.display = "block";
      } else {
        body.dataset.mode = "day";
        card.dataset.mode = "day";
        sun.style.display = "block";
        moon.style.display = "none";
      }

      // Isi Konten Card
      document.querySelector(".city").textContent = location.name;

      // Ambil Waktu Local
      document.querySelector(".date").textContent =
        new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });

      document.querySelector(
        ".humidity"
      ).textContent = `💧${current.humidity}%`;
      document.querySelector(
        ".wind"
      ).textContent = `💨${current.wind_kph} km/h`;
      document.querySelector(
        ".temperature"
      ).textContent = `${current.temp_c} °C`;
      document.querySelector(".weather-icon").textContent = emoji;

      updateForecast(forecast.forecastday.slice(1, 7), nightMode);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Forecast
function updateForecast(days, nightMode) {
  const forecastItems = document.querySelectorAll(".forecast-item");
  days.forEach((day, index) => {
    const emoji = getIconEmoji(day.day.condition.code, nightMode);
    const label = new Date(day.date).toLocaleDateString("id-ID", {
      weekday: "long",
    });

    if (forecastItems[index]) {
      forecastItems[index].querySelector(".weather-day").textContent = label;
      forecastItems[index].querySelector(".weather-icon").textContent = emoji;
      forecastItems[index].querySelector(
        ".temperature-card"
      ).textContent = `${day.day.avgtemp_c}°C`;
    }
  });
}

window.onload = () => {
  getWeatherByCity(city);
};
