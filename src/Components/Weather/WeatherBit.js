import * as React from 'react';
import ReactWeather, { useWeatherBit } from 'react-open-weather';

const WeatherBit = () => {
    const { data, isLoading, errorMessage } = useWeatherBit({
      key: '[weatherbit.io API Key]',
      lat: '[Location Latitude]',
      lon: '[Location Longitude]',
      lang: 'en',
      unit: 'M', // values are (M,S,I)    
    });
    return (
      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang="en"
        locationLabel="Toronto"
        unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
        showForecast={false}
      />
    );
  };

  export default WeatherBit;