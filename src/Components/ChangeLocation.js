import React, { useEffect, useState }      from 'react'
import { db, ref, onValue, runTransaction} from '../Functions/Firebase'
import '../Styles/ChangeLocation.css'

const ChangeLocation = ({ user }) => {

    const [city, setCity] = useState('')

    useEffect(() => {

        if(user){

            let cityRef = ref(db, `users/${user.uid}/city`)

            let unsubscribe = onValue(cityRef, snapshot => {

                setCity(snapshot.val() || '')

            })

            return () => unsubscribe()

        }

    }, [user])

    const handleCity = (e) => {

        let text = e.target.value

        if(text.length <= 50){

            let cityRef = ref(db, `users/${user.uid}/city`)

            runTransaction(cityRef, _ => text)

        }

    }

    return(
        <div className = 'ChangeLocation'>
            <input value = {city} onChange = {handleCity}></input>
        </div>
    )

}

export default ChangeLocation