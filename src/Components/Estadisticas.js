import React, { useState, useEffect } from 'react';
import { Link }                       from 'react-router-dom';
import firebase                       from '../Functions/Firebase';
import Chart                          from 'chart.js'; 
import '../Styles/Estadisticas.css';

const Estadisticas = () => {
    
    const [bounceRate, setBounceRate]             = useState('0%');
    const [days, setDays]                         = useState([]);
    const [duration, setDuration]                 = useState(0);
    const [interval, setInterval]                 = useState(1);
    const [pageviews, setPageviews]               = useState([]);
    const [pageviewsSession, setPageviewsSession] = useState(0);
    const [ranking, setRanking]                   = useState([]);
    const [realTimeUsers, setRealTimeUsers]       = useState(0);
    const [sessions, setSessions]                 = useState([]);
    const [users, setUsers]                       = useState([]);
    
    console.log(`Interval ${interval}`)
    console.log(ranking);
    
    let graph1 = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Usuarios',
          borderColor: '#48ac98',
          borderWidth: 2,
          backgroundColor: 'rgba(72, 172, 152, 0.6)',
          data: []
        },{
          label: 'Sesiones',
          borderColor: '#778dff',
          borderWidth: 2,
          backgroundColor: 'rgba(119, 141, 255, 0.6)',
          data: []  
        },{
          label: 'Visitas',
          borderColor: '#1e99e6',
          borderWidth: 2,
          backgroundColor: 'rgba(30, 153, 230, 0.6)',
          data: []           
        }]
      },
      options: {
        animation: false,
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
        
        let canvas = document.getElementById('graph-1');
        let ctx    = canvas.getContext('2d');
        let width  = window.innerWidth;
        
        // Getting labels and data
        graph1.data.labels = days;
        graph1.data.datasets['0'].data = users;
        graph1.data.datasets['1'].data = sessions;
        graph1.data.datasets['2'].data = pageviews;
        
        // Drawing chart 
        if(days && users && sessions && pageviews) {
            
            new Chart(ctx, graph1); 
        } 
        
    }, [days, users, sessions, pageviews]);
    
    useEffect( () => {
        
        // Return name of the month
        const getMonth = (number) => {
            
            let name;
            
            switch(parseInt(number)){
                case 1: name = 'ene'; break;
                case 2: name = 'feb'; break;
                case 3: name = 'mar'; break;
                case 4: name = 'abr'; break;
                case 5: name = 'may'; break;
                case 6: name = 'jun'; break;
                case 7: name = 'jul'; break;
                case 8: name = 'ago'; break;
                case 9: name = 'sep'; break;
                case 10: name ='oct'; break;
                case 11: name ='nov'; break;
                case 12: name ='dic'; break;
            }
            
            return name;
            
        }
        
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
                        
                        console.log(session);
                        console.log(Object.keys(data[day][uid][session]));
                        console.log(Object.keys(data[day][uid][session].pageviews));
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
                        
                        let sec = (data[day][uid][session].timeStampEnd - data[day][uid][session].timeStampIni)/1000;
                        
                        duration.push(sec);
                    
                    });
                    
                });
                
            });
            
            let avg = duration.reduce( (a,b) => a + b)/duration.length;
            
            return `${Math.floor(avg / 60)} min ${Math.floor(avg % 60)} seg`;
            
        }
        
        // Return real-time users
        const getRealTimeUsers = (data) => {
            
            let realTimeUsers = 0;
            
            let now = (new Date()).getTime();
            
            Object.keys(data).map(day => {
                
                Object.keys(data[day]).map(uid => {
                    
                    let realTimeSession = false;
                    
                    Object.keys(data[day][uid]).map(session => {
                        
                        // We count as connected users all the sessions active within the last
                        // 5 minutes
                        if(now - data[day][uid][session].timeStampEnd <= 5 * 60 * 1000)
                            realTimeSession = true
                        
                    });
                    
                    if(realTimeSession) realTimeUsers ++;
                    
                });
                
            });
            
            return realTimeUsers;
            
        }
        
        // Return pageviews per session
        const getPageviewsSession = (pageviews, sessions) => {
            
            let res = 0;
            
            if(pageviews && sessions)
                res = pageviews.reduce( (a, b) => a + b, 0) / sessions.reduce( (a, b) => a + b, 0);
            
            return res.toFixed(2);
            
        }
        
        // Return bounce rate
        const getBounceRate = (data) => {
            
            let bounced = 0;
            let total = 0;
            
            Object.keys(data).map(day => {
                
                Object.keys(data[day]).map(uid => {
                    
                    Object.keys(data[day][uid]).map(session => {
                        
                        // We count users who didn't do scrolling
                        if(data[day][uid][session].timeStampIni === data[day][uid][session].timeStampEnd)
                            bounced ++;
                        
                        total ++;
                        
                    });
                    
                });
                
            });
            
            return `${ (100 * bounced / total).toFixed(2) }%`;
            
            
        }
        
        // Return ranking of url's and pageviews
        const getRanking = (data) => {
            
            let array = [];
            
            Object.keys(data).map(day => {
                
                Object.keys(data[day]).map(uid => {
                    
                    Object.keys(data[day][uid]).map(session => {
                        
                        Object.keys(data[day][uid][session].pageviews).map(pid => {
                            
                            array.push(data[day][uid][session].pageviews[pid].url);
                            
                        });
                        
                    });
                    
                });
                
            });
            
            // Remove duplicates
            let unique = [...new Set(array)];
            
            // Counting duplicates
            let duplicates  = unique.map(value => [value, array.filter(url => url === value).length ]);
            
            // Sort by second parameter
            return duplicates.sort((a, b) => b[1] - a[1]);
        }
        
        // Reading info from the database
        let listener = firebase.database().ref(`analytics/`).limitToLast(interval).on('value', snapshot => {
            
            if(snapshot){
                
                // Getting the json
                let data = snapshot.val();
                console.log(data);
                
                // Getting the days
                let days = Object.keys(data).map(date => `${date.substr(6, 2)} ${getMonth(date.substr(4, 2))}`);
                setDays(days);
                
                // Getting number of users
                let users = getUsers(data);
                setUsers(users);
                
                // Getting number of sessions
                let sessions = getSessions(data);
                setSessions(sessions);
                
                // Getting number of pageviews
                let pageviews = getPageviews(data);
                setPageviews(pageviews);
                
                // Getting average sessiond duration
                let avg = getSessionDuration(data);
                setDuration(avg);
                
                // Getting real-time users
                let realTime = getRealTimeUsers(data);
                setRealTimeUsers(realTime);
                
                // Getting pageviews/session
                let pageviewsSession = getPageviewsSession(pageviews, sessions);
                setPageviewsSession(pageviewsSession);
                
                // Getting bounce rate
                let bounceRate = getBounceRate(data);
                setBounceRate(bounceRate);
                
                // Get ranking
                let ranking = getRanking(data);
                setRanking(ranking);
            }
            
            
        });
        
        return () => firebase.database().ref(`analytics/`).off('value', listener);
        
        
    }, [interval]);

    return (
        <div className = 'Estadisticas'>
            { interval === 1
            ? <h2>Estadísticas de hoy</h2>
            : <h2>Estadísticas de los últimos {interval} días</h2>
            }
            
            <div className = 'Fecha'>
                <button onClick = {() => setInterval(1)}   className = {interval === 1   ? 'Selected' : null}>Día</button>
                <button onClick = {() => setInterval(30)}  className = {interval === 30  ? 'Selected' : null}>Mes</button>
                <button onClick = {() => setInterval(365)} className = {interval === 365 ? 'Selected' : null}>Año</button>
            </div>
            
            <div className = 'Parrilla'>
                <div className = 'Datos'>
                    <div className = 'Titulo'>Tiempo real</div>
                    <div className = 'Desc'>{realTimeUsers}</div>
                </div>
                <div className = 'Datos'>
                    <div className = 'Titulo'>Páginas/sesión</div>
                    <div className = 'Desc'>{pageviewsSession}</div>
                </div>
                <div className = 'Datos'>
                    <div className = 'Titulo'>Tiempo medio sesión</div>
                    <div className = 'Desc'>{duration}</div>
                </div>
                <div className = 'Datos'>
                    <div className = 'Titulo'>Porcentaje de rebote</div>
                    <div className = 'Desc'>{bounceRate}</div>
                </div>
            </div>
            
            <div className = 'Graficos'>
                <canvas id = 'graph-1'/>
            </div>
            
            { interval === 1
            ? <h3>Lo más visto de hoy</h3>
            : <h3>Lo más visto de los últimos {interval} días</h3>
            }
            <div className = 'Ranking'>
                <div className = 'Row'>
                    <div className = 'Url'>URL</div>
                    <div className = 'Visitas'>Visitas</div>
                </div>
                {ranking.map(elem => <div className = 'Row'>
                                            <div className = 'Url'><Link to = {elem[0]}>{elem[0]}</Link></div>
                                            <div className = 'Visitas'>{elem[1]}</div>
                                    </div>)
                }
            </div>
            
        </div>
    );

}

export default Estadisticas;
