import React, { useContext, useState }       from 'react'
import Twemoji                               from '../Components/Twemoji'
import { auth, db, onValue, runTransaction } from '../Functions/Firebase'
import AnonymName                            from '../Functions/AnonymName'
import AnonymImg                             from '../Functions/AnonymImg'
import UserContext                           from '../Functions/UserContext'
import '../Styles/DeleteAccount.css';

const DeleteAccount = () => {
    
    const [confirmation, setConfirmation] = useState(false)
    const [error, setError]               = useState(null)
    const [goodbye, setGoodbye]           = useState(null)
    const [input, setInput]               = useState(null)
    const { user }                        = useContext(UserContext)
    
    const handleDelete = async () => {
        
        var nickName   = AnonymName()
        var randomImg  = AnonymImg()
        var deletedUid = 'deletedUser' + user.uid
        
        if(!input)                    {
            
            setError('Debes introducir tu dirección de correo para poder eliminar la cuenta.')
        
        }
        else if(input !== user.email) {
            
            setError('El correo introducido con coincide con tu dirección de correo...')
        
        }
        else if(input === user.email){

            let postsRef = ref(db, 'posts')

            onValue(postsRef, snapshot => {

                let posts = snapshot.val()

                Object.keys(posts).forEach(pid => { 
                
                    if(posts[pid].userUid === user.uid) {

                        runTransaction(ref(db, `posts/${pid}/userName`),  _ => nickName)
                        runTransaction(ref(db, `posts/${pid}/userPhoto`), _ => randomImg)
                        runTransaction(ref(db, `posts/${pid}/userUid`),   _ => deletedUid)
                        
                    }
                    
                    if(typeof posts[pid].replies !== 'undefined'){
                        
                        let replies = posts[pid].replies;
                        
                        Object.keys(replies).forEach( rid => {
                            
                            if(replies[rid].userUid === user.uid){

                                runTransaction(ref(db, `posts/${pid}/replies/${rid}/userName`),  _ => nickName)
                                runTransaction(ref(db, `posts/${pid}/replies/${rid}/userPhoto`), _ => randomImg)
                                runTransaction(ref(db, `posts/${pid}/replies/${rid}/userUid`),   _ => deletedUid)

                                runTransaction(ref(db, `replies/${rid}/userName`),  _ => nickName)
                                runTransaction(ref(db, `replies/${rid}/userPhoto`), _ => randomImg)
                                runTransaction(ref(db, `replies/${rid}/userUid`),   _ => deletedUid)
                                
                            }
                            
                        });
                    }
                    
                })

            }, { onlyOnce: true })

            runTransaction(ref(db, `users/${deletedUid}/name`), _ => nickName)
            
            await auth.currentUser.delete()
            await auth.signOut()
            
            setGoodbye(true)
            setConfirmation(false)
            
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
                        <p>Gracias por el tiempo que has dedicado a Maña. El tiempo es lo más valioso que tenemos.</p> 
                        <p>Cuídate, mucho. </p>
                        <a href = '/'>Volver a la página principal</a>
                    </div>
                </div>
            : null
            }
            <button className = 'Delete Account' onClick = {() => setConfirmation(true) }>Eliminar cuenta</button>
        </React.Fragment>
    )
    
}

export default DeleteAccount