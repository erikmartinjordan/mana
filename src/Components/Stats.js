import React, { useState, useEffect }                                                                                                from 'react'
import { Link }                                                                                                                      from 'react-router-dom'
import moment                                                                                                                        from 'moment'
import Chart                                                                                                                         from 'chart.js/auto'
import { db, endAt, limitToLast, onValue, orderByKey, startAt, query, ref }                                                                          from '../Functions/Firebase'
import { getUsers, getSessions, getPageviews, getSessionDuration, getRealTimeUsers, getPageviewsSession, getBounceRate, getRanking } from '../Functions/Analytics'
import '../Styles/Stats.css'

const Stats = () => {
    
    const [bounceRate, setBounceRate]             = useState('0%')
    const [duration, setDuration]                 = useState(0)
    const [interval, setInterval]                 = useState(7)
    const [pageviewsSession, setPageviewsSession] = useState(0)
    const [ranking, setRanking]                   = useState([])
    const [realTimeUsers, setRealTimeUsers]       = useState(0)
    
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
                        
                    return values.length > 7 && index % 2 !== 0 ? null : this.getLabelForValue(value)

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
                    
                    return index % 2 === 0 ? value : null

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
                        
                        return index % 2 === 0 ? this.getLabelForValue(value) : null

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
                        
                        return index % 2 === 0 ? value : null

                    }
                }  
            }
        }
      } 
    }
    
    useEffect(() => {
        
        document.title = 'Estadísticas - Nomoresheet' 
        document.querySelector('meta[name="description"]').content = 'Algunas estadísticas sobre Nomoresheet' 
        
    })

    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])

    useEffect(() => {

        let today = moment().format('YYYYMMDD')

        let unsubscribe = onValue(ref(db, `analytics/${today}`), snapshot => {

            if(snapshot){

                let data = snapshot.val()
                
                let realTime = getRealTimeUsers(data)
                setRealTimeUsers(realTime)

            }

        })

        return () => unsubscribe()

    }, [])
    
    useEffect(() => {
        
        let canvas = document.getElementById('graph-1')
        let ctx = canvas.getContext('2d')
        let chart = new Chart(ctx, graph1)

        let iniDate = moment().subtract(interval - 1, 'days').format('YYYYMMDD')
        let endDate = moment().subtract(0,            'days').format('YYYYMMDD')
        
        onValue(query(ref(db, `analytics`), orderByKey(), startAt(iniDate), endAt(endDate)), snapshot => {
            
            if(snapshot){
                
                let data = snapshot.val()
                
                let days = Object.keys(data).map(date => moment(date).format('DD MMM'))
                
                let users = getUsers(data)
                let sessions = getSessions(data)
                let pageviews = getPageviews(data)
                let pageviewsSession = getPageviewsSession(pageviews, sessions)
                let avg = getSessionDuration(data)
                let bounceRate = getBounceRate(data)
                let ranking = getRanking(data)

                setDuration(avg)
                setPageviewsSession(pageviewsSession)
                setBounceRate(bounceRate)
                setRanking(ranking)

                graph1.data.labels = days
                graph1.data.datasets['0'].data = users
                graph1.data.datasets['1'].data = sessions
                graph1.data.datasets['2'].data = pageviews

                graph1.type = interval === 1 ? 'bar' : 'line'
                
                chart.update()
                
            }
            
        }, { onlyOnce: true })
        
        return () => {
            
            chart.destroy()
            
        }
        
    }, [interval])
    
    useEffect(() => {
        
        let canvas = document.getElementById('graph-2')
        let ctx = canvas.getContext('2d')
        let chart = new Chart(ctx, graph2)
        
        let unsubscribe = onValue(query(ref(db, `stats`), orderByKey(), limitToLast(12)), snapshot => {
            
            if(snapshot.val()){
                
                let stats = snapshot.val()
                
                let months = Object.keys(stats).map(e => moment(e).format('MMM YYYY'))
                let posts  = Object.values(stats).map(e => e.posts)
                
                graph2.data.labels = months
                graph2.data.datasets['0'].data = posts
                
                chart.update()
                
            }
            
        })
        
        return () => {
            
            unsubscribe()

            chart.destroy()

        }
        
        
    }, [])

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
    )
}

export default Stats