import React, { useContext, useState, useEffect }                   from 'react'
import {  GraphIcon, StarIcon, InboxIcon, SignOutIcon }             from '@primer/octicons-react'
import PaymentModal                                                 from './PaymentModal'
import ConnectToStripe                                              from './ConnectToStripe'
import Notifications                                                from './Notifications'
import UserAvatar                                                   from './UserAvatar'
import ToggleButton                                                 from './ToggleButton'
import DeleteAccount                                                from './DeleteAccount'
import DowngradeToFreePlan                                          from './DowngradeToFreePlan'
import ChangeBio                                                    from './ChangeBio'
import ChangeLocation                                               from './ChangeLocation'
import ChangeWebsite                                                from './ChangeWebsite'
import UserContext                                                  from '../Functions/UserContext'
import Points                                                       from '../Functions/PointsAndValues'
import { auth, db, environment, onValue, ref, runTransaction }      from '../Functions/Firebase'
import GetNumberOfPosts                                             from '../Functions/GetNumberOfPosts'
import GetNumberOfReplies                                           from '../Functions/GetNumberOfReplies'
import GetPoints                                                    from '../Functions/GetPoints'
import GetLevel                                                     from '../Functions/GetLevelAndPointsToNextLevel'
import AnonymImg                                                    from '../Functions/AnonymImg'
import AnonymName                                                   from '../Functions/AnonymName'
import { premium, infinita }                                        from '../Functions/Stripe'
import Accounts                                                     from '../Rules/Accounts'
import '../Styles/Perfil.css'
import '../Styles/UserAvatar.css'
import '../Styles/ToggleButton.css'

const Profile = (props) => {

    const [infoUser, setInfoUser]                = useState(null)
    const [menu, setMenu]                        = useState(props.menu ? props.menu : 'Notif')
    const [nextPayment, setNextPayment]          = useState('')
    const [uid, setUid]                          = useState(null)
    const posts                                  = GetNumberOfPosts(uid)
    const replies                                = GetNumberOfReplies(uid)
    const points                                 = GetPoints(uid)
    const { valuePost, valueReply }              = Points
    const [level, pointsToNextLevel, percentage] = GetLevel(points)
    const { user }                               = useContext(UserContext)
    
    useEffect(() => {
        
        document.title = 'Perfil – Nomoresheet' 
        document.querySelector('meta[name="description"]').content = 'Este es tu perfil en Nomoresheet...'   
        
    })
    
    useEffect(() => {
        
        if(user){
            
            let unsubscribe = onValue(ref(db,`users/${user.uid}`), snapshot => {
                
                if(snapshot.val()){
                    
                    let {account, subscriptionId} = snapshot.val()
                    
                    if(account === 'premium')  getNextPaymentDate(subscriptionId)
                    if(account === 'infinita') setNextPayment('∞')
                    
                    setInfoUser(snapshot.val())
                    
                }
                
            })    
            
            setUid(user.uid)

            return () => unsubscribe()
            
        }    
        
    }, [user])
    
    const getNextPaymentDate = async (subscriptionId) => {
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/nextPaymentNomoresheet'
        
        let response = await fetch(fetchURL, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                environment: environment,
                subscriptionId: subscriptionId
            })
            
        })
        
        if(response.ok){
            
            let data = await response.json()
            
            let date = (new Date(data.nextPaymentDate * 1000)).toLocaleDateString()
            
            setNextPayment(date)
            
        }
        
    }
 
    return (
        <div className = 'Perfil'>
            <div className = 'Perfil-Wrap'>
                <Sidebar 
                    menu = {menu} 
                    setMenu = {setMenu}
                    hide = {props.hide}
                    user = {user}
                />
                { menu === 'Notif'
                ? <Notifications
                    user = {user}
                    hide = {props.hide}
                  />
                : menu === 'Cuenta' 
                ? <Account 
                    user = {user} 
                    infoUser = {infoUser} 
                    nextPayment = {nextPayment}
                    uid = {uid}
                  />
                : menu === 'Datos'
                ? <Data 
                    posts = {posts} 
                    replies = {replies} 
                    level = {level} 
                    percentage = {percentage}
                    points = {points}
                    pointsToNextLevel = {pointsToNextLevel} 
                    valuePost = {valuePost}
                    valueReply = {valueReply}
                  />
                : menu === 'Premium'
                ? <Premium
                    user = {user}
                    infoUser = {infoUser}
                  />
                : null
                }
            </div>
            <div className = 'Invisible' onClick = {props.hide}></div>
        </div>
    )
}

