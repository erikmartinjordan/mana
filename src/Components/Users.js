import React, { useState, useEffect }                         from 'react'
import { Link }                                               from 'react-router-dom'
import UserAvatar                                             from './UserAvatar'
import { db, limitToLast, onValue, orderByChild, ref, query } from '../Functions/Firebase'
import '../Styles/Users.css'

const Users = ({numberOfUsers = 10}) => {
    
    const [users, setUsers] = useState([])
    
    useEffect(() => {

        let unsubscribe = onValue(query(ref(db, 'users'), orderByChild('numPoints'), limitToLast(10)), snapshot => {
            
            if(snapshot.val()){
                
                let ranking = snapshot.val()
                
                let sortedRanking = Object.entries(ranking).sort((a, b) => b[1].numPoints > a[1].numPoints ? 1 : b[1].numPoints < a[1].numPoints ? -1 : 0)
                
                setUsers(sortedRanking)
                
            }
            
        })
        
        return () => unsubscribe()
        
    }, [numberOfUsers])
    
    return(
        <div className = 'Users'>
            <h2>Ranking</h2>
            <p>Los usuarios con más reputación:</p>
            {users.map(([id, user], index) => 
                <Link to = {'/@' + id} className = 'User' key = {index}>
                    <div className = 'Rank'>#{index + 1}</div>
                    <UserAvatar user = {{uid: id, photoURL: user.profilePic}}/>
                    <div className = 'NamePoints'>
                        <div>{user.name}</div>
                        <div><span className = 'Points'>{user.numPoints}</span> puntos</div>
                    </div>
                </Link>
            )}
        </div>
    )
    
}

export default Users