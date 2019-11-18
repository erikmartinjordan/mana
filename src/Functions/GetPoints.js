import React                from 'react';
import GetNumberOfPosts     from './GetNumberOfPosts.js';
import GetNumberOfReplies   from './GetNumberOfReplies.js';
import GetNumberOfSpicy     from './GetNumberOfSpicy.js';
import GetNumberOfApplauses from './GetNumberOfApplauses.js';

//--------------------------------------------------------------/
// This function returns the points of the user
//
//--------------------------------------------------------------/
const GetPoints = (...userUids) => {
    
    // Defining the value of each element
    const postValue     = 30;
    const replyValue    = 40;
    const spicyValue    = 50;
    const applauseValue = 60;
    
    // Getting posts, replies, spicy and applauses
    const posts     = GetNumberOfPosts(...userUids);
    const replies   = GetNumberOfReplies(...userUids);
    const spicy     = GetNumberOfSpicy(...userUids);
    const applauses = GetNumberOfApplauses(...userUids);
    
    // Initialize array
    const points = new Array(userUids.length).fill(0);
    
    // Getting the points
    for(let i = 0; i < userUids.length; i ++)
        points[i] = (posts[i] * postValue) + (replies[i] * replyValue) + (spicy[i] * spicyValue) + (applauses[i] * applauseValue);
      
    // Returning total points and the values of each element
    return points;
}

export default GetPoints;