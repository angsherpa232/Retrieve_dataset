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
      userValue: '',
      status: '',
      dataLength: '',
      loading: false,
      lat: 42.364166,
      lng: 43.745002,
      zoom: 3,
      bounds: null
    }

  
   componentDidMount() {
    axios.get('/all')
    .then(result => {
      this.setState({
        response: result.data,
        dataLength: result.data.length,
        status: result.statusText
      })
    })
    .catch(err => console.log(err))
   }

handleChangeMain= (e) => {
  this.setState({userValue: e.target.value})
}


getBoundings= (res,resultLen) => {
  let corde = []

//Try this logic to swtich the lat long position for bounding 
this.state.response.map(e => {
  corde.push(e.metadata.location.coordinates)
})
  corde.map(elem => {
    elem.move(0,1)
  })

  corde.length > 0 ?
  this.setState({
    dataLength: resultLen,
    bounds: L.latLngBounds(corde)
  }) : console.log('nein')
}

checkLength = (res) => {
  const resultLen = res.data.length;
  resultLen > 0 ?
      this.getBoundings(res,resultLen)
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
