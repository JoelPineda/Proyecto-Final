import React, { useState, useEffect } from "react";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";
import $ from "jquery";
import { NumbersWithComma, numberWithCommas } from "../../utils/CommonFunctions";

export default function Dasboard(props) {
  const [company, setCompany] = useState([]);
  const handleLogout = () => {
    removeUserSession();
    props.history.push("/login");
  };
  const [dashboard, setdashboard] = useState([]);
  useEffect(() => {
    $("body").addClass(" is-menu-visible");
    API.getData("Dashboard/get")
      .then((response) => {
        if (response.status === 200) {
          setdashboard(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {}, []);

  return (
    <div class="content-wrapper">
      <section class="content-header">
        <h1>Estadísticas</h1>
        <p>Ver estadísticas generales.</p>
      </section>
      <section class="content">
        {dashboard.map((item) => (
          <div class="row">
            <div class="col-lg-3 col-xs-6">
              <div class="small-box bg-red">
                <div class="inner">
                  <h3>{numberWithCommas(item.dayVisit)}</h3>
                  <p>Visitas del día</p>
                </div>
                <div class="icon">
                  <i class="fa fa-clock-o"></i>
                </div>
                <a href="/employeeVisit" class="small-box-footer">
                  Ver mas detalle <i class="fa fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div class="col-lg-3 col-xs-6">
              <div class="small-box bg-gray">
                <div class="inner">
                  <h3>{numberWithCommas(item.monthVisit)}</h3>
                  <p>Visitas del mes</p>
                </div>
                <div class="icon">
                  <i class="fa fa-calendar"></i>
                </div>
                <a href="/employeeVisitMonth" class="small-box-footer">
                  Ver mas detalle <i class="fa fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div class="col-lg-3 col-xs-6">
              <div class="small-box bg-red">
                <div class="inner">
                  <h3>{numberWithCommas(item.lastMonthVisit)}</h3>
                  <p>Visitas del mes anterior</p>
                </div>
                <div class="icon">
                  <i class="fa fa-calendar-minus-o"></i>
                </div>
                <a href="/employeeVisitLastMonth" class="small-box-footer">
                  Ver mas detalle <i class="fa fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div class="col-lg-3 col-xs-6">
              <div class="small-box bg-gray">
                <div class="inner">
                  <h3>{numberWithCommas(item.employeesActive)}</h3>
                  <p>Empleados activos registrados</p>
                </div>
                <div class="icon">
                  <i class="fa fa-users"></i>
                </div>
                <a href="/employee" class="small-box-footer">
                  Ver mas detalle <i class="fa fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div class="col-lg-3 col-xs-6">
              <div class="small-box bg-gray">
                <div class="inner">
                  <h3>{numberWithCommas(item.policiesAccepted)}</h3>
                  <p>Diferentes Empleados que han aceptado las políticas</p>
                </div>
                <div class="icon">
                  <i class="fa fa-anchor"></i>
                </div>
                <a href="/policyAccepted" class="small-box-footer">
                  Ver mas detalle <i class="fa fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div class="col-lg-3 col-xs-6">
              <div class="small-box bg-red">
                <div class="inner">
                  <h3>{numberWithCommas(item.userActive)}</h3>
                  <p>Usuarios activos</p>
                </div>
                <div class="icon">
                  <i class="fa fa-unlock"></i>
                </div>
                <a href="/frontend_users" class="small-box-footer">
                  Ver mas detalle <i class="fa fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
