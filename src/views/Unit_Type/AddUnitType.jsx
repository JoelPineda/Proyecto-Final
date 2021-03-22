import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const AddTipoUnidad = (e) => {
  let formulario =
    "<br /><div id='divAddDescription' class='container d-flex flex-column'><hr />" +
    "<div class='form-group'>" +
    "  <label for='tbDescription' class='float-left' >Nombre Unidad</label>&nbsp;<span class='float-left defaultText red' id=sp_tbDescription></span><input class='form-control' id='tbDescription' /> </br>" +
    "</div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
