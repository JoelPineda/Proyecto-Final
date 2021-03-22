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

export default function New(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [faq, setFaq] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("News/get?companyId=01")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setFaq(res.data);

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
              publishingDate:
                '<span class="capitalized defaultText">' +
                Moment(item.publishingDate).format("DD/MM/YYYY  ") +
                "</span>",
              inactive:
                '<span class="capitalized defaultText">' +
                (item.inactive !== "N" ? "Si" : "No") +
                "</span>",
              companyId:
                '<span class="capitalized defaultText">' +
                item.companyId +
                "</span>",
              itemBtn:
                '<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Editar Noticia" href="/editNew?id=' +
                item.id +
                '"' +
                item.id +
                " ></a>",
            });
          });

          $("#TblNew").DataTable({
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
                      publishingDate: "",
                      inactive: "",
                      companyId: "",
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
                data: "content",
                title: "Contenido",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "publishingDate",
                title: "Fecha\u00a0publicacion",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "inactive",
                title: "Inactivo",
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
              <h2 className="h2">Noticias</h2>
              <a href="/addNew">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;Añadir Noticia
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
