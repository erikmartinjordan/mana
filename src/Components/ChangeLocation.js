import React, { useEffect, useState }      from 'react'
import { db, ref, onValue, runTransaction} from '../Functions/Firebase'
import '../Styles/ChangeLocation.css'

const ChangeLocation = ({ user }) => {

    const [city, setCity] = useState('')

    useEffect(() => {

        if(user){

            let unsubscribe = onValue(ref(db, `users/${user.uid}/city`), snapshot => {

                setCity(snapshot.val() || '')

            })

            return () => unsubscribe()

        }

    }, [user])

    const handleCity = (e) => {

        let text = e.target.value

        if(text.length <= 50){

            runTransaction(ref(db, `users/${user.uid}/city`), _ => text)

        }

    }

    return(
        <div className = 'ChangeLocation'>
            <input value = {city} onChange = {handleCity}></input>
        </div>
    )

}

export default ChangeLocation