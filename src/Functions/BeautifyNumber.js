const beautifyNumber = (number) => {
    
    let beautyPoints;
    
    if(number < 1000)                      beautyPoints = `${number}`;
    if(number >= 1000 && number < 1000000) beautyPoints = `~${(number/1000).toFixed(1)}k`;
    if(number >= 1000000)                  beautyPoints = `~${(number/1000000).toFixed(1)}m`;
    
    return beautyPoints;
    
}

export default beautifyNumber;