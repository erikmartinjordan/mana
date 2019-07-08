import React from 'react';

//--------------------------------------------------------------/
// This function returns the points of the user:
//
// date1 => timestamp of date 1 (ms)
// date2 => timestamp of date 2 (ms)
//
//--------------------------------------------------------------/
const printDate = (date1, date2) => {
    
    // Defining the value of each element
    const difference = Math.abs(date2 - date1);
    
    // Getting the total miliseconds of one month: 30 days, 24 hours, 60 minutes, 60 seconds
    const timeStampMonth = 30 * 24 * 60 * 60 * 1000;
    
    // Checking the difference
    var message = difference > timeStampMonth ? 'Más antiguo' : 'Últimos 30 días';
     
    // Returning total points and the values of each element
    return message;
}

export default printDate;