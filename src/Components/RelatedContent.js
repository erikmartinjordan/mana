import React, { useState, useEffect } from 'react';
import { Link }                       from 'react-router-dom';
import Loading                        from './Loading';
import firebase                       from '../Functions/Firebase';
import '../Styles/RelatedContent.css';

const RelatedContent = () => {
    
    const [combo,   setCombo]   = useState([]); 
    const [random,  setRandom]  = useState([]);
    const [related, setRelated] = useState([]);
    const [update, setUpdate]   = useState(0);
    const url                   = window.location.pathname.split('/').pop();
    
    useEffect(() => {
        
        const getRandomPosts = async (num) => {
            
            let ref = firebase.database().ref('posts');
            
            let snapshot_1 = await ref.orderByChild('timeStamp').limitToFirst(1).once('value');
            let snapshot_2 = await ref.orderByChild('timeStamp').limitToLast(1).once('value');
            
            let first = Object.values(snapshot_1.val())[0];
            let last  = Object.values(snapshot_2.val())[0];
            
            let randomTimeStamp = Math.floor( Math.random() * (last.timeStamp - first.timeStamp + 1) + first.timeStamp );
            
            let snapshot_3 = await ref.orderByChild('timeStamp').startAt(randomTimeStamp).limitToFirst(num).once('value');
            
            if(snapshot_3.val()){
             
                let posts = Object.entries(snapshot_3.val()).map(([url, {title, replies}]) => ({url, title, replies})).reverse();
                
                setRandom(posts);
                
            }
            
        }
        
        getRandomPosts(5);
        
    }, [update]);
    
    useEffect(() => {
        
        const getRelatedPosts = async (num) => {
            
            let ref = firebase.database().ref('posts');
            
            let related = (await ref.child(`${url}/related`).orderByChild('hits').limitToFirst(num).once('value')).val();
            
            if(related){
                
                let posts = Object.keys(related).map(async url => {

                    let title   = (await ref.child(`${url}/title`).once('value')).val();
                    let replies = (await ref.child(`${url}/replies`).once('value')).val();
                    
                    return {

                        url: url,
                        title: title,
                        replies: replies

                    }

                });

                posts = await Promise.all(posts);
                
                setRelated(posts);
                
            }
            
        }
        
        getRelatedPosts(5);
        
    }, [update, url]);
    
    useEffect(() => {    
        
        let group = new Set();
        
        let union = [...related, ...random];
        
        let unique = union.filter(post => {
            
            let urlTitle = JSON.stringify(post);
            
            let groupHasPost = group.has(urlTitle);
            
            group.add(urlTitle)
            
            return groupHasPost ? false : true;
            
        });
        
        setCombo(unique);
        
    }, [random, related]);
    
    const updateRelated = (title, relatedUrl) => {
        
        let ref = firebase.database().ref('posts');
        
        ref.child(`${url}/related/${relatedUrl}/hits`).transaction(value => value + 1);
        
        setUpdate(update + 1);
        
        window.scrollTo(0, 0);
        
    }
    
    return(
        <React.Fragment>
        { combo.length !== 0
        ? <div className = 'RelatedContent'>
            <span className = 'Title'>Relacionado</span>
            <div className = 'Links'>
                {combo.map(({url, title, replies = {}}, key) => 
                    (<div key = {key} >
                        <Link onClick = {() => updateRelated(title, url)} to = {url} >{title}</Link>
                        <p>{Object.keys(replies).length} {Object.keys(replies).length === 1 ? 'comentario' : 'comentarios'}</p>
                    </div>)
                )}
            </div>
          </div>
        : <Loading type = 'RelatedContent'/>
        }
        </React.Fragment>
    );
    
}

export default RelatedContent;