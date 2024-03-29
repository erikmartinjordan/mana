import React, { useEffect }                                 from 'react'
import moment                                               from 'moment'
import Chart                                                from 'chart.js/auto'
import { db, limitToLast, onValue, orderByKey, query, ref } from '../Functions/Firebase'

const ReputationGraph = ({uid}) => {
    
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
            responsive: true,
            plugins: {
              title: {
                display: false
              },
              legend: {
                display: false
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
        },
        scales: {
          x: {
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
          },
          y: {
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
          }
        },
        responsive: true
        }
    }
    
    useEffect(() => {
        
        if(uid){
            
            let canvas = document.getElementById(`Graph`)
            let ctx = canvas.getContext('2d')
            let width = window.innerWidth
            let gradientStroke = ctx.createLinearGradient(0, 0, width, 0)
            
            gradientStroke.addColorStop(0.0, '#48ac98')
            gradientStroke.addColorStop(0.2, '#778dff')
            gradientStroke.addColorStop(0.5, '#f39a9a')
            
            statsProperties.data.datasets['0'].borderColor = gradientStroke
            
            let chart = new Chart(ctx, statsProperties)
            
            var unsubscribe = onValue(query(ref(db, `users/${uid}/reputationData`), orderByKey(), limitToLast(20)), snapshot => {
                
                if(snapshot.val()){
                    
                    let dates = Object.keys(snapshot.val()).map(timestamp => moment(+timestamp).format('DD-MM-YYYY'))
                    let data  = Object.values(snapshot.val())
                    
                    statsProperties.data.labels = dates
                    statsProperties.data.datasets['0'].data = data
                    
                    chart.update()
                   
                }
                
            })
            
            return () => {
                
                unsubscribe()

                chart.destroy()

            }
            
        }
        
    }, [uid])
    
    return (
        <div className = 'Reputation'>
            <canvas id = {'Graph'}/>
        </div>
    )
    
    
}

export default ReputationGraph