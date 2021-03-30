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

export const AllFn_EvaluationPossibleAnswer = () =>{

}
export const AddEvaluationPossibleAnswer = (e) => {
    let tableData =
    "<br /><div id='divEditEvaluationPossibleAnswer' class='container'><hr />" +
          "<div class='row'>" +
          "<h3 id='sp_EvalName'></h3>" +
            "<div class='lowcolor col-12 float-start'>" + 
              "<div class='d-flex justify-content-start'><span class='btn btn-success btn-sm' id='sp_AddEvaluationPossibleAnswer'  ><i class='fa fa-plus-circle'></i>&nbsp;Añadir Posible Respuesta</span>&nbsp;&nbsp;<span class='cs-mb'><span class='fa faa-flash animated faa-slow' id='spResult'></span></span></div>" +
            "</div>" +
          "</div>" +    
            "<div class='row '>" +
                "<div class='container'>" +    
                    "<div class=''>" +
                      "<div class='bordered table-responsive default-table-size' style='min-height:200px'>" +
                          "<table id='TblEvaluationPossibleAnswer'    class='table table-striped table-bordered display' style='width:100% !important'></table>" +
                      "</div>" +                 
                    "</div> " +           
                "</div>" + 
          "</div></div>" 

  return tableData;
};
