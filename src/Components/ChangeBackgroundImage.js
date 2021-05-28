import React, { useEffect }    from 'react';
import firebase                from '../Functions/Firebase';

const ChangeBackgroundImage = ({user}) => {

    const updateBackground = (e) => {

        let file = e.target.files[0];

        if(file){

            let reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {

                let img = new Image();

                img.src = reader.result;

                img.onload = () => {
                    
                    let resized = resizeMe(img);

                    firebase.database().ref(`users/${user.uid}/backgroundPic`).transaction(value => resized);
                
                }

            }

        }

    }

    const resizeMe = (img) => {
  
        let canvas = document.getElementById('background');
        let ctx = canvas.getContext('2d');

        let ratio = img.height/img.width;

        canvas.width  = 500;
        canvas.height = 500 * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        return canvas.toDataURL("image/jpeg", 0.7); 
      
    }

    const triggerInput = () => {

        document.getElementById('file').click();

    }

    return(
        <React.Fragment>
            <canvas id = 'background' style = {{display: 'none'}}></canvas>
            <input  id = 'file' type = 'file' accept = 'image/*' onChange = {updateBackground} style = {{display: 'none'}}/>
            <button onClick = {triggerInput}>Subir imagen</button>
        </React.Fragment>
    );

}

export default ChangeBackgroundImage;