import {useState, useEffect, createContext} from 'react';
import {get} from './components/api/Api';
import PrivateRoute from "./components/helpers/PrivateRoute";
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import {
    Switch,
    Route
} from "react-router-dom";
import Layout from "./components/layout/layout";

import PaymentType from './components/pages/PaymentType/PaymentType';
import PaymentAddEdit from './components/pages/PaymentType/PaymentAddEdit';

import SocialType from './components/pages/SocialType/SocialType';
import SocialAddEdit from './components/pages/SocialType/SocialAddEdit';

import StatusType from './components/pages/StatusType/StatusType';
import StatusAddEdit from './components/pages/StatusType/StatusAddEdit';

import Customers from './components/pages/Customer/Customers';
import CustomerInfo from './components/pages/Customer/CustomerInfo';
import CustomerAddEdit from './components/pages/Customer/CustomerAddEdit';

import AddPurchase from './components/pages/Purchase/AddPurchase';
import PurchaseInfo from "./components/pages/Purchase/PurchaseInfo";


export const IsAuth = createContext(null);
export const UserInfo = createContext(null);

function App() {

    const [isUserAuth, setIsUserAuth] = useState(!!localStorage.getItem('jwt_token'));
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        if (isUserAuth) {
            get('/users/me')
                .then(setUserInfo)
                .catch(console.log);
        }
    }, [isUserAuth]);

    return (
        <IsAuth.Provider value={{isUserAuth, setIsUserAuth}}>
            <UserInfo.Provider value={{userInfo, setUserInfo}}>
                <Layout>
                    <Switch>
                        <Route path='/' exact>
                            <Home/>
                        </Route>
                        {!isUserAuth && (
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
                        <PrivateRoute path='/addPurchase/:customerID' component={AddPurchase}/>
                        <PrivateRoute path='/purchaseInfo' component={PurchaseInfo}/>
                    </Switch>
                </Layout>
            </UserInfo.Provider>
        </IsAuth.Provider>
    );
}

export default App;
