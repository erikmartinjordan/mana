import React from 'react';
import '../Styles/Alert.css';

//
// Returns an alert that will display on the screen for delta seconds
// meessage => message to display
//

const Alert = (props) => <div className = 'Alert'>
                            <div className = 'Alert-Emoji'>📮</div>
                            <div>
                                <div className = 'Title'>{props.title ? props.title : 'Ups...'}</div>
                                <div className = 'Message'>{props.message}</div>  
                            </div>
                         </div>;

export default Alert;