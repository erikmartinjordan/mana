export const getUsers = (data) => {
            
    let users = [];
    
    Object.keys(data).forEach(day => {
        
        users.push(Object.keys(data[day]).length);
        
    });
    
    return users;
    
}

export const getSessions = (data) => {
    
    let sessions = [];
    
    Object.keys(data).forEach(day => {
        
        let count = 0; 
        
        Object.keys(data[day]).forEach(uid => {
            
            count = count + Object.keys(data[day][uid]).length;
            
        });
        
        sessions.push(count);
        
    });
    
    return sessions;
}

export const getPageviews = (data) => {
    
    let pageviews = [];
    
    Object.keys(data).forEach(day => {
        
        let count = 0; 
        
        Object.keys(data[day]).forEach(uid => {
            
            Object.keys(data[day][uid]).forEach(session => {
                
                if(data[day][uid][session].pageviews)
                    count = count + Object.keys(data[day][uid][session].pageviews).length;
                
            });
            
        });
        
        pageviews.push(count);
        
    });
    
    
    return pageviews;
    
}

export const getSessionDuration = (data) => {
    
    let duration = [];
    
    Object.keys(data).forEach(day => {
        
        Object.keys(data[day]).forEach(uid => {
            
            Object.keys(data[day][uid]).forEach(session => {
                
                let sec = (data[day][uid][session].timeStampEnd - data[day][uid][session].timeStampIni)/1000;
                
                if(!isNaN(sec)) duration.push(sec);
            
            });
            
        });
        
    });
    
    let avg = duration.reduce( (a,b) => a + b)/duration.length;
    
    return `${Math.floor(avg / 60)} min ${Math.floor(avg % 60)} seg`;
    
}

export const getRealTimeUsers = (data) => {

    return (Object.keys(data || {}).length) 
    
}

export const getPageviewsSession = (pageviews, sessions) => {
    
    let res = 0;
    
    if(pageviews && sessions)
        res = pageviews.reduce( (a, b) => a + b, 0) / sessions.reduce( (a, b) => a + b, 0);
    
    return res.toFixed(2);
    
}

export const getBounceRate = (data) => {
    
    let bounced = 0;
    let total = 0;
    
    Object.keys(data).forEach(day => {
        
        Object.keys(data[day]).forEach(uid => {
            
            Object.keys(data[day][uid]).forEach(session => {
                
                if(data[day][uid][session].timeStampIni === data[day][uid][session].timeStampEnd)
                    bounced ++;
                
                total ++;
                
            });
            
        });
        
    });
    
    return `${ (100 * bounced / total).toFixed(2) }%`;
    
}

export const getRanking = (data) => {
    
    let array = [];
    
    Object.keys(data).forEach(day => {
        
        Object.keys(data[day]).forEach(uid => {
            
            Object.keys(data[day][uid]).forEach(session => {
                
                if(data[day][uid][session].pageviews){
                    
                    Object.keys(data[day][uid][session].pageviews).forEach(pid => {
                        
                        array.push(data[day][uid][session].pageviews[pid].url);
                        
                    });
                    
                }
                
            });
            
        });
        
    });
    
    let unique = [...new Set(array)];
    
    let duplicates  = unique.map(value => [value, array.filter(url => url === value).length ]);
    
    return duplicates.sort((a, b) => b[1] - a[1]);
}