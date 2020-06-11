import React, { useEffect } from 'react';
import { Link }             from 'react-router-dom';
import '../Styles/Privacy.css';

const Privacy = () => {
  
    return (
        <div className = 'Privacy'>
            <h2>Datos generados</h2>
            <p>Las estadísticas de tráfico de la web se pueden consultar en <Link to = '/estadisticas'>este enlace</Link>. Nomoresheet también guarda datos de tráfico en Google Analytics. Los datos no tienen carácter personal; son anónimos. En un futuro, Nomoresheet quiere dejar de depender de aplicaciones de terceros para generar estadísticas de tráfico y los datos que se recojan tendrán carácter público y se podrán consultar en <Link to = '/estadisticas'>este enlace</Link>. </p>
            
            <h2>Publicaciones</h2>
            <p>Es necesario tener una cuenta de Google para publicar. El inicio de sesión con una cuenta de Google permite controlar los mensajes de <em>bots</em> y evitar el <em>spam</em>.</p> 
            <p>Los mensajes que se publiquen serán visibles para todos aquellos usuarios que visiten la web y serán publicados con el mismo nombre que figura en la cuenta de Google asociada. Los usuarios obtienen más privilegios a medida que aumenta su reputación en la web. Así la comunidad puede crecer de forma sana.</p>
            <p>Como usuario tienes derecho a borrar tu cuenta y todos tus mensajes serán anonimizados. El contenido de tus publicaciones no se eliminará pues puede seguir siendo relevante para otros usuarios.</p>
            
            <h2>Pagos</h2>
            <p>Una cuenta <em>premium</em> permite obtener todos los privilegios de Nomoresheet de forma inmediata. Los pagos se realizan de forma segura vía <Link to = 'https://stripe.com/es'>Stripe</Link>.</p>
            <p>Ojo, no es necesario tener una cuenta de pago para obtener todos los privilegios de una cuenta <em>premium</em>, también se pueden obtener sumando puntos y aumentando de nivel en la comunidad.</p>
        </div>
    );
    
}

export default Privacy;