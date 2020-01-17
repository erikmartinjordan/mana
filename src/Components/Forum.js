import React, { useState, useEffect } from 'react';
import OrderBy                        from './OrderBy';
import LastQuestions                  from './LastQuestions';
import Comments                       from './Comments';
import LastPosts                      from './LastPosts';
import '../Styles/Forum.css';

const Front = () => {
    
    return (
        <div className = 'Forum'>
            <div className = 'Forum-TwoCol'>
                <div className = 'Main'>
                    <OrderBy/>
                    <LastQuestions items = {10}/>
                </div>
                <div className = 'Sidebar'>
                    <Comments/>
                    <LastPosts items = {5}/>
                </div>
            </div>
      </div> 
    );
}

export default Front;
