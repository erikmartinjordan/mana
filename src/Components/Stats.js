import React, { useState, useEffect } from 'react';
import { Link }                       from 'react-router-dom';
import moment                         from 'moment';
import Chart                          from 'chart.js'; 
import firebase                       from '../Functions/Firebase';
import '../Styles/Stats.css';

const Stats = () => {
    
    const [bounceRate, setBounceRate]             = useState('0%');
    const [days, setDays]                         = useState([]);
    const [duration, setDuration]                 = useState(0);
    const [interval, setInterval]                 = useState(1);
    const [months, setMonths]                     = useState(null);
    const [pageviews, setPageviews]               = useState([]);
    const [pageviewsSession, setPageviewsSession] = useState(0);
    const [posts, setPosts]                       = useState(null);
    const [ranking, setRanking]                   = useState([]);
    const [realTimeUsers, setRealTimeUsers]       = useState(0);
    const [sessions, setSessions]                 = useState([]);
    const [users, setUsers]                       = useState([]);
    
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
            display: true,
            gridLines: {
                display: false,
            },
            ticks: {
                autoSkip: true,
                maxRotation: 45,
                minRotation: 45,
                callback: (value, index, values) => values.length > 7 && index % 2 !== 0 ? null : value
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
    
    let graph2 = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Publicaciones',
          borderColor: '#48ac98',
          borderWidth: 2,
          backgroundColor: 'rgba(72, 172, 152, 0.6)',
          data: []         
        }],
        responsive: true
      } 
    }
    
    useEffect(() => {
        
        document.title = 'Estadísticas - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'Algunas estadísticas sobre Nomoresheet'; 
        
    });
    
    useEffect(() => {
        
        let canvas = document.getElementById('graph-1');
        let ctx = canvas.getContext('2d');
        let chart = new Chart(ctx, graph1);
        
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
                default: break;
            }
            
            return name;
            
        }
        
        const getUsers = (data) => {
            
            let users = [];
            
            Object.keys(data).forEach(day => {
                
                users.push(Object.keys(data[day]).length);
                
            });
            
            return users;
            
        }
        
        const getSessions = (data) => {
            
            let sessions = [];
            
            Object.keys(data).forEach(day => {
                
                let count = 0; 
                
                Object.keys(data[day]).forEach(uid => {
                    
                    count = count + Object.keys(data[day][uid]).length;
                    
                });
                
                sessions.push(count);
                
            });
            
            return sessions;
        }
        
        const getPageviews = (data) => {
            
            let pageviews = [];
            
            Object.keys(data).forEach(day => {
                
                let count = 0; 
                
                Object.keys(data[day]).forEach(uid => {
                    
                    Object.keys(data[day][uid]).forEach(session => {
                        
                        if(data[day][uid][session].pageviews)
                            count = count + Object.keys(data[day][uid][session].pageviews).length;
                        
                    });
                    
                });
                
                pageviews.push(count);
                
            });
            
            
            return pageviews;
            
        }
        
        const getSessionDuration = (data) => {
            
            let duration = [];
            
            Object.keys(data).forEach(day => {
                
                Object.keys(data[day]).forEach(uid => {
                    
                    Object.keys(data[day][uid]).forEach(session => {
                        
                        let sec = (data[day][uid][session].timeStampEnd - data[day][uid][session].timeStampIni)/1000;
                        
                        if(!isNaN(sec)) duration.push(sec);
                    
                    });
                    
                });
                
            });
            
            let avg = duration.reduce( (a,b) => a + b)/duration.length;
            
            return `${Math.floor(avg / 60)} min ${Math.floor(avg % 60)} seg`;
            
        }
        
        const getRealTimeUsers = (data) => {
            
            let realTimeUsers = 0;
            
            let now = (new Date()).getTime();
            
            Object.keys(data).forEach(day => {
                
                Object.keys(data[day]).forEach(uid => {
                    
                    let realTimeSession = false;
                    
                    Object.keys(data[day][uid]).forEach(session => {
                        
                        if(now - data[day][uid][session].timeStampEnd <= 5 * 60 * 1000){
                            
                            realTimeSession = true;
                            
                        }
                        
                    });
                    
                    if(realTimeSession) realTimeUsers ++;
                    
                });
                
            });
            
            return realTimeUsers;
            
        }
        
        const getPageviewsSession = (pageviews, sessions) => {
            
            let res = 0;
            
            if(pageviews && sessions)
                res = pageviews.reduce( (a, b) => a + b, 0) / sessions.reduce( (a, b) => a + b, 0);
            
            return res.toFixed(2);
            
        }
        
        const getBounceRate = (data) => {
            
            let bounced = 0;
            let total = 0;
            
            Object.keys(data).forEach(day => {
                
                Object.keys(data[day]).forEach(uid => {
                    
                    Object.keys(data[day][uid]).forEach(session => {
                        
                        if(data[day][uid][session].timeStampIni === data[day][uid][session].timeStampEnd)
                            bounced ++;
                        
                        total ++;
                        
                    });
                    
                });
                
            });
            
            return `${ (100 * bounced / total).toFixed(2) }%`;
            
        }
        
        const getRanking = (data) => {
            
            let array = [];
            
            Object.keys(data).forEach(day => {
                
                Object.keys(data[day]).forEach(uid => {
                    
                    Object.keys(data[day][uid]).forEach(session => {
                        
                        if(data[day][uid][session].pageviews){
                            
                            Object.keys(data[day][uid][session].pageviews).forEach(pid => {
                                
                                array.push(data[day][uid][session].pageviews[pid].url);
                                
                            });
                            
                        }
                        
                    });
                    
                });
                
            });
            
            let unique = [...new Set(array)];
            
            let duplicates  = unique.map(value => [value, array.filter(url => url === value).length ]);
            
            return duplicates.sort((a, b) => b[1] - a[1]);
        }
        
        let listener = firebase.database().ref(`analytics/`).orderByKey().limitToLast(interval).on('value', snapshot => {
            
            if(snapshot){
                
                let data = snapshot.val();
                
                let days = Object.keys(data).map(date => `${date.substr(6, 2)} ${getMonth(date.substr(4, 2))}`);
                setDays(days);
                
                let users = getUsers(data);
                setUsers(users);
                
                let sessions = getSessions(data);
                setSessions(sessions);
                
                let pageviews = getPageviews(data);
                setPageviews(pageviews);
                
                let avg = getSessionDuration(data);
                setDuration(avg);
                
                let realTime = getRealTimeUsers(data);
                setRealTimeUsers(realTime);
                
                let pageviewsSession = getPageviewsSession(pageviews, sessions);
                setPageviewsSession(pageviewsSession);
                
                let bounceRate = getBounceRate(data);
                setBounceRate(bounceRate);
                
                let ranking = getRanking(data);
                setRanking(ranking);
                
                graph1.data.labels = days;
                graph1.data.datasets['0'].data = users;
                graph1.data.datasets['1'].data = sessions;
                graph1.data.datasets['2'].data = pageviews;
                
                chart.update();
                
            }
            
        });
        
        return () => {
            
            firebase.database().ref(`analytics/`).off('value', listener);
            
            chart.destroy();
            
        }
        
    }, [interval]);
    
    useEffect(() => {
        
        let canvas = document.getElementById('graph-2');
        let ctx = canvas.getContext('2d');
        let chart = new Chart(ctx, graph2);
        
        let ref = firebase.database().ref(`stats`);
        
        let listener = ref.on('value', snapshot => {
            
            if(snapshot.val()){
                
                let stats = snapshot.val();
                
                let months = Object.keys(stats).map(e => moment(e).format('MMM YYYY'));
                let posts  = Object.values(stats).map(e => e.posts);
                
                graph2.data.labels = months;
                graph2.data.datasets['0'].data = posts;
                
                chart.update();
                
            }
            
        });
        
        return () => ref.off('value', listener);
        
        
    }, []);

    return (
        <div className = 'Estadisticas'>
            { interval === 1
            ? <h2>Estadísticas de hoy</h2>
            : <h2>Estadísticas de los últimos {interval} días</h2>
            }
            
            <div className = 'Fecha'>
                <button onClick = {() => setInterval(1)}   className = {interval === 1  ? 'Selected' : null}>Día</button>
                <button onClick = {() => setInterval(7)}   className = {interval === 7  ? 'Selected' : null}>Semana</button>
                <button onClick = {() => setInterval(30)}  className = {interval === 30 ? 'Selected' : null}>Mes</button>
            </div>
            
            <div className = 'Parrilla'>
                <div className = 'Datos'>
                    <div className = 'Titulo'>
                        Tiempo real 
                        <div className = 'Pulse'></div>
                    </div>
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
                {ranking.slice(0, 10).map((elem, key) => (
                    <div className = 'Row' key = {key}>
                        <div className = 'Url'><Link to = {elem[0]}>{elem[0]}</Link></div>
                        <div className = 'Visitas'>{elem[1]}</div>
                    </div>)
                )}
            </div>
            
            <h3>Publicaciones totales</h3>
            <div className = 'Publicaciones'>
                <canvas id = 'graph-2'/>
            </div>
            
        </div>
    );
}

export default Stats;