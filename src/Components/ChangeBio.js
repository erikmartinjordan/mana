import React, { useEffect, useState }  from 'react';
import firebase                        from '../Functions/Firebase';
import '../Styles/ChangeBio.css';

const ChangeBio = ({user}) => {

    const [bio, setBio]     = useState('');
    const [chars, setChars] = useState(250);

    useEffect(() => {

        if(user){

            let ref = firebase.database().ref(`users/${user.uid}/bio`);

            let listener = ref.on('value', snapshot => {

                let bio = snapshot.val();

                if(bio){
                    
                    setBio(bio);
                    setChars(250 - bio.length);

                }
                else{

                    setBio('');
                    setChars(250);
                }

            });

            return () => ref.off('value', listener);

        }

    }, [user]);

    const handleBio = (e) => {

        let text = e.target.value;

        if(text.length <= 250){

            firebase.database().ref(`users/${user.uid}/bio`).transaction(value => text);

            setChars(250 - text.length);

        }

    }

    return(
        <div className = 'ChangeBio'>
            <textarea rows = '4' onChange = {handleBio} value = {bio} maxLength = {250}/>
            <div className = 'CharsLeft'>{chars}</div>
        </div>
    );

}

export default ChangeBio;