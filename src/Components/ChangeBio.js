import React, { useEffect, useState }       from 'react'
import { db, onValue, ref, runTransaction } from '../Functions/Firebase'
import '../Styles/ChangeBio.css'

const ChangeBio = ({ user }) => {

    const [bio, setBio]     = useState('')
    const [chars, setChars] = useState(250)

    useEffect(() => {

        if(user){

            let unsubscribe = onValue(ref(db, `users/${user.uid}/bio`), snapshot => {

                setBio(snapshot.val() || '')
                setChars(250 - (snapshot.val() || '').length)

            })

            return () => unsubscribe()

        }

    }, [user])

    const handleBio = (e) => {

        let text = e.target.value

        if(text.length <= 250){

            runTransaction(ref(db, `users/${user.uid}/bio`), _ => text)

            setChars(250 - text.length)

        }

    }

    return(
        <div className = 'ChangeBio'>
            <textarea rows = '4' onChange = {handleBio} value = {bio} maxLength = {250}/>
            <div className = 'CharsLeft'>{chars}</div>
        </div>
    )

}

export default ChangeBio