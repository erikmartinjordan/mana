import React, { useState, useEffect } from 'react';
import firebase                       from '../Functions/Firebase';
import Chart                          from 'chart.js'; 
import '../Styles/Acerca.css';

const Estadisticas = () => {
    
    const [days, setDays]           = useState(null);
    const [duration, setDuration]   = useState(null);
    const [pageviews, setPageviews] = useState(null);
    const [sessions, setSessions]   = useState(null);
    const [users, setUsers]         = useState(null);
    
    let object = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Usuarios',
          borderColor: 'blue',
          borderWidth: 3,
          backgroundColor: 'blue',
          data: []
        },{
          label: 'Sesiones',
          borderColor: 'pink',
          borderWidth: 3,
          backgroundColor: 'pink',
          data: []  
        },{
          label: 'Visitas',
          borderColor: 'red',
          borderWidth: 3,
          backgroundColor: 'red',
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
          display: true  
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
                display: true
            }
          }]
        },
        responsive: true
      }
    }
    
    useEffect( () => {
        
        // Meta and title
        document.title = 'Estadísticas - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'Algunas estadísticas sobre Nomoresheet'; 
        
        // Emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });
    
    useEffect( () => {
        
        let canvas = document.querySelector('canvas');
        let ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        
        // Getting labels and data
        object.data.labels = days;
        object.data.datasets['0'].data = users;
        object.data.datasets['1'].data = sessions;
        object.data.datasets['2'].data = pageviews;
        
        // Drawing chart 
        if(days && users && sessions && pageviews) {
            
            new Chart(ctx, object); 
        } 
        
    }, [days, users, sessions, pageviews]);
    
    useEffect( () => {
        
        // Return number of users
        const getUsers = (data) => {
            
            // [users_day1, users_day2, ... , users_dayN]
            let users = [];
            
            Object.keys(data).map(day => {
                
                // Pushing number of users per day
                users.push(Object.keys(data[day]).length);
                
            });
                
            return users;
            
        }
        
        // Return number of sessions
        const getSessions = (data) => {
            
            // [sessions_day1, sessions_day2, ... , sessions_dayN]
            let sessions = [];
            
            Object.keys(data).map(day => {
                
                let count = 0; 
                
                // Iteration over each day
                Object.keys(data[day]).map(uid => {
                    
                    count = count + Object.keys(data[day][uid]).length;
                    
                });
                
                // Pushing total number of sessions per day
                sessions.push(count);
                
            });
            
            return sessions;
        }
        
        // Return number of pageviews
        const getPageviews = (data) => {
            
            // [pageviews_day1, pageviews_day2, ... , pageviews_dayN]
            let pageviews = [];
            
            Object.keys(data).map(day => {
                
                let count = 0; 
                
                // Iteration over each day
                Object.keys(data[day]).map(uid => {
                    
                    Object.keys(data[day][uid]).map(session => {
                        
                        count = count + Object.keys(data[day][uid][session].pageviews).length;
                        
                    });
                    
                });
                
                // Pushing total number of sessions per day
                pageviews.push(count);
                
            });
            
            
            return pageviews;
            
        }
        
        // Return average session duration in ms
        const getSessionDuration = (data) => {
            
            let duration = [];
            
            Object.keys(data).map(day => {
                
                // push data[day][user_1][session_1].timeStampEnd - data[day][user_1][session_1].timeStampIni
                // push data[day][user_1][session_2].timeStampEnd - data[day][user_1][session_1].timeStampIni
                Object.keys(data[day]).map(uid => {
                    
                    Object.keys(data[day][uid]).map(session => {
                        
                        duration.push(data[day][uid][session].timeStampEnd - data[day][uid][session].timeStampIni);
                    
                    });
                    
                });
                
            });
            
            return duration.reduce( (a,b) => a + b)/duration.length;
            
        }
        
        // Reading info from the database
        firebase.database().ref(`analytics/`).limitToLast(30).on('value', snapshot => {
            
            if(snapshot){
                
                // Getting the json
                let data = snapshot.val();
                
                // Getting the days
                let days = Object.keys(data);
                
                // Getting number of users
                let users = getUsers(data);
                
                // Getting number of sessions
                let sessions = getSessions(data);
                
                // Getting number of pageviews
                let pageviews = getPageviews(data);
                
                // Getting average sessiond duration
                let avg = getSessionDuration(data);
                
                setDays(days);
                setUsers(users);
                setSessions(sessions);
                setPageviews(pageviews);
                setDuration(avg);
                
            }
            
            
        });
        
        
    }, []);

    return (
        <div className = 'Estadisticas'>
            <h2>Estadísticas de los últimos 30 días</h2>
            
            <div className = 'Datos'>
                <canvas/>
            </div>
            
        </div>
    );

}

export default Estadisticas;
