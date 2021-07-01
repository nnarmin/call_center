import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from "../../store/auth-context";
import {Button} from "react-bootstrap";
import logo from '../../../assets/images/logo.png';

const Header = () => {
    const authCtx = useContext(AuthContext);

    const logout = () => {
        authCtx.logout();
    };

    const role_user = authCtx.decoded_token && authCtx.decoded_token.sub;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand mr-2" href="/"><img
                    style={{
                        maxWidth: '200px',
                    }}
                    src={logo}
                    alt='logo'
                /></a>
                <div className="d-flex align-items-center justify-content-between flex-1">
                    {role_user === 'admin' && (
                        <div>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <NavLink to='/paymentType' activeClassName="active"
                                                 className="nav-link">Ödəniş </NavLink>
                                    </li>
                                    <li className="nav-item active">
                                        <NavLink to='/statusType' className="nav-link">Status </NavLink>
                                    </li>
                                    <li className="nav-item active">
                                        <NavLink to='/socialType' className="nav-link">Sosial </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {authCtx.isLoggedIn &&
                    <div className="">
                        <Button onClick={logout}>Çıxış</Button>
                    </div>
                    }
                </div>
            </div>
        </nav>
    )
};

export default Header;
