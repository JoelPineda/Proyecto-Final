import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import API from "../../utils/api";

import { getUser, removeUserSession } from "../../utils/Common";
import Loading from "../../components/loading/loading";
import {
  ShowPopUp,
  ShowConfirmationStatus,
  ShowConfirmationMessage,
  MessageResults,
  ShowAlertMessage,
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";
import { GetLetterParam } from "../../components/letters/GetLetterParam";

import { GetLetter } from "../../components/letters/letterWitoutSalary";
import { GetLetterWithSalary } from "../../components/letters/letterWithSalary";
import { GetLetterBankWithSalary } from "../../components/letters/letterBankWithSalary";
import { GetLetterConsulateWithSalary } from "../../components/letters/letterConsulateWithSalary";
import { GetLetterOtherWithSalary } from "../../components/letters/letterOtherWithSalary";

$(document).ready(() => {
  let idUnico = 0;
  $("body").on("click", "#TblStaffLetter #btEdit", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    if (param.statusCardId == 1) {
      ShowConfirmationStatus(SaveDisableChanges, "", param, "A EN PROCESO");
    } else if (param.statusCardId == 2) {
      ShowConfirmationStatus(
        SaveDisableChanges,
        "",
        param,
        "A LISTA PARA ENTREGAR"
      );
    } else if (param.statusCardId == 5) {
      ShowConfirmationStatus(
        SaveDisableChanges,
        "",
        param,
        "A LA CARTA RECHAZADA A EN PROCESO"
      );
    } else if (param.statusCardId == 3) {
      ShowConfirmationStatus(SaveDisableChanges, "", param, "A ENTREGAR");
    }
  });

  const SaveChanges = (params) => {
    API.putData("StaffLetter/StatusCard?id=" + idUnico)
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
  const SaveDisableChanges = (params) => {
    let id = params.staffLetterId;
    API.putData("StaffLetter/StatusCard?id=" + id)
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

  $("body").on("click", "#TblStaffLetter #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];

    idUnico = param.staffLetterId;
    let DataResult = GetLetterParam(param.employeesList);
    switch (param.cardTypeId) {
      case 1:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetter({ props: DataResult }),
          isDisabled: true,
          TextOk: "Cambiar al estado siguiente",
        });
        break;
      case 2:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetterWithSalary({ props: DataResult }),
          isDisabled: true,
          TextOk: "Cambiar al estado siguiente",
        });
        break;
      case 4:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetterBankWithSalary({ props: DataResult }),
          isDisabled: true,
          TextOk: "Cambiar al estado siguiente",
        });
        break;
      case 5:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetterConsulateWithSalary({ props: DataResult }),
          isDisabled: true,
          TextOk: "Cambiar al estado siguiente",
        });
        break;
      case 6:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetterOtherWithSalary({ props: DataResult }),
          isDisabled: true,
          TextOk: "Cambiar al estado siguiente",
        });
        break;

      default:
        ShowAlertMessage(
          "Información",
          "Favor asegurarse de tener todos los campos completados"
        );
        break;
    }
  });

  $("body").on("click", "#TblStaffLetter #btRec", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(
      SaveRejectedChanges,
      "",
      param,
      "DESEA RECHAZAR ESTA SOLICITUD"
    );
  });

  const SaveRejectedChanges = (params) => {
    let id = params.staffLetterId;
    API.putData("StaffLetter/RejectedCard?id=" + id)
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

export default function StaffLetter(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [staffLetter, setStaffLetter] = useState(true);

  const fillData = () => {
    API.getData("StaffLetter/Get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setStaffLetter(res.data);
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Carta' ></a>&nbsp;";
          let RechazarBtn =
            "<a href='#' id='btRec'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Rechazar Solicitud' ></a>&nbsp;";
          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa-eye custom-color size-effect-x2 ' title='Visualizar Carta' ></a>&nbsp;";
          res.data.forEach((item) => {
            dataResult.push({
              bank:
                '<span class="container d-flex align-items-center justify-content-center">' +
                (item.bank == null ? " " : item.bank.bankName) +
                "</>",
              cardType:
                '<span class="capitalized defaultText">' +
                (item.cardType == null ? " " : item.cardType) +
                "</span>",
              consulate:
                '<span class="capitalized defaultText">' +
                (item.consulate == null ? " " : item.consulate.consulateName) +
                "</span>",
              employeeName:
                '<span class="capitalized defaultText">' +
                item.employeeName +
                "</span>",
              employeeNumber:
                '<span class="capitalized defaultText">' +
                item.employeeNumber +
                "</span>",
              other:
                '<span class="capitalized defaultText">' +
                (item.other == null ? " " : item.other) +
                "</span>",
              statusCard:
                '<span class="capitalized defaultText ' +
                item.statusCssClass +
                '">' +
                item.statusCard +
                "</span>",
              creationDate:
                '<span class="capitalized defaultText">' +
                Moment(item.creationDate).format("DD/MM/YYYY ") +
                "</span>",
              itemBtn:
                "<span data-created='" +
                Moment(item.creationDate).format("DD/MM/YYYY ") +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                EditBtn +
                (item.statusCardId == 5 ? " " : DeleteBtn) +
                (item.statusCardId == 5 ? " " : RechazarBtn) +
                "</span>",
            });
          });

          $("#TblStaffLetter").DataTable({
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
                      bank: "",
                      cardType: "",
                      consulate: "",
                      creationDate: "",
                      employeeName: "",
                      other: "",
                      statusCard: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "employeeName",
                title: "Empleado",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "bank",
                title: "Banco",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "cardType",
                title: "Tipo De Carta",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "consulate",
                title: "Consuldado",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "other",
                title: "Otros",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "statusCard",
                title: "Estado",
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
                          id="TblStaffLetter"
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
