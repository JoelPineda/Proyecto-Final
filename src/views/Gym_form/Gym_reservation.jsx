import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import Loading from "../../components/loading/loading";
import $ from "jquery";

import Moment from "moment";
import { LangSpanish } from "../../tools/dataTables.Language";
import {
  ShowConfirmationMessage,
  MessageResults,
  ShowAlertMessage,
} from "../../utils/CommonFunctions";

$(document).ready(() => {
  $("body").on("click", "#TblNew #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(
      SaveDisableChanges,
      "",
      param,
      "DESEA CANCELAR LA RESERVACIÓN"
    );
  });

  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("GymReservation/delete?id=" + id)
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

export default function GymReservation(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [faq, setFaq] = useState(true);

  useEffect(() => {
    let Record = [];
    API.getData("GymReservation/getAll")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setFaq(res.data);

          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Usuario' ></a>";
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
              horario:
                '<span class="capitalized defaultText">' +
                item.horario +
                "</span>",
              day:
                '<span class="capitalized defaultText">' +
                Moment(item.day).format("DD/MM/YYYY  ") +
                "</span>",
              name:
                '<span class="capitalized defaultText">' +
                item.name +
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

          $("#TblNew").DataTable({
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
                      horario: "",
                      day: "",
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
                title: "Card",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "horario",
                title: "Horario",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "day",
                title: "Día",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "itemBtn",
                title: "\u00a0Acciones\u00a0\u00a0\u00a0",
                width: "30%",
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
  });
  return (
    <>
      <div>
        <br />
        <div className=" htmlPayroll    container">
          <div className="row">
            <div className="lowcolor col-12">
              <br />
              <br />
              <h2 className="h2">Reservaciónes</h2>
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
                          id="TblNew"
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
