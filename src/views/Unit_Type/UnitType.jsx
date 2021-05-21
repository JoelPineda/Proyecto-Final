import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import API from "../../utils/api";
import { AddTipoUnidad } from "../Unit_Type/AddUnitType";
import { EditTipoUnidad } from "../Unit_Type/EditUnitType";
import Loading from "../../components/loading/loading";
import {
  ShowPopUp,
  ShowAlertMessage,
  ShowConfirmationMessage,
  MessageResults,
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";

$(document).ready(() => {
  $("#sp_AddTIPO").click(() => {
    ShowPopUp({
      titleName: "AGREGAR TIPO DE UNIDAD",
      htmlBody: AddTipoUnidad(),
      handlerEvent: OnClickSaveConsulateBank,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });
  const OnClickSaveConsulateBank = () => {
    API.postData("BusinessUnitType/add", {
      description: $("#tbDescription").val(),
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

  $("body").on("change", "#tbDescription", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    if ($(e.currentTarget).val().length > 3) {
      API.getData(
        "BusinessUnitType/getDescription?description=" +
          $("#tbDescription").val()
      )
        .then((response) => {
          if (response.status === 200) {
            if (response.data) {
              $("#sp_tbDescription").text("Tipo De Unidad Existe");

              $(btnOk).attr("disabled", true);
            } else {
              $(btnOk).removeAttr("disabled");
              $("#sp_tbDescription").text("");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      $(btnOk).attr("disabled", true);
      $("#sp_tbDescription").text(" Requerido!");
    }
  });

  $("body").on("click", "#Tbltipo #btEdit", function (e) {
    ShowPopUp({
      titleName: "ACTUALIZAR TIPO DE UNIDAD",
      htmlBody: EditTipoUnidad(e),
      handlerEvent: OnClickSaveEditBank,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });

  $("body").on("change", "#tbDescriptionEdit", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    $(btnOk).removeAttr("disabled");
  });

  const OnClickSaveEditBank = () => {
    let inac = $("#tbinactive").val() !== "Y" ? "N" : "Y";

    API.putData("BusinessUnitType/update", {
      id: parseInt($("#tbTipoID").val()),
      description: $("#tbDescriptionEdit").val(),
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

  $("body").on("click", "#Tbltipo #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(SaveDisableChanges, "", param);
  });

  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("BusinessUnitType/DisableRegister?id=" + id)
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

export default function UnitType(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [unitType, setUnitType] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("BusinessUnitType/get")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setUnitType(res.data);
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Tipo Unidad' ></a>&nbsp;";

          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Tipo Unidad' ></a>";
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              description:
                '<span class="capitalized defaultText">' +
                item.description +
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
                      description: "",
                      inactive: "",
                      companyId: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "description",
                title: "Descripción",
                width: "25%",
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
              <h2 className="h2">Tipos De Unidades</h2>

              <span className="btn btn-success btn-sm" id="sp_AddTIPO">
                <i className="fa fa-plus-circle"></i>&nbsp;Añadir Tipo De Unidad
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
