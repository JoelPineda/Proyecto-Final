import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import $ from "jquery";
import Moment from "moment";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";
import { EditConsulate } from "../Consulate/EditConsulate";

import Loading from "../../components/loading/loading";
import {
  ShowConfirmationMessage,
  ShowAlertMessage,
  ShowPopUp,
  MessageResults,
} from "../../utils/CommonFunctions";
import { AddConsulate } from "../Consulate/AddConsulate";
import { LangSpanish } from "../../tools/dataTables.Language";

$(document).ready(() => {
  $("#sp_AddConsulate").click(() => {
    ShowPopUp({
      titleName: "AGREGAR NUEVO CONSULADO",
      htmlBody: AddConsulate(),
      handlerEvent: OnClickSaveConsulateBank,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });
  const OnClickSaveConsulateBank = () => {
    API.postData("Consulate/add", {
      ConsulateName: $("#tbConsulate").val(),
      inactive: "N",
    })
      .then((res) => {
        MessageResults(res.status);
        setTimeout(() => {
          window.location.reload(true);
        }, 1200);
      })
      .catch((error) => {
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
        console.log(error);
      });
  };

  $("body").on("change", "#tbConsulate", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    if ($(e.currentTarget).val().length > 3) {
      API.getData("Consulate/getName?Consulatename=" + $("#tbConsulate").val())
        .then((response) => {
          if (response.status === 200) {
            if (response.data) {
              $("#sp_tbConsulate").text("Consulado existe");

              $(btnOk).attr("disabled", true);
            } else {
              $(btnOk).removeAttr("disabled");
              $("#sp_tbConsulate").text("");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      $(btnOk).attr("disabled", true);
      $("#sp_tbConsulate").text(" Requerido!");
    }
  });

  $("body").on("click", "#TblConsulate #btEdit", function (e) {
    ShowPopUp({
      titleName: "Actualizar Consulado",
      htmlBody: EditConsulate(e),
      handlerEvent: OnClickSaveEditBank,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });

  $("body").on("change", "#tbconsulateNameEdit", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    $(btnOk).removeAttr("disabled");
  });

  $("body").on("change", "#tbinactiveC", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    $(btnOk).removeAttr("disabled");
  });
  const OnClickSaveEditBank = () => {
    let inac = $("#tbinactiveC").val() !== "Y" ? "N" : "Y";

    API.putData("Consulate/update", {
      id: parseInt($("#tbConsulateID").val()),
      ConsulateName: $("#tbconsulateNameEdit").val(),
      inactive: inac,
    })
      .then((res) => {
        MessageResults(res.status);
        setTimeout(() => {
          window.location.reload(true);
        }, 1200);
      })
      .catch((error) => {
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
        console.log(error);
      });
  };

  $("body").on("click", "#TblConsulate #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(SaveDisableChanges, "", param);
  });

  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("Consulate/DisableRegister?id=" + id)
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

export default function Consulate(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [bank, setBank] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("Consulate/getBak")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setBank(res.data);
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Consulado' ></a>&nbsp;";

          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Consulado' ></a>";
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              consulateName:
                '<span class="capitalized defaultText">' +
                item.consulateName +
                "</span>",
              inactive:
                '<span class="capitalized defaultText">' +
                (item.inactive !== "N" ? "Si" : "No") +
                "</span>",
              creationDate:
                '<span class="capitalized defaultText">' +
                Moment(item.creationDate).format("DD/MM/YYYY  ") +
                "</span>",
              itemBtn:
                "<span data-created='" +
                Moment(item.creationDate).format("DD/MM/YYYY ") +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                EditBtn +
                "</span>",
            });
          });

          $("#TblConsulate").DataTable({
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
                      consulateName: "",
                      inactive: "",
                      creationDate: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "consulateName",
                title: "Consulado",
                width: "40%",
                className: "capitalized",
              },
              {
                data: "creationDate",
                title: "Fecha",
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
                width: "20%",
                orderable: false,
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
              <h2 className="h2">Consulados</h2>

              <span className="btn btn-success btn-sm" id="sp_AddConsulate">
                <i className="fa fa-plus-circle"></i>&nbsp;Añadir Consulado
              </span>
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
                          id="TblConsulate"
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
