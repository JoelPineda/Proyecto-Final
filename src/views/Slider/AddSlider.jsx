import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";
$(document).ready(() => {
  $("body").on("change", "#inpBanner", (e) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  });
});

export const AddSlider = (e) => {
  let formulario =
    "<br /><div id='divAddDescription' class='container d-flex flex-column'><hr />" +
    "<div class='form-group'>" +
    "  <label for='tbOrden' class='float-left' >Número de Orden</label>&nbsp;<span class='float-left defaultText red' id=sp_tbOrden></span><input class='form-control' id='tbOrden' /> </br>" +
    "</div>" +
    "<div class='form-group'>" +
    "<label  class='float-left' >Imagen</label>&nbsp;&nbsp;" +
    "<input class='form-control' type='file'  id='inpBanner'     multiple/> <br />" +
    "<img  id='output'   width='150'  height='150'/>" +
    "</div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
