import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import API from "../../utils/api";
import { ResetUserApp } from "./ResetUserApp";

import { EditUserApp } from "./EditUserApp";
import { AddUserApp } from "./AddUser";
import { getUser, removeUserSession } from "../../utils/Common";
import Loading from "../../components/loading/loading";
import {
  ShowPopUp,
  ShowAlertMessage,
  ShowConfirmationReset,
  MessageResults,
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";

$(document).ready(() => {
  $("#sp_AddUsuario").click(() => {
    ShowPopUp({
      titleName: "AGREGAR NUEVO USUARIO",
      htmlBody: AddUserApp(),
      handlerEvent: OnClickSaveAddUser,
      TextOk: "Registrar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });

  const OnClickSaveAddUser = () => {
    API.postData("User/add", {
      employeeIdCard: $("#tbemployeeIdCard").val(),
      password: $("#tbemployeeIdCard").val(),
      changePassword: "X",
      lastLogin: "2020-12-10T00:00:00",
      hideCarnet: "",
    })
      .then((res) => {
        if (res.status === 200) {
          MessageResults(res.status);
          setTimeout(() => {
            window.location.reload(true);
          }, 1200);
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        MessageResults(400, err);
      });
  };

  $("body").on("change", "#tbemployeeIdCard", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    if ($(e.currentTarget).val().length > 10) {
      API.getData(
        "Employees/getEmployeeIdCard?employeeIdCard=" +
          $("#tbemployeeIdCard").val()
      )
        .then((response) => {
          if (response.data) {
            $(btnOk).attr("disabled", true);
            $("#sp_tbemployeeIdCard").text(
              "Usuario Existente No Se Puede Crear De Nuevo"
            );
          } else {
            $("#sp_tbemployeeIdCard").text(" ");

            $(btnOk).removeAttr("disabled");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      $(btnOk).attr("disabled", true);
      $("#sp_tbemployeeIdCard").text(" Requerido!");
    }
  });

  $("body").on("click", "#TblUserAPP #btEdit", function (e) {
    ShowPopUp({
      titleName: "Actualizar Contraseña APP",
      htmlBody: EditUserApp(e),
      handlerEvent: OnClickSaveEditUser,
      TextOk: "Resetear",
      isDisabled: true,
      EnabledDisabled: true,
    });
    let btnre = $(".swal2-confirm.swal2-styled");
    $(btnre).removeAttr("disabled");
  });

  const OnClickSaveEditUser = () => {
    API.putData("User/update", {
      id: parseInt($("#tbUserAppID").val()),
      employeeIdCard: $("#tbemployeeIdCard").val(),
      password: $("#tbpass").val(),
      changePassword: "X",
      lastLogin: $("#tblastLogin").val(),
      hideCarnet: "",
    })
      .then((res) => {
        if (res.status === 200) {
          MessageResults(res.status);
          setTimeout(() => {
            window.location.reload(true);
          }, 1200);
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        MessageResults(400, err);
      });
  };

  $("body").on("click", "#TblUserAPP #btReset", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];

    let name = param.firstName + " " + param.lastName;

    ShowConfirmationReset(ResetChanges, "", param, name);
  });

  const ResetChanges = (params) => {
    let id = params.id;
    API.putData("User/Reset", {
      id: id,
      employeeIdCard: params.employeeIdCard,
      password: params.employeeIdCard,
      changePassword: params.changePassword,
      lastLogin: params.lastLogin,
      hideCarnet: params.hideCarnet,
    })
      .then((res) => {
        if (res.status === 200) {
          MessageResults(res.status);
          setTimeout(() => {
            window.location.reload(true);
          }, 1200);
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        MessageResults(400, err);
      });
  };
});

export default function UserAPP(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [userApp, setUserApp] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("User/Get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setUserApp(res.data);
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Resetear Contraseña' ></a>&nbsp;";
          let ReseBtn =
            "&nbsp;<a href='#' id='btReset'  class='fa fa-unlock-alt custom-color size-effect-x2' title='Resetear Contraseña' ></a>&nbsp;";

          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Tipo Unidad' ></a>";
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              employeeIdCard:
                '<span class="capitalized defaultText">' +
                item.employeeIdCard +
                "</span>",
              password:
                '<span class="capitalized defaultText">' +
                item.password +
                "</span>",
              changePassword:
                '<span class="capitalized defaultText">' +
                (item.changePassword !== "X" ? "Si" : "No") +
                "</span>",
              name:
                '<span class="capitalized defaultText">' +
                item.firstName +
                " " +
                item.lastName +
                "</span>",
              lastLogin:
                '<span class="capitalized defaultText">' +
                Moment(item.lastLogin).format("DD/MM/YYYY ") +
                "</span>",
              hideCarnet:
                '<span class="capitalized defaultText">' +
                item.hideCarnet +
                "</span>",
              itemBtn:
                "<span data-created='" +
                Moment(item.creationDate).format("DD/MM/YYYY ") +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                ReseBtn +
                EditBtn +
                "</span>",
            });
          });

          $("#TblUserAPP").DataTable({
            destroy: true,
            searching: true,
            language: LangSpanish,
            bLengthChange: false,
            lengthMenu: [10, 20, 40, 60, 80, 90, 100, 200],
            order: [[0, "desc"]],
            dom: "Bfrtip",
            buttons: ["copy", "excel", "pdf"],
            data:
              dataResult.length === 0
                ? [
                    {
                      id: "",
                      employeeIdCard: "",
                      password: "",
                      changePassword: "",
                      lastLogin: "",
                      hideCarnet: "",
                      name: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "name",
                title: "Nombre",
                width: "25%",
                className: "capitalized",
              },

              {
                data: "employeeIdCard",
                title: "Usuario",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "password",
                title: "Contraseña",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "changePassword",
                title: "Cambio Contraseña",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "lastLogin",
                title: "Fecha login",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "itemBtn",
                title: "\u00a0Acciones\u00a0\u00a0\u00a0",
                width: "20%",
                orderable: false,
              },
            ],
          });
          $(".csHidden").attr("style", "display:none");
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });
    setDataLoading(false);
  };

  useEffect(() => {
    fillData();
  }, []);

  return (
    <>
      <div>
        <br />
        <div className=" htmlPayroll    container">
          <div className="row">
            <div className="lowcolor col-12">
              <br />
              <br />
              <h2 className="h2">Usuario Aplicación</h2>
              <span className="btn btn-success btn-sm" id="sp_AddUsuario">
                <i className="fa fa-plus-circle"></i>&nbsp;Añadir Usuario
              </span>
            </div>
          </div>
          <div className="row ">
            {!dataLoading ? (
              <>
                <div className="container">
                  <div className="">
                    {!dataLoading ? (
                      <div
                        className="scroll-table bordered"
                        Style="min-height:600px"
                      >
                        <table
                          id="TblUserAPP"
                          className="table table-striped table-bordered display"
                          Style="width:100% !important"
                        ></table>
                      </div>
                    ) : (
                      <Loading />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="container">
                <Loading />
              </div>
            )}
          </div>

          <br />
          <br />
        </div>
        <br />
        <br />
      </div>
    </>
  );
}
