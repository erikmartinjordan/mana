import React, { useContext, useEffect, useState } from 'react';
import { Link }                                   from 'react-router-dom';
import UserContext                                from '../Functions/UserContext';
import '../Styles/Ad.css';

const Ad = () => {

    const [random, setRandom] = useState(null);

    useEffect(() => {

        let ads = {
            'iPhone': {
                url: 'https://amzn.to/34m6n8x',
                img: 'https://images.unsplash.com/photo-1606061587005-c1c57d134082?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
                author: 'Filip Baotić',
                profile: 'https://unsplash.com/@filipbaotic'
            },
            'NewBalance': {
                url: 'https://amzn.to/3oRwWvI',
                img: 'https://images.unsplash.com/photo-1621315271772-28b1f3a5df87?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
                author: 'Ervan Wirawan',
                profile: 'https://unsplash.com/@ervan_me'
            },
            'AirPods': {
                url: 'https://amzn.to/3bUvrHR',
                img: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=630&q=80',
                author: 'Omid Armin',
                profile: 'https://unsplash.com/@omidarmin'
            },
            'Aesop': {
                url: 'https://amzn.to/3bTJ4XY',
                img: 'https://images.unsplash.com/photo-1604603815783-2bd94c5a819f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
                author: 'Dan Farrell',
                profile: 'https://unsplash.com/@farreal'
            },
            'LogitechMX':{
                url: 'https://amzn.to/2RDXogl',
                img: 'https://images.unsplash.com/photo-1607801354062-c7520503e178?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
                author: 'Jhon Paul Dela Cruz',
                profile: 'https://unsplash.com/@jpdelacruz'
            }
        }

        let random = ~~(Math.random() * Object.keys(ads).length);

        setRandom(Object.values(ads)[random]);

    }, []);
    
    return(
        <div className = 'Ad' onClick = {() => window.location.href = random?.url}>
            <span className = 'Title'>Anuncio</span>
            <div className = 'Ad-Wrap'>
                <img src = {random?.img}/>
            </div>
            <span className = 'Author'>📸 Foto por <a href = {random?.profile}>{random?.author}</a></span>
        </div>
    );
    
};

export default Ad;