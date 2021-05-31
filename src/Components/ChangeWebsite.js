import React, { useEffect, useState }  from 'react';
import firebase                        from '../Functions/Firebase';
import '../Styles/ChangeWebsite.css';

const ChangeWebsite = ({user}) => {

    const [web, setWeb] = useState('');

    useEffect(() => {

        if(user){

            let ref = firebase.database().ref(`users/${user.uid}/web`);

            let listener = ref.on('value', snapshot => {

                let web = snapshot.val();

                if(web){
                    
                    setWeb(web);

                }
                else{

                    setWeb('');

                }

            });

            return () => ref.off('value', listener);

        }

    }, [user]);

    const handleWeb = (e) => {

        let text = e.target.value;

        if(text.length <= 50){

            firebase.database().ref(`users/${user.uid}/web`).transaction(value => text);

        }

    }

    return(
        <div className = 'ChangeWebsite'>
            <input value = {web} onChange = {handleWeb} placeholder = {'https://'}></input>
        </div>
    );

}

export default ChangeWebsite;