import React, {useState, useRef} from 'react';
import {post} from '../../api/Api';
import {Button} from "react-bootstrap";

const NewPayment = (props) => {
    const inputPaymentName=useRef();
    const [isLoading, setIsLoading] = useState(false);

    const newPaymentMethodHandle = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const enteredPaymentName = inputPaymentName.current.value;
        post('/payment-types', {name: enteredPaymentName}).then((res) => {
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
        });
    };

    return(
        <form onSubmit={newPaymentMethodHandle}>
            <div className="form-group">
                <label>Yeni Ödəniş üsulu</label>
                <input type="text" className="form-control"
                       ref={inputPaymentName}
                       required/>
            </div>
            <Button type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="mt-2"
            >
                {isLoading ? 'Gözləyin…' : 'Əlavə et'}
            </Button>
        </form>
    );
};

export default NewPayment;
