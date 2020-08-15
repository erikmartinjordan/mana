import React, { useEffect, useState } from 'react';

const Donate = () => {
    
    const [showDonation, setShowDonation] = useState(false);
    
    const inviteCoffes = (amountInEur) => {
        
        
        
    }
    
    return(
        
        <div className = 'Donate'>
            <button onClick = {() => setShowDonation(true)}>Invitar a un café</button>
        </div>
        
    );
    
}

export default Donate;