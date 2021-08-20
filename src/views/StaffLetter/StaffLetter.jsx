import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import API from "../../utils/api";
import { GetImagePatch } from "../../utils/CommonFunctions";
import { jsPDF } from "jspdf";
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
  let DataResultado = [];
  let Tipo = 0;
  let cardType = "";
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
    if (idUnico >= 4) {
      if (
        cardType == "A quien pueda interesar sin salario" ||
        cardType == "A quien pueda interesar"
      ) {
        letterWitoutSalary();
      } else if (cardType == "Carta bancaria") {
        //Agregar metodo de la carta bancaria
        letterBank_Consulate_Salary("Banco");
      }
      else if(cardType == "Carta consular"){
        //Agregar metodo de la carta consular
        letterBank_Consulate_Salary("Consul");
      }
      else if (cardType =="Carta otro"){
        //Agregar metodo de la carta otro
      }
    } else {
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
    }

    idUnico = 0;
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

  const letterWitoutSalary = () => {
    var doc = new jsPDF();
    var logo = new Image();
    logo.src = GetImagePatch("/images/logo_dc.png");
    doc.addImage(logo, "PNG", 15, 20, 60, 20);
    doc.text(15, 60, DataResultado.header_date);
    doc.text(60, 80, "A QUIEN PUEDA INTERESAR");

    var texto = `Mediante la presente, le informamos que el SR. ${DataResultado.employee_name}, dominicano mayor de edad, portador de la cédula de identidad y electoral No.${DataResultado.employee_id_card}, labora en esta empresa desde el ${DataResultado.hiring_date}, desempeñando actualmente el puesto de ${DataResultado.position_name} ubicada en la ${DataResultado.address} `;
    var splitTitle = doc.splitTextToSize(texto, 250);

    doc.setFontSize("12");

    var y = 95;
    for (var i = 0; i < splitTitle.length; i++) {
      if (y > 250) {
        y = 8;
        doc.addPage();
      }
      doc.text(15, y, splitTitle[i]);
      y = y + 8;
    }
    if (Tipo == 1 || Tipo == 2) {
      doc.text(
        15,
        140,
        `Recibe un ingreso ${DataResultado.salary_frequency} de ${DataResultado.salary} pesos, entre sueldos y gratificaciones voluntarias.`
      );
    }
    doc.text(
      15,
      150,
      `Expedimos la presente solicitud a la parte interesada a los ${DataResultado.header_date}.`
    );
    doc.text(15, 170, `Atentamente,`);
    var firma = new Image();
    firma.src = GetImagePatch("/images/firma_isis_abreu.png");

    doc.addImage(firma, "PNG", 60, 190, 70, 25);

    var sello = new Image();
    sello.src = GetImagePatch("/images/sello_gyg.png");

    doc.addImage(sello, "PNG", 60, 215, 90, 30);

    var footer = `${DataResultado.companyName} | ${DataResultado.address} ${DataResultado.email} ${DataResultado.phones} ${DataResultado.rnc}`;
    doc.setFontSize("10");
    var splitTitles = doc.splitTextToSize(footer, 200);
    var y = 270;
    for (var i = 0; i < splitTitles.length; i++) {
      if (y > 288) {
        y = 8;
        doc.addPage();
      }
      doc.text(15, y, splitTitles[i]);
      y = y + 8;
    }

    // Save the PDF
    doc.save(`Carta Empleado ${DataResultado.employee_name}`);
  };




  const letterBank_Consulate_Salary = (Name) => {
    var doc = new jsPDF();
    var logo = new Image();
    logo.src = GetImagePatch("/images/logo_dc.png");
    doc.addImage(logo, "PNG", 15, 20, 60, 20);

    doc.text(15, 60, DataResultado.header_date);

    
    doc.text(15, 75,  "Señores:");

  
    if(Name == "Banco"){ 
      
      doc.text(15, 85, DataResultado.bankName);
      
    }else if(Name== "Consul"){ 
      doc.text(15, 85, DataResultado.consulateName);
    }
    

    var texto = `Mediante la presente, le informamos que el SR. ${DataResultado.employee_name}, dominicano mayor de edad, portador de la cédula de identidad y electoral No.${DataResultado.employee_id_card}, labora en esta empresa desde el ${DataResultado.hiring_date}, desempeñando actualmente el puesto de ${DataResultado.position_name} ubicada en la ${DataResultado.address} `;
    var splitTitle = doc.splitTextToSize(texto, 250);

    doc.setFontSize("12");


    var y = 105;
    for (var i = 0; i < splitTitle.length; i++) {
      if (y > 270) {
        y = 8;
        doc.addPage();
      }
      doc.text(15, y, splitTitle[i]);
      y = y + 8;
    }
    if (Tipo == 1 || Tipo == 2) {
      doc.text(
        15,
        150,
        `Recibe un ingreso ${DataResultado.salary_frequency} de ${DataResultado.salary} pesos, entre sueldos y gratificaciones voluntarias.`
      );
    }
    doc.text(
      15,
      163,
      `Expedimos la presente solicitud a la parte interesada a los ${DataResultado.header_date}.`
    );
    doc.text(15, 180, `Atentamente,`);
    var firma = new Image();
    firma.src = GetImagePatch("/images/firma_isis_abreu.png");

    doc.addImage(firma, "PNG", 70, 195, 65, 15);

    var sello = new Image();
    sello.src = GetImagePatch("/images/sello_gyg.png");

    doc.addImage(sello, "PNG", 60, 210, 90, 30);


    doc.setFontSize("10");
    var footer = `${DataResultado.companyName} | ${DataResultado.address}`;
    var contact =  `${DataResultado.email} ${DataResultado.phones} ${DataResultado.rnc}`;
    doc.text(15, 270,  footer);
    doc.text(46, 280,  contact);

    // Save the PDF
    if(Name == "Banco"){ 

      doc.save(`Carta Banco ${DataResultado.employee_name}`);
      
    }else if(Name== "Consul"){ 
      doc.save(`Carta Consulado ${DataResultado.employee_name}`);
    }
    
  };

  $("body").on("click", "#TblStaffLetter #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    cardType = param.cardType;
    alert(cardType);
    let consulate = "";
    let bank = "";
    let other = "";
    if (param.consulate != null) {
      consulate = param.consulate.consulateName;
    }
    if (param.bank != null) {
      bank = param.bank.bankName;
    }
    if (param.other != null) {
      other = param.other;
    }

    idUnico = param.statusCardId;
    let DataResult = GetLetterParam(
      param.employeesList,
      param.salaryFrequencyId,
      consulate,
      bank,
      other
    );
    DataResultado = DataResult;
    Tipo = param.salaryFrequencyId;
    alert(idUnico);
    switch (param.cardTypeId) {
      case 1:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetter({ props: DataResult }),
          isDisabled: true,
          TextOk:
            idUnico == 4 || idUnico == 5
              ? "Imprimir carta"
              : "Cambiar al estado siguiente",
        });
        break;
      case 2:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetterWithSalary({ props: DataResult }),
          isDisabled: true,
          TextOk:
            idUnico == 4 || idUnico == 5
              ? "Imprimir carta"
              : "Cambiar al estado siguiente",
        });
        break;
      case 4:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetterBankWithSalary({ props: DataResult }),
          isDisabled: true,
          TextOk:
            idUnico == 4 || idUnico == 5
              ? "Imprimir carta"
              : "Cambiar al estado siguiente",
        });
        break;
      case 5:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetterConsulateWithSalary({ props: DataResult }),
          isDisabled: true,
          TextOk:
            idUnico == 4 || idUnico == 5
              ? "Imprimir carta"
              : "Cambiar al estado siguiente",
        });
        break;
      case 6:
        ShowPopUp({
          handlerEvent: SaveChanges,
          htmlBody: GetLetterOtherWithSalary({ props: DataResult }),
          isDisabled: true,
          TextOk:
            idUnico == 4 || idUnico == 5
              ? "Imprimir carta"
              : "Cambiar al estado siguiente",
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
              salaryFrequencyId:
                '<span class="capitalized defaultText">' +
                item.salaryFrequencyId +
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
                      salaryFrequencyId: "",
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
