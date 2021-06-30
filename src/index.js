import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthContextProvider} from "./components/store/auth-context";

ReactDOM.render(
    <Router>
        <AuthContextProvider>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </AuthContextProvider>
    </Router>,
    document.getElementById('root')
);
