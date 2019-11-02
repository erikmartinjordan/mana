import React, { useState, useEffect } from 'react';
import firebase, { auth } from '../Functions/Firebase.js';
import PaymentModal from './PaymentModal.js';
import Login from './Login.js';
import GetNumberOfPosts from '../Functions/GetNumberOfPosts.js';
import GetNumberOfReplies from '../Functions/GetNumberOfReplies.js';
import GetNumberOfSpicy from '../Functions/GetNumberOfSpicy.js';
import GetPoints from '../Functions/GetPoints.js';
import GetLevel from '../Functions/GetLevelAndPointsToNextLevel.js';
import ToggleButton from '../Functions/ToggleButton.js';
import AnonymImg from '../Functions/AnonymImg.js';
import DeleteAccount from '../Functions/DeleteAccount.js';
import NightModeToggleButton from '../Functions/NightModeToggleButton.js';
import Accounts from '../Rules/Accounts.js';
import DowngradeToFreePlan from '../Functions/DowngradeToFreePlan.js';
import '../Styles/Perfil.css';
import '../Styles/Progressbar.css';
import '../Styles/ToggleButton.css';

const Perfil = (props) => {

    const [confirmation, setConfirmation] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [infoUser, setInfoUser] = useState(null);
    const [lastSignIn, setLastSignIn] = useState(null);
    const [menu, setMenu] = useState('Cuenta');
    const [render, setRender] = useState(true);
    const [user, setUser] = useState(null);
    const [uid, setUid] = useState(null);
    const posts = GetNumberOfPosts(uid);
    const replies = GetNumberOfReplies(uid);
    const spicy = GetNumberOfSpicy(uid);
    const points = GetPoints(posts, replies, spicy)[0];
    const valuePost = GetPoints(posts, replies, spicy)[1];
    const valueReply = GetPoints(posts, replies, spicy)[2];
    const valueSpicy = GetPoints(posts, replies, spicy)[3];
    const level = GetLevel(points)[0];
    const pointsToNextLevel = GetLevel(points)[1];
    const percentage = GetLevel(points)[2];
    
    
    useEffect( () => {
        
        // Meta and title
        document.title = 'Perfil – Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'Este es tu perfil en Nomoresheet...';   
        
        // Drawing emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
                
    });
        
    useEffect( () => {
    
        auth.onAuthStateChanged( user => {

            if(user){
              
                var date = new Date(parseInt(user.metadata.b));
                                
                firebase.database().ref('users/' + user.uid).on( 'value', (snapshot) => {

                  setInfoUser(snapshot.val());

                });    

                setRender(false);
                setUser(user);
                setUid(user.uid);
                setLastSignIn(`Has accedido por última vez: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} a las ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}`);
            }
        });
        
    }, []);
  
    const anonimizar = () => {

        firebase.database().ref('users/' + user.uid + '/anonimo/').transaction( (value) =>  {

            // Necesitamos anonimizar el nombre y el avatar
            if(value === null || value === false){
                firebase.database().ref('users/' + user.uid + '/nickName/').transaction( (value) => {
                    return Math.random().toString(36).substr(2, 5);
                });
                firebase.database().ref('users/' + user.uid + '/avatar/').transaction( (value) => {
                    return AnonymImg();
                });
            }

            // Devolvemos el resultado
            return value === null ? true : !value; 

        });
    }
       
    return (
        <div className = 'Perfil'>
            <div className = 'Perfil-Wrap'>
                <div className = 'Sidebar'>
                    <div className = 'First-Menu'>
                        <div className = 'Menu-Title'>Menú</div>
                        <div className = 'Item' onClick = {() => setMenu('Cuenta')}>🐨 Cuenta</div>
                        <div className = 'Item' onClick = {() => setMenu('Datos')}>📈 Datos</div>
                        <div className = 'Item' onClick = {() => setMenu('Premium')}>✨ Premium</div>
                        <div className = 'Separator'></div>
                        <div className = 'Item'>Modo noche <NightModeToggleButton></NightModeToggleButton></div>
                        <div className = 'Separator'></div>
                    </div>
                    <div className = 'Last-Menu'>
                        {lastSignIn}
                    </div>
                </div>
                {menu === 'Cuenta' &&
                <div className = 'Datos Cuenta'>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Imagen</div>
                        <div className = {'Progress ProgressBar-' + percentage}>
                            {user && infoUser && infoUser.anonimo  && <img src = {infoUser.avatar}></img>}
                            {user && infoUser && !infoUser.anonimo && <img src = {user.photoURL}></img>}
                            {user && infoUser && infoUser.account === 'premium' && <div className = 'Tag'>✨</div>}
                        </div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Nombre</div>
                        <div className = 'Num'>
                            {user && infoUser && infoUser.anonimo  && infoUser.nickName}
                            {user && infoUser && !infoUser.anonimo && user.displayName}
                        </div>
                        <div className = 'Comment'>Nombre que se muestra públicamente.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Correo</div>
                        <div className = 'Num'>{user && user.email}</div>
                        <div className = 'Comment'>Tu correo no se muestra ni se utiliza en ningún momento.</div>
                    </div>
                    {user && infoUser && infoUser.account && Accounts[infoUser.account].anonymMessages && 
                    <div className = 'Bloque'>
                            <div className = 'Title'>Anonimizar</div>
                            <div className = 'Toggle' onClick = {() => anonimizar()}>
                                <div className = 'Tag'>Tu nombre real no se mostrará.</div>
                                { infoUser && infoUser.anonimo 
                                ? <ToggleButton status = 'on' /> 
                                : <ToggleButton status = 'off' />
                                }
                            </div>
                            <div className = 'Comment'>Se mostrará un alias y foto genérica.</div>
                    </div>}
                    <div className = 'Bloque'>
                        <div className = 'Title'>Zona de peligro</div>
                        <DeleteAccount></DeleteAccount>
                    </div>
                </div>    
                }
                {menu === 'Datos' &&
                <div className = 'Datos'>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Artículos</div>
                        <div className = 'Num'>{posts}</div>
                        <div className = 'Comment'>Se muestran el número de artículos totales publicados. Publicando un artículo, sumas {valuePost} puntos.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Respuestas</div>
                        <div className = 'Num'>{replies}</div>
                        <div className = 'Comment'>Se muestran el número de respuestas que has publicado. Por cada respuesta, sumas {valueReply} puntos.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Picante</div>
                        <div className = 'Num'>{spicy}🌶️</div>
                        <div className = 'Comment'>Se muestran el número de veces que te han dado picante. Por cada voto de picante, sumas {valueSpicy} puntos.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Puntos</div>
                        <div className = 'Num'>{points.toLocaleString()}</div>
                        <div className = 'Comment'>Se muestran el número de puntos totales conseguidos hasta el momento.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Nivel</div>
                        <div className = 'Num'>{level}</div>
                        <div className = 'Bar'>
                            <div className = 'Completed' style = {{width: percentage + '%'}}></div>
                        </div>
                        <div className = 'Comment'>{pointsToNextLevel} puntos para el siguiente nivel ({percentage}% completado).</div>
                    </div>
                </div>
                }
                {menu === 'Premium' &&
                <div className = 'Datos'>
                    <div className = 'Premium'>
                        <div className = 'Account-Block'>
                            <div className = 'Account-Type'>Gratis</div>
                            <div className = 'Price'>
                                <span className = 'Quantity'>0 €</span>
                                <span className = 'Comment'></span>
                            </div>
                            {user && infoUser && (!infoUser.account || infoUser.account === 'free')
                            ?   <div className = 'current'>Plan actual</div>
                            :   <button onClick = {() => {setConfirmation(true)}} className = 'send'>Apuntarse</button>
                            }
                            <ul className = 'Features'>
                                <li>Vota artículos</li>
                                <li>Envía mensajes con límites</li>
                                <li>Notificaciones</li>
                                <li>Gana experiencia con puntos y niveles</li>
                            </ul>
                        </div>
                        <div className = 'Account-Block'>
                            <div className = 'Account-Type'>Premium</div>
                            <div className = 'Price'>
                                <span className = 'Quantity'>19 €</span>
                                <span className = 'Comment'>anuales</span>
                            </div>
                            {user && infoUser && infoUser.account === 'premium'
                            ?   <div className = 'current'>Plan actual</div>
                            :   <button onClick = {() => setPaymentModal(true)} className = 'send'>Apuntarse</button>
                            }
                            <ul className = 'Features'>
                                <li>Vota artículos</li>
                                <li>Envía mensajes ilimitados</li>
                                <li>Notificaciones</li>
                                <li>Gana experiencia con puntos y niveles</li>                                
                                <li>Mensajes anónimos</li>
                                <li><em>Badge</em> identificativo</li>
                            </ul>
                        </div>
                    </div>
                    <div className = 'Faq'>
                        <h3>Preguntas frecuentes</h3>
                        <p className = 'Question'>¿Por qué una cuenta <em>premium</em>?</p>
                        <p className = 'Answer'>Principalmente, porque como usuario <em>premium</em> gozas de un uso ilimitado de Nomoresheet. Puedes enviar tantos mensajes como quieras; sin restricciones de tiempo ni de longitud.</p>
                        <p className = 'Question'>¿Por qué cuesta dinero la cuenta <em>premium</em>? ¿Por qué son gratis otras plataformas?</p>
                        <p className = 'Answer'>El espacio en la nube es costoso. A medida que más usuarios publican en Nomoresheet, más espacio ocupan los datos y más aumentan los gastos de mantenimiento de la web. Las grandes plataformas reciben capital de inversores o tienen ingresos derivados de publicidad.</p>  
                        <p className = 'Question'>¿Qué me ofrece Nomoresheet que no me ofrezcan otras plataformas?</p>
                        <p className = 'Answer'>En otras redes sociales no tienes libertad para publicar lo que te apetezca. Tus datos son explotados y vendidos a terceras partes, o hay un uso excesivo de publicidad, etc.</p>
                        <p className = 'Question'>¿Puedo cancelar la suscripción en cualquier momento?</p>
                        <p className = 'Answer'>Sí, siempre que tú quieras.</p>
                     
                    </div>
                </div>
                }
            </div>
            <div>{render && <Login hide = {() => setRender(false)}></Login>}</div>
            {paymentModal && <PaymentModal percentage = {percentage} hide = {() => setPaymentModal(false)}></PaymentModal>}
            {confirmation && <DowngradeToFreePlan subscriptionId = {infoUser.subscriptionId}></DowngradeToFreePlan>}
            <div className = 'Invisible' onClick = {() => props.hide()}></div>
        </div>
    );
}

export default Perfil;
