import React from 'react';
import '../Styles/Loading.css';

const Loading = ({type, tag}) => {
    
    const loading = () => {
        
        if(type === 'Responses'){
            
            let array = [];
            
            for(let i = 0; i < 10; i ++) 
                array.push(<div key = {i} className = 'Loading' style = {{height: '200px', marginBottom: '20px'}}></div>);
            
            return array;
        }
        else if(type === 'Comments' || type === 'RelatedContent'){
            
            return  <div className = 'Loading' style = {{height: '400px', marginBottom: '20px'}}></div>
            
        }
        else if(type === 'Question'){
            
            return  <div className = 'Loading' style = {{height: '200px', marginBottom: '20px', marginTop: '35px'}}></div>
            
        }
        else if(type === 'Avatar'){
            
            return  <div className = 'Loading' style = {{height: '30px', width: '30px', borderRadius: '50%', margin: '0 5px 0 0'}}></div>
            
        }
        else if(type === 'Button'){
            
            return <div className = 'Button-Loader'>
                        <div className = 'Dot'></div>
                        <div className = 'Dot'></div>
                        <div className = 'Dot'></div>
                   </div>
        }
        else{
            return <div className = 'Wheel-Loading'>
                        <div className = 'Loading-Wrap'>
                            {tag}
                            <div className = 'Loader'></div>
                        </div>
                    </div>
        }
    }
    
    return (loading());
}

export default Loading;