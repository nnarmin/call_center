import React from 'react';
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/login" component={Login}/>
            </Switch>
        </Router>
    );
}

export default App;
