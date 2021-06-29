import Home from './components/pages/Home'
import Login from './components/pages/Login'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Layout from "./components/Layout/layout";

function App() {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path='/' exact component={Home}/>
                    <Route path='/login' component={Login}/>
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
