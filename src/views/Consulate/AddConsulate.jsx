import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const AddConsulate = (e) => {
  let formulario =
    "<br /><div id='divAddConsulate' class='container d-flex flex-column'><hr />" +
    "<div class='form-group'>" +
    "  <label for='tbConsulate' class='float-left' >Nombre Consulado</label>&nbsp;<span class='float-left defaultText red' id=sp_tbConsulate></span><input class='form-control' id='tbConsulate' /> </br>" +
    "</div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
