import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const AddBank = (e) => {
  let formulario =
    "<br /><div id='divAddBank' class='container d-flex flex-column'><hr />" +
    "<div class='form-group'>" +
    "  <label for='tbBank' class='float-left' >Nombre Banco</label>&nbsp;<span class='float-left defaultText red' id=sp_tbBank></span><input class='form-control' id='tbBank' /> </br>" +
    "</div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
