import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import $ from "jquery";
import Moment from "moment";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";
import { EditEvaluation } from "../Evaluation/editEvaluation";

import Loading from "../../components/loading/loading";
import {
  ShowConfirmationMessage,
  MessageResults,
  ShowPopUp,
} from "../../utils/CommonFunctions";
import { DataTable } from "datatables.net";
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

export default function EmployeeVisitMonth(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [employeeVisit, setEmployeeVisit] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("/EmployeeVisit/getMonth")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];
          setEmployeeVisit(res.data);

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
              creationDate:
                '<span class="capitalized">' +
                Moment(item.creationDate).format("DD/MM/YYYY") +
                "</span>",
              employee:
                '<span class="capitalized defaultText">' +
                item.firstName +
                " " +
                item.lastName +
                "</span>",
            });
          });

          $("#TblVisita").DataTable({
            destroy: true,
            searching: false,
            language: LangSpanish,
            bLengthChange: false,
            lengthMenu: [10, 20, 40, 60, 80, 90, 100, 200],
            order: [[0, "desc"]],
            dom: "Bfrtip",
            buttons: ["copy", "excel", "pdf"],
            data:
              dataResult.length === 0
                ? [{ employeeIdCard: "", creationDate: "", employee: "" }]
                : dataResult,
            columns: [
              {
                data: "employeeIdCard",
                title: "Empleado\u00a0Card",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "employee",
                title: "Empleado",
                width: "25%",
                className: "capitalized",
              },

              {
                data: "creationDate",
                title: "Fecha\u00a0visita",
                width: "20%",
                className: "capitalized",
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
              <h2 className="h2">Visitas Empleados Del Mes</h2>
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
