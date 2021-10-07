import React             from 'react'
import ReactDOM          from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App               from './Components/App'
import './Styles/Index.css'
import './Styles/WorkMode.css'

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'))