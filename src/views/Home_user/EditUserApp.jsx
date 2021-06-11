import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";

import Moment from "moment";

export const EditUserApp = (e) => {
  let dataItem = JSON.parse(
    atob($(e.currentTarget).parent().attr("data-item"))
  )[0];

  let formulario =
    "<br /><div id='divAddconsulateName' class='container d-flex flex-column'><hr />" +
    "<input type='hidden' value='" +
    dataItem.id +
    "' class='form-control' id='tbConsulateID' /> <div class='form-group'>" +
    "  <label for='tbName' class='float-left' >Nombre</label>&nbsp;<span class='float-left defaultText red' id=sp_tbNameEdit></span>" +
    "<input value='" +
    dataItem.firstName +
    " " +
    dataItem.lastName +
    "' class='form-control' id='tbname' readonly /> </br>" +
    " <div class='form-group'>" +
    "  <label for='tbemployeeIdCard' class='float-left' >Usuario</label>&nbsp;<span class='float-left defaultText red' id=sp_tbemployeeIdCard></span>" +
    "<input  value='" +
    dataItem.employeeIdCard +
    "' class='form-control' id='tbemployeeIdCard' readonly /> </br>" +
    " <div class='form-group'>" +
    "  <label for='tblastLogin' class='float-left' >Fecha login</label>&nbsp;<span class='float-left defaultText red' id=sp_tblastLogin></span>" +
    "<input value='" +
    Moment(dataItem.lastLogin).format("DD/MM/YYYY ") +
    "' class='form-control' id='tblastLogin' readonly /> </br>" +
    " </div>" +
    " <div class='form-group'>" +
    "  <label for='tbpass' class='float-left' >Contraseña</label>&nbsp;<span class='float-left defaultText red' id=sp_tbpass></span>" +
    "<input  value='" +
    dataItem.password +
    "'  class='form-control' id='tbpass' readonly /> </br>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
