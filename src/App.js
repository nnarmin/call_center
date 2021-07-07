import {useContext} from 'react';
import PrivateRoute from "./components/helpers/PrivateRoute";
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import {
    Switch,
    Route
} from "react-router-dom";
import Layout from "./components/layout/layout";
import AuthContext from "./components/store/auth-context";

import PaymentType from './components/pages/PaymentType/PaymentType';
import PaymentAddEdit from './components/pages/PaymentType/PaymentAddEdit';

import SocialType from './components/pages/SocialType/SocialType';
import SocialAddEdit from './components/pages/SocialType/SocialAddEdit';

import StatusType from './components/pages/StatusType/StatusType';
import StatusAddEdit from './components/pages/StatusType/StatusAddEdit';

import Customers from './components/pages/Customer/Customers';
import CustomerInfo from './components/pages/Customer/CustomerInfo';
import CustomerAddEdit from './components/pages/Customer/CustomerAddEdit';

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
                <PrivateRoute path='/payment-types' component={PaymentType}/>
                <PrivateRoute path='/payment-methods/add' component={PaymentAddEdit}/>
                <PrivateRoute path='/social-types' exact component={SocialType}/>
                <PrivateRoute path='/social-type/add' component={SocialAddEdit}/>
                <PrivateRoute path='/status-types' exact component={StatusType}/>
                <PrivateRoute path='/status-type/add' component={StatusAddEdit}/>
                <PrivateRoute path='/customers' component={Customers}/>
                <PrivateRoute path='/customerInfo/:customerID' component={CustomerInfo}/>
                <PrivateRoute path='/customer/add' component={CustomerAddEdit}/>
            </Switch>
        </Layout>
    );
}

export default App;
