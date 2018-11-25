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
      responseToPost: ''
    }

  
  //  componentDidMount() {
  //   axios.get('/population')
  //   .then(response => {
  //     this.setState({response: response.data})
  //     console.log(response)
  //   })
  //   .catch(err => console.log(err))
  //  }

handleChangeMain= (e) => {
  this.setState({post: e.target.value})
  //console.log(e.target.value)
}

submitted (e) {
  e.preventDefault();
  axios.get(this.state.post)
    .then(result => {
      this.setState({response: result.data})
      console.log('Submitted successfully!!')
      console.log(this.state.response)
    })
    .catch(err => console.log(err))
}


  render() {
    return (
      <div>
      <Header/>
      <div className="row">
      <UserInput postvalue = {this.state.post} 
      handleChange={this.handleChangeMain}
      onSubmit = {this.submitted.bind(this)}
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
