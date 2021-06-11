import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import $ from "jquery";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";

import Loading from "../../components/loading/loading";
import {
  ShowAlertMessage,
  MessageResults,
  ShowPopUp,
  GetImagePatch,
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

$(document).ready(() => {
  $("body").on("click", "#TblVisita #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];

    ShowPopUp({
      handlerEvent: SaveChanges,
      htmlBody: GetCat(
        param.name,
        param.imangen,
        param.secondDosis,
        param.firstDosis,
        param.noVacunado,
        param.noMeVacunare,
        param.employeeIdCard
      ),
      isDisabled: true,
      TextOk: "OK",
    });
  });
  const SaveChanges = (params) => {};
  const GetCat = (
    name,
    imangen,
    secondDosis,
    firstDosis,
    noVacunado,
    noMeVacunare,
    employeeIdCard
  ) => {
    return `<html><body><section>
      <div class="container">
      <p style="margin-bottom: 0.25in; line-height: 100%; text-align-center: left;"><font face="Times New Roman, serif"><font size="3">ENCUESTA VACUNA</font></font></p>
      <p   style="margin-bottom: 0in; line-height: 100%"> ${employeeIdCard} ${name}  <br /></p>  
      <p style="margin-bottom: 0in; line-height: 100%; text-align: left;">
              <img src="${
                imangen === ""
                  ? GetImagePatch("/log.png")
                  : "data:image;base64," + imangen
              }" class="img-fluid" style="width: 600px !important;min-width: 200px;min-height: 45px;margin-top: 20px;" name="Logo DC" align="bottom" width="200" height="45" border="0" /> <font color="#575757"><font face="Segoe UI, serif"><font size="2" style="font-size: 10pt"><br /> <br /></font></font></font><br />
          </p> 
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">VACUNADO: ${
            noVacunado === "1" ? "NO" : "SI"
          }</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">ME VACUNARE: ${
            noMeVacunare === "1" ? "NO" : "SI"
          }</font><br /></p>
          <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">PRIMERA DOSIS: ${
            firstDosis === "0" ? "NO" : "SI"
          }</font><br /></p>  
           <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">SEGUNDA DOSIS: ${
             secondDosis === "0" ? "NO" : "SI"
           }</font><br /></p>
      </div>	
  </section></body></html>`;
  };

  /////////////////////////////////////////////////
  $("body").on("click", "#TblVisita #btEdit", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowPopUp({
      handlerEvent: SaveChanges,
      htmlBody: GetCatEncuesta(
        param.noMeVacunareTotal,
        param.noVacunadoTotal,
        param.secondDosisTotal,
        param.siVacunadoTotal,
        param.siMeVacunareTotal,
        param.firstDosisTotal
      ),
      isDisabled: true,
      TextOk: "OK",
    });
  });

  /////////////////////////////////////////////////
  $("body").on("click", "#btEditCompany", function (e) {});

  const GetCatEncuesta = (
    noMeVacunareTotal,
    noVacunadoTotal,
    secondDosisTotal,
    siVacunadoTotal,
    siMeVacunareTotal,
    firstDosisTotal
  ) => {
    return `<html><body><section>
      <div class="container">
      <p style="margin-bottom: 0.25in; line-height: 100%; text-align-center: left;"><font face="Times New Roman, serif"><font size="3">ENCUESTA VACUNA TOTALES</font></font></p>
      <p   style="margin-bottom: 0in; line-height: 100%">   <br /></p>  
      <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TOTAL SI SE VACUNARAN: ${siMeVacunareTotal}</font><br /></p>
     <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TOTAL NO SE VACUNARAN: ${noMeVacunareTotal}</font><br /></p>
     <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TOTAL NO SE HAN VACUNADOS: ${noVacunadoTotal}</font><br /></p>
     <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TOTAL SI SE HAN VACUNADO: ${siVacunadoTotal}</font><br /></p>
     <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TOTAL PRIMERA DOSIS: ${firstDosisTotal}</font><br /></p>
     <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">TOTAL SEGUNDA DOSIS: ${secondDosisTotal}</font><br /></p>
          
      </div>	
  </section></body></html>`;
  };
});
export default function PollVaccine(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [policyAccepted, setpolicyAccepted] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("/PollVaccinesService/get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];
          setpolicyAccepted(res.data);
          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa-eye custom-color size-effect-x2 ' title='Visualizar Encuestado' ></a>&nbsp;";
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Detelle Encuesta' ></a>&nbsp;";
          res.data.forEach((item) => {
            dataResult.push({
              name:
                '<span class="capitalized defaultText">' + item.name + "</>",
              companyName:
                '<span class="capitalized defaultText">' +
                item.companyName +
                "</>",
              employeeIdCard:
                '<span class="capitalized defaultText">' +
                item.employeeIdCard +
                "</span>",
              employee:
                '<span class="capitalized defaultText">' +
                item.firstName +
                " " +
                item.lastName +
                "</span>",
              noVacunado:
                '<span class="capitalized defaultText">' +
                (item.noVacunado === "1" ? "No" : "Si") +
                "</span>",
              noMeVacunare:
                '<span class="capitalized defaultText">' +
                (item.noMeVacunare === "1" ? "No" : "Si") +
                "</span>",
              firstDosis:
                '<span class="capitalized defaultText">' +
                (item.firstDosis === "0" ? "No" : "Si") +
                "</span>",
              secondDosis:
                '<span class="capitalized defaultText">' +
                (item.secondDosis === "0" ? "No" : "Si") +
                "</span>",
              imangen:
                '<img src="' +
                item.imangen +
                '"  class="img-fluid "  alt="Logo" />',
              noVacunadoTotal:
                '<span class="capitalized defaultText">' +
                item.noVacunadoTotal +
                "</span>",
              siVacunadoTotal:
                '<span class="capitalized defaultText">' +
                item.siVacunadoTotal +
                "</span>",
              noMeVacunareTotal:
                '<span class="capitalized defaultText">' +
                item.noMeVacunareTotal +
                "</span>",
              siMeVacunareTotal:
                '<span class="capitalized defaultText">' +
                item.siMeVacunareTotal +
                "</span>",
              firstDosisTotal:
                '<span class="capitalized defaultText">' +
                item.firstDosisTotal +
                "</span>",
              secondDosisTotal:
                '<span class="capitalized defaultText">' +
                item.secondDosisTotal +
                "</span>",

              itemBtn:
                "<span data-created='" +
                item.id +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                DeleteBtn +
                EditBtn +
                "</span>",
            });
          });

          $("#TblVisita").DataTable({
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
                      name: "",
                      companyName: "",
                      employeeIdCard: "",
                      employee: "",
                      noVacunado: "",
                      noMeVacunare: "",
                      firstDosis: "",
                      secondDosis: "",
                      imangen: "",
                      itemBtn: "",
                      noMeVacunareTotal: "",
                      noVacunadoTotal: "",
                      secondDosisTotal: "",
                      siVacunadoTotal: "",
                      siMeVacunareTotal: "",
                      firstDosisTotal: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "name",
                title: "Empleado ",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "employeeIdCard",
                title: "Id Card",
                width: "15%",
                className: "capitalized",
              },

              {
                data: "noVacunado",
                title: "Vacunado",
                width: "5%",
                className: "capitalized",
              },
              {
                data: "noMeVacunare",
                title: "Me Vacunare",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "firstDosis",
                title: "Primera Dosis",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "secondDosis",
                title: "Segunda Dosis",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "companyName",
                title: "Compañia",
                width: "20%",
                className: "capitalized",
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
        setDataLoading(false);

        console.error("Error de conexion " + err);
      });
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
              <h2 className="h2">ENCUESTA DE VACUNA</h2>
              <a href="/totalpollVaccine">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;TOTALES ENCUESTADO
                  POR COMPAÑIA
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
                          id="TblVisita"
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
