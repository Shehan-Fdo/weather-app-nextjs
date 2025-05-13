"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Function to fetch weather based on city name
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0ce943acc04eea382a788373e3e48514&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch weather based on user's location
  const fetchWeatherByLocation = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0ce943acc04eea382a788373e3e48514&units=metric`
      );
      if (!res.ok) throw new Error("Weather not found");
      const data = await res.json();
      setWeather(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to get user's location using Geolocation API
  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherByLocation(lat, lon);
        },
        (err) => {
          setError("Unable to retrieve your location.");
          setWeather(null);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setWeather(null);
      setLoading(false);
    }
  };

  // Update time every second for live time based on timezone
  useEffect(() => {
    if (weather) {
      const intervalId = setInterval(() => {
        const currentTime = new Date(
          new Date().getTime() + weather.timezone * 1000
        );
        setLocalTime(currentTime.toLocaleTimeString());
      }, 1000); // Update every second

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [weather]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto mt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather App</h1>
          <p className="text-gray-600">Get real-time weather & local time information</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Enter city name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </form>
        </div>

        {/* Location Button */}
        <div className="flex justify-center mb-6">
          <button
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={getLocation}
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Location
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Weather Card */}
        {weather && !loading && (
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            {/* Header with City Name and Time */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">{weather.name}</h2>
                  <p className="text-blue-100">{weather.sys.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light">{localTime}</p>
                </div>
              </div>
            </div>
            
            {/* Weather Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <image
                    src={getWeatherIconUrl(weather.weather[0].icon)}
                    alt={weather.weather[0].description}
                    className="w-16 h-16"
                  />
                  <div className="ml-4">
                    <p className="text-xl font-medium capitalize">{weather.weather[0].description}</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-800">
                  {Math.round(weather.main.temp)}°C
                </div>
              </div>
              
              {/* Additional Weather Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Feels Like</p>
                  <p className="font-medium text-lg">{Math.round(weather.main.feels_like)}°C</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Humidity</p>
                  <p className="font-medium text-lg">{weather.main.humidity}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Wind</p>
                  <p className="font-medium text-lg">{Math.round(weather.wind.speed)} m/s</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Pressure</p>
                  <p className="font-medium text-lg">{weather.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-auto pt-6 pb-4 text-center text-gray-500 text-sm">
        <p>Designed with ❤️ • Powered by OpenWeather API</p>
      </footer>
    </main>
  );
}