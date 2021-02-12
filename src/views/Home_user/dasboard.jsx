import React, { useState, useEffect } from "react";
import { getUser, removeUserSession } from "../../utils/Common"; 
import API from "../../utils/api";
import $ from 'jquery';

export default function Dasboard(props) {
  const [company, setCompany] = useState([]);
  const handleLogout = () => {
    removeUserSession();
    props.history.push("/login");
  };


  useEffect(() => {
   $("body").addClass(' is-menu-visible'); 

  },[]);
  
  return (
    
    <div class="content-wrapper">
    <section class="content-header">
      <h1>Estadísticas</h1>
      <p>Ver estadísticas generales.</p>
    </section>

    <section class="content">
        <div class="row">
          <div class="col-lg-3 col-xs-6">
            <div class="small-box bg-red">
              <div class="inner">
                <h3>1,523</h3>
                <p>Visitas del día</p>
              </div>
              <div class="icon">
                <i class="fa fa-clock-o"></i>
              </div>
              <a href="administrator/employee_visit" class="small-box-footer">Ver mas detalle <i class="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div class="col-lg-3 col-xs-6">
            <div class="small-box bg-gray">
              <div class="inner">
                <h3>1,523</h3>
                <p>Visitas del mes</p>
              </div>
              <div class="icon">
                <i class="fa fa-calendar"></i>
              </div>
              <a href="/employee_visit" class="small-box-footer">Ver mas detalle <i class="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div class="col-lg-3 col-xs-6">
            <div class="small-box bg-red">
              <div class="inner">
                <h3>1,523</h3>
                <p>Visitas del mes anterior</p>
              </div>
              <div class="icon">
                <i class="fa fa-calendar-minus-o"></i>
              </div>
              <a href="/employee_visit" class="small-box-footer">Ver mas detalle <i class="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div class="col-lg-3 col-xs-6">
            <div class="small-box bg-gray">
              <div class="inner">
                <h3>1,523</h3>
                <p>Empleados activos registrados</p>
              </div>
              <div class="icon">
                <i class="fa fa-users"></i>
              </div>
              <a href="/employees" class="small-box-footer">Ver mas detalle <i class="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div class="col-lg-3 col-xs-6">
            <div class="small-box bg-gray">
              <div class="inner">
                <h3>1,523</h3>
                <p>Diferentes Empleados que han aceptado las políticas</p>
              </div>
              <div class="icon">
                <i class="fa fa-anchor"></i>
              </div>
              <a href="/employee_policies" class="small-box-footer">Ver mas detalle <i class="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div class="col-lg-3 col-xs-6">
            <div class="small-box bg-red">
              <div class="inner">
                <h3>1,523</h3>
                <p>Usuarios activos</p>
              </div>
              <div class="icon">
                <i class="fa fa-unlock"></i>
              </div>
              <a href="/frontend_users" class="small-box-footer">Ver mas detalle <i class="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
        </div>
    </section>
</div>
  );
}
