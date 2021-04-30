import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";
$(document).ready(() => {
  $("body").on("change", "#inplogo", (e) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  });
});

export const AddBenefitsCategory = (e) => {
  let formulario =
    "<br /><div id='divAddDescription' class='container d-flex flex-column'><hr />" +
    "<div class='form-group'>" +
    "  <label for='tbDescriptionB' class='float-left' >Descripción</label>&nbsp;<span class='float-left defaultText red' id=sp_tbDescriptionB></span><input class='form-control' id='tbDescriptionB' /> </br>" +
    "</div>" +
    "<div class='form-group'>" +
    "  <label for='tbcat' class='float-left' >Orden Categoría</label>&nbsp;<span class='float-left defaultText red' id=sp_tbcat></span><input class='form-control' id='tbcat'  /> </br>" +
    "</div>" +
    "<div class='form-group'>" +
    "<label  class='float-left' >Logo</label>&nbsp;&nbsp;" +
    "<input class='form-control' accept='image/png' type='file'  id='inplogo'     multiple/> <br />" +
    "<img  id='output'   width='150'  height='150'/>" +
    "</div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
