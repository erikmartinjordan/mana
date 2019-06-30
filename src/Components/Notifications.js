import React, { Component } from 'react';
import {auth, provider} from './Firebase.js';
import '../Styles/Notifications.css';

class Notifications extends Component {  
    
  constructor(){
      super();
      this.state = {
          show: false
      }
  }
    
  componentDidMount  = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  hideNotifications = () => this.setState({ show: false });
  showNotifications = () => this.setState({ show: true });

  getNotifications = (number) => {
      
      var url = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg';
      
      var notifications = <div className = 'Notifications-Menu'>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>

                                </div>
                               <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>
                                </div>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>+30</span>
                                        <span className = 'Notifications-Message'>Has comentado un artículo nuevo y eso te da mucha puntuación y bla, bla, bla.</span>

                                </div>
                          </div>;
      
      return notifications;
      
  }
    
  render() {
    return (
        <div className = 'Notifications'>
            <div className = 'Notifications-Icon' onClick = {this.showNotifications}>
                <div className = 'Notifications-Logo' onClick = {this.showNotifications}>🔔</div>
                <span className = 'Notifications-Number'>9</span>
            </div>
            {this.state.show ? this.getNotifications(10) : null}
            {this.state.show ? <div onClick = {this.hideNotifications} className = 'Invisible'></div> : null}
        </div>  
    );
  }
}

export default Notifications;