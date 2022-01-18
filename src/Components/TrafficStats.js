import { useEffect, useState }                                                               from 'react'
import { useHistory }                                                                        from 'react-router-dom'
import Fingerprint                                                                           from 'fingerprintjs'
import moment                                                                                from 'moment'
import { db, goOnline, goOffline, onDisconnect, onValue, ref, push, runTransaction, update } from '../Functions/Firebase'

let fingerprint = new Fingerprint().get()
let date  = moment()

const TrafficStats = () => {    
    
    const [sessionId, setSessionId] = useState(null)
    const history                   = useHistory()
    
    useEffect(() => {
        
        let sessionId = push(ref(db, `analytics/${date.format('YYYYMMDD')}/${fingerprint}`)).key
        
        let timeStamp = { 
            timeStampIni: date.valueOf(), 
            timeStampEnd: date.valueOf()
        }

        update(ref(db, `analytics/${date.format('YYYYMMDD')}/${fingerprint}/${sessionId}`), timeStamp)
        
        setSessionId(sessionId)
        
    }, [])
    
    useEffect(() => {
        
        if(sessionId && !history.location.pathname.includes('token')){

            push(ref(db, `analytics/${date.format('YYYYMMDD')}/${fingerprint}/${sessionId}/pageviews`), { url: history.location.pathname })
            
        }
        
    }, [sessionId, history.location.pathname])
    
    useEffect(() => {
        
        var scrollListener
                
        if(sessionId){
            
            scrollListener = window.addEventListener('scroll', () => {

                runTransaction(ref(db, `analytics/${date.format('YYYYMMDD')}/${fingerprint}/${sessionId}/timeStampEnd`), _ => (new Date()).getTime() )
                
            })
        }
        
        return () => window.removeEventListener('scroll', scrollListener) 
        
    }, [sessionId, history.location.pathname])


    useEffect(() => {

        const onIdleTabGoOffline = (ms) => {

            let timer

            document.addEventListener('visibilitychange', () => {
    
                if(document.hidden){
        
                    timer = setTimeout(() => goOffline(db), ms)
        
                }
                else{
        
                    clearTimeout(timer)
    
                    goOnline(db)
        
                }
        
            })

        }

        onValue(ref(db, '.info/connected'), snapshot => {
            
            if (snapshot.val()) {

                let con = push(ref(db, 'concurrent'), { connected: 'a__' + moment().format('DD/MM/YYYY HH:mm') })

                onDisconnect(con).remove()

                onIdleTabGoOffline(10 * 60 * 1000)

            }
        })          
        
    }, [])
    
    return null
    
}

export default TrafficStats