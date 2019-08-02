import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import AnonymImg from '../Functions/AnonymImg.js';
import { Link } from 'react-router-dom';
import '../Styles/DeleteAccount.css';

//--------------------------------------------------------------/
//
//
// Deletes an account or with a confirmation message
//
//
//--------------------------------------------------------------/
const DeleteAccount = () => {
    
    const [confirmation, setConfirmation] = useState(false);
    const [error, setError] = useState(null);
    const [goodbye, setGoodbye] = useState(null);
    const [id, setId] = useState(null);
    const [input, setInput] = useState(null);
    const [user, setUser] = useState(null);
    
    useEffect( () => {
        
        // Setting unser 
        auth.onAuthStateChanged( user => user && setUser(user) );
        
        // Emojis as svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
                
    });
    
    // Function that deletes the account
    const handleDelete = () => {
        
        var nickName = Math.random().toString(36).substr(2, 5);
        var randomImg = AnonymImg();
        var deletedUid = 'deletedUser' + user.uid;
                
        if(!input)  setError('Debes introducir tu dirección de correo para poder eliminar la cuenta.');
        else if(input !== user.email) setError('El correo introducido con coincide con tu dirección de correo...');
        else if(input === user.email){
        
            firebase.database().ref('posts/').once('value').then( snapshot => { 

                        // Capturing data
                        var posts = snapshot.val(); 
                
                        // We get the posts written by user with ID = uid
                        if(posts){
                            
                            Object.keys(posts).map( pid => { 
                                
                                // Changing the name of the user for all the posts
                                if(posts[pid].userUid === user.uid) {
                                    firebase.database().ref('posts/' + pid + '/userName').transaction(value => nickName);
                                    firebase.database().ref('posts/' + pid + '/userPhoto').transaction(value => randomImg);
                                    firebase.database().ref('posts/' + pid + '/userUid').transaction(value => deletedUid);
                                }

                                // Changing the name of the user for the replies
                                if(typeof posts[pid].replies !== 'undefined'){

                                    var replies = posts[pid].replies;
                                    
                                    Object.keys(replies).map( rid => {
                                                                                
                                        if(replies[rid].userUid === user.uid){ 
                                            firebase.database().ref('posts/' + pid + '/replies/' + rid + '/userName').transaction(value => nickName);
                                            firebase.database().ref('posts/' + pid + '/replies/' + rid + '/userPhoto').transaction(value => randomImg);
                                            firebase.database().ref('posts/' + pid + '/replies/' + rid + '/userUid').transaction(value => deletedUid);
                                        }
                                    });
                                }

                            });
                        }

            });
            
            // Deleting the user and showing goodbye message
            auth.currentUser.delete().then( setGoodbye(true) );

            setConfirmation(false);
        }
       
    }
    
    var deletion = <React.Fragment>
                    {confirmation && !goodbye &&
                        <div className = 'Delete Account Confirmation'>
                            <div className = 'Delete Account Confirmation-Wrap'>
                                <h2>Oh, vaya... 😿</h2>
                                <p>Tu cuenta se borrará, pero el contenido seguirá publicado con un nombre aleatorio.</p>
                                <p>Eliminar una cuenta es irreversible, perderás las publicaciones y todos tus puntos.</p>
                                <p>¿Estás seguro de que quieres hacerlo?</p>
                                {error && <span className = 'Error'>{error}</span>}
                                <input onChange = { (e) => { setInput(e.target.value); setError(null); } } placeholder = {user.email} value = {input}></input>
                                <button onClick = { () => handleDelete() } className = 'Yes-Delete'>
                                    Sí, eliminar
                                </button>
                                <button onClick = { () => setConfirmation(false) } className = 'No-Delete'>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    }
                    {goodbye &&
                        <div className = 'Delete Account Confirmation'>
                            <div className = 'Delete Account Confirmation-Wrap'>
                            <h2>Hasta pronto 😺</h2>
                                <p>Tus mensajes han sido anonimizados y tu cuenta ha sido borrada.</p>
                                <p>Gracias por el tiempo que has dedicado a Nomoresheet. El tiempo es lo más valioso que tenemos.</p> 
                                <p>Cuídate, mucho. </p>
                                <Link to = '/'>Volver a la página principal</Link>
                            </div>
                        </div>
                    }
                    <button className = 'Delete Account' onClick = { () => setConfirmation(true) }>Eliminar cuenta</button>
                 </React.Fragment>;

    return deletion;
    
}

export default DeleteAccount;