import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications-component/dist/theme.css'

import {BrowserRouter as Router} from 'react-router-dom';
import {AuthContextProvider} from "./components/store/auth-context";
import ReactNotification from 'react-notifications-component'

import App from './App';


ReactDOM.render(
    <Router>
        <ReactNotification/>
        <AuthContextProvider>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </AuthContextProvider>
    </Router>,
    document.getElementById('root')
);
