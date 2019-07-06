import React from 'react';

//--------------------------------------------------------------/
// This function returns the current user's level
//
// points => current points
//
//--------------------------------------------------------------/
const returnLevel = (points) => {
    
    // numb = log1.5(points + 1)
    // level = floor(log1.5(points + 1))
    const numb  = Math.log(points + 1) / Math.log(1.5)
    const level = Math.floor(numb);
        
    //  Calculating the points of next level, lower and higher bounds
    // pointsNext = 1.5^nextLevel - 1
    const nextLevel  = level + 1;
    const pointsLevelDown = Math.pow(1.5, level) - 1;
    const pointsLevelUp = Math.pow(1.5, nextLevel) - 1;
    const pointsToNextLevel = Math.ceil(pointsLevelUp - points);
    
    // Percentage of current level completed
    const percentage = Math.floor(100 * (points - pointsLevelDown) / (pointsLevelUp - pointsLevelDown));
    
    // Returning the actual level and number of points to the next
    return [level, pointsToNextLevel, percentage];
}

export default returnLevel;