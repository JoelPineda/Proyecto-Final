import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import { getUser } from "../../utils/Common";
import API from "../../utils/api";
import Loading from "../../components/loading/loadingS";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {
  ShowConfirmationMessage,
  MessageResults,
  ShowAlertMessage,
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";

$(document).ready(() => {
  $("body").on("click", "#TblPolicy #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(SaveDisableChanges, "", param);
  });

  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("policies/DisableRegister?id=" + id)
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

export default function PolicyRead(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [policy, setPolicy] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("policies/getRead?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];
          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Politica' ></a>";
          setPolicy(res.data);
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
                name:
                '<span class="capitalized defaultText">' +
                item.name +
                "</span>",
                policie:
                '<span class="capitalized defaultText">' +
                item.policie +
                "</span>",
           
                code:
                '<span class="capitalized defaultText">' +
                item.code +
                "</span>",
                read:
                '<span class="capitalized defaultText">' +(item.read !== false ? "Si" : "No")
                 +
                "</span>",        

              itemBtn:
                "<span data-created='" +
                item.id +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                '&nbsp;<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Editar Politica" href="/editpolicy?id=' +
                item.id +
                '"' +
                " ></a>&nbsp;" +
                DeleteBtn +
                "</span>",
            });
          });

          $("#TblPolicy").DataTable({
          
            destroy: true,
            searching: true,
            language: LangSpanish,
            bLengthChange: false,
            lengthMenu: [5000 ],
            order: [[0, "desc"]],
            dom: "Bfrtip",
            buttons: ["copy", "excel", "pdf"],
            data:
              dataResult.length === 0
                ? [
                    {
                      name: "",
                      policie: "",
                      code: "",
                      read: "", 
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
                data: "policie",
                title: "Politica",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "code",
                title: "Código Empleado",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "read",
                title: "Leyó",
                width: "20%",
                className: "capitalized",
              } ,
             
            ],
          });
          $(".csHidden").attr("style", "display:none");
          setDataLoading(false);
        }
      })
      .catch(function (err) {
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
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
              <h2 className="h2">Politica leídas y no leídas </h2>
           
             
            </div>
          </div>
          <div className="row ">
            {!dataLoading ? (
              <>
                <div className="container">
                  <div className="">
                  {policy.length > 0 ? (
                        <ReactHTMLTableToExcel
                          id="ButtonExportExcel"
                          className="btn btn-success"
                          table="TblPolicy"
                          filename="Politica leídas y no leídas"
                          buttonText="Exportar a excel"
                          
                        />
                      ) : (
                        <br />
                      )}
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
