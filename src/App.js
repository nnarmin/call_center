import {useContext} from 'react';
import PrivateRoute from "./components/helpers/PrivateRoute";
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import PaymentType from './components/pages/PaymentType/PaymentType';
import NewPayment from './components/pages/PaymentType/NewPayment';
import SocialType from './components/pages/SocialType/SocialType';
import StatusType from './components/pages/StatusType/StatusType';
import CustomerInfo from './components/pages/CustomerInfo';
import {
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
                <PrivateRoute path='/paymentType' component={PaymentType}/>
                <PrivateRoute path='/paymentMethod/add' component={NewPayment}/>
                <PrivateRoute path='/socialType' component={SocialType}/>
                <PrivateRoute path='/statusType' component={StatusType}/>
                <PrivateRoute path='/customerInfo/:customerID' component={CustomerInfo}/>
            </Switch>
        </Layout>
    );
}

export default App;
