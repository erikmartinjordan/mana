import React, { useState, useEffect }                                                                    from 'react'
import { Link }                                                                                          from 'react-router-dom'
import Loading                                                                                           from './Loading'
import { db,  endAt, get, limitToFirst, limitToLast, orderByChild, onValue, ref, query, runTransaction } from '../Functions/Firebase'
import '../Styles/RelatedContent.css'

const RelatedContent = ({ postId }) => {
    
    const [combo,   setCombo]   = useState([]) 
    const [random,  setRandom]  = useState([])
    const [related, setRelated] = useState([])
    const [update, setUpdate]   = useState(0)

    useEffect(() => {
        
        const getRandomPosts = async (num) => {

            // This is an ugly and provisional solution implemented because get function doesn't work properly so far
            // See https://stackoverflow.com/questions/69376211/combining-limittofirst-and-limittolast-leads-to-an-unexpected-behavior
            // Let's wait for an update
            onValue(query(ref(db, 'posts'), orderByChild('timeStamp'), limitToFirst(1)), snapshot_1 => {

                onValue(query(ref(db, 'posts'), orderByChild('timeStamp'), limitToLast(1)), snapshot_2 => {

                    let { timeStamp: ini } = Object.values(snapshot_1.val())[0]
                    let { timeStamp: end } = Object.values(snapshot_2.val())[0]

                    let ran = Math.floor(Math.random() * (end - ini + 1) + ini)

                    onValue(query(ref(db, 'posts'), orderByChild('timeStamp'), endAt(ran), limitToLast(num)), snapshot_3 => {
             
                        let posts = Object.entries(snapshot_3.val() || {}).map(([url, {title, replies}]) => ({url, title, replies})).reverse()
                            
                        setRandom(posts)

                    }, { onlyOnce: true })

                }, { onlyOnce: true })

            }, { onlyOnce: true })
            
        }
        
        getRandomPosts(5)
        
    }, [update])
    
    useEffect(() => {
        
        const getRelatedPosts = async (num) => {

            let related = (await get(query(ref(db, `posts/${postId}/related`), orderByChild('hits'), limitToFirst(num)))).val()
            
            if(related){
                
                let posts = Object.keys(related).map(async url => {

                    let title =   (await get(ref(db, `posts/${url}/title`))).val()
                    let replies = (await get(ref(db, `posts/${url}/replies`))).val()
                    
                    return { url, title, replies }

                })

                posts = await Promise.all(posts)
                
                setRelated(posts)
                
            }
            
        }
        
        getRelatedPosts(5)
        
    }, [update])
    
    useEffect(() => {    
        
        let group = new Set()
        
        let union = [...related, ...random]
        
        let unique = union.filter(post => {
            
            let urlTitle = JSON.stringify(post)
            
            let groupHasPost = group.has(urlTitle)
            
            group.add(urlTitle)
            
            return groupHasPost ? false : true
            
        })
        
        setCombo(unique)
        
    }, [random, related])
    
    const updateRelated = (relatedUrl) => {

        runTransaction(ref(db, `posts/${postId}/related/${relatedUrl}/hits`), value => value + 1)
        
        setUpdate(update + 1)
        
        window.scrollTo(0, 0)
        
    }
    
    return(
        <React.Fragment>
        { combo.length !== 0
        ? <div className = 'RelatedContent'>
            <span className = 'Title'>Relacionado</span>
            <div className = 'Links'>
                {combo.map(({url, title, replies}, key) => 
                    (<div key = {key} >
                        <Link onClick = {() => updateRelated(url)} to = {`/comunidad/post/${url}`} >{title}</Link>
                        <p>{Object.keys(replies || {}).length} {Object.keys(replies || {}).length === 1 ? 'respuesta' : 'respuestas'}</p>
                    </div>)
                )}
            </div>
          </div>
        : <Loading type = 'RelatedContent'/>
        }
        </React.Fragment>
    )
    
}

export default RelatedContent