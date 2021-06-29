import React, {useContext} from 'react';
import AuthContext from "../store/auth-context";
import logo from '../../assets/images/logo.png';

const Header = () => {
    const {isLoggedIn}= useContext(AuthContext);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container d-flex align-items-center justify-content-between">
                <a className="navbar-brand" href="/"><img
                    style={{
                        maxWidth: '200px',
                    }}
                    src={logo}
                    alt='logo'
                /></a>
                {isLoggedIn &&
                <div className="">
                    <a className="navbar-brand" href="/">Çıxış</a>
                </div>
                }
            </div>
        </nav>
    )
};

export default Header;
