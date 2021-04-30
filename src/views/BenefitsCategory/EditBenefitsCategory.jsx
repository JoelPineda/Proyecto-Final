import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";
import { GetImagePatch } from "../../utils/CommonFunctions";

$(document).ready(() => {
  $("body").on("change", "#tblogo", (e) => {
    const output = document.getElementById("output1");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  });
});

export const EditBenefitsCategory = (e) => {
  let dataItem = JSON.parse(
    atob($(e.currentTarget).parent().attr("data-item"))
  )[0];
  let formulario =
    "<br /><div id='divEditBenefitsCategory' class='container d-flex flex-column'><hr />" +
    "<input type='hidden' value='" +
    dataItem.id +
    "' class='form-control' id='tbTipoID' /> <div class='form-group'>" +
    "  <label for='tbDescriptionB' class='float-left' >Descripción</label>&nbsp;<span class='float-left defaultText red' id=sp_tbDescriptionB></span>" +
    "<input value='" +
    dataItem.description +
    "' class='form-control' id='tbDescriptionEdit' /> </br>" +
    "<div class='form-group'>" +
    "  <label for='tbcat' class='float-left' >Orden Categoría</label>&nbsp;<span class='float-left defaultText red' id=sp_tbcat></span><input class='form-control' id='tbcat' value='" +
    dataItem.orderCat +
    "'   /> </br>" +
    "</div>" +
    "<div class='form-group'>" +
    "<label  class='float-left' >Logo</label>&nbsp;&nbsp;" +
    "<input class='form-control' accept='image/png' type='file'  id='tblogo'     multiple/> <br />" +
    "<img id='output1' src='" +
    GetImagePatch("/images/" + dataItem.logo) +
    "' width='150' height='150' />" +
    "<input  type='hidden' value='" +
    dataItem.logo +
    "' id='logoName' />" +
    "</div>" +
    "</div>" +
    "</div><hr />";

  return formulario;
};
