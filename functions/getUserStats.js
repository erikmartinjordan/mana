const getNumberOfPosts = (posts, uid) => {
    
    let numPosts = 0;
    
    Object.keys(posts).forEach( postId => { 
        
        if(posts[postId].userUid === uid) 
            numPosts ++;
        
    });
    
    return numPosts;
    
}

const getNumberOfReplies = (posts, uid) => {
    
    let numReplies = 0;
    
    Object.keys(posts).forEach( postId => { 
        
        if(typeof posts[postId].replies !== 'undefined'){
            
            let replies = posts[postId].replies;
         
            Object.keys(replies).forEach( replyId => {
                
                if(replies[replyId].userUid === uid){
                    
                    numReplies ++;
                }
                
            });
        }
        
    });    
   
    return numReplies;
    
}

const getNumberOfSpicy = (posts, uid) => {
    
    let numSpicy = 0;
    
    Object.keys(posts).forEach( postId => { 
        
        if(posts[postId].userUid === uid && posts[postId].voteUsers) {
            
            numSpicy = numSpicy + Object.keys(posts[postId].voteUsers).length;
            
        }
        
    });    
   
    return numSpicy;
}

const getNumberOfApplauses = (posts, uid) => {
    
    let numApplauses = 0;
    
    Object.keys(posts).forEach( postId => { 
        
        if(typeof posts[postId].replies !== 'undefined'){
            
            let replies = posts[postId].replies;
         
            Object.keys(replies).forEach( replyId => {
                
                if(replies[replyId].userUid === uid && replies[replyId].voteUsers){
                    
                    numApplauses = numApplauses + Object.keys(replies[replyId].voteUsers).length;
                }
                
            });
        }
        
    });    
   
    return numApplauses;
}

const getNumberOfViews = (posts, uid) => {
    
    let totalViews = 0;
    
    let userPosts = Object.values(posts).filter(post => {
        
        let { replies = {}, userUid } = post;
        
        return post.userUid === uid || Object.values(replies).some(reply => reply.userUid === uid);
        
    });
    
    totalViews = userPosts.reduce( (total, post) => total = total + ~~post.views, 0); 
    
    return totalViews;
    
}

module.exports = {
    
    getNumberOfPosts,
    getNumberOfReplies,
    getNumberOfSpicy,
    getNumberOfApplauses,
    getNumberOfViews
    
}