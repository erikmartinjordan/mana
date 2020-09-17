import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase';
import Chart                          from 'chart.js';

const ReputationGraph = (props) => {
    
    const [reputationGraph, setReputationGraph] = useState(null);
    
    let statsProperties = {
          drive: null,
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Puntos',
              borderColor: 'green',
              pointBorderWidth: 1,
              pointHoverRadius: 1,
              pointHoverBorderWidth: 1,
              pointRadius: 1,
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
                display: false,
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
                    padding: 5
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
    
    useEffect( () => {
        
        if(props.userUid){
            
            var ref = firebase.database().ref('users/' + props.userUid + '/reputationData');
            
            var listener = ref.orderByKey().limitToLast(20).on('value', snapshot => {
                
                if(snapshot.val()){
                    
                    let canvas = document.getElementById(`Graph-${props.canvas}`);
                    let ctx = canvas.getContext('2d');
                    let width = window.innerWidth;
                    let gradientStroke = ctx.createLinearGradient(0, 0, width, 0);
                    
                    gradientStroke.addColorStop(0.0, '#48ac98');
                    gradientStroke.addColorStop(0.2, '#778dff');
                    gradientStroke.addColorStop(0.5, '#f39a9a');
                    
                    statsProperties.data.datasets['0'].borderColor = gradientStroke;
                    
                    const dateArray = Object.keys(snapshot.val()).map( ts => {
                        
                        var date = new Date(parseInt(ts));
                        
                        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                        
                        return date.toLocaleDateString('es-ES', options);
                        
                    });
                    
                    statsProperties.data.labels = dateArray;
                    statsProperties.data.datasets['0'].data = Object.values(snapshot.val());
                    
                    new Chart(ctx, statsProperties);
                    
                    setReputationGraph(true);
                   
                }
                
            });
            
            return () => ref.off('value', listener);
            
        }
        
    }, [props.userUid, props.canvas, statsProperties]);
    
    return (
        <div className = 'Reputation' style = {{height: reputationGraph ? 'auto' : '0px'}}>
            <canvas id = {'Graph-' + props.canvas}/>
        </div>
    );
    
    
}

export default ReputationGraph;