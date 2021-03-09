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
import Employee from "../../views/Dashboard/employee";
import EmployeeVisit from "../../views/Dashboard/employeeVisits";
import EmployeeVisitMonth from "../../views/Dashboard/employeeVisitsMonth";
import EmployeeVisitLastMonth from "../../views/Dashboard/employeeVisitsLastMonth";
import AcceptePolicy from "../../views/Dashboard/policyaccepted";
import CompanyConf from "../../views/Company/company";
import NewCompany from "../../views/Company/AddCompany";
import EditCompany from "../../views/Company/EditCompany";
import AddPolicy from "../../views/Policy/AddPolicy";
import EditPolicy from "../../views/Policy/EditPolicy";
import PolicyInd from "../../views/Policy/policy";
import Faq from "../../views/Faq/Faq";
import AddFaq from "../../views/Faq/AddFaq";
import EditFaq from "../../views/Faq/EditFaq";
import Bank from "../../views/Bank/Bank";
import AddBank from "../../views/Bank/AddBank";
import EditBank from "../../views/Bank/EditBank";
import Consulate from "../../views/Consulate/Consulate";
import AddConsulate from "../../views/Consulate/AddConsulate";
import EditConsulate from "../../views/Consulate/EditConsulate";
import New from "../../views/News/New";
import AddNew from "../../views/News/AddNew";
import EditNew from "../../views/News/EditNew";

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
        <header id="header" className="main-header">
          <nav className="navbar navbar-static-top">
            {getToken() ? <a href="#menu">Menu</a> : <></>}
          </nav>
          <Link to="/" className="logo">
            <center>
              {getToken() ? <i className="fa fa-user-circle">&nbsp;</i> : <></>}
              {getToken() ? getUser().user : <></>}
            </center>
          </Link>
        </header>
        <div className="col-4 ">
          <nav className="navbar navbar-static-top" id="menu">
            <section class="sidebar">
              {getToken() ? (
                <div dangerouslySetInnerHTML={{ __html: getMenu() }} />
              ) : (
                <></>
              )}
            </section>
          </nav>
        </div>

        <Switch>
          <PublicRoute path="/Login" component={Login} />
          <PrivateRoute path="/logout" component={Logout} />
          <PrivateRoute exact path="/" component={dasboard} />
          <PrivateRoute exact path="/evaluation" component={Evaluation} />
          <PrivateRoute path="/changepassword" component={MyChangePassword} />
          <PrivateRoute path="/employeeVisit" component={Employee} />
          <PrivateRoute path="/employeeVisitMonth" component={EmployeeVisit} />
          <PrivateRoute
            path="/employeeVisitLastMonth"
            component={EmployeeVisitMonth}
          />
          <PrivateRoute path="/employee" component={EmployeeVisitLastMonth} />
          <PrivateRoute path="/policyAccepted" component={AcceptePolicy} />

          <PrivateRoute path="/settings" component={CompanyConf} />
          <PrivateRoute path="/addCompany" component={NewCompany} />
          <PrivateRoute path="/editCompany" component={EditCompany} />

          <PrivateRoute path="/policies" component={PolicyInd} />
          <PrivateRoute path="/addPolicy" component={AddPolicy} />
          <PrivateRoute path="/editPolicy" component={EditPolicy} />

          <PrivateRoute path="/faq" component={Faq} />
          <PrivateRoute path="/addfaq" component={AddFaq} />
          <PrivateRoute path="/editfaq" component={EditFaq} />

          <PrivateRoute path="/bank" component={Bank} />
          <PrivateRoute path="/addbank" component={AddBank} />
          <PrivateRoute path="/editbank" component={EditBank} />

          <PrivateRoute path="/consulate" component={Consulate} />
          <PrivateRoute path="/addconsulate" component={AddConsulate} />
          <PrivateRoute path="/editconsulate" component={EditConsulate} />

          <PrivateRoute path="/news" component={New} />
          <PrivateRoute path="/addNew" component={AddNew} />
          <PrivateRoute path="/editNew" component={EditNew} />
        </Switch>
      </Router>
    );
  }
}
