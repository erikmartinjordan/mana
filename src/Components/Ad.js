import React, { useState } from 'react';
import moment              from 'moment';
import Fingerprint         from 'fingerprintjs';
import firebase            from '../Functions/Firebase';
import '../Styles/Ad.css';

const Ad = () => {
    
    const ads = [
        
        {
            "campaign": 'AirBnB',
            "link": 'https://www.airbnb.es/c/erikm3737?currency=EUR',
            "text": 'Obtén 34 euros de descuento en tu primera reserva de AirBnB'
            
        },
        {
            
            "campaign": 'Amazon',
            "link": 'https://amzn.to/39lC2sk',
            "text": 'Los auriculares inalámbricos de AUKEY cuestan menos de 30 euros'
            
        },
        {
            
            "campaign": 'Agoda',
            "link": 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1772106&city=9395',
            "text": '¿Conoces Agoda? Es igual que Booking pero las reservas son más baratas.'
            
        }
        
    ]
    
    const [random, setRandom] = useState(Math.floor(ads.length * Math.random()));
    
    const handleAd = (campaign) => {
        
        var fingerprint = new Fingerprint().get();
        var date        = moment().format('YYYYMMDD');
        
        firebase.database().ref(`ads/${campaign}/${date}/${fingerprint}/clicks/`).transaction(value => value + 1);
    }
    
    return(
        
        <a className = 'Ad' href = {ads[random].link} onClick = {() => handleAd(ads[random].campaign)} target = '_blank' rel = 'noopener noreferrer nofollow'>
            <span className = 'Title'>Anuncio</span>
            <p>{ads[random].text}</p>
        </a>
    );
    
}

export default Ad;