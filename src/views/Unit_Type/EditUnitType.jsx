import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";

export const EditTipoUnidad = (e) => {
  let dataItem = JSON.parse(
    atob($(e.currentTarget).parent().attr("data-item"))
  )[0];

  let formulario =
    "<br /><div id='divAddTipo' class='container d-flex flex-column'><hr />" +
    "<input type='hidden' value='" +
    dataItem.id +
    "' class='form-control' id='tbTipoID' /> <div class='form-group'>" +
    "  <label for='tbDescription' class='float-left' >Nombre Unidad</label>&nbsp;<span class='float-left defaultText red' id=sp_tbDescription></span>" +
    "<input value='" +
    dataItem.description +
    "' class='form-control' id='tbDescriptionEdit' /> </br>" +
    " <div class='form-group'>" +
    " <label class='float-left'>Activo</label>" +
    "<select id='tbinactive'  value='" +
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
