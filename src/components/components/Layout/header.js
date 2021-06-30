import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import AuthContext from "../../store/auth-context";
import {Button} from "react-bootstrap";
import logo from '../../../assets/images/logo.png';

const Header = () => {
    const authCtx= useContext(AuthContext);

    const logout= () => {
        authCtx.logout();
    };

    const role_user= authCtx.decoded_token && authCtx.decoded_token.sub;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <a className="navbar-brand mr-2" href="/"><img
                        style={{
                            maxWidth: '200px',
                        }}
                        src={logo}
                        alt='logo'
                    /></a>
                    {role_user === 'admin' && (
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link to='/paymentType' className="nav-link">Ödəniş </Link>
                            </li>
                            <li className="nav-item active">
                                <Link to='/statusType' className="nav-link">Status </Link>
                            </li>
                            <li className="nav-item active">
                                <Link to='/socialType' className="nav-link">Sosial </Link>
                            </li>
                        </ul>
                    )}
                </div>
                {authCtx.isLoggedIn &&
                <div className="">
                    <Button onClick={logout}>Çıxış</Button>
                </div>
                }
            </div>
        </nav>
    )
};

export default Header;
