import React from 'react';
import '../Styles/Loading.css';

const Loading = (props) => {
    
    const loading = () => {
        
        if(props && props.type === 'Responses'){
            
            let array = [];
            
            for(let i = 0; i < 10; i ++) 
                array.push(<div className = 'Loading' style = {{height: '200px', marginBottom: '20px'}}></div>);
            
            return array;
        }
        else if(props && props.type === 'Comments'){
            
            return  <div className = 'Loading' style = {{height: '400px', marginBottom: '20px'}}></div>
            
        }
        else if(props && props.type === 'Question'){
            
            return  <div className = 'Loading' style = {{height: '200px', marginBottom: '20px', marginTop: '35px'}}></div>
            
        }
        else if(props && props.type === 'Avatar'){
            
            return  <div className = 'Loading' style = {{height: '30px', width: '30px', borderRadius: '50%', margin: '0 5px 0 0'}}></div>
            
        }
        else{
            return <div className = 'Loading'>
                        <div className = 'Loading-Wrap'>
                            <div className = 'Loader'></div>
                        </div>
                    </div>
        }
    }
    
    return (loading());
}

export default Loading;