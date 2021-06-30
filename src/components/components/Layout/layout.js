import React from 'react';
import Footer from './footer';
import Header from './header';

const Layout = (props) => {
    return (
        <React.Fragment>
            <Header/>
            <section className='content d-flex flex-column flex-column-fluid py-3' style={{ minHeight: 'calc(100vh - 118px)' }}>
                <div className='container'>
                    <div className='row justify-content-center'>
                        {props.children}
                    </div>
                </div>
            </section>
            <Footer/>
        </React.Fragment>
    )
};

export default Layout;
