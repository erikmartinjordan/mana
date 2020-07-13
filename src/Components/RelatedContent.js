import React, { useState, useEffect } from 'react';
import { Link }                       from 'react-router-dom';
import firebase                       from '../Functions/Firebase';

const RelatedContent = () => {
    
    const [combo,   setCombo]   = useState([]); 
    const [random,  setRandom]  = useState([]);
    const [related, setRelated] = useState([]);
    
    useEffect( () => {
        
        const getRandomPosts = async (num) => {
            
            let ref = firebase.database().ref('posts');
            
            let snapshot_1 = await ref.orderByChild('timeStamp').limitToFirst(1).once('value');
            let snapshot_2 = await ref.orderByChild('timeStamp').limitToLast(1).once('value');
            
            let first = Object.values(snapshot_1.val())[0];
            let last  = Object.values(snapshot_2.val())[0];
            
            let randomTimeStamp = Math.floor( Math.random() * (last.timeStamp - first.timeStamp + 1) + first.timeStamp );
            
            let snapshot_3 = await ref.orderByChild('timeStamp').startAt(randomTimeStamp).limitToFirst(num).once('value');
            
            if(snapshot_3.val()){
             
                let posts = Object.entries(snapshot_3.val()).map(([url, {title}]) => ({url, title}));
                setRandom(posts);
                
            }
            
        }
        
        getRandomPosts(5);
        
    }, []);
    
    useEffect( () => {
        
        const getRelatedPosts = async (num) => {
            
            let ref = firebase.database().ref('posts');
            let url = window.location.pathname.split('/').pop();
            
            let snapshot_1 = await ref.child(`${url}/related`).orderByChild('hits').limitToFirst(num).once('value');
            
            if(snapshot_1.val()){
                
                let posts = Object.entries(snapshot_1.val()).map(([url, {title}]) => ({url, title}));
                setRelated(posts);
                
            }
            
        }
        
        getRelatedPosts(5);
        
    }, []);
    
    useEffect( () => {
        
        if(random.length > 0 && related.length > 0){
            
            let unique = [...new Set([...random, ...related])];            
            setCombo(unique);
            
        }
        
    }, [random, related]);
    
    const updateRelated = (title, relatedUrl) => {
        
        let ref = firebase.database().ref('posts');
        let url = window.location.pathname.split('/').pop();
        
        ref.child(`${url}/related/${relatedUrl}/title`).transaction(value => title);
        ref.child(`${url}/related/${relatedUrl}/hits`) .transaction(value => value + 1);
        
    }
    
    return(
        <div className = 'Related'>
            {combo.map(({url, title}) => <div><Link onClick = {() => updateRelated(title, url)} to = {url} >{title}</Link></div>)}
        </div>
    );
    
}

export default RelatedContent;