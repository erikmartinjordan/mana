import React, { useState } from 'react'
import { db, ref, remove } from '../Functions/Firebase'
import '../Styles/DeletePost.css'

const DeleteFeature = (props) => {
    
    const [confirmation, setConfirmation] = useState(false)
    const [id, setId]                     = useState(null)
    
    const handleConfirmation = (e) => {
        
        setId(e.target.getAttribute('id'))
        setConfirmation(true)
        
    }
    
    const handleDelete = (id) => {
      
        remove(ref(db, `features/${id}`))
        setConfirmation(false)
       
    }
    
    return(
        <React.Fragment>
            {confirmation
            ? <div className = 'Confirmation'>
                    <div className = 'Confirmation-Wrap'>
                        <p>¿Estás seguro de que quieres borrar está publicación?</p>
                        <button onClick = { () => handleDelete(id) }       className = 'Yes-Delete'>Sí, eliminar</button>
                        <button onClick = { () => setConfirmation(false) } className = 'No-Delete'>Cancelar</button>
                    </div>
                </div>
            : null
            }
            <button className = 'Delete' id = {props.id} onClick = {handleConfirmation}>Eliminar</button>
        </React.Fragment>
    )
    
}

export default DeleteFeature