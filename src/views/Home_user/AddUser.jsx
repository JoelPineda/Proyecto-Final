import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const AddUserApp = (e) => {
  let formulario =
    "<br /><div id='divAddconsulateName' class='container d-flex flex-column'><hr />" +
    " <div class='form-group'>" +
    "  <label for='tbemployeeIdCard' class='float-left' >Usuario o Identificación</label>&nbsp;<span class='float-left defaultText red' id=sp_tbemployeeIdCard></span>" +
    "<input class='form-control' id='tbemployeeIdCard' /> </br>" +
    "</div><hr />";

  return formulario;
};
