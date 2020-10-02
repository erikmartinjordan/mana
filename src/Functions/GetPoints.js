import GetNumberOfPosts     from './GetNumberOfPosts.js';
import GetNumberOfReplies   from './GetNumberOfReplies.js';
import GetNumberOfSpicy     from './GetNumberOfSpicy.js';
import GetNumberOfApplauses from './GetNumberOfApplauses.js';
import Points               from './PointsAndValues.js';

const GetPoints = (...userUids) => {
   
    const postValue     = Points.post;
    const replyValue    = Points.reply;
    const spicyValue    = Points.spicy;
    const applauseValue = Points.applause;
    
    const posts     = GetNumberOfPosts(...userUids);
    const replies   = GetNumberOfReplies(...userUids);
    const spicy     = GetNumberOfSpicy(...userUids);
    const applauses = GetNumberOfApplauses(...userUids);
    
    const points = new Array(userUids.length).fill(0);
    
    for(let i = 0; i < userUids.length; i ++)
        points[i] = (~~posts[i] * postValue) + (~~replies[i] * replyValue) + (~~spicy[i] * spicyValue) + (~~applauses[i] * applauseValue);
    
    return points;
}

export const GetPointsLevel = (level) => {
    
    let points = Math.pow(1.5, level) - 1;
    
    return points;
}

export default GetPoints;