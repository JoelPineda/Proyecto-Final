import DropdownList from "../../components/dropdown/dropdownList";
import {GetdropDownListYesNo, GetdropDownListYesNoClosed, getCurTimeAndAddtoDateStr, GetdropDownListPositionMustFill} from "../../utils/CommonFunctions";
import $ from "jquery";
import { registerLocale } from "react-datepicker";
import Moment from "moment";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";
import {ShowConfirmationMessage, MessageResults, ShowPopUp, ShowPopUpDataTable, ShowAlertMessage} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

export const AllFn_EvaluationQuestion = ()=>{
  $('body').on('click', '#TblEvaluation #btQuestn', function(e){

      ShowPopUp({titleName: "Preguntas", htmlBody: AddEvaluationQuestion(e), handlerEvent: OnClickSaveEditQuestion, TextOk:"Guardar", isDisabled:true, EnabledDisabled:true});
      
  }) 
  
const OnClickSaveEditQuestion = ()=>{
 let param = {
                EvaluationId: parseInt($("#tbEvaluationName").attr('data-id')),
                EvaluationName: $("#tbEvaluationName").val(),
                EvaluationObjectId: parseInt($("#dropObject").val()), 
                EvaluationHierarchyId: ($("#dropHierarchy").val() ==="0"? null: parseInt($("#dropHierarchy").val())),
                PositionMustFill: ($("#dropPositionMustFill").val() ==="0"? null: $("#dropPositionMustFill").val()),
                FillAfterLogin: $("#dropFillAfterLogin").val(),
                AfterHiringDate: $("#dropAfterHiringDate").val(),
                Inactive: $("#dropInactive").val()
            }; 
    ShowConfirmationMessage('', '',param);
}
const SaveEditQuestionChanges = (params)=>{ 
    //   API.putData("Evaluations/Update", params)
    //   .then((res) => {
    //       if (res.status === 200) {
    //           MessageResults(res.status);
    //           setTimeout(() => {
    //               window.location.reload(true);
    //           }, 1200);
    //       } 
    //   })
    //   .catch(function (err) {
    //   console.error("Error de conexion " + err);
    //       MessageResults(400, err);
    //   });     
}     

}

export const AddEvaluationQuestion = (e) => {
  let dataObj = $("#TblEvaluation").attr("data-evaluation-ojb");
  let DefaultField = '<option value="0">--Seleccione--</option>';
  let evaluationObject = dataObj !== undefined ? JSON.parse(atob(dataObj)) : [];
  let evaluationHierarchy = JSON.parse(
    atob($("#sp_AddEvaluation").attr("data-evaluation-hierarchy"))
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
