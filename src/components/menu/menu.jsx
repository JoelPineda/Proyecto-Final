import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { getToken, removeUserSession } from "../../utils/Common";
import PrivateRoute from "../../utils/private_route";
import PublicRoute from "../../utils/public_route";
import dasboard from "../../views/Home_user/dasboard";
import Evaluation from "../../views/Evaluation/evaluation";
import Login from "../../views/Home_user/login";
import Logout from "../../views/Home_user/logout";
import MyChangePassword from "../../views/Profile/change_password";
import { getUser, getPolicieSession, getMenu } from "../../utils/Common";

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
    };

    

  }
 
  render() {

    function changeText(event) {
      removeUserSession();
    }

    return (
      <Router>
        <header id="header" className="main-header" >
          <nav className="navbar navbar-static-top">{getToken() ? <a href="#menu">Menu</a> : <></>}</nav>
          <Link to="/" className="logo">
            <center>
              {getToken() ? <i className="fa fa-user-circle">&nbsp;</i> : <></>}
              {getToken() ? getUser().user  : <></>}
               
            </center>
          </Link>
        </header>
      <div className="col-4 ">
        <nav className="navbar navbar-static-top" id="menu">
          <section class="sidebar">
            {getToken() ? <div dangerouslySetInnerHTML={{ __html: getMenu() }} />: <></>} 
          </section>   
        </nav>       
      </div>

        <Switch>
          <PublicRoute path="/Login" component={Login} />
          <PrivateRoute path="/logout" component={Logout} />
          <PrivateRoute exact path="/" component={dasboard} />
          <PrivateRoute exact path="/evaluation" component={Evaluation} />
          <PrivateRoute path="/changepassword" component={MyChangePassword} />            
        </Switch>
      </Router>
    );
  }
}
