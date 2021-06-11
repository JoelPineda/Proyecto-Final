import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";

export const EditConsulate = (e) => {
  let dataItem = JSON.parse(
    atob($(e.currentTarget).parent().attr("data-item"))
  )[0];

  let formulario =
    "<br /><div id='divAddconsulateName' class='container d-flex flex-column'><hr />" +
    "<input type='hidden' value='" +
    dataItem.id +
    "' class='form-control' id='tbConsulateID' /> <div class='form-group'>" +
    "  <label for='tbconsulateName' class='float-left' >Nombre Consulado</label>&nbsp;<span class='float-left defaultText red' id=sp_tbconsulateNameEdit></span>" +
    "<input value='" +
    dataItem.consulateName +
    "' class='form-control' id='tbconsulateNameEdit' /> </br>" +
    " <div class='form-group'>" +
    " <label class='float-left'>Activo</label>" +
    "<select id='tbinactiveC'  value='" +
    dataItem.inactive +
    "'    class='form-control'  > " +
    "   <option value=' '>Seleccionar</option>" +
    "   <option value='N'>Sí</option>" +
    "  <option value='Y'>No</option>" +
    " </select>" +
    "</div>" +
    " </div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
