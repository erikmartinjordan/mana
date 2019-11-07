import React, { useState, useEffect }   from 'react';
import Chart                            from 'chart.js';
import firebase, { auth }               from '../Functions/Firebase';

const Users = () => {

    let object = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Usuarios',
          borderColor: 'blue',
          pointBorderWidth: 3,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
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
            display: false,
            position: "left",
            gridLines: {
                display: false
            }
          }]
        },
        responsive: true
      }
    }
    
    useEffect( () => {

        let canvas = document.querySelector('canvas');
        let ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let gradientStroke = ctx.createLinearGradient(0, 0, width, 0);
        
        // Generating gradient color  
        gradientStroke.addColorStop(0, '#00d2ff');
        gradientStroke.addColorStop(0.5, '#3a7bd5');
        
        // Setting gradient stroke  
        object.data.datasets['0'].borderColor = gradientStroke;  
        
        // Getting the number of users
        firebase.database().ref('stats/').on('value', snapshot => {
            
            if(snapshot.val()) {
                // Declaring data
                let json = snapshot.val();
                
                // Getting labels and data
                let labels = Object.keys(json).map( date => date.slice(6, 8) + '-' + date.slice(4, 6) + '-' + date.slice(0, 4));
                let data   = Object.keys(json).map( date => Object.keys(json[date]).length);
                
                // Modifiying labels and data
                object.data.labels = labels.slice(-7);
                object.data.datasets['0'].data = data.reverse().slice(-7);
            
                // Drawing chart  
                new Chart(ctx, object);  
                
            }
            
        }); 
        
    }, []);

    return <canvas/>
}

export default Users