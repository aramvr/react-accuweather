import React, { Component } from 'react';
import getLocations from '../api/Api';
import Content from './Content';

class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'default',
      favorites: [],
      currentCity: '',
      cities: [],
      removedCities: [],
      activeCity: false,
    };
    this.changeCity = this.changeCity.bind(this);
    this.selectFavorite = this.selectFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.Content = React.createRef();
  }
  componentDidMount() {
    this.setSetting();
  }
  componentDidUpdate() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }
  setSetting() {
    let state = localStorage.getItem('state');

    state = JSON.parse(state);
    if (state !== null) {
      this.setState({ ...state });
      this.selectFavorite(state.currentCity);
    } else {
      getLocations().then((res) => {
        const cities = res.map(city => ({
          EnglishName: city.EnglishName,
          Key: city.Key,
        }));

        this.setState({
          cities,
        });
      });
    }
  }
  changeCity(e) {
    this.addFavorite(e.target.value);
  }

  addFavorite(key) {
    const favorites = this.state.favorites;
    const city = this.state.cities.filter(e => key === e.Key);
    favorites.push(city[0]);
    this.removeCityFromList(key);
    this.setState({ favorites });
  }
  removeFavorite(key) {
    const favorites = this.state.favorites;
    const index = favorites.map(e => e.Key).indexOf(key);
    const currentCity = this.state.currentCity;
    if (key === currentCity) {
      this.Content.current.reset();
    }
    favorites.splice(index, 1);
    this.setState({ favorites });
    this.addCitytoList(key);
  }

  selectFavorite(currentCity) {
    if (currentCity === '' || currentCity === 'undefined') return false;
    this.setState({ currentCity, activeCity: true });
    this.Content.current.setWeather(currentCity);
    return true;
  }

  removeCityFromList(key) {
    const cities = this.state.cities;
    const removedCities = this.state.removedCities;
    const index = cities.map(e => e.Key).indexOf(key);

    removedCities.push({
      index,
      city: cities[index],
    });
    cities.splice(index, 1);
    this.setState({ cities, removedCities });
  }
  addCitytoList(key) {
    const cities = this.state.cities;
    const removedCities = this.state.removedCities;
    const removed = removedCities.filter(e => e.city.Key === key);
    const removedIndex = removedCities.map(e => e.city.Key).indexOf(key);
    const index = removed[0].index;
    const city = removed[0].city;

    cities.splice(index, 0, city);
    removedCities.splice(removedIndex, 1);
    this.setState({ cities, removedCities });
  }

  favoriteListItem(fav, index) {
    const name = fav.EnglishName;
    const key = fav.Key;
    return (
      <div key={index} className={this.state.currentCity === key ? 'selected' : ''}>
        <div onClick={() => this.selectFavorite(key)} onKeyDown={() => {}}>
          <p>{name}</p>
        </div>
        <span onClick={() => { this.removeFavorite(key); }} onKeyDown={() => {}}>×</span>
      </div>
    );
  }

  render() {
    const [cities, selected, favorites] = [this.state.cities, this.state.selected, this.state.favorites];
    return (
      <div>
        <div className="Sidebar">
          <div className="CountrySelector">
            <select value={selected} id="addCountry" onChange={this.changeCity}>
              <option disabled value="default">Choose A city</option>
              {cities.map((city, index) => <option key={index} value={city.Key}>{city.EnglishName}</option>)}
            </select>
          </div>
          <div className="favorites">
            {
              favorites.map((fav, index) => this.favoriteListItem(fav, index))
            }
          </div>
        </div>
        <Content ref={this.Content} city={this.state.currentCity} />
      </div>
    );
  }
}

export default Weather;
