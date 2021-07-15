import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import $ from "jquery";
import Moment from "moment";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";
import { EditEvaluation } from "../Evaluation/editEvaluation";

import { jsPDF } from "jspdf";
import Loading from "../../components/loading/loading";
import {
  ShowConfirmationMessage,
  MessageResults,
  ShowPopUp,
} from "../../utils/CommonFunctions";
import { DataTable } from "datatables.net";
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

$(document).ready(() => {
  $("body").on("click", "#TblVisitaPolicy #btIMPR", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];

    var name = param.firstName + " " + param.lastName;
    API.getData(
      "Policies/getbyidHtml?id=" +
        param.id +
        "&employee=" +
        param.employeeNumber +
        "&name=" +
        name +
        "&cedula=" +
        param.cedula
    )
      .then((response) => {
        var doc = new jsPDF();
        /*pdf.html(response.data.content, {});

        pdf.save(param.firstName + " " + param.title);*/

        let pageWidth = doc.internal.pageSize.getWidth();

        //   doc.text(param.title, pageWidth / 3, 20, "center");

        var splitTitle = doc.splitTextToSize(response.data.content, 270);
        var pageHeight = doc.internal.pageSize.height;

        doc.setFontSize("11");
        var y = 7;
        for (var i = 0; i < splitTitle.length; i++) {
          if (y > 280) {
            y = 10;
            doc.addPage();
          }
          doc.text(15, y, splitTitle[i]);
          y = y + 7;
        }

        // Save the PDF
        doc.save(param.firstName + " " + param.title);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
export default function PolicyAccepted(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [policyAccepted, setpolicyAccepted] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("/policies/getPolicyAccepted")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];
          setpolicyAccepted(res.data);
          let DeleteBtn =
            "<a href='#' id='btIMPR'  class='fa fa-print custom-color size-effect-x2 red' title='Eliminar Politica' ></a>";

          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              title:
                '<span class="capitalized defaultText">' +
                item.title +
                "</span>",

              cedula:
                '<span class="capitalized defaultText">' +
                item.cedula +
                "</span>",
              readingDate:
                '<span class="capitalized">' +
                Moment(item.readingDate).format("DD/MM/YYYY") +
                "</span>",
              employee:
                '<span class="capitalized defaultText">' +
                item.employeeNumber +
                " " +
                item.firstName +
                " " +
                item.lastName +
                "</span>",
              employeeNumber:
                '<span class="capitalized defaultText">' +
                item.employeeNumber +
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

          $("#TblVisitaPolicy").DataTable({
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
                      title: "",
                      readingDate: "",
                      employee: "",
                      itemBtn: "",
                      content: "",
                      employeeNumber: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "employee",
                title: "Empleado ",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "title",
                title: "Politica\u00a0Aceptada",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "readingDate",
                title: "Fecha\u00a0Aceptacion",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "itemBtn",
                title: "\u00a0Acciones\u00a0\u00a0\u00a0",
                width: "10%",
                orderable: false,
              },
            ],
          });
          $(".csHidden").attr("style", "display:none");
        }
      })
      .catch(function (err) {
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
              <h2 className="h2">EMPLEADOS QUE HAN ACEPTADO LAS POLITICAS</h2>
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
                          id="TblVisitaPolicy"
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
