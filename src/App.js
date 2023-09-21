import './App.css';
import Main from './Components/Main/Main';
import WeatherBit from './Components/Weather/WeatherBit';

function App() {
  const WeatherNetworkLink = "https://www.theweathernetwork.com/ca/weather/ontario/toronto";

  return (
    <div className="App">
      <Main />
      <a href={WeatherNetworkLink} target="_blank">
        <WeatherBit />
      </a>
    </div>
  );
}

export default App;
