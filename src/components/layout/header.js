import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from "../store/auth-context";
import {Button} from "react-bootstrap";
import logo from '../../assets/images/logo.png';

const Header = () => {
    const authCtx = useContext(AuthContext);

    const logout = () => {
        authCtx.logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand mr-2 py-0 align-items-start" href="/"><img
                    style={{
                        maxWidth: '200px',
                    }}
                    src={logo}
                    alt='logo'
                /></a>
                <div className="d-flex justify-content-between flex-1">
                    {authCtx.isAdmin && (
                        <div className="flex-1">
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <NavLink to='/payment-types?page=0&size=10' activeClassName="active"
                                                 className="nav-link">Ödəniş </NavLink>
                                    </li>
                                    <li className="nav-item active">
                                        <NavLink to='/status-types' className="nav-link">Status </NavLink>
                                    </li>
                                    <li className="nav-item active">
                                        <NavLink to='/social-types' className="nav-link">Sosial </NavLink>
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
