import React, { Component } from 'react';
import { getWeather } from '../api/Api';

const initialState = {
  date: '',
  min: '',
  max: '',
  ready: false,
};
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  setWeather(currentCity) {
    getWeather(currentCity)
      .then((res) => {
        const date = new Date(res.DailyForecasts[0].Date);
        const weather = res.DailyForecasts[0].Temperature;
        const min = this.celciusConverter(weather.Minimum.Value);
        const max = this.celciusConverter(weather.Maximum.Value);
        this.setState({
          date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} `,
          min,
          max,
          ready: true,
        });
      });
  }
  reset() {
    this.setState(initialState);
  }
  celciusConverter(degre) {
    const c = (parseInt(degre) - 32) * 5 / 9;
    return c.toFixed();
  }
  render() {
    if (this.state.ready) {
      return (
        <div className="Content">
          <p className="date">{this.state.date}</p>
          <div className="weather">
            <div className="min">
              <span>MIN</span>
              <b>{this.state.min}°</b>
            </div>
            <div className="max">
              <span>MAX</span>
              <b>{this.state.max}°</b>
            </div>
          </div>

        </div>
      );
    }

    return null;
  }
}

export default Content;