export default Profile

const Sidebar = ({menu, setMenu, hide, user}) => {

    const selected = (item) => menu === item ? 'Item Selected' : 'Item'

    const logout = () => {

        hide()

        auth.signOut()

    }
    
    return(
        <div className = 'Sidebar'>
            <div className = 'First-Menu'>
                <div className = 'BackButtonmobile'        onClick = {hide}>← Volver</div>
                <div className = 'Menu-Title'>Menú</div>
                    <div className = {selected('Cuenta')}  onClick = {() => setMenu('Cuenta')}><img src = {user.photoURL}/>Cuenta</div>
                    <div className = {selected('Notif')}   onClick = {() => setMenu('Notif')}><InboxIcon/>Notificaciones</div>
                    <div className = {selected('Datos')}   onClick = {() => setMenu('Datos')}><GraphIcon/>Datos</div>
                    <div className = {selected('Premium')} onClick = {() => setMenu('Premium')}><StarIcon/>Premium</div>
                    <div className = 'Item'                onClick = {logout}><SignOutIcon/>Cerrar sesión</div>
            </div>
        </div>
    )
    
}

const Account = ({user, infoUser, nextPayment, uid}) => {
    
    const anonimizar = () => {

        runTransaction(ref(db, `users/${user.uid}/nickName`), nickName => nickName ? null : AnonymName())
        runTransaction(ref(db, `users/${user.uid}/avatar`), avatar => avatar ? null : AnonymImg())

    }
    
    return(
        <div className = 'Datos Cuenta'>
            <div className = 'Bloque'>
                <div className = 'Title'>Imagen</div>
                <UserAvatar user = {user}/>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Nombre</div>
                <div className = 'Num'>
                    {infoUser.nickName || user.displayName}
                </div>
                <div className = 'Comment'>Nombre que se muestra públicamente.</div>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Bio</div>
                <ChangeBio user = {user}/>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Ciudad</div>
                <ChangeLocation user = {user}/>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Web</div>
                <ChangeWebsite user = {user}/>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Enlace público</div>
                <div className = 'Num'>
                    <a href = {`@${uid}`}>@{uid}</a>
                </div>
                <div className = 'Comment'>Enlace a tu perfil público.</div>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Correo</div>
                <div className = 'Num'>{user?.email}</div>
                <div className = 'Comment'>Tu correo no se muestra públicamente ni se utiliza en ningún momento.</div>
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
                    <div className = 'Toggle' onClick = {anonimizar}>
                        <div className = 'Tag'>Tu nombre real no se mostrará.</div>
                        { infoUser?.nickName
                        ? <ToggleButton status = 'on' /> 
                        : <ToggleButton status = 'off' />
                        }
                    </div>
                    <div className = 'Comment'>Se mostrará un alias y foto genérica.</div>
              </div>
            : null}
            <div className = 'Bloque'>
                <div className = 'Title'>Donaciones</div>
                <ConnectToStripe user = {user}/>
                <div className = 'Comment'>Los usuarios podrán invitarte a un café virtual por tu buen hacer.</div>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Zona de peligro</div>
                <DeleteAccount></DeleteAccount>
            </div>
        </div> 
    )
    
}

