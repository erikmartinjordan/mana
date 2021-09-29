import React, { useState, useEffect }                                                            from 'react'
import { Link }                                                                                  from 'react-router-dom'
import Loading                                                                                   from './Loading'
import { db, get, limitToFirst, limitToLast, orderByChild, ref, query, runTransaction, startAt } from '../Functions/Firebase'
import '../Styles/RelatedContent.css'

const RelatedContent = () => {
    
    const [combo,   setCombo]   = useState([]) 
    const [random,  setRandom]  = useState([])
    const [related, setRelated] = useState([])
    const [update, setUpdate]   = useState(0)
    const url                   = window.location.pathname.split('/').pop()
    
    useEffect(() => {
        
        const getRandomPosts = async (num) => {

            let snapshot_1 = await get(query(ref(db, 'posts'), orderByChild('timeStamp'), limitToFirst(1)))
            let snapshot_2 = await get(query(ref(db, 'posts'), orderByChild('timeStamp'), limitToLast(1)))
            
            let first = Object.values(snapshot_1.val())[0]
            let last  = first

            console.log(first)
            console.log(last)
            
            let randomTimeStamp = Math.floor( Math.random() * (last.timeStamp - first.timeStamp + 1) + first.timeStamp )
            
            let snapshot_3 = await get(query(ref(db, 'posts'), orderByChild('timeStamp'), startAt(randomTimeStamp), limitToFirst(num)))
            
            if(snapshot_3.val()){
             
                let posts = Object.entries(snapshot_3.val()).map(([url, {title, replies}]) => ({url, title, replies})).reverse()
                
                setRandom(posts)
                
            }
            
        }
        
        getRandomPosts(5)
        
    }, [update])
    
    useEffect(() => {
        
        const getRelatedPosts = async (num) => {

            let related = (await get(query(ref(db, `posts/${url}/related`), orderByChild('hits'), limitToFirst(num)))).val()
            
            if(related){
                
                let posts = Object.keys(related).map(async url => {

                    let title =   (await get(ref(db, `posts/${url}/title`))).val()
                    let replies = (await get(ref(db, `posts/${url}/replies`))).val()
                    
                    return {

                        url: url,
                        title: title,
                        replies: replies

                    }

                })

                posts = await Promise.all(posts)
                
                setRelated(posts)
                
            }
            
        }
        
        getRelatedPosts(5)
        
    }, [update, url])
    
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

        runTransaction(ref(db, `posts/${url}/related/${relatedUrl}/hits`), value => value + 1)
        
        setUpdate(update + 1)
        
        window.scrollTo(0, 0)
        
    }
    
    return(
        <React.Fragment>
        { combo.length !== 0
        ? <div className = 'RelatedContent'>
            <span className = 'Title'>Relacionado</span>
            <div className = 'Links'>
                {combo.map(({url, title, replies = {}}, key) => 
                    (<div key = {key} >
                        <Link onClick = {() => updateRelated(url)} to = {url} >{title}</Link>
                        <p>{Object.keys(replies).length} {Object.keys(replies).length === 1 ? 'comentario' : 'comentarios'}</p>
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