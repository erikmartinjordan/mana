import React, { useState, useEffect }       from 'react';
import Login                                from './Login';
import PaymentModal                         from './PaymentModal';
import Points                               from '../Functions/PointsAndValues';
import firebase, { auth, environment }      from '../Functions/Firebase';
import GetNumberOfPosts                     from '../Functions/GetNumberOfPosts';
import GetNumberOfReplies                   from '../Functions/GetNumberOfReplies';
import GetNumberOfSpicy                     from '../Functions/GetNumberOfSpicy';
import GetPoints                            from '../Functions/GetPoints';
import GetLevel                             from '../Functions/GetLevelAndPointsToNextLevel';
import ToggleButton                         from '../Functions/ToggleButton';
import AnonymImg                            from '../Functions/AnonymImg';
import AnonymName                           from '../Functions/AnonymName';
import DeleteAccount                        from '../Functions/DeleteAccount';
import DowngradeToFreePlan                  from '../Functions/DowngradeToFreePlan';
import UserAvatar                           from '../Functions/UserAvatar';
import { premium, infinita }                from '../Functions/Stripe';
import Accounts                             from '../Rules/Accounts';
import { SmileyIcon, GraphIcon, StarIcon }  from '@primer/octicons-react';
import '../Styles/Perfil.css';
import '../Styles/UserAvatar.css';
import '../Styles/ToggleButton.css';

const Perfil = (props) => {

    const [infoUser, setInfoUser]                = useState(null);
    const [menu, setMenu]                        = useState('Cuenta');
    const [nextPayment, setNextPayment]          = useState('');
    const [user, setUser]                        = useState([]);
    const [uid, setUid]                          = useState(null);
    const posts                                  = GetNumberOfPosts(uid);
    const replies                                = GetNumberOfReplies(uid);
    const spicy                                  = GetNumberOfSpicy(uid);
    const points                                 = GetPoints(uid)[0];
    const {valuePost, valueReply, valueSpicy}    = Points;
    const [level, pointsToNextLevel, percentage] = GetLevel(points);

    
    useEffect(() => {
        
        document.title = 'Perfil – Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'Este es tu perfil en Nomoresheet...';   
        
    });
    
    useEffect(() => {
        
        auth.onAuthStateChanged(user => {
            
            if(user){
              
                firebase.database().ref(`users/${user.uid}`).on('value', snapshot => {
                    
                    if(snapshot.val()){
                        
                        let {account, subscriptionId} = snapshot.val();
                        
                        if(account === 'premium')  getNextPaymentDate(subscriptionId);
                        if(account === 'infinita') setNextPayment('∞');
                        
                        setInfoUser(snapshot.val());
                        
                    }
                    
                });    
                
                setUser(user);
                setUid(user.uid);
                
            }
            
        });
        
    }, []);
    
    const getNextPaymentDate = async (subscriptionId) => {
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/nextPaymentNomoresheet';
        
        let response = await fetch(fetchURL, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                environment: environment,
                subscriptionId: subscriptionId
            })
            
        });
        
        if(response.ok){
            
            let data = await response.json();
            
            let date = (new Date(data.nextPaymentDate * 1000)).toLocaleDateString();
            
            setNextPayment(date);
            
        }
        
    }
 
    return (
        <div className = 'Perfil'>
            <div className = 'Perfil-Wrap'>
                <Sidebar setMenu = {setMenu}/>
                { menu === 'Cuenta' 
                ? <Account 
                        user = {user} 
                        infoUser = {infoUser} 
                        nextPayment = {nextPayment}
                  />
                : menu === 'Datos'
                ? <Data 
                        posts = {posts} 
                        replies = {replies} 
                        spicy = {spicy} 
                        level = {level} 
                        percentage = {percentage}
                        points = {points}
                        pointsToNextLevel = {pointsToNextLevel} 
                        valuePost = {valuePost}
                        valueReply = {valueReply}
                        valueSpicy = {valueSpicy}
                  />
                : menu === 'Premium'
                ? <Premium
                        user = {user}
                        infoUser = {infoUser}
                  />
                : null
                }
            </div>
            <div className = 'Invisible' onClick = {() => props.hide()}></div>
        </div>
    );
}

