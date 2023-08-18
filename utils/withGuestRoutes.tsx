import Router from 'next/router';
import { useState, useEffect } from 'react';

const withGuest = (WrappedComponent) => {
    return (props) => {

        const [unauthenticated, setUnauthenticated] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                Router.replace("/dashboard");
            }
            else {
                setUnauthenticated(true)
            }
        }, []);

        if (unauthenticated) {
            return <WrappedComponent {...props} />;
        } else {
            return null;
        }
    };
};

export default withGuest;