import {useContext} from 'react';
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import PaymentType from './components/pages/PaymentType';
import SocialType from './components/pages/SocialType'
import CustomerInfo from './components/pages/CustomerInfo'
import {
    Redirect,
    Switch,
    Route
} from "react-router-dom";
import Layout from "./components/components/Layout/layout";
import AuthContext from "./components/store/auth-context";

function App() {

    const authCtx = useContext(AuthContext);

    return (
        <Layout>
            <Switch>
                <Route path='/' exact>
                    <Home/>
                </Route>
                {!authCtx.isLoggedIn && (
                    <Route path='/login'>
                        <Login/>
                    </Route>
                )}
                {authCtx.isLoggedIn && (
                    <Route path='/paymentType'>
                        <PaymentType/>
                    </Route>
                )}
                {authCtx.isLoggedIn && (
                    <Route path='/socialType'>
                        <SocialType/>
                    </Route>
                )}
                {authCtx.isLoggedIn && (
                    <Route path='/customerInfo/:customerID'>
                        <CustomerInfo/>
                    </Route>
                )}
                <Route path='*'>
                    <Redirect to='/'/>
                </Route>
            </Switch>
        </Layout>
    );
}

export default App;
