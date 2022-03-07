import React from 'react'
import moment from 'moment'
import { Reply } from './Replies'
import UserAvatar from './UserAvatar'
import Verified from './Verified'
import '../Styles/Preview.css'

const Preview = ({ message, nickName, user }) => {

    return message
    ?   <div className = 'Reply Question Preview'>
            <div className = 'Header'>
                <div className = 'Author-Name-Date'> 
                    <UserAvatar user = {user}/>
                    <span className = 'Author-Date'>
                        <span className = 'Author-Info'>
                            {nickName || user.displayName}
                            <Verified uid = {nickName || user.uid}/>
                        </span>
                        <time>{moment().fromNow()}</time>
                    </span>
                </div>
            </div>
            <div className = 'Content'>
                <Reply message = {message}/>
            </div>
        </div>
    : null

}

export default Preview