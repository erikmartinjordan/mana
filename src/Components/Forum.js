import React, { useState }            from 'react';
import OrderBy                        from './OrderBy';
import LastQuestions                  from './LastQuestions';
import Comments                       from './Comments';
import LastPosts                      from './LastPosts';
import Ad                             from './Ad';
import '../Styles/Forum.css';

const Front = () => {
    
    const [ready, setReady]       = useState(false);
    const [timeline, setTimeline] = useState('nuevo');
 
    return (
        <div className = 'Forum'>
            <div className = 'Forum-TwoCol'>
                <div className = 'Main'>
                    <OrderBy       timeline = {timeline} setTimeline = {setTimeline}/>
                    <LastQuestions timeline = {timeline} items = {10} tag = {window.location.pathname.split('/').pop()}/>
                </div>
                <div className = 'Sidebar'>
                    <Comments/>
                    <Ad/>
                </div>
            </div>
      </div> 
    );
}

export default Front;
