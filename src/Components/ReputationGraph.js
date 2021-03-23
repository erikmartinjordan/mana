import React, { useState, useEffect } from 'react';
import moment                         from 'moment';
import Chart                          from 'chart.js';
import firebase                       from '../Functions/Firebase';

const ReputationGraph = ({uid}) => {
    
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
        tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
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
            display: false,
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
    
    useEffect(() => {
        
        if(uid){
            
            let canvas = document.getElementById(`Graph`);
            let ctx = canvas.getContext('2d');
            let width = window.innerWidth;
            let gradientStroke = ctx.createLinearGradient(0, 0, width, 0);
            
            gradientStroke.addColorStop(0.0, '#48ac98');
            gradientStroke.addColorStop(0.2, '#778dff');
            gradientStroke.addColorStop(0.5, '#f39a9a');
            
            statsProperties.data.datasets['0'].borderColor = gradientStroke;
            
            let chart = new Chart(ctx, statsProperties);
            
            var ref = firebase.database().ref(`users/${uid}/reputationData`);
            
            var listener = ref.orderByKey().limitToLast(20).on('value', snapshot => {
                
                if(snapshot.val()){
                    
                    let dates = Object.keys(snapshot.val()).map(timestamp => moment(+timestamp).format('DD-MM-YYYY'));
                    let data  = Object.values(snapshot.val());
                    
                    statsProperties.data.labels = dates;
                    statsProperties.data.datasets['0'].data = data;
                    
                    chart.update();
                   
                }
                
            });
            
            return () => ref.off('value', listener);
            
        }
        
    }, [uid]);
    
    return (
        <div className = 'Reputation'>
            <canvas id = {'Graph'}/>
        </div>
    );
    
    
}

export default ReputationGraph;