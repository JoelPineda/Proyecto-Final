import React, { useState, useEffect } from "react";
import $ from "jquery";
import "moment/locale/es";
import API from "../../utils/api";
import Moment from "moment";
import Loading from "../../components/loading/loading";
import { LangSpanish } from "../../tools/dataTables.Language";
import { getUser, removeUserSession } from "../../utils/Common";
import {
  ShowPopUp,
  ShowAlertMessage,
  ShowConfirmationMessage,
  MessageResults,
  ShowConfirmationStatus,
} from "../../utils/CommonFunctions";
import { GetLetter } from "../../components/letters/letterWitoutSalary";

$(document).ready(() => {
  let idUnico = 0;
  $("body").on("click", "#TblMedicalLicenses #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    idUnico = param.id;
    ShowPopUp({
      handlerEvent: SaveChanges,
      htmlBody: GetCat(
        param.employeeNumber,
        param.img,
        param.employee,
        param.creationDate,
        param.description
      ),
      isDisabled: true,
      TextOk: "Cambiar al estado siguiente",
    });
  });
  $("body").on("click", "#TblMedicalLicenses #btRec", function (e) {
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
  $("body").on("click", "#TblMedicalLicenses #btEdit", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    if (param.statusMedicalId == 1) {
      ShowConfirmationStatus(SaveDisableChanges, "", param, "A EN PROCESO");
    } else if (param.statusMedicalId == 2) {
      ShowConfirmationStatus(SaveDisableChanges, "", param, "A APROBADO");
    }
  });
  const SaveRejectedChanges = (params) => {
    let id = params.id;

    API.putData("MedicalLicenses/RejectedMedical?id=" + id)
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
  const GetCat = (number, img, name, fecha, description) => {
    return `<html><body><section>
    <div class="container">
    <p style="margin-bottom: 0.25in; line-height: 100%; text-align-center: left;"><font face="Times New Roman, serif"><font size="3"> LICENCIA MÉDICA</font></font></p>
    <p   style="margin-bottom: 0in; line-height: 100%"> ${number} ${name}  <br /></p>  
    <p style="margin-bottom: 0in; line-height: 100%; text-align: left;">
            <img src="${img}" class="img-fluid" style="width: 600px !important;min-width: 200px;min-height: 45px;margin-top: 20px;" name="Logo DC" align="bottom" width="200" height="45" border="0" /> <font color="#575757"><font face="Segoe UI, serif"><font size="2" style="font-size: 10pt"><br /> <br /></font></font></font><br />
        </p>
        <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">Fecha ${Moment(
          fecha
        ).format("DD/MM/YYYY")}<font size="3"> </font></font></p>
        
        <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif">COMENTARIO: ${description.toUpperCase()}</font><br /></p>
    </div>	
</section></body></html>`;
  };
  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("MedicalLicenses/StatusMedical?id=" + id)
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
  const SaveChanges = () => {
    API.putData("MedicalLicenses/StatusMedical?id=" + idUnico)
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

export default function MedicalLicenses(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [medicalLicenses, setMedicalLicenses] = useState(true);

  const fillData = () => {
    API.getData("MedicalLicenses/get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setMedicalLicenses(res.data);
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Carta' ></a>&nbsp;";
          let RechazarBtn =
            "<a href='#' id='btRec'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Rechazar Solicitud' ></a>&nbsp;";

          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa-eye custom-color size-effect-x2 ' title='Visualizar Licencia' ></a>&nbsp;";
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              name:
                '<span class="capitalized defaultText">' +
                item.employee +
                "</span>",
              employeeNumber:
                '<span class="capitalized defaultText">' +
                item.employeeNumber +
                "</span>",
              img:
                '<img src="' + item.img + '"  class="img-fluid "  alt="img" />',
              description:
                '<span class="capitalized defaultText">' +
                item.description +
                "</span>",
              companyId:
                '<span class="capitalized defaultText">' +
                item.companyId +
                "</span>",
              statusCard:
                '<span class="capitalized defaultText ' +
                item.statusCssClass +
                '">' +
                item.statusCard +
                "</span>",

              creationDate:
                '<span class="capitalized defaultText">' +
                Moment(item.creationDate).format("DD/MM/YYYY  ") +
                "</span>",
              itemBtn:
                "<span data-created='" +
                item.id +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                (item.statusMedicalId == 3 ? " " : EditBtn) +
                (item.statusMedicalId == 4 || item.statusMedicalId == 3
                  ? " "
                  : DeleteBtn) +
                (item.statusMedicalId == 4 || item.statusMedicalId == 3
                  ? " "
                  : RechazarBtn) +
                "</span>",
            });
          });

          $("#TblMedicalLicenses").DataTable({
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
                      employeeNumber: "",
                      img: "",
                      description: "",
                      companyId: "",
                      creationDate: "",
                      statusCard: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "employeeNumber",
                title: "Empleado",
                width: "fa-rotate-180%",
                className: "capitalized",
              },
              {
                data: "name",
                title: "Nombre",
                width: "25%",
                className: "capitalized",
              },

              {
                data: "description",
                title: "Comentario",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "creationDate",
                title: "Fecha",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "statusCard",
                title: "Estado",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "itemBtn",
                title: "\u00a0Acciones\u00a0\u00a0\u00a0",
                width: "10%",
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
              <h2 className="h2">Licencias Médicas</h2>
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
                          id="TblMedicalLicenses"
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