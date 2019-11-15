import React from 'react';

//--------------------------------------------------------------/
// This function returns the points of the user:
//
// posts => number of posts
// replies => number of replies
// spicy => number of chillis 
// applauses => number of claps
//
//--------------------------------------------------------------/
const GetPoints = (posts, replies, spicy, applauses) => {
    
    // Defining the value of each element
    const postValue     = 30;
    const replyValue    = 40;
    const spicyValue    = 50;
    const applauseValue = 60;
    
    // Getting the total
    const points = (posts * postValue) + (replies * replyValue) + (spicy * spicyValue) + (applauses * applauseValue);
      
    // Returning total points and the values of each element
    return [points, postValue, replyValue, spicyValue, applauseValue];
}

export default GetPoints;