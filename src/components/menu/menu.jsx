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
import Consulate from "../../views/Consulate/Consulate";
import New from "../../views/News/New";
import AddNew from "../../views/News/AddNew";
import EditNew from "../../views/News/EditNew";
import UnitType from "../../views/Unit_Type/UnitType";
import CompanyUnit from "../../views/CompanyUnit/CompanyUnit";
import AddCompanyUnit from "../../views/CompanyUnit/AddCompanyUnit";
import EditUnitCompany from "../../views/CompanyUnit/EditCompanyUnit";
import BackendUser from "../../views/Backend_user/backendUsers";
import BenefitsCategory from "../../views/BenefitsCategory/BenefitsCategory";
import AddBenefitsCategory from "../../views/BenefitsCategory/AddBenefitsCategory";
import EditBenefitsCategory from "../../views/BenefitsCategory/EditBenefitsCategory";
import CompanyBenefits from "../../views/CompanyBenefits/CompanyBenefits";
import AddCompanyBenefits from "../../views/CompanyBenefits/AddCompanyBenefits";
import EditCompanyBenefits from "../../views/CompanyBenefits/EditCompanyBenefits";
import Slider from "../../views/Slider/Slider";
import AddSlider from "../../views/Slider/AddSlider";
import EditSlider from "../../views/Slider/EditSlider";
import StaffLetter from "../../views/StaffLetter/StaffLetter";
import ServiceDescAdm from "../../views/Home_user/userApp";
import MedicalLicenses from "../../views/StaffLetter/MedicalLicenses";
import HistoryButton from "../Button/HistoryButton";
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
    const goBack = () => {
      window.history.back();
    };
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
          {getToken() ? (
            window.location.pathname != "/" ? (
              <>
                <HistoryButton clickHandler={goBack}></HistoryButton>
              </>
            ) : (
              <div></div>
            )
          ) : (
            <></>
          )}
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
          <PrivateRoute exact path="/dashboard" component={dasboard} />
          <PrivateRoute exact path="/evaluation" component={Evaluation} />
          <PrivateRoute exact path="/backend_users" component={BackendUser} />
          <PrivateRoute path="/changepassword" component={MyChangePassword} />
          <PrivateRoute path="/employeeVisit" component={EmployeeVisit} />
          <PrivateRoute
            path="/employeeVisitMonth"
            component={EmployeeVisitMonth}
          />
          <PrivateRoute
            path="/employeeVisitLastMonth"
            component={EmployeeVisitLastMonth}
          />
          <PrivateRoute path="/employee" component={Employee} />
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
          <PrivateRoute path="/consulate" component={Consulate} />
          <PrivateRoute path="/news" component={New} />
          <PrivateRoute path="/addNew" component={AddNew} />
          <PrivateRoute path="/editNew" component={EditNew} />
          <PrivateRoute path="/company_unit_type" component={UnitType} />
          <PrivateRoute path="/company_unit" component={CompanyUnit} />
          <PrivateRoute path="/addCompanyUnit" component={AddCompanyUnit} />
          <PrivateRoute path="/editCompanyUnit" component={EditUnitCompany} />
          <PrivateRoute path="/comment" component={BenefitsCategory} />
          <PrivateRoute path="/addcategory" component={AddBenefitsCategory} />
          <PrivateRoute path="/editcategory" component={EditBenefitsCategory} />
          <PrivateRoute path="/company_benefits" component={CompanyBenefits} />
          <PrivateRoute
            path="/addCompanyBenefits"
            component={AddCompanyBenefits}
          />
          <PrivateRoute
            path="/editCompanyBenefits"
            component={EditCompanyBenefits}
          />
          <PrivateRoute path="/staff_letter" component={StaffLetter} />
          <PrivateRoute path="/banners" component={Slider} />
          <PrivateRoute path="/addSlider" component={AddSlider} />
          <PrivateRoute path="/editSlider" component={EditSlider} />
          <PrivateRoute path="/frontend_users" component={ServiceDescAdm} />
          <PrivateRoute path="/medical_licenses" component={MedicalLicenses} />
        </Switch>
      </Router>
    );
  }
}
