import React                 from 'react'
import { PaperAirplaneIcon } from '@primer/octicons-react'
import '../Styles/Loading.css'

const Loading = ({type, tag}) => {
    
    const loading = () => {
        
        if(type === 'Responses'){
            
            let array = []
            
            for(let i = 0; i < 10; i ++) 
                array.push(
                    <div style = {{alignItems: 'center', display: 'flex', marginBottom: '20px'}} key = {i}>
                        <div className = 'Loading' style = {{height: '60px',  width: '60px', marginRight: '10px'}}/> 
                        <div style = {{width: '100%'}}>
                            <div className = 'Loading' style = {{height: '14px', marginBottom: '10px'}}/>
                            <div className = 'Loading' style = {{height: '14px', width: '75%', marginBottom: '10px'}}/>
                         </div>
                    </div>
                )
            
            return array
        }
        else if(type === 'Comments' || type === 'RelatedContent' || type === 'OneYearAgo'){
            
            return  <div className = 'Loading' style = {{height: '400px', marginBottom: '20px'}}/>
            
        }
        else if(type === 'Question'){
            
            return  <div className = 'Loading' style = {{height: '200px', marginBottom: '20px', marginTop: '35px'}}/>
            
        }
        else if(type === 'Avatar'){
            
            return  <div className = 'Loading' style = {{height: '24px', width: '24px', border: '1px solid rgba(1, 1, 1, 0.05)', borderRadius: '50%', margin: '0 5px 0 0'}}/>
            
        }
        else if(type === 'Reply'){
            
            return (
                <div className = 'Button-Loader'>
                    <PaperAirplaneIcon/>
                </div>
            )
        }
        else{
            return (
                <div className = 'Wheel-Loading'>
                    <div className = 'Loading-Wrap'>
                        {tag}
                        <div className = 'Loader'></div>
                    </div>
                </div>
            )
        }
    }
    
    return (loading())
}

export default Loading