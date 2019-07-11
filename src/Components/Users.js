import React, { Component } from 'react';
import firebase, { auth }   from '../Functions/Firebase';
import Fingerprint from 'fingerprintjs';
import Chart from 'chart.js';

class Users extends Component {

  state = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Usuarios',
          borderColor: 'blue',
          pointBorderWidth: 8,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 1,
          pointRadius: 0.5,
          backgroundColor: 'rgba(0, 210, 255, 0.05)',
          data: []
        }]
      },
      options: {
        title: {
          display: false,
          text: 'Visitantes',
          fontSize: 20
        },
        legend:{
          display: false  
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
                display: false,
            },
            ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45
            }  
          }],
          yAxes: [{
            type: "linear",
            display: true,
            position: "left",
            gridLines: {
                display: false
            }
          }]
        },
        responsive: true
      }
  }
    
  componentDidMount = () => {

    let object = this.state;  
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let gradientStroke = ctx.createLinearGradient(0, 0, width, 0);
    let fingerprint = new Fingerprint().get();
    let date = new Date();
    let day = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
      
    // Adding fingerprint to database
    firebase.database().ref('stats/' + `/${year}${month}${day}/` + `/${fingerprint}` + '/visits/' ).transaction( value => value + 1 );
      
    // Getting the number of users
    firebase.database().ref('stats/').on('value', snapshot => {
        
        if(snapshot.val()) {
            // Declaring data
            let json = snapshot.val();
            
            // Getting labels and data
            let labels = Object.keys(json).map( date => date.slice(6, 8) + '-' + date.slice(4, 6) + '-' + date.slice(0, 4));
            let data   = Object.keys(json).map( date => Object.keys(json[date]).length);
            
            // Modifiying labels and data
            object.data.labels = labels;
            object.data.datasets['0'].data = data;
                                    
            // Updating state  
            this.setState({ object });  
        }
        
    }); 
    

    // Generating gradient color  
    gradientStroke.addColorStop(0, '#00d2ff');
    gradientStroke.addColorStop(0.5, '#3a7bd5');

    // Setting gradient stroke  
    object.data.datasets['0'].borderColor = gradientStroke;      

    // Drawing chart  
    new Chart(ctx, this.state);      
  }

  componentDidUpdate = () => {
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    new Chart(ctx, this.state);       
  }

  render() {
    return <canvas/>
  }
}

export default Users