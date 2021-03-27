import DropdownList from "../../components/dropdown/dropdownList";
import {
  GetdropDownListYesNo,
  GetdropDownListPositionMustFill,
} from "../../utils/CommonFunctions";
import $ from "jquery";

export const AddEvaluationCalendar = (e) => {
  let tableData =
    "<br /><div id='divEditEvaluationCalendar' class='container'><hr />" +
          "<div class='row'>" +
          "<h3 id='sp_EvalName'></h3>" +
            "<div class='lowcolor col-12 float-start'>" + 
              "<div class='d-flex justify-content-start'><span class='btn btn-success btn-sm' id='sp_AddEvaluationCalendar'  ><i class='fa fa-plus-circle'></i>&nbsp;Añadir Calendario</span>&nbsp;&nbsp;<span class='cs-mb'><span class='fa faa-flash animated faa-slow' id='spResult'></span></span></div>" +
            "</div>" +
          "</div>" +    
            "<div class='row '>" +
                "<div class='container'>" +    
                    "<div class=''>" +
                      "<div class='bordered table-responsive default-table-size' style='min-height:200px'>" +
                          "<table id='TblEvaluationCalendar'    class='table table-striped table-bordered display' style='width:100% !important'></table>" +
                      "</div>" +                 
                    "</div> " +           
                "</div>" + 
          "</div></div>" 


     

  return tableData;
};
