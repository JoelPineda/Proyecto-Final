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

export default function CompanyConf(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [company, setCompany] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("/Company/getCompany")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          let EditBtn =
            "<a href='/addCompany'   class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Evaluación' ></a>";
          setCompany(res.data);
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              logo:
                '<span class="capitalized defaultText">' +
                item.logo +
                "</span>",
              vision:
                '<span class="capitalized defaultText">' +
                item.vision +
                "</span>",
              values:
                '<span class="capitalized defaultText">' +
                item.values +
                "</span>",
              name:
                '<span class="capitalized defaultText">' +
                item.name +
                "</span>",
              mision:
                '<span class="capitalized defaultText">' +
                item.mision +
                "</span>",
              itemBtn:
                '<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Editar Compañia" href="/editCompany?id=' +
                item.id +
                '"' +
                item.id +
                " ></a>",
            });
          });

          $("#TblCompany").DataTable({
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
                      logo: "",
                      vision: "",
                      name: "",
                      mision: "",
                      values: "",
                      itemBtn: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "name",
                title: "Nombre ",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "logo",
                title: "Logo\u00a0Compania",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "vision",
                title: "Vision",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "values",
                title: "Valores",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "mision",
                title: "Mision ",
                width: "15%",
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
              <h2 className="h2">CompaÑia</h2>
              <a href="/addCompany">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;Añadir Compania
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
                          id="TblCompany"
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
