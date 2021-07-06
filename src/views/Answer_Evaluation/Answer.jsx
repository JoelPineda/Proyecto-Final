import React, { useState, useEffect } from "react";
import { registerLocale } from "react-datepicker";
import $ from "jquery";
import es from "date-fns/locale/es";
import "moment/locale/es";
import API from "../../utils/api";
import Moment from "moment";
import Loading from "../../components/loading/loading";
import { ShowAlertMessage } from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

export default function Answer(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [policyAccepted, setpolicyAccepted] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("/NewEvaluation/GetNewEvaluationAll")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];
          setpolicyAccepted(res.data);
          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa-eye custom-color size-effect-x2 ' title='Visualizar Encuestado' ></a>&nbsp;";
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Detelle Encuesta' ></a>&nbsp;";
          res.data.forEach((item) => {
            dataResult.push({
              id: '<span class="capitalized defaultText">' + item.id + "</>",
              name:
                '<span class="capitalized defaultText">' + item.nombre + "</>",
              fecha:
                '<span class="capitalized defaultText">' +
                Moment(item.fecha).format("DD/MM/YYYY  ") +
                "</>",
              comentario:
                '<span class="capitalized defaultText">' +
                item.comentario +
                "</span>",
              encuesta:
                '<span class="capitalized defaultText">' +
                item.encuesta +
                "</span>",
              itemBtn:
                '<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Detalle Respuesta" href="/answerdetails?id=' +
                item.id +
                '"' +
                item.id +
                " ></a>",
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
                      id: "",
                      fecha: "",
                      comentario: "",
                      encuesta: "",
                      itemBtn: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "name",
                title: "Empleado ",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "encuesta",
                title: "Encuesta",
                width: "13%",
                className: "capitalized",
              },
              {
                data: "comentario",
                title: "Comentario",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "fecha",
                title: "Fecha",
                width: "5%",
                className: "capitalized",
              },
              {
                data: "itemBtn",
                title: "Acciones",
                width: "3%",
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
        <div className=" htmlPayroll    container">
          <div className="row">
            <div className="lowcolor col-12">
              <br />
              <br />
              <h2 className="h2">ENCUESTA EMPLEADO</h2>
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
