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

export default function Employee(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [employeeVisit, setEmployeeVisit] = useState(true);
  //+ getUser().companyId
  const fillData = () => {
    API.getData("/Employees/get?companyId=01")
      .then((res) => {
        setDataLoading(false);
        debugger;
        if (res.status === 200) {
          let dataResult = [];
          setEmployeeVisit(res.data);

          res.data.forEach((item) => {
            dataResult.push({
              employeeNumber:
                '<span class="class="capitalized defaultText">' +
                item.employeeNumber +
                "</>",
              employeeIdCard:
                '<span class="capitalized defaultText">' +
                item.employeeIdCard +
                "</span>",
              Name:
                '<span class="capitalized defaultText">' +
                item.firstName +
                " " +
                item.lastName +
                "</span>",
              companyName:
                '<span class="capitalized defaultText">' +
                item.companyName +
                "</span>",
              divisionName:
                '<span class="capitalized defaultText">' +
                item.divisionName +
                "</span>",
              companyBranchOfficeName:
                '<span class="capitalized defaultText">' +
                item.companyBranchOfficeName +
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
                ? [
                    {
                      employeeNumber: "",
                      employeeIdCard: "",
                      Name: "",

                      companyName: "",
                      divisionName: "",
                      companyBranchOfficeName: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "employeeNumber",
                title: "Empleado",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "employeeIdCard",
                title: "Cedula",
                width: "15%",
                className: "capitalized",
              },

              {
                data: "Name",
                title: "Nombre",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "companyName",
                title: "Empresa",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "divisionName",
                title: "Division",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "companyBranchOfficeName",
                title: "Departamento",
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
              <h2 className="h2">Empleados Activos</h2>
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
