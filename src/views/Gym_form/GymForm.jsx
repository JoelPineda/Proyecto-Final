import React, { useState, useEffect } from "react";
import $ from "jquery";
import API from "../../utils/api";
import Loading from "../../components/loading/loading";
import {
  ShowAlertMessage,
  ShowConfirmationMessage,
  MessageResults,
  ShowPopUp,
} from "../../utils/CommonFunctions";

import { LangSpanish } from "../../tools/dataTables.Language";

$(document).ready(() => {
  $("body").on("click", "#TblGYM #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(
      SaveDisableChanges,
      "",
      param,
      "Desea cambiar el estado a Aceptado?"
    );
  });

  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("Gym/StatusGymForm?id=" + id)
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
  const SaveChanges = (params) => {};
  $("body").on("click", "#TblGYM #btEdit", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];

    ShowPopUp({
      handlerEvent: SaveChanges,
      htmlBody: GetCat(
        param.fullName,
        param.employeeIdCard,
        param.employeeNumber,
        param.signedUp,
        param.terms,
        param.direction,
        param.phone,
        param.mobile,
        param.bloodtype,
        param.email,
        param.nameE,
        param.directionE,
        param.phoneE,
        param.mobileE
      ),
      isDisabled: true,
      TextOk: "OK",
    });
  });
  const GetCat = (
    fullName,
    employeeIdCard,
    employeeNumber,
    signedUp,
    terms,
    direction,
    phone,
    mobile,
    bloodtype,
    email,
    nameE,
    directionE,
    phoneE,
    mobileE
  ) => {
    return `<html><body><section>
      <div class="container">
      <p style="margin-bottom: 0.25in; line-height: 100%; text-align-center: left;"><font face="Times New Roman, serif"><font size="3">INFORMACIÓN DEL EMPLEADO</font></font></p>
    
      
      <p   style="margin-bottom: 0in; line-height: 100%"> ${fullName} ${employeeNumber}    <br /></p>  
      <br />
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">IDENTIFICACIÓN: ${employeeIdCard}</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">DIRECCIÓN: ${direction}</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">CELULAR: ${mobile}</font><br /></p>  
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">CORREO: ${email}</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TIPO DE SANGRE: ${bloodtype}</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TELEFONO: ${phone}</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">ESTATUS: ${
            signedUp === false ? "Proceso" : "Aprobado"
          }</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TERMINOS: ${
            terms !== "true" ? "Aceptado" : "No Aceptado"
          }</font><br /></p>
          
          <br />
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align-center: left;"><font face="Times New Roman, serif"><font size="3">CONTACTO DE EMERGENCIA</font></font></p>
          
          <br />
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">NOMBRE: ${nameE}</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">DIRECCIÓN: ${directionE}</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">CELULAR: ${mobileE}</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TELEFONO: ${phoneE}</font><br /></p>
      </div>	
  </section></body></html>`;
  };
});

export default function GymForm(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [gymForm, setGymForm] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("Gym/get")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setGymForm(res.data);
          let EditBtn =
            "<a href='#' id='btEdit'  class='fa fa-eye custom-color size-effect-x2 ' title='Visualizar Encuestado' ></a>&nbsp;";

          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa-pencil-square-o custom-color size-effect-x2 red' title='Eliminar Pregunta' ></a>";
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              fullName:
                '<span class="capitalized defaultText">' +
                item.fullName +
                "</span>",
              employeeIdCard:
                '<span class="capitalized defaultText">' +
                item.employeeIdCard +
                "</span>",
              signedUp:
                '<span class="capitalized defaultText">' +
                (item.signedUp === false ? "Proceso" : "Aprobado") +
                "</span>",
              terms:
                '<span class="capitalized defaultText">' +
                (item.terms !== "true" ? "Aceptado" : "No Aceptado") +
                "</span>",
              direction:
                '<span class="capitalized defaultText">' +
                item.direction +
                "</span>",
              phone:
                '<span class="capitalized defaultText">' +
                item.phone +
                "</span>",
              mobile:
                '<span class="capitalized defaultText">' +
                item.mobile +
                "</span>",
              bloodtype:
                '<span class="capitalized defaultText">' +
                item.bloodtype +
                "</span>",
              email:
                '<span class="capitalized defaultText">' +
                item.email +
                "</span>",
              nameE:
                '<span class="capitalized defaultText">' +
                item.nameE +
                "</span>",
              directionE:
                '<span class="capitalized defaultText">' +
                item.directionE +
                "</span>",
              phoneE:
                '<span class="capitalized defaultText">' +
                item.phoneE +
                "</span>",
              mobileE:
                '<span class="capitalized defaultText">' +
                item.mobileE +
                "</span>",

              itemBtn:
                "<span data-created='" +
                item.id +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                EditBtn +
                DeleteBtn +
                "</span>",
            });
          });

          $("#TblGYM").DataTable({
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
                      fullName: "",
                      employeeIdCard: "",
                      employeeNumber: "",
                      signedUp: "",
                      terms: "",
                      direction: "",
                      phone: "",
                      mobile: "",
                      bloodtype: "",
                      email: "",
                      nameE: "",
                      directionE: "",
                      phoneE: "",
                      mobileE: "",
                      itemBtn: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "fullName",
                title: "Nombre",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "employeeIdCard",
                title: "Identificación",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "direction",
                title: "Dirección",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "mobile",
                title: "Celular",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "email",
                title: "Correo",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "terms",
                title: "Terminos",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "signedUp",
                title: "Estado",
                width: "10%",
                className: "capitalized",
              },

              {
                data: "itemBtn",
                title: "\u00a0Acciones\u00a0\u00a0\u00a0",
                width: "5%",
                orderable: false,
              },
            ],
          });
          $(".csHidden").attr("style", "display:none");
        }
      })
      .catch(function (err) {
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
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
              <h2 className="h2">GYM LISTA</h2>
              <a href="/gymReservation">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;RESERVACIONES GYM
                </span>
              </a>
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
                          id="TblGYM"
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
