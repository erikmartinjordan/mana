import React, { useState }            from 'react';
import OrderBy                        from './OrderBy';
import LastQuestions                  from './LastQuestions';
import Comments                       from './Comments';
import OneYearAgo                     from './OneYearAgo';
import '../Styles/Forum.css';

const Front = () => {
    
    const [filter, setFilter] = useState('nuevo');
    const [from , setFrom]    = useState(null);
    const [to, setTo]         = useState(null);
 
    return (
        <div className = 'Forum'>
            <div className = 'Forum-TwoCol'>
                <div className = 'Main'>
                    <OrderBy       
                        filter    = {filter}
                        setFilter = {setFilter}
                        setFrom   = {setFrom} 
                        setTo     = {setTo}
                    />
                    <LastQuestions 
                        number    = {10} 
                        from      = {from} 
                        to        = {to} 
                        filter    = {filter} 
                    />
                </div>
                <div className = 'Sidebar'>
                    <Comments/>
                    <OneYearAgo/>
                </div>
            </div>
      </div> 
    );
}

export default Front;
