const GetLevel = (points) => {
    
    // numb = log1.5(points + 1)
    // level = floor(log1.5(points + 1))
    const numb  = Math.log(points + 1) / Math.log(1.5)
    const level = Math.floor(numb);
    
    const nextLevel  = level + 1;
    const pointsLevelDown = Math.pow(1.5, level) - 1;
    const pointsLevelUp = Math.pow(1.5, nextLevel) - 1;
    const pointsToNextLevel = Math.ceil(pointsLevelUp - points);
    
    const percentage = Math.floor(100 * (points - pointsLevelDown) / (pointsLevelUp - pointsLevelDown));
    
    return isNaN(level) ? [0, 0, 0] : [level, pointsToNextLevel, percentage];
}

export default GetLevel;