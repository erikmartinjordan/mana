import React, { useState, useEffect } from 'react';
import { Link }                       from 'react-router-dom';
import moment                         from 'moment';
import Chart                          from 'chart.js/auto';
import firebase                       from '../Functions/Firebase';
import '../Styles/Stats.css';

const Stats = () => {
    
    const [bounceRate, setBounceRate]             = useState('0%');
    const [days, setDays]                         = useState([]);
    const [duration, setDuration]                 = useState(0);
    const [interval, setInterval]                 = useState(7);
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
          borderWidth: 4,
          backgroundColor: 'rgba(72, 172, 152, 1)',
          borderRadius: 10,
          pointRadius: 0,
          data: []
        },{
          label: 'Sesiones',
          borderColor: '#778dff',
          borderWidth: 4,
          backgroundColor: 'rgba(119, 141, 255, 1)',
          borderRadius: 10,
          pointRadius: 0,
          data: []  
        },{
          label: 'Visitas',
          borderColor: '#1e99e6',
          borderWidth: 4,
          backgroundColor: 'rgba(30, 153, 230, 1)',
          borderRadius: 10,
          pointRadius: 0,
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
            display: true,
            grid: {
                display: false,
                drawBorder: false
            },
            offset: true,
            ticks: {
                autoSkip: true,
                rotation: 0,
                callback: function(value, index, values){ 
                        
                    return values.length > 7 && index % 2 !== 0 ? null : this.getLabelForValue(value);

                }
            }  
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            grid: {
                display: false,
                drawBorder: false
            },
            ticks: {
                rotation: 0,
                callback: function(value, index, values){ 
                    
                    return index % 2 === 0 ? value : null;

                }
            }
          }
        }
      }
    }
    
    let graph2 = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Publicaciones',
          borderColor: 'transparent',
          backgroundColor: 'rgba(72, 172, 152, 1)',
          borderWidth: 2,
          borderRadius: 10,
          borderSkipped: false,
          data: []         
        }],
      },
      options:{
        responsive: true,
        plugins:{
            legend:{
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    rotation: 0,
                    callback: function(value, index, values){ 
                        
                        return index % 2 === 0 ? this.getLabelForValue(value) : null;

                    }
                } 
            },
            y: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    rotation: 0,
                    callback: function(value, index, values){ 
                        
                        return index % 2 === 0 ? value : null;

                    }
                }  
            }
        }
      } 
    }
    
    useEffect(() => {
        
        document.title = 'Estadísticas - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'Algunas estadísticas sobre Nomoresheet'; 
        
    });

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);
    
    useEffect(() => {
        
        let canvas = document.getElementById('graph-1');
        let ctx = canvas.getContext('2d');
        let chart = new Chart(ctx, graph1);
        
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

        let iniDate = moment().subtract(interval - 1, 'days').format('YYYYMMDD');
        let endDate = moment().subtract(0,            'days').format('YYYYMMDD');
        
        let listener = firebase.database().ref(`analytics/`).orderByKey().startAt(iniDate).endAt(endDate).on('value', snapshot => {
            
            if(snapshot){
                
                let data = snapshot.val();
                
                let days = Object.keys(data).map(date => moment(date).format('DD MMM'));
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

                if(interval === 1)   graph1.type = 'bar';
                if(interval === 7)   graph1.type = 'line';
                if(interval === 30)  graph1.type = 'line';
                if(interval === 365) graph1.type = 'line';
                
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
        
        let listener = ref.orderByKey().limitToLast(12).on('value', snapshot => {
            
            if(snapshot.val()){
                
                let stats = snapshot.val();
                
                let months = Object.keys(stats).map(e => moment(e).format('MMM YYYY'));
                let posts  = Object.values(stats).map(e => e.posts);
                
                graph2.data.labels = months;
                graph2.data.datasets['0'].data = posts;
                
                chart.update();
                
            }
            
        });
        
        return () => {
            
            ref.off('value', listener);

            chart.destroy();

        }
        
        
    }, []);

    return (
        <div className = 'Estadisticas'>
            { interval === 1
            ? <h2>Estadísticas de hoy</h2>
            : <h2>Estadísticas de los últimos {interval} días</h2>
            }
            
            <div className = 'Fecha'>
                <button onClick = {() => setInterval(1)}   className = {interval === 1   ? 'Selected' : null}>Día</button>
                <button onClick = {() => setInterval(7)}   className = {interval === 7   ? 'Selected' : null}>Semana</button>
                <button onClick = {() => setInterval(30)}  className = {interval === 30  ? 'Selected' : null}>Mes</button>
                <button onClick = {() => setInterval(365)} className = {interval === 365 ? 'Selected' : null}>Año</button>
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