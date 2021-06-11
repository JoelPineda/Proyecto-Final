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

export default function TotalPollVaccine(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [policyAccepted, setpolicyAccepted] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("/PollVaccinesService/getCompany")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];
          setpolicyAccepted(res.data);
          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa-eye custom-color size-effect-x2 ' title='Visualizar Encuestado' ></a>&nbsp;";
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
              totalEncuestado:
                '<span class="capitalized defaultText">' +
                item.total +
                "</span>",

              itemBtn:
                "<span data-created='" +
                item.id +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                DeleteBtn +
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
                      totalEncuestado: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "companyName",
                title: "Compañia",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "noMeVacunareTotal",
                title: "No Se Vacunaran",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "siMeVacunareTotal",
                title: "Si Se Vacunaran",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "noVacunadoTotal",
                title: "No Vacunado",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "siVacunadoTotal",
                title: "Vacunado",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "firstDosisTotal",
                title: "Primera Dosis",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "secondDosisTotal",
                title: "Segunda Dosis",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "totalEncuestado",
                title: "Total Encuestado",
                width: "10%",
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
        <div className=" htmlPayroll container">
          <div className="row">
            <div className="lowcolor col-12">
              <br />
              <br />
              <h2 className="h2">
                TOTALES ENCUESTADOS DE VACUNACIÓN POR EMPRESA
              </h2>
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
