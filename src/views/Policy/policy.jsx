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

export default function Policy(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [policy, setPolicy] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("policies/getAll?companyId=01")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setPolicy(res.data);
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
              content:
                '<span class="capitalized defaultText">' +
                item.content +
                "</span>",
              creationDate:
                '<span class="capitalized defaultText">' +
                Moment(item.creationDate).format("DD/MM/YYYY  ") +
                "</span>",
              isRequired:
                '<span class="capitalized defaultText">' +
                item.isRequired +
                "</span>",
              levelFrom:
                '<span class="capitalized defaultText">' +
                item.levelFrom +
                "</span>",
              readAfterLogin:
                '<span class="capitalized defaultText">' +
                item.readAfterLogin +
                "</span>",
              companyId:
                '<span class="capitalized defaultText">' +
                item.companyId +
                "</span>",
              inactive:
                '<span class="capitalized defaultText">' +
                item.inactive +
                "</span>",
              itemBtn:
                '<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Editar Politica" href="/editPolicy?id=' +
                item.id +
                '"' +
                item.id +
                " ></a>",
            });
          });

          $("#TblPolicy").DataTable({
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
                      title: "",
                      content: "",
                      creationDate: "",
                      isRequired: "",
                      levelFrom: "",
                      readAfterLogin: "",
                      companyId: "",
                      inactive: "",
                      itemBtn: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "title",
                title: "Titulo",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "creationDate",
                title: "Fecha\u00a0Creacion",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "isRequired",
                title: "Requerido",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "levelFrom",
                title: "Nivel",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "inactive",
                title: "Inactivo ",
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
              <h2 className="h2">Politica</h2>
              <a href="/addPolicy">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;Añadir Politica
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
                          id="TblPolicy"
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
