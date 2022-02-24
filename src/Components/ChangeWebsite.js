import React, { useEffect, useState }       from 'react'
import { db, onValue, ref, runTransaction } from '../Functions/Firebase'
import '../Styles/ChangeWebsite.css'

const ChangeWebsite = ({ user }) => {

    const [web, setWeb] = useState('')

    useEffect(() => {

        if(user){

            let unsubscribe = onValue(ref(db,`users/${user.uid}/web` ), snapshot => {

                setWeb(snapshot.val() || '')

            })

            return () => unsubscribe()

        }

    }, [user])

    const handleWeb = (e) => {

        let text = e.target.value

        if(text.length <= 50){

            runTransaction(ref(db, `users/${user.uid}/web`), _ => text)

        }

    }

    return(
        <div className = 'ChangeWebsite'>
            <input value = {web} onChange = {handleWeb} placeholder = {'https://'}></input>
        </div>
    )

}

export default ChangeWebsite