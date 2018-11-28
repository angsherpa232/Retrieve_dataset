import React, { Component } from 'react';
import axios from 'axios';
import L from 'leaflet';

//COMPONENTS
import UserInput from './components/user_input';
import Header from './components/header';
import MapComp from './components/mapComp';
import Footer from './components/footer';
import ThemeTime from './components/theme_time';
import './moveFunction';

class App extends Component {  
    state= {
      response: [],
      coords: [],
      userValue: '',
      status: '',
      dataLength: '',
      loading: false,
      lat: 42.364166,
      lng: 43.745002,
      zoom: 3,
      bounds: null
    }

    pushLatLong = (res) => {
      let holder = [];
      res.data.map(elem => {
        holder.push(elem.metadata.location.coordinates);
      })
      return {latlongArray:holder, result: res};
    }

    changeLatLong = (obj) => {
      obj.latlongArray.map(elem => elem.move(1,0))
      this.setState({
        coords: obj.latlongArray,
        response: obj.result.data,
        dataLength: obj.result.data.length,
        status: obj.result.statusText,
        bounds: L.latLngBounds(obj.latlongArray)
      })
    }


   componentDidMount() {
     let latlongCollecter = []
    axios.get('/all')
    .then(result => {
      
      this.changeLatLong(this.pushLatLong(result))
      latlongCollecter.push(result.data[0].metadata.location.coordinates)
      latlongCollecter.map(e=>e.move(1,0))
      console.log('new trial ',latlongCollecter)
    })
    .catch(err => console.log(err))
   }


handleChangeMain= (e) => {
  this.setState({userValue: e.target.value})
}

checkLength = (res) => {
  const resultLen = res.data.length;
  resultLen > 0 ?
      this.changeLatLong(this.pushLatLong(res))
      : this.setState({dataLength: 0})
}

changeState = (res) => {
  console.log('from button push')
  this.setState({
    status: res.statusText,
    response: res.data,
    lng: res.data[0].metadata.location.coordinates[0],
    lat: res.data[0].metadata.location.coordinates[1],
    zoom: 12,
    loading: false
  });
  this.checkLength(res);
}

submitted (e) {
  e.preventDefault();
  this.setState({loading: true});
  axios.get(this.state.userValue)
    .then(result => {
      this.changeState(result);
    })
    .catch(err => {
      this.setState({
        loading: false,
        status: err,
        dataLength: 0,
        response: []
      });
    }
      );
}

  render() {
    return (
      <div>
      <Header/>
      <div className="row">
      <UserInput postvalue = {this.state.userValue} 
      handleChange={this.handleChangeMain}
      onSubmit = {this.submitted.bind(this)}
      status = {this.state.status}
      dataLength = {this.state.dataLength}
      loading = {this.state.loading}
      />
      <MapComp {...this.state}/>
      <ThemeTime post={this.state.response}/>
      </div>
      <Footer />
      </div>
    );
  }
}

export default App;
