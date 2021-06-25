import React, {useState} from 'react';
import {Button} from "react-bootstrap";

const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleForm = (event) => {
        event.preventDefault();
        console.log("submit");
    };

    const onChangeUserName = (event) => {
        setUserName(event.target.value)
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value)
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6 ml-auto mr-auto mt-5">
                    <form onSubmit={handleForm}>
                        <div className="form-group">
                            <label htmlFor="fname">User Name:</label>
                            <input type="text" id="username" name="username" onChange={onChangeUserName} value={username}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lname">Password:</label>
                            <input type="password" id="password" name="password" onChange={onChangePassword} value={password}/>
                        </div>
                        <Button type="submit" variant="primary">Submit</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;