import React from 'react';

//--------------------------------------------------------------/
// This function returns the points of the user:
//
// posts => number of posts
// replies => number of replies
// spicy => number of chillis 
//
//--------------------------------------------------------------/
const returnPoints = (posts, replies, spicy) => {
    
    // Defining the value of each element
    const postValue     = 30;
    const replyValue    = 40;
    const spicyValue    = 50;
    
    // Getting the total
    const points = (posts * postValue) + (replies * replyValue) + (spicy * spicyValue)
     
    // Returning total points and the values of each element
    return [points, postValue, replyValue, spicyValue];
}

export default returnPoints;