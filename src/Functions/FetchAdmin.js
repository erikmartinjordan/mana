import { auth, environment } from '../Functions/Firebase'

const FetchAdmin  = async (user) => {

    if(!user) return null
    
    let idToken = await user.getIdToken(true)
    
    let url = environment === 'PRE' 
    ? 'https://us-central1-nomoresheet-pre.cloudfunctions.net/isAdmin' 
    : 'https://us-central1-nomoresheet-forum.cloudfunctions.net/isAdmin'
    
    let response = await fetch(url, {
        "method":  "POST",
        "headers": { "Content-Type": "application/json" },
        "body":    JSON.stringify({ "idToken": idToken })
    })
 
    let { isAdmin } = await response.json()

    return isAdmin
    
}

export default FetchAdmin