const Data = ({posts, replies, level, pointsToNextLevel, valuePost, valueReply, percentage, points}) => {
    
    return(
        <div className = 'Datos'>
            <div className = 'Bloque'>
                <div className = 'Title'>Publicaciones</div>
                <div className = 'Num'>{posts}</div>
                <div className = 'Comment'>Se muestran el número de publicaciones. Publicando un artículo, sumas {valuePost} puntos.</div>
            </div>
            <div className = 'Bloque'>
                <div className = 'Title'>Respuestas</div>
                <div className = 'Num'>{replies}</div>
                <div className = 'Comment'>Se muestran el número de respuestas que has publicado. Por cada respuesta, sumas {valueReply} puntos.</div>
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
    
    const [confirmation, setConfirmation] = useState(false)
    const [paymentModal, setPaymentModal] = useState(false)
    
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
                    : <button disabled = {true}>Tienes tarifa infinita</button>
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
                    ? <button onClick = {() => setPaymentModal('premium')} className = 'send' disabled = {user?.isAnonymous}>Apuntarse</button>
                    : infoUser?.account === 'premium'
                    ? <div className = 'current'>Plan actual</div>
                    : <button disabled = {true}>Tienes tarifa infinita</button>
                    }
                    <ul className = 'Features'>
                        <li>Vota artículos</li>
                        <li>Envía mensajes ilimitados</li>
                        <li>Notificaciones</li>
                        <li>Gana experiencia con puntos y niveles</li>                                
                        <li>Mensajes anónimos</li>
                        <li>Edita y elimina mensajes</li>
                        <li><em>Badge</em> identificativo</li>
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
                    :   <button onClick = {() => setPaymentModal('infinita')} className = 'send' disabled = {user?.isAnonymous}>Apuntarse</button>
                    }
                    <ul className = 'Features'>
                        <li>Vota artículos</li>
                        <li>Envía mensajes ilimitados</li>
                        <li>Notificaciones</li>
                        <li>Gana experiencia con puntos y niveles</li>                                
                        <li>Mensajes anónimos</li>
                        <li>Edita y elimina mensajes</li>
                        <li><em>Badge</em> identificativo</li>
                        <li>Paga una única vez y disfruta de Nomoresheet para siempre</li>
                    </ul>
                </div>
            </div>
            <div className = 'Faq'>
                <h3>Preguntas frecuentes</h3>
                <p className = 'Question'>¿Por qué una cuenta <em>premium</em>?</p>
                <p className = 'Answer'>Principalmente, porque gozarás de un uso ilimitado de Nomoresheet. Podrás enviar tantos mensajes como quieras sin restricciones de tiempo ni de longitud. Además, podrás anonimizar mensajes, editarlos, añadir formato y eliminarlos (obtendrás un identificador como usuario PRO).</p>
                <p className = 'Question'>¿Por qué cuesta dinero la cuenta <em>premium</em>? ¿Por qué son gratis otras plataformas?</p>
                <p className = 'Answer'>El espacio en la nube es costoso. A medida que más usuarios publican en Nomoresheet, más espacio ocupan los datos y más aumentan los gastos de mantenimiento de la web. Las grandes plataformas reciben capital de inversores o tienen ingresos derivados de publicidad. Aquí no hay nada de eso.</p>  
                <p className = 'Question'>¿Qué me ofrece Nomoresheet que no me ofrezcan otras plataformas?</p>
                <p className = 'Answer'>En otras plataformas no tienes libertad para publicar lo que te apetezca. Tus datos son explotados y vendidos a terceras partes, o hay un uso excesivo de publicidad, etc. Nomoresheet intenta ser lo más transparente posible. Puedes leer las políticas de privacidad, son breves y están escritas para que todo el mundo las entienda.</p>
                <p className = 'Question'>¿Puedo cancelar la suscripción en cualquier momento?</p>
                <p className = 'Answer'>Sí, siempre que tú quieras.</p>
            </div>
            { paymentModal 
            ? <PaymentModal 
                hide = {() => setPaymentModal(false)} 
                plan = {paymentModal}/> 
            : null}
            { confirmation 
            ? <DowngradeToFreePlan 
                subscriptionId = {infoUser.subscriptionId} 
                confirmation = {confirmation} 
                setConfirmation = {setConfirmation}/> 
            : null 
            }
        </div>
    )
    
}