export default Perfil;

const Sidebar = ({setMenu}) => {
    
    return(
        <div className = 'Sidebar'>
            <div className = 'First-Menu'>
                <div className = 'Menu-Title'>Menú</div>
                    <div className = 'Item' onClick = {() => setMenu('Cuenta')}><SmileyIcon/>Cuenta</div>
                    <div className = 'Item' onClick = {() => setMenu('Datos')}><GraphIcon/>Datos</div>
                    <div className = 'Item' onClick = {() => setMenu('Premium')}><StarIcon/> Premium</div>
            </div>
        </div>
    );
    
}

const Account = ({user, infoUser, nextPayment}) => {
    
    const anonimizar = () => {
        
        firebase.database().ref(`users/${user.uid}/anonimo/`).transaction(anonimo => {
            
            if(!anonimo){
                
                firebase.database().ref(`users/${user.uid}/nickName/`).transaction(value => AnonymName());
                firebase.database().ref(`users/${user.uid}/avatar/`)  .transaction(value => AnonymImg());
                
            }
            
            return !anonimo ? true : false; 
            
        });
    }
    
    return(
        <div className = 'Datos Cuenta'>
            <div className = 'Bloque'>
                <div className = 'Title'>Imagen</div>
                <UserAvatar user = {user} allowAnonymousUser = {true}/>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Nombre</div>
                <div className = 'Num'>
                    {infoUser?.anonimo ? infoUser.nickName : user.displayName}
                </div>
                <div className = 'Comment'>Nombre que se muestra públicamente.</div>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Correo</div>
                <div className = 'Num'>{user?.email}</div>
                <div className = 'Comment'>Tu correo no se muestra ni se utiliza en ningún momento.</div>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Tipo de cuenta</div>
                <div className = 'Num'>
                    {!infoUser?.account
                    ? 'Gratis'
                    : infoUser?.account === 'premium'
                    ? 'Premium'
                    : infoUser?.account === 'infinita'
                    ? 'Infinita'
                    : null
                    }
                </div>
                <div className = 'Comment'>
                    { infoUser?.account === 'premium' || infoUser?.account === 'infinita'
                    ? `Cuenta válida hasta el ${nextPayment}.`
                    : 'Sube a Premium para disfrutar de Nomoresheet sin limitaciones.'
                    }
                </div>
            </div>
            {Accounts[infoUser?.account]?.anonymMessages
            ? <div className = 'Bloque'>
                    <div className = 'Title'>Anonimizar</div>
                    <div className = 'Toggle' onClick = {() => anonimizar()}>
                        <div className = 'Tag'>Tu nombre real no se mostrará.</div>
                        { infoUser?.anonimo 
                        ? <ToggleButton status = 'on' /> 
                        : <ToggleButton status = 'off' />
                        }
                    </div>
                    <div className = 'Comment'>Se mostrará un alias y foto genérica.</div>
              </div>
            : null}
            <div className = 'Bloque'>
                <div className = 'Title'>Zona de peligro</div>
                <DeleteAccount></DeleteAccount>
            </div>
        </div> 
    );
    
}

const Data = ({posts, replies, spicy, level, pointsToNextLevel, valuePost, valueReply, valueSpicy, percentage, points}) => {
    
    return(
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
    )
    
}

const Premium = ({user, infoUser}) => {
    
    const [confirmation, setConfirmation] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    
    return(
        <div className = 'Datos'>
            <div className = 'Premium'>
                <div className = 'Account-Block'>
                    <div className = 'Account-Type'>Gratis</div>
                    <div className = 'Price'>
                        <span className = 'Quantity'>0 €</span>
                        <span className = 'Comment'></span>
                    </div>
                    { !infoUser?.account
                    ? <div className = 'current'>Plan actual</div>
                    : infoUser?.account === 'premium'
                    ? <button onClick = {() => {setConfirmation(true)}} className = 'send'>Apuntarse</button>
                    : <button disabled = {true} className = 'send'>Tienes tarifa infinita</button>
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
                        <span className = 'Quantity'>{premium.value} €</span>
                        <span className = 'Comment'>anuales</span>
                    </div>
                    { !infoUser?.account
                    ? <button onClick = {() => setPaymentModal('premium')} className = 'send'>Apuntarse</button>
                    : infoUser?.account === 'premium'
                    ? <div className = 'current'>Plan actual</div>
                    : <button disabled = {true} className = 'send'>Tienes tarifa infinita</button>
                    }
                    <ul className = 'Features'>
                        <li>Vota artículos</li>
                        <li>Envía mensajes ilimitados</li>
                        <li>Notificaciones</li>
                        <li>Gana experiencia con puntos y niveles</li>                                
                        <li>Mensajes anónimos</li>
                        <li>Edita y elimina mensajes</li>
                        <li>Añade formato a tus mensajes</li>
                        <li><em>Badge</em> identificativo</li>
                        <li>Lee artículos privados</li>
                    </ul>
                </div>
                <div className = 'Account-Block'>
                    <div className = 'Account-Type'>Infinita</div>
                    <div className = 'Price'>
                        <span className = 'Quantity'>{infinita.value} €</span>
                        <span className = 'Comment'>en un único pago</span>
                    </div>
                    {infoUser?.account === 'infinita' && !infoUser.subscriptionId
                    ?   <div className = 'current'>Plan actual</div>
                    :   <button onClick = {() => setPaymentModal('infinita')} className = 'send'>Apuntarse</button>
                    }
                    <ul className = 'Features'>
                        <li>Vota artículos</li>
                        <li>Envía mensajes ilimitados</li>
                        <li>Notificaciones</li>
                        <li>Gana experiencia con puntos y niveles</li>                                
                        <li>Mensajes anónimos</li>
                        <li>Edita y elimina mensajes</li>
                        <li>Añade formato a tus mensajes</li>
                        <li><em>Badge</em> identificativo</li>
                        <li>Lee artículos privados</li>
                        <li>Paga una única vez y disfruta de Nomoresheet para siempre</li>
                    </ul>
                </div>
            </div>
            <div className = 'Faq'>
                <h3>Preguntas frecuentes</h3>
                <p className = 'Question'>¿Por qué una cuenta <em>premium</em>?</p>
                <p className = 'Answer'>Principalmente, porque gozarás de un uso ilimitado de Nomoresheet. Podrás enviar tantos mensajes como quieras; sin restricciones de tiempo ni de longitud. Además, podrás anonimizar mensajes, editarlos, añadir formato y eliminarlos (obtendrás un identificador como usuario PRO).</p>
                <p className = 'Question'>¿Por qué cuesta dinero la cuenta <em>premium</em>? ¿Por qué son gratis otras plataformas?</p>
                <p className = 'Answer'>El espacio en la nube es costoso. A medida que más usuarios publican en Nomoresheet, más espacio ocupan los datos y más aumentan los gastos de mantenimiento de la web. Las grandes plataformas reciben capital de inversores o tienen ingresos derivados de publicidad. Aquí no hay nada de eso.</p>  
                <p className = 'Question'>¿Qué me ofrece Nomoresheet que no me ofrezcan otras plataformas?</p>
                <p className = 'Answer'>En otras plataformas no tienes libertad para publicar lo que te apetezca. Tus datos son explotados y vendidos a terceras partes, o hay un uso excesivo de publicidad, etc. Nomoresheet intenta ser lo más transparente posible. Puedes leer las políticas de privacidad, son breves y están escritas para que todo el mundo las entienda.</p>
                <p className = 'Question'>¿Puedo cancelar la suscripción en cualquier momento?</p>
                <p className = 'Answer'>Sí, siempre que tú quieras.</p>
            </div>
            {paymentModal
            ? <PaymentModal hide = {() => setPaymentModal(false)} plan = {paymentModal}/>
            : null}
            {confirmation 
            ? <DowngradeToFreePlan subscriptionId = {infoUser.subscriptionId}/>
            : null}
        </div>
    );
    
}