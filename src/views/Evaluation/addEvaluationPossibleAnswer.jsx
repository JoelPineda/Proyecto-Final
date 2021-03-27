import DropdownList from "../../components/dropdown/dropdownList";
import {
  GetdropDownListYesNo,
  GetdropDownListPositionMustFill,
} from "../../utils/CommonFunctions";
import $ from "jquery";

export const AddEvaluationPossibleAnswer = (e) => {
  let dataObj = $("#TblEvaluation").attr("data-evaluation-Ojb");
  let DefaultField = '<option value="0">--Seleccione--</option>';
  let evaluationObject = dataObj !== undefined ? JSON.parse(atob(dataObj)) : [];
  let evaluationHierarchy = JSON.parse(
    atob($("#sp_AddEvaluation").attr("data-evaluation-Hierarchy"))
  );
  let dropObject = [
    '<select class="form-control validate-option" data-value="null" id="dropObject">' +
      DefaultField,
  ];
  let dropHierarchy = [
    '<select class="form-control validate-no-option" data-optional="null" id="dropHierarchy">' +
      DefaultField,
  ];

  evaluationObject.forEach((item) => {
    if (item.inactive === "N") {
      dropObject.push(
        '<option class="capitalized" value="' +
          item.evaluationObjectId +
          '">' +
          item.evaluationObjectName +
          "</option>"
      );
    }
  });
  dropObject.push("</select>");

  evaluationHierarchy.forEach((item) => {
    if (item.inactive === "N") {
      dropHierarchy.push(
        '<option class="capitalized" value="' +
          item.evaluationHierarchyId +
          '">' +
          item.evaluationHierarchyName +
          "</option>"
      );
    }
  });
  dropHierarchy.push("</select>");

  let tableData =
    "<br /><div id='divEditEvaluation' class='container d-flex flex-column'><hr />" +
    "<div class='form-group'>" +
    "<div class='divLeft'><label for='tbEvaluationName'>Nombre&nbsp;Evaluaci&oacute;n*:</label><span class='title-required fa faa-flash animated'></span></div>" +
    "<input type='text' class='form-control capitalized' id='tbEvaluationName' title='Nombre de evaluación' value=''   />" +
    "</div>" +
    "<div class='form-group'>" +
    "<div class='divLeft'><label for='dropObject'>Objeto&nbsp;Evaluado*:</label><span class='title-required fa faa-flash animated'></span></div>" +
    dropObject.join("") +
    "</div>" +
    "<div class='form-group'>" +
    "<div class='divLeft'><label for='dropHierarchy'>Jerarqu&iacute;a&nbsp;Evaluaci&oacute;n:</label><span class='span-optional-info'>(Opcional)</span></div>" +
    dropHierarchy.join("") +
    "</div>" +
    "<div class='form-row'>" +
    "<div class='form-group  col-md-6'>" +
    "<div class='divLeft'><label for='dropPositionMustFill'>Debe&nbsp;Llenar:</label><span class='span-optional-info'>(Opcional)</span></div>" +
    GetdropDownListPositionMustFill(
      "validate-no-option",
      null,
      "dropPositionMustFill"
    ) +
    "</div>" +
    "<div class='form-group  col-md-6'>" +
    "<div class='divLeft'><label for='dropFillAfterLogin'>Llenar&nbsp;Inicio&nbsp;Sessi&oacute;n:</label><span class='title-required fa faa-flash animated'></span></div>" +
    GetdropDownListYesNo("validate-option", "null", "dropFillAfterLogin") +
    "</div>" +
    "<div class='form-group  col-md-6'>" +
    "<div class='divLeft'><label for='dropAfterHiringDate'>Llenar&nbsp;Luego&nbsp;aniversario:</label><span class='title-required fa faa-flash animated'></span></div>" +
    GetdropDownListYesNo("validate-option", "null", "dropAfterHiringDate") +
    "</div>" +
    "<div class='form-group  col-md-6'>" +
    "<div class='divLeft'><label for='dropInactive'>Inactivo:</label><span class='title-required fa faa-flash animated'></span></div>" +
    GetdropDownListYesNo("validate-option", "null", "dropInactive") +
    "</div>" +
    "</div>" +
    "</div><hr />";

  return tableData;
};
