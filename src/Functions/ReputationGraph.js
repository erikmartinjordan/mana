import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase';
import Chart                          from 'chart.js';

const ReputationGraph = (props) => {
        
    // Properties
    let statsProperties = {
          drive: null,
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Reputation',
              borderColor: 'green',
              pointBorderWidth: 0,
              pointHoverRadius: 0,
              pointHoverBorderWidth: 0,
              pointRadius: 0,
              backgroundColor: 'rgba(0, 210, 255, 0)',
              data: []
            }]
          },
          options: {
            title: {
              display: false,
              text: 'Visitors',
              fontSize: 20
            },
            legend:{
              display: false  
            },
            scales: {
              xAxes: [{
                display: true,
                gridLines: {
                    drawTicks: false,
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45,
                    maxTicksLimit: 4,
                    padding: 20
                }  
              }],
              yAxes: [{
                type: 'linear',
                display: true,
                position: 'left',
                gridLines: {
                    drawTicks: false,
                    display: false,
                    drawBorder: false
                },
                ticks:{
                    maxTicksLimit: 3,
                    padding: 20
                }
              }]
            },
            responsive: true
        }
    };
    
    //  Views Stats
    useEffect( () => {
        
        let canvas = document.getElementById('Graph');
        let ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let gradientStroke = ctx.createLinearGradient(0, 0, width, 0);
        
        // Generating gradient color  
        gradientStroke.addColorStop(0.0, '#48ac98');
        gradientStroke.addColorStop(0.2, '#778dff');
        gradientStroke.addColorStop(0.5, '#f39a9a');
        
        // Setting gradient stroke  
        statsProperties.data.datasets['0'].borderColor = gradientStroke;
        
        if(props.userUid){
            
            firebase.database().ref('users/' + props.userUid + '/reputationData').on('value', snapshot => {
                
                if(snapshot.val()){
                    
                    // Modifiying labels and data
                    const dateArray = Object.keys(snapshot.val()).map( ts => {
                        
                        // Getting the date
                        var date = new Date(parseInt(ts));
                        
                        // Defining options
                        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                        
                        // Formatting date
                        return date.toLocaleDateString('es-ES', options);
                        
                        
                    });
                    
                    // Adding x and y axes
                    statsProperties.data.labels = dateArray;
                    statsProperties.data.datasets['0'].data = Object.values(snapshot.val());
                
                    // Drawing chart  
                    new Chart(ctx, statsProperties);
                }
                
            });
        }

        
    }, [props.userUid]);
    
    return (
        <div className = 'Reputation'>
            <canvas id = 'Graph'/>
        </div>
    );
    
    
}

export default ReputationGraph;