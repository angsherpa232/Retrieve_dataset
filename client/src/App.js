import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import UserInput from './components/user_input';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state= {
      response: [],
      post: '/home/sweet',
      responseToPost: ''
    }

  }
  
  // componentDidMount() {
  //   axios.get('/munster')
  //   .then(response => {
  //     //this.setState({response: response})
  //     console.log(response)
  //   })
  //   .catch(err => console.log(err))
  // }

handleChangeMain= (e) => {
  this.setState({post: e.target.value})
  //console.log(e.target.value)
}

submitted (e) {
  e.preventDefault();
  axios.get(this.state.post)
    .then(result => {
      this.setState({response: result.data})
      console.log('THis is ', result)
    })
    .catch(err => console.log(err))
}


  render() {
    return (
      <div className="App">
      <p>{this.state.post}</p>
      This is nasty {this.state.post}
      <UserInput postvalue = {this.state.post} 
      handleChange={this.handleChangeMain}
      onSubmit = {this.submitted.bind(this)}
      />
      </div>
    );
  }
}

export default App;
