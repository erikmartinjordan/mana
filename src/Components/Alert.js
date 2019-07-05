import React from 'react';
import '../Styles/Alert.css';

//
// Returns an alert that will display on the screen for delta seconds
// meessage => message to display
//

const Alert = (message) => <div className = 'Alert'>{message}</div>;

export default Alert;