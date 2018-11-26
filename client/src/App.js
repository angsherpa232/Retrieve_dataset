import React, { Component } from 'react';
import axios from 'axios';

//COMPONENTS
import UserInput from './components/user_input';
import Header from './components/header';
import MapComp from './components/mapComp';
import Footer from './components/footer';
import ThemeTime from './components/theme_time';


class App extends Component {  
    state= {
      response: [],
      post: '/bonn',
      status: '',
      dataLength: '',
      loading: false,
      lat: 42.364166,
      lng: 43.745002,
      zoom: 3
    }

  
   componentDidMount() {
    axios.get('/all')
    .then(result => {
      this.setState({response: result.data})
      this.setState({dataLength: result.data.length})
      this.setState({status: result.statusText});
    })
    .catch(err => console.log(err))
   }

handleChangeMain= (e) => {
  this.setState({post: e.target.value})
}

changeState(res){
  const resultLen = res.data.length;
  
  this.setState({status: res.statusText});
  this.setState({lng: res.data[0].metadata.location.coordinates[0]});
  this.setState({lat: res.data[0].metadata.location.coordinates[1]});
  this.setState({zoom:12})
  this.setState({loading: false});
      resultLen > 0 ?
      this.setState({response: res.data,dataLength: resultLen})
      : this.setState({dataLength: 0})
}

submitted (e) {
  e.preventDefault();
  this.setState({loading: true});
  axios.get(this.state.post)
    .then(result => {
      this.changeState(result);
    })
    .catch(err => {
      this.setState({loading: false});
      this.setState({status: err});
      this.setState({dataLength: 0});
      this.setState({response: []});
    }
      );
}


  render() {
    return (
      <div>
      <Header/>
      <div className="row">
      <UserInput postvalue = {this.state.post} 
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
