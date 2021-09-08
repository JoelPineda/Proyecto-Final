import React from 'react';
import ProTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom';

export const PublicRouter = ({
    isAuthenticated,
    component: Component,
    ...rest 
}) => {
    return (
        <Route {...rest}
            component = { (props) =>(
                (isAuthenticated)
                    ?(<Redirect to="/"/>)
                    :(<Component {...props}/>)
            )}
        
        />
    )
}

PublicRouter.prototype = {
    isAuthenticated: ProTypes.bool.isRequired,
    component: ProTypes.func.isRequired
}