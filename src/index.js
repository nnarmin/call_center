import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthContextProvider} from "./components/store/auth-context";

ReactDOM.render(
    <AuthContextProvider>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </AuthContextProvider>,
    document.getElementById('root')
);
