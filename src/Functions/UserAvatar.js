import React, { useState, useEffect } from 'react';
import firebase                       from '../Functions/Firebase.js';
import GetPoints                      from '../Functions/GetPoints.js';
import GetLevel                       from '../Functions/GetLevelAndPointsToNextLevel.js';
import '../Styles/UserAvatar.css';

const UserAvatar = (props) => {  
    
    const [picture, setPicture] = useState(null);
    const [premium, setPremium] = useState(null);
    
    const points     = GetPoints(props.user.uid);
    const level      = GetLevel(...points)[0];
    const percentage = GetLevel(...points)[2];
    
    useEffect( () => {
        
        // Reference
        let ref = firebase.database().ref('users/' + props.user.uid);
        
        // Getting user's properties
        let listener = ref.on( 'value', snapshot => {
            
            if(snapshot.val()){
                
                var capture = snapshot.val();
                
                // If user is anonymous, load avatar
                capture.anonimo
                ? setPicture(capture.avatar)
                : setPicture(props.user.photoURL);
                
                // Setting all the info of the user
                capture.account === 'premium'
                ? setPremium(true)
                : setPremium(false)
            }
            
        });
        
        // Removing listener
        return () => ref.off('value', listener);
        
    }, [props.user]);
    
    
    let badge = <svg version="1.1" viewBox="0.0 0.0 176.7270341207349 100.0"><clipPath id="p.0"><path d="m0 0l176.72704 0l0 100.0l-176.72704 0l0 -100.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l176.72704 0l0 100.0l-176.72704 0z" fill-rule="evenodd"/><path fill="#778dff" d="m16.667 0l160.0574 0c3.8146973E-4 0 7.6293945E-4 1.5515937E-4 0.0010375977 4.3134484E-4c2.746582E-4 2.7618546E-4 4.272461E-4 6.507733E-4 4.272461E-4 0.0010413586l-0.0014648438 83.33153c0 9.204933 -7.4620667 16.667 -16.667007 16.667l-160.0574 0l2.5368E-19 0c-8.1335165E-4 0 -0.0014727034 -6.5612793E-4 -0.0014727034 -0.0014724731l0.0014727034 -83.33153l0 0c0 -9.204929 7.46207 -16.667 16.667 -16.667z" fill-rule="evenodd"/><path fill="#ffffff" d="m34.98504 48.8125l3.3125 0q4.65625 0 6.96875 -1.84375q2.3125 -1.84375 2.3125 -5.359375q0 -3.546875 -1.9375 -5.234375q-1.9375 -1.6875 -6.0625 -1.6875l-4.59375 0l0 14.125zm22.78125 -7.5625q0 7.6875 -4.796875 11.765625q-4.796875 4.0625 -13.65625 4.0625l-4.328125 0l0 16.921875l-10.093752 0l0 -47.578125l15.203127 0q8.65625 0 13.15625 3.734375q4.515625 3.718752 4.515625 11.093752zm19.074188 6.296875l3.25 0q4.796875 0 7.0625 -1.59375q2.28125 -1.609375 2.28125 -5.015625q0 -3.390625 -2.328125 -4.8125q-2.328125 -1.4375 -7.203125 -1.4375l-3.0625 0l0 12.859375zm0 8.1875l0 18.265625l-10.09375 0l0 -47.578125l13.875 0q9.6875 0 14.34375 3.53125q4.65625 3.531252 4.65625 10.718752q0 4.203125 -2.3125 7.46875q-2.3125 3.265625 -6.53125 5.125q10.734375 16.046875 13.984375 20.734375l-11.1875 0l-11.359375 -18.265625l-5.375 0zm77.09728 -5.59375q0 11.8125 -5.859375 18.171875q-5.84375 6.34375 -16.78125 6.34375q-10.937492 0 -16.796867 -6.34375q-5.859375 -6.359375 -5.859375 -18.234375q0 -11.875 5.875 -18.140627q5.875 -6.265625 16.843742 -6.265625q10.96875 0 16.765625 6.3125q5.8125 6.312502 5.8125 18.156252zm-34.718742 0q0 7.96875 3.015625 12.015625q3.03125 4.03125 9.062492 4.03125q12.0625 0 12.0625 -16.046875q0 -16.078125 -12.0 -16.078125q-6.0312424 0 -9.093742 4.0625q-3.046875 4.046875 -3.046875 12.015625z" fill-rule="nonzero"/></g></svg>;
    
    return (
        <div className = {`Progress ProgressBar-${percentage}`}>
            <img src = {picture}></img>
            {premium && badge}
        </div>
    );
  
}

export default UserAvatar;
