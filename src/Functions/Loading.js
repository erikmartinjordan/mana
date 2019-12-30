import React from 'react';
import '../Styles/Loading.css';

const Loading = (props) => {
    
    const loading = () => {
        
        /*
         * This is the box loader on the main page
         * */
        if(props && props.page === 'Main'){
                    
            return <div className = 'Forum-TwoCol'>
                        <div className = 'Main'>
                            <div className = 'OrderBy'>
                                <div className = 'Loading'></div>
                                <div className = 'Loading'></div>
                                <div className = 'Loading'></div>
                            </div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>                       
                        </div>
                        <div className = 'Sidebar'>
                            <div className = 'Loading'></div> 
                            <div className = 'Loading'></div> 
                        </div>
                    </div>
        }
        /*
         * This is the loader by default
         * */
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