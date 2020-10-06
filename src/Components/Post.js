import React, { useState, useEffect }            from 'react';
import moment                                    from 'moment';
import ReactMarkdown                             from 'react-markdown';
import Default                                   from './Default';
import Login                                     from './Login';
import Perfil                                    from './Perfil';
import Twemoji                                   from './Twemoji';
import firebase, { auth, provider }              from '../Functions/Firebase';
import GetLevel                                  from '../Functions/GetLevelAndPointsToNextLevel';
import GetPoints                                 from '../Functions/GetPoints';
import Data                                      from '../Posts/_data';
import '../Styles/Post.css';

const Post = () => {
    
    const [date, setDate]                       = useState(['', '', '']);
    const [description, setDescription]         = useState(null);
    const [error, setError]                     = useState(false);
    const [likes, setLikes]                     = useState('');
    const [login, setLogin]                     = useState(false);
    const [numPrivatePosts, setNumPrivatePosts] = useState(0);
    const [perfil, setPerfil]                   = useState(false);
    const [premium, setPremium]                 = useState(false);
    const [privateArticle, setPrivateArticle]   = useState(false);
    const [superlikes, setSuperlikes]           = useState('');
    const [text, setText]                       = useState('');
    const [title, setTitle]                     = useState('');
    const [user, setUser]                       = useState(false);
    const [views, setViews]                     = useState(0);
    const points                                = GetPoints(user ? user.uid : 0);
    
    const level                                 = GetLevel(...points)[0];
    const levelLimit                            = 20;
    const timeLimitPrivateArticleInMonths       = 2;
    const url                                   = window.location.pathname.split('/').pop();
    
    useEffect( () => {
        
        document.title = `${title} - Nomoresheet`; 
        document.querySelector(`meta[name = 'description']`).content = description; 
        
        window.scrollTo(0, 0);
        
    });
    
    useEffect( () => {
        
        if(privateArticle){
            document.querySelector(`meta[name = 'robots']`).content = 'noindex';
        }
        
    }, [privateArticle]);
    
    useEffect( () => {
        
        auth.onAuthStateChanged( user => {
            
            if(user)
                setUser(user);
            else
                setUser(null);
            
        });
        
    }, []);
    
    useEffect( () => {
        
        if(user){
            
            firebase.database().ref(`users/${user.uid}/account`).on('value', snapshot => {
                
                if(snapshot.val()) {
                    
                    setPremium(true);
                    
                }
                
            });
            
        }
        
    }, [user]);
    
    useEffect( () => {
        
        let numPrivatePosts = Object.values(Data).reduce( (accumulator, post) => {
            
            let [day, month, year] = [post.date[0], post.date[1], post.date[2]];
            
            let postDate = moment().year(year).month(month).date(day).format('YYYYMMDD');
            let today    = moment();
            
            let monthsSincePostWasPublished = today.diff(postDate, 'months');
            
            if(monthsSincePostWasPublished < timeLimitPrivateArticleInMonths || post.privat) accumulator ++;
            
            return accumulator;
            
        }, 0);
        
        setNumPrivatePosts(numPrivatePosts);
        
    }, []);

    useEffect( () => { 
        
        const fetchData = async () => {
         
            try{
                
                const readmePath = require(`../Posts/${url}.md`); 
                
                let resp = await fetch(readmePath);
                let text = await resp.text();
                
                let [title, date, description] = [Data[url].title, Data[url].date, Data[url].description];
                let [day, month, year] = [date[0], date[1], date[2]];
                
                let postDate = moment().year(year).month(month).date(day).format('YYYYMMDD');
                let today    = moment();
                
                let monthsSincePostWasPublished = today.diff(postDate, 'months');

                if('privat' in Data[url]){
                    setPrivateArticle(Data[url].privat);
                }
                else if(monthsSincePostWasPublished < timeLimitPrivateArticleInMonths){
                    setPrivateArticle(true);
                }
                
                setTitle(title);
                setDate(date);
                setDescription(description);
                setText(text);
                
                firebase.database().ref(`articles/${url}`).on('value', snapshot => {
                    
                    if(snapshot.val()){
                        
                        let [views, likes, superlikes] = [snapshot.val().views, snapshot.val().likes, snapshot.val().superlikes];
                        
                        setViews(views);
                        setLikes(likes);
                        setSuperlikes(superlikes);
                        
                    }
                    
                })
                
                firebase.database().ref(`articles/${url}/views/`).transaction( value => value + 1 );
                
            }
            catch(e){
                
                setError(true);
                
            }
            
        }
        
        fetchData();
        
    }, [url]);
    
    const handleLikes = () => {
        
        firebase.database().ref(`articles/${url}/likes/`).transaction(value => value + 1);
        
    }
    
    const handleSuperLikes  = () => {
        
        firebase.database().ref(`articles/${url}/superlikes/`).transaction(value => value + 1);
        
    }
    
    return (
        <div className = 'Post'>
            { error
            ? <Default/>
            : <React.Fragment>
                <Header
                   title            = {title}
                   date             = {date}
                   user             = {user}
                   views            = {views}
                   likes            = {likes}
                   superlikes       = {superlikes}
                   handleLikes      = {handleLikes}
                   handleSuperLikes = {handleSuperLikes}
                   setLogin         = {setLogin}
               />
              <Content
                   text             = {text}
                   setLogin         = {setLogin}
                   privateArticle   = {privateArticle}
                   numPrivatePosts  = {numPrivatePosts}
                   views            = {views}
                   likes            = {likes}
                   superlikes       = {superlikes}
                   handleLikes      = {handleLikes}
                   handleSuperLikes = {handleSuperLikes}
                   setLogin         = {setLogin}
                   user             = {user}
                   level            = {level}
                   levelLimit       = {levelLimit}
                   premium          = {premium}
                   setPerfil        = {setPerfil}
              />
            </React.Fragment>
            }
            {login  ? <Login  hide = {() => setLogin(false)}/> : null}
            {perfil ? <Perfil hide = {() => setPerfil(false)} menu = {'Premium'} /> : null}
        </div>
    );
}

export default Post;

const Header = ({title, date, user, views, likes, superlikes, handleLikes, handleSuperLikes, setLogin}) => {
    
    let profilePic = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg';
    
    return(
        <div className = 'Header'>
            <h1>{title}</h1>
            <div className = 'Infopost'>
                <p className = 'Author'>
                    <img id = 'Erik' src = {profilePic}></img>
                    <span>{`Erik Martín Jordán, ${date[1]} ${date[2]}`}</span>
                </p>
                <div className = 'i'>👀 {parseInt(views).toLocaleString('es')}</div>
                <div className = 'i' onClick = {user ? handleLikes      : () => setLogin(true)}><Twemoji emoji = {'👏'}/> {likes}</div>
                <div className = 'i' onClick = {user ? handleSuperLikes : () => setLogin(true)}><Twemoji emoji = {'🎉'}/> {superlikes}</div>
            </div>
        </div>
    );
    
}

const Content = ({text, privateArticle, numPrivatePosts, user, setLogin, level, levelLimit, premium, setPerfil}) => {
    
    let twoParagraphs = text ? `${text.split('\n')[0]}\n\n${text.split('\n')[2]}\n\n` : null;
    
    return(
        <div className = 'Content'>
            { privateArticle && !user
            ? <React.Fragment>
                <div className = 'Blur-Login'>
                    <ReactMarkdown 
                    source     = {twoParagraphs} 
                    escapeHtml = {false} 
                    renderers  = {{link : props => <a href = {props.href} target = '_blank' rel = 'noindex noreferrer noopener'>{props.children}</a>}}
                    /> 
                </div>
                <div className = 'Login-Box'>
                    <h3>Lee la historia completa</h3>
                    <p>Para poder seguir leyendo este artículo y {numPrivatePosts} más, accede a Nomoresheet.</p>
                    <a className = 'login' onClick = {() => setLogin(true)}>Acceder</a>
                </div>    
              </React.Fragment>
            : privateArticle && user && level < levelLimit && !premium
            ? <React.Fragment>
                <div className = 'Blur-Login'>
                    <ReactMarkdown 
                    source     = {twoParagraphs} 
                    escapeHtml = {false} 
                    renderers  = {{link : props => <a href = {props.href} target = '_blank' rel = 'noindex noreferrer noopener'>{props.children}</a>}}
                    /> 
                </div>
                <div className = 'Login-Box'>
                    <h3>Lee la historia completa</h3>
                    <p>Necesitas tener nivel {levelLimit} para poder leer el artículo. También puedes desbloquearlo con una cuenta Premium.</p>
                    <button className = 'more' onClick = {() => setPerfil(true)}>Saber más</button>
                </div>    
              </React.Fragment>
            : <React.Fragment>
                <ReactMarkdown 
                    source     = {text} 
                    escapeHtml = {false} 
                    renderers  = {{link : props => <a href = {props.href} target = '_blank' rel = 'noindex noreferrer noopener'>{props.children}</a>}}
                /> 
              </React.Fragment>
            }
        </div>
    );
    
}