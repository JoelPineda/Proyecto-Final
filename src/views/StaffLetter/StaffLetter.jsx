import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import API from "../../utils/api";

import { getUser, removeUserSession } from "../../utils/Common";
import Loading from "../../components/loading/loading";
import {
  ShowPopUp,
  ShowAlertMessage,
  ShowConfirmationMessage,
  MessageResults,
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";

$(document).ready(() => {});

export default function StaffLetter(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [staffLetter, setStaffLetter] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("StaffLetterSign/Get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setStaffLetter(res.data);
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Tipo Unidad' ></a>&nbsp;";

          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Tipo Unidad' ></a>";
          res.data.forEach((item) => {
            dataResult.push({
              staffLetterSignId:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.staffLetterSignId +
                "</>",
              staffLetterSignName:
                '<span class="capitalized defaultText">' +
                item.staffLetterSignName +
                "</span>",
              employeePosition:
                '<span class="capitalized defaultText">' +
                item.employeePosition +
                "</span>",
              priorityOrderToDisplaySign:
                '<span class="capitalized defaultText">' +
                item.priorityOrderToDisplaySign +
                "</span>",
              creationDate:
                '<span class="capitalized defaultText">' +
                item.creationDate +
                "</span>",
              inactive:
                '<span class="capitalized defaultText">' +
                (item.inactive !== "N" ? "Si" : "No") +
                "</span>",
              itemBtn:
                "<span data-created='" +
                Moment(item.creationDate).format("DD/MM/YYYY ") +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                EditBtn +
                DeleteBtn +
                "</span>",
            });
          });

          $("#Tbltipo").DataTable({
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
                      staffLetterSignName: "",
                      employeePosition: "",
                      inactive: "",
                      priorityOrderToDisplaySign: "",
                      creationDate: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "staffLetterSignName",
                title: "Nombre",
                width: "25%",
                className: "capitalized",
              },

              {
                data: "employeePosition",
                title: "Posicion",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "priorityOrderToDisplaySign",
                title: "Prioridad",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "creationDate",
                title: "Fecha",
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
              <h2 className="h2">Solicitud De Cartas</h2>
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
                          id="Tbltipo"
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
