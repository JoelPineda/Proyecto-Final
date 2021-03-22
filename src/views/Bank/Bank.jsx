import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import API from "../../utils/api";
import Loading from "../../components/loading/loading";
import { LangSpanish } from "../../tools/dataTables.Language";
import { ShowPopUp, ShowAlertMessage } from "../../utils/CommonFunctions";
import { AddBank } from "../Bank/AddBank";
import { EditBank } from "../Bank/EditBank";

$(document).ready(() => {
  $("#sp_AddBanco").click(() => {
    ShowPopUp({
      titleName: "AGREGAR NUEVO BANCO",
      htmlBody: AddBank(),
      handlerEvent: OnClickSaveAddBank,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });

  $("body").on("click", "#TblBank #btEdit", function (e) {
    ShowPopUp({
      titleName: "Actualizar Banco",
      htmlBody: EditBank(e),
      handlerEvent: OnClickSaveEditBank,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });

  $("body").on("change", "#tbBankEdit", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    $(btnOk).removeAttr("disabled");
  });

  const OnClickSaveEditBank = () => {
    alert($("#tbBankID").val());
    let inac = $("#tbinactive").val() !== "Y" ? "N" : "Y";
    API.putData("Bank/update", {
      id: parseInt($("#tbBankID").val()),
      bankName: $("#tbBankEdit").val(),
      inactive: inac,
    })
      .then((response) => {
        setTimeout(() => {
          window.location.reload(true);
        }, 1200);
        ShowAlertMessage("Información", "Actualizado correctamente");
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

  const OnClickSaveAddBank = () => {
    API.postData("Bank/add", {
      bankName: $("#tbBank").val(),
      inactive: "N",
    })
      .then((response) => {
        setTimeout(() => {
          window.location.reload(true);
        }, 1200);
        ShowAlertMessage("Información", "Guardado correctamente");
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

  $("body").on("change", "#tbBank", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    if ($(e.currentTarget).val().length > 3) {
      API.getData("Bank/getName?bankname=" + $("#tbBank").val())
        .then((response) => {
          if (response.status === 200) {
            if (response.data) {
              $("#sp_tbBank").text("Banco existe");

              $(btnOk).attr("disabled", true);
            } else {
              $(btnOk).removeAttr("disabled");
              $("#sp_tbBank").text("");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      $(btnOk).attr("disabled", true);
      $("#sp_tbBank").text(" Requerido!");
    }
    // alert($(e.currentTarget).val());
  });
});

export default function Bank(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [bank, setBank] = useState(true);

  const fillData = () => {
    API.getData("Bank/get")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];
          setBank(res.data);
          let EditBtn =
            "<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Banco' ></a>";
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              bankName:
                '<span class="capitalized defaultText">' +
                item.bankName +
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

          $("#TblBank").DataTable({
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
                      bankName: "",
                      inactive: "",
                      creationDate: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "bankName",
                title: "Banco",
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
              <h2 className="h2">Bancos</h2>
              <span className="btn btn-success btn-sm" id="sp_AddBanco">
                <i className="fa fa-plus-circle"></i>&nbsp;Añadir banco
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
                          id="TblBank"
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
