import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";

export const EditBank = (e) => {
  let dataItem = JSON.parse(
    atob($(e.currentTarget).parent().attr("data-item"))
  )[0];
  let formulario =
    "<br /><div id='divAddBank' class='container d-flex flex-column'><hr />" +
    "<input type='hidden' value='" +
    dataItem.id +
    "' class='form-control' id='tbBankID' /> <div class='form-group'>" +
    "  <label for='tbBank' class='float-left' >Nombre Banco</label>&nbsp;<span class='float-left defaultText red' id=sp_tbBank></span>" +
    "<input value='" +
    dataItem.bankName +
    "' class='form-control' id='tbBankEdit' /> </br>" +
    " <div class='form-group'>" +
    " <label class='float-left'>Activo</label>" +
    "<select id='tbinactive'  value='" +
    dataItem.inactive +
    "' class='form-control'> " +
    "<option value=' '>Seleccionar</option>" +
    "<option value='N'>Sí</option>" +
    "<option value='Y'>No</option>" +
    " </select>" +
    "</div>" +
    " </div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
