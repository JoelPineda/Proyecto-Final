import React from 'react';
import ProTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom';

export const PrivateRouter = ({
    isAuthenticated,
    component: Component,
    ...rest 
}) => {


    

    return (
        <Route {...rest}
            component = { (props) =>(
                (isAuthenticated)
                    ?(<Component {...props}/>)
                    :(<Redirect to="/auth/login"/>)
            )}
        
        />
    )
}

PrivateRouter.prototype = {
    isAuthenticated: ProTypes.bool.isRequired,
    component: ProTypes.func.isRequired
}