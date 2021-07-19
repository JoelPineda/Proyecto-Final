import React, { useState, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import Moment from "moment";
import "moment/locale/es";
import es from "date-fns/locale/es";
import Button from "../../components/Button/Button";
import BackButton from "../../components/Button/BackButton";
import "react-datepicker/dist/react-datepicker.css";
import "../../components/payroll/payroll.css";
import API from "../../utils/api";
import { ShowAlertMessage } from "../../utils/CommonFunctions";
import $ from "jquery";
import Loading from "../../components/loading/loading";
import { LangSpanish } from "../../tools/dataTables.Language";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { jsPDF } from "jspdf";

registerLocale("es", es);

$(document).ready(() => {
  $("body").on("click", "#TblGYM #btIMPR", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];

    var doc = new jsPDF();

    doc.text(10, 10, "Documento de acuerdo de solicitud gimnasio");
    doc.setFontSize("12");
    doc.text(
      10,
      20,
      "Yo: " +
        param.fullName +
        ", cedula: " +
        param.employeeIdCard +
        ", código empleado:" +
        param.employeeNumber
    );
    doc.text(
      10,
      30,
      "Acepto que he solicitado la solicitud para usar las instalaciones del gimnasio"
    );
    doc.text(
      10,
      40,
      "Acuerdo firmado: " + Moment(param.enrollmentDate).format("DD/MM/YYYY  ")
    );

    // Save the PDF
    doc.save(param.fullName + " " + param.employeeNumber);
  });
});
export default function GymFormFiltre(props) {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [dataLoading, setDataLoading] = useState(true);
  const [gymForm, setGymForm] = useState(true);
  const clickSearch = () => {
    API.getData(
      "/Gym/GetbyGYMDateRange?dateTimeFrom=" +
        Moment(startDate).format("YYYY-MM-DD") +
        "&dateTimeTo=" +
        Moment(endDate).format("YYYY-MM-DD")
    )
      .then((res) => {
        setDataLoading(false);
        let dataResult = [];

        setGymForm(res.data);
        let EditBtn =
          "<a href='#' id='btEdit'  class='fa fa-eye custom-color size-effect-x2 ' title='Visualizar Encuestado' ></a>&nbsp;";
        let imprimirBtn =
          "<a href='#' id='btIMPR'  class='fa fa-print custom-color size-effect-x2 red' title='Eliminar Politica' ></a>";

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
            employeeNumber:
              '<span class="capitalized defaultText">' +
              item.employeeNumber +
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
              '<span class="capitalized defaultText">' + item.phone + "</span>",
            mobile:
              '<span class="capitalized defaultText">' +
              item.mobile +
              "</span>",
            bloodtype:
              '<span class="capitalized defaultText">' +
              item.bloodtype +
              "</span>",
            email:
              '<span class="capitalized defaultText">' + item.email + "</span>",
            nameE:
              '<span class="capitalized defaultText">' + item.nameE + "</span>",
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
            subscription:
              '<span class="capitalized defaultText">' +
              (item.subscription === false ? "Cancelada" : "Activa") +
              "</span>",
            cancellationDate:
              '<span class="capitalized defaultText">' +
              (item.subscription === true
                ? "N/A"
                : Moment(item.cancellationDate).format("DD/MM/YYYY  ")) +
              "</span>",
            enrollmentDate:
              '<span class="capitalized defaultText">' +
              Moment(item.enrollmentDate).format("DD/MM/YYYY  ") +
              "</span>",
            itemBtn:
              "<span data-created='" +
              item.id +
              "'  data-item='" +
              btoa(JSON.stringify([item])) +
              "'>" +
              imprimirBtn +
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
                    subscription: "",
                    enrollmentDate: "",
                    cancellationDate: "",
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
              data: "employeeNumber",
              title: "Código",
              width: "10%",
              className: "capitalized",
            },
            {
              data: "enrollmentDate",
              title: "Fecha de inscripción",
              width: "10%",
              className: "capitalized",
            },
            {
              data: "cancellationDate",
              title: "Fecha de cancelación",
              width: "10%",
              className: "capitalized",
            },
            {
              data: "subscription",
              title: "Subcripción",
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
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });
  };

  useEffect(() => {
    clickSearch();
  }, []);

  return (
    <>
      <br />
      <div className=" htmlPayroll  table-responsive container">
        <div className="row">
          <div className="lowcolor col-12">
            <h2 className="h2" Style={"text-align:center"}>
              INSCRIPCIÓN GYM PERIODO
            </h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="input-group-prepend">
              <div className="input-group-text mb-2">
                Seleccione&nbsp;el&nbsp;rango&nbsp;de&nbsp;fecha&nbsp;que&nbsp;desea&nbsp;visualizar
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Desde:</div>
              </div>
              <DatePicker
                id="dtFrom"
                className=" reactCalendar"
                relativeSize={true}
                popperPlacement="auto-right"
                selected={startDate}
                locale="es"
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setStartDate(date)}
              />
              <div className="input-group-prepend calendarCs">
                <div className="notAllowed">
                  <span
                    class="iconify"
                    data-icon="fa:calendar"
                    data-inline="false"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Hasta:&nbsp;</div>
              </div>
              <DatePicker
                className=" reactCalendar"
                relativeSize={true}
                popperPlacement="auto-right"
                id="dtTo"
                selected={endDate}
                minDate={startDate}
                locale="es"
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setEndDate(date)}
              />
              <div className="input-group-prepend calendarCs">
                <div className="notAllowed">
                  <span
                    className="iconify"
                    data-icon="fa:calendar"
                    data-inline="false"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-12 col-sm-12">
            <div className="input-group mb-2">
              <Button
                type="btn-outline-danger"
                text="BUSCAR"
                clickHandler={clickSearch}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="lowcolor col-12">
            <span className="custom-color">Resultados</span>
            <hr />
          </div>
        </div>

        <div className="row ">
          {!dataLoading ? (
            <>
              <div className="container">
                <div className="">
                  {!dataLoading ? (
                    <div>
                      {gymForm.length > 0 ? (
                        <ReactHTMLTableToExcel
                          id="ButtonExportExcel"
                          className="btn btn-success"
                          table="TblGYM"
                          filename="Inscripción GYM"
                          sheet="Página 1"
                          buttonText="Exportar a excel"
                        />
                      ) : (
                        <br />
                      )}
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
      </div>
      <br />
      <br />
    </>
  );
}
