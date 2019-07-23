import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import '../Styles/DeletePost.css';

//
// Deletes a post or with a confirmation message
//

const DeletePost = (props) => {
    
    const [confirmation, setConfirmation] = useState(false);
    const [id, setId] = useState(null);
    
    
    // Function that displays confirmation modal before deleting post
    const handleConfirmation = (e) => {
    
     setId(e.target.getAttribute('id'));
     setConfirmation(true);
    
    }
    
    // Function that deletes the post
    const handleDelete = (id) => {
      
      if(props.type === 'post') firebase.database().ref('posts/' + id).remove();
      if(props.type === 'reply')firebase.database().ref('posts/' + props.post + '/replies/' + id ).remove();
          
      setConfirmation(false);
       
    }
    
    var deletion = <React.Fragment>
                    {confirmation &&
                        <div className = 'Confirmation'>
                            <div className = 'Confirmation-Wrap'>
                                <p>¿Estás seguro de que quieres eliminar el {props.type === 'post' ? 'artículo? Se borrarán todos los comentarios.' : 'comentario?'}</p>
                                <button onClick = { () => handleDelete(id) }       className = 'Yes-Delete'>Sí, eliminar</button>
                                <button onClick = { () => setConfirmation(false) } className = 'No-Delete'>Cancelar</button>
                            </div>
                        </div>
                    }
                    <button className = 'Delete' id = {props.id} onClick = { (e) => handleConfirmation(e) }>Eliminar</button>
                 </React.Fragment>;

    return deletion;
    
}

export default DeletePost;