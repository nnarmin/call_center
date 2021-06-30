import React, {useState, useRef, useContext} from 'react';
import jwt_decode from 'jwt-decode';

import {Button, Spinner} from "react-bootstrap";
import {LoginRequest} from "../api/Request";
import AuthContext from "../store/auth-context";

const Login = () => {
    const [isFetching, setIsFetching] = useState(false);
    const passwordInputRef = useRef();
    const usernameInputRef = useRef();

    const authCtx = useContext(AuthContext);

    const handleForm = (event) => {
        event.preventDefault();
        setIsFetching(true);
        const enteredName = usernameInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        if (enteredPassword.trim().length && enteredName.trim().length) {
            LoginRequest(enteredName, enteredPassword).then(data => {
                const decoded_jwt= data && data.data && jwt_decode(data.data.idToken);
                const expirationTime = new Date(
                    new Date().getTime() + +decoded_jwt.exp * 1000
                );
                data && data.data && authCtx.login(data.data.idToken, expirationTime);
                setIsFetching(false);
            });
        } else if (!enteredPassword.trim().length) {

        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6 ml-auto mr-auto mt-5">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleForm}>
                                <div className="form-group">
                                    <label htmlFor="fname">İstifadəçi adı:</label>
                                    <input type="text" id="username" name="username" className="form-control"
                                           ref={usernameInputRef}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lname">Şifrə:</label>
                                    <input type="password" id="password" name="password" className="form-control"
                                           ref={passwordInputRef}/>
                                </div>
                                <Button type="submit" variant="primary">
                                    Daxil Ol
                                    {isFetching
                                    && <Spinner style={{ marginLeft: 10 }} animation='border' variant='light' size='sm' className='align-middle' />}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
