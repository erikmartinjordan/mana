import React, { useState, useEffect } from 'react';
import Twemoji                        from '../Components/Twemoji';
import firebase, {auth}               from '../Functions/Firebase.js';
import AnonymImg                      from '../Functions/AnonymImg.js';
import { Link }                       from 'react-router-dom';
import '../Styles/DeleteAccount.css';

const DeleteAccount = () => {
    
    const [confirmation, setConfirmation] = useState(false);
    const [error, setError]               = useState(null);
    const [goodbye, setGoodbye]           = useState(null);
    const [input, setInput]               = useState(null);
    const [user, setUser]                 = useState(null);
    
    useEffect( () => {
        
        auth.onAuthStateChanged( user => {
            
            if(user)
                setUser(user) 
            else
                setUser(null);
            
        });
        
    });
    
    const handleDelete = async () => {
        
        var nickName   = Math.random().toString(36).substr(2, 5);
        var randomImg  = AnonymImg();
        var deletedUid = 'deletedUser' + user.uid;
        
        if(!input)                    setError('Debes introducir tu dirección de correo para poder eliminar la cuenta.');
        else if(input !== user.email) setError('El correo introducido con coincide con tu dirección de correo...');
        else if(input === user.email){
            
            let snapshot_1 = await firebase.database().ref('posts').once('value');
            
            let posts = snapshot_1.val(); 
            
            Object.keys(posts).forEach(pid => { 
                
                if(posts[pid].userUid === user.uid) {
                    
                    firebase.database().ref(`posts/${pid}/userName`) .transaction(value => nickName);
                    firebase.database().ref(`posts/${pid}/userPhoto`).transaction(value => randomImg);
                    firebase.database().ref(`posts/${pid}/userUid`)  .transaction(value => deletedUid);
                    
                }
                
                if(typeof posts[pid].replies !== 'undefined'){
                    
                    let replies = posts[pid].replies;
                    
                    Object.keys(replies).forEach( rid => {
                        
                        if(replies[rid].userUid === user.uid){
                            
                            firebase.database().ref(`posts/${pid}/replies/${rid}/userName`) .transaction(value => nickName);
                            firebase.database().ref(`posts/${pid}/replies/${rid}/userPhoto`).transaction(value => randomImg);
                            firebase.database().ref(`posts/${pid}/replies/${rid}/userUid`)  .transaction(value => deletedUid);
                            
                        }
                        
                    });
                }
                
            });
            
            let snapshot_2 = await firebase.database().ref('replies').limitToLast(10).once('value');
            
            let replies = snapshot_2.val();
            
            Object.keys(replies).forEach(rid => {
               
                if(replies[rid].userUid === user.uid){
                    
                    firebase.database().ref(`replies/${rid}/userName`) .transaction(value => nickName);
                    firebase.database().ref(`replies/${rid}/userPhoto`).transaction(value => randomImg);
                    firebase.database().ref(`replies/${rid}/userUid`)  .transaction(value => deletedUid);
                    
                }
                
            });
            
            firebase.database().ref(`users/${deletedUid}/name`).transaction(value => nickName);
            
            await auth.currentUser.delete();
            await auth.signOut();
            
            setGoodbye(true);
            setUser(null);
            setConfirmation(false);
            
        }
       
    }
    
    return (
        <React.Fragment>
            {confirmation && !goodbye
                ? <div className = 'Delete Account Confirmation'>
                    <div className = 'Delete Account Confirmation-Wrap'>
                        <h2>Oh, vaya... <Twemoji emoji = {'😿'}/></h2>
                        <p>Tu cuenta se borrará, pero el contenido seguirá publicado con un nombre aleatorio.</p>
                        <p>Eliminar una cuenta es irreversible, perderás las publicaciones y todos tus puntos.</p>
                        <p>Escribe tu correo electrónico para eliminar la cuenta:</p>
                        {error && <span className = 'Error'>{error}</span>}
                        <input onChange = {(e) => { setInput(e.target.value); setError(null); } } placeholder = {user.email} value = {input}></input>
                        <button onClick = {() => handleDelete() } className = 'Yes-Delete'>
                            Sí, eliminar
                        </button>
                        <button onClick = {() => setConfirmation(false) } className = 'No-Delete'>
                            Cancelar
                        </button>
                    </div>
                </div>
                : null
            }
            {goodbye
            ?   <div className = 'Delete Account Confirmation'>
                    <div className = 'Delete Account Confirmation-Wrap'>
                    <h2>Hasta pronto <Twemoji emoji = {'😺'}/></h2>
                        <p>Tus mensajes han sido anonimizados y tu cuenta ha sido borrada.</p>
                        <p>Gracias por el tiempo que has dedicado a Nomoresheet. El tiempo es lo más valioso que tenemos.</p> 
                        <p>Cuídate, mucho. </p>
                        <a href = '/'>Volver a la página principal</a>
                    </div>
                </div>
            : null
            }
            <button className = 'Delete Account' onClick = {() => setConfirmation(true) }>Eliminar cuenta</button>
        </React.Fragment>
    );
    
}

export default DeleteAccount;