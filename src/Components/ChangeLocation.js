import React, { useEffect, useState }  from 'react';
import firebase                        from '../Functions/Firebase';
import '../Styles/ChangeLocation.css';

const ChangeLocation = ({user}) => {

    const [city, setCity] = useState('');

    useEffect(() => {

        if(user){

            let ref = firebase.database().ref(`users/${user.uid}/city`);

            let listener = ref.on('value', snapshot => {

                let city = snapshot.val();

                if(city){
                    
                    setCity(city);

                }
                else{

                    setCity('');

                }

            });

            return () => ref.off('value', listener);

        }

    }, [user]);

    const handleCity = (e) => {

        let text = e.target.value;

        if(text.length <= 50){

            firebase.database().ref(`users/${user.uid}/city`).transaction(value => text);

        }

    }

    return(
        <div className = 'ChangeLocation'>
            <input value = {city} onChange = {handleCity}></input>
        </div>
    );

}

export default ChangeLocation;