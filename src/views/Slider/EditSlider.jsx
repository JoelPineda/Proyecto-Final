import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";
import { GetImagePatch } from "../../utils/CommonFunctions";

$(document).ready(() => {
  $("body").on("change", "#EditinpBanner", (e) => {
    const output = document.getElementById("Editoutput");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  });
});

export const EditSlider = (e) => {
  let dataItem = JSON.parse(
    atob($(e.currentTarget).parent().attr("data-item"))
  )[0];

  let formulario =
    "<br /><div id='divAddDescription' class='container d-flex flex-column'><hr />" +
    "<div class='form-group'>" +
    "<input type='hidden' value='" +
    dataItem.id +
    "' class='form-control' id='tbSliderID' /> <div class='form-group'>" +
    "  <label for='EdittbOrden' class='float-left' >Número de Orden</label>&nbsp;<span class='float-left defaultText red' id=sp_tbOrden></span><input value='" +
    dataItem.showOrder +
    "'  class='form-control' id='EdittbOrden' /> </br>" +
    "</div>" +
    "<div class='form-group'>" +
    "<label  class='float-left' >Logo</label>&nbsp;&nbsp;" +
    "<input class='form-control' type='file'  id='Edittblogo'     multiple/> <br />" +
    "<img id='output' src='" +
    GetImagePatch("/images/Slider/" + dataItem.imageName) +
    "' width='150' height='150' />" +
    "<input  type='hidden' value='" +
    dataItem.logo +
    "' id='EditlogoName' />" +
    "</div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
