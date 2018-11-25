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
      loading: false
    }

  
   componentDidMount() {
    axios.get('/all')
    .then(result => {
      this.setState({response: result.data})
      this.setState({dataLength: result.data.length})
      this.setState({status: result.statusText});
      console.log(result)
    })
    .catch(err => console.log(err))
   }

handleChangeMain= (e) => {
  this.setState({post: e.target.value})
  //console.log(e.target.value)
}

submitted (e) {
  e.preventDefault();
  this.setState({loading: true});
  axios.get(this.state.post)
    .then(result => {
      const resultLen = result.data.length;
      this.setState({response: result.data});
      this.setState({status: result.statusText});
      this.setState({loading: false});
      resultLen > 0 ?
      this.setState({dataLength: resultLen})
      : this.setState({dataLength: 0})
      
      console.log(result)
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
      <MapComp />
      <ThemeTime post={this.state.response}/>
      </div>
      <Footer />
      </div>
    );
  }
}

export default App;
