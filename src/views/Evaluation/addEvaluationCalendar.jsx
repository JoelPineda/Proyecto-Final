import DropdownList from "../../components/dropdown/dropdownList";
import {GetdropDownListYesNo, GetdropDownListYesNoClosed, getCurTimeAndAddtoDateStr} from "../../utils/CommonFunctions";
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

export const AllFn_EvaluationCalendar = ()=>{

  $('body').on('click', '#TblEvaluation #btCalendar', function(e){

    ShowPopUpDataTable({titleName: "Calendario de Evaluaci&oacute;n", htmlBody: AddEvaluationCalendar(e)});
    fillCalendarData(e);


})
$('body').on('click', '#TblEvaluationCalendar #btEditCalendar', function(e){
    let dataItems = $(e.currentTarget).parent().parent().parent().find('.current-td-cal-line-exist');
    let $controlRoot = $(e.currentTarget).parent().parent().parent();
    if($(e.currentTarget).parent().find('.fa-pencil-square-o').length){
        $(e.currentTarget).parent().find('.fa-pencil-square-o').removeClass('fa-pencil-square-o').addClass('fa-floppy-o temp-class green');
        
        for (let index = 0; index < dataItems.length; index++) {
            const element = dataItems[index];
            $(element).removeAttr("readonly");
            
        }
        $($controlRoot.find('.currentdrop-exist')[0]).removeAttr('disabled');
        $($controlRoot.find('.currentdrop-exist')[1]).removeAttr('disabled');

    }else{
        
        let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
        for (let index = 0; index < dataItems.length; index++) {
            const element = dataItems[index];
           if(new Date($(element).val()).getYear() < 0 || new Date($(element).val()).getFullYear() < new Date().getFullYear()){
                $(element).val($(element).attr('min'));
           }
            
        }  
         
        let result = window.confirm("Seguro Desea continuar?");
        if (result == true) {
            let evaluationCalendar = {
                    Id:dataItem[0].id,
                    EvaluationId:  dataItem[0].evaluationId,
                    EvaluationCalendarName: dataItem[0].evaluationCalendarName,
                    EvaluationDateFrom:   getCurTimeAndAddtoDateStr($controlRoot.find('.param-inpEvalFrom').val()),
                    EvaluationDateTo: getCurTimeAndAddtoDateStr($controlRoot.find('.param-inpEvalTo').val()),
                    DateEnabledFrom: getCurTimeAndAddtoDateStr($controlRoot.find('.param-inpEnabFrom').val()),
                    DateEnabledTo: getCurTimeAndAddtoDateStr($controlRoot.find('.param-inpEnabTo').val()),
                    Quarter: ($controlRoot.find('#dropQuarter-exist').val() === "N"? null: 1),
                    Inactive: $controlRoot.find('#dropInactive-exist').val()}; 
        UpdateCalendar(e,evaluationCalendar);  
        $(e.currentTarget).parent().find('.fa-floppy-o').removeClass('fa-floppy-o temp-class green').addClass('fa-pencil-square-o');
        }                       
        
    }

    
 
})    
$('body').on('click', '#TblEvaluationCalendar #btDelCalendar', function(e){
    let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
    let result = window.confirm("Seguro Desea continuar y eliminar el Registro?");
    if (result == true) {
      DeleteCalendar(e,dataItem[0].id);  
    }      
})

$('body').on('click', '#sp_AddEvaluationCalendar', function(e){
  if($('.current-td-master').length > 0){
       alert('Debe procesar primero el registro que agregó!');
       setTimeout(() => {
           $("#inpAswEval").focus();
       }, 100);
  }else{
      let tbl =  $("#TblEvaluationCalendar").DataTable();  
      tbl.row.add({Id : '<div class="current-td-master p-2 bd-highlight d-flex align-items-center justify-content-center"><i class="fa fa-arrow-right faa-passing animated green" ></i></div>', 
                  EvaluationCalendarName:'<div><input id="inpAswEval" autocomplete="off" type="text" class="current-td-line"  /><span id="sp_inpAswEval" class="fa faa-flash animated faa-fast red"></span></div>',
                  CreationDate:'<div><p><br /><span class="defaultText">'+ Moment(new Date()).format("DD/MM/YYYY") +'</span></p></div>',
                  DateEnabledFrom: '<div><input id="inpEnabFrom" type="date" class="form-control current-td-cal-line defaultText" title="Dar click en el Calendario" value="'+ Moment(new Date()).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'"  /></div>',
                  DateEnabledTo: '<div><input id="inpEnabTo" type="date" class="form-control current-td-cal-line defaultText" title="Dar click en el Calendario"  value="'+ Moment(new Date()).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'"  /></div>',
                  EvaluationDateFrom: '<div><input id="inpEvalFrom" type="date" class="form-control current-td-cal-line defaultText" title="Dar click en el Calendario"  value="'+ Moment(new Date()).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'"  /></div>',
                  EvaluationDateTo: '<div><input id="inpEvalTo" type="date" class="form-control current-td-cal-line defaultText" title="Dar click en el Calendario"  value="'+ Moment(new Date()).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'"  /></div>',
                  Quarter: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line  defaultText", "Y" , "dropQuarter") +'</div>', 
                  Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line defaultText", "N", "dropInactive") +'</div>',
                  itemBtn: '<div><span class="btn btn-success btn-sm  custom-color size-effect" id="btaddNewCalendar" title="Agregar Calendario"  ><i class="fa fa-plus-circle"></i></span></div>' 
                  }).draw(false);
                  
      setTimeout(() => {
              $("#inpAswEval").focus();
      }, 100);
  }
})


$('body').on('click', '#btaddNewCalendar', function(e){                    
  let  $aswEval = $('#inpAswEval');
  let eventCalendarNameItem = $('#TblEvaluationCalendar').find('.evaluation-calendar-name');
  let eventCalendarItem = $('.current-td-cal-line');
  let resultData = '';
  for (let index = 0; index < eventCalendarItem.length; index++) {
      const element = eventCalendarItem[index];
     if(new Date($(element).val()).getYear() < 0 || new Date($(element).val()).getFullYear() < new Date().getFullYear()){
          $(element).val($(element).attr('min'));
     }
      
  }
  for (let index = 0; index < eventCalendarNameItem.length; index++) {
      const element = eventCalendarNameItem[index];
      if($(element).text().trim().toLowerCase() === $aswEval.val().trim().toLowerCase()){
          resultData = 'Ya existe el nombre!';
      }
      
  }
 
  if($aswEval.val().trim().length < 1){
      resultData ='Requerido!';
  }
  if(resultData !== ''){
      $('#sp_inpAswEval').text(resultData);
      $("#inpAswEval").focus(); 
  }else{

      let dataItem = JSON.parse(atob($('#hdEvaluationItem').val()))[0];
      let evaluationCalendar = {
              EvaluationId:  dataItem.evaluationId,
              EvaluationCalendarName: $aswEval.val().trim(),
              EvaluationDateFrom:   getCurTimeAndAddtoDateStr($('#inpEvalFrom').val()),
              EvaluationDateTo: getCurTimeAndAddtoDateStr($('#inpEvalTo').val()),
              DateEnabledFrom: getCurTimeAndAddtoDateStr($('#inpEnabFrom').val()),
              DateEnabledTo: getCurTimeAndAddtoDateStr($('#inpEnabTo').val()),
              Quarter:  ($('#dropQuarter').val() === "N"? null: 1),
              Inactive:$('#dropInactive').val()};

      SaveAddNewCalendar(e, evaluationCalendar);
      
  }
}) 
const  fillCalendarData =(e) => { 
  let dataArr = [];
  if($(e.currentTarget).parent().attr('data-item') !== undefined){
      $('#hdEvaluationItem').val($(e.currentTarget).parent().attr('data-item'));
      dataArr = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
  }else{
      dataArr = JSON.parse(atob($('#hdEvaluationItem').val()));
  }
  let Record = [];
  let dataItem = dataArr[0];
  $('#sp_EvalName').text((dataItem !== undefined? dataItem.evaluationName:''));
     API.getData("/EvaluationCalendar/GetEvaluationCalendarQuestionDetails?evaluationId=" + dataItem.evaluationId)
    .then((res) => {
      if (res.status === 200) {
          let dataResult = []; 
          let EditBtn = "<a href='#' id='btEditCalendar'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Calendario' ></a>&nbsp;";
          let DelBtn = "<a href='#' id='btDelCalendar'  class='fa fa-trash-o red custom-color size-effect-x2' title='Eliminar Calendario' ></a>";

          res.data.forEach(item => {
              dataResult.push({ 
                  Id: '<span class="d-flex justify-content-start capitalized defaultText" data-evaluationQuestionId-id="'+ item.id +'">' + item.id + '</span>',
                  EvaluationCalendarName: '<span class="d-flex justify-content-start capitalized defaultText evaluation-calendar-name">' + item.evaluationCalendarName + '</span>', 
                  Quarter: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line currentdrop-exist defaultText", (item.quarter === null? "N": "Y") , "dropQuarter-exist") +'</div>',                       
                  CreationDate: '<span class="d-flex align-items-center justify-content-center">' + Moment(item.creationDate).format("DD/MM/YYYY") + '</>',
                  DateEnabledFrom: '<div><input type="date" class="form-control param-inpEnabFrom current-td-cal-line-exist defaultText" title="Dar click en el Calendario" value="'+ Moment(item.dateEnabledFrom).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'" readonly  /></div>',
                  DateEnabledTo: '<div><input type="date" class="form-control param-inpEnabTo current-td-cal-line-exist defaultText" title="Dar click en el Calendario" value="'+ Moment(item.dateEnabledTo).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'" readonly  /></div>',
                  EvaluationDateFrom: '<div><input type="date" class="form-control param-inpEvalFrom current-td-cal-line-exist defaultText" title="Dar click en el Calendario" value="'+ Moment(item.evaluationDateFrom).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'" readonly  /></div>',
                  EvaluationDateTo: '<div><input type="date" class="form-control param-inpEvalTo current-td-cal-line-exist defaultText" title="Dar click en el Calendario" value="'+ Moment(item.evaluationDateTo).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'" readonly  /></div>',
                  Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line currentdrop-exist defaultText", item.inactive, "dropInactive-exist") +'</div>',
                  itemBtn: "<span class='d-flex align-items-left justify-content-left'  data-item='"+ btoa(JSON.stringify([item])) +"'>"+ EditBtn + DelBtn + "</span>" 
              }); 
            
          });
          
          $("#TblEvaluationCalendar").DataTable({
                      destroy: true,
                      searching: true,
                      language: LangSpanish,
                      bLengthChange: false,
                      paging: false,
                      lengthMenu: [5, 20, 40, 60, 80, 90, 100, 200],
                      "order": [[0, "desc"]],
                      dom: 'Bfrtip',
                          buttons: [ 
                              'copy','excel','pdf'
                          ],                            
                      data:  dataResult,
                      columns: [ 
                          { data: "Id", title: "Reg.\u00a0", width:'4%', className:"capitalized defaultText" }, 
                          { data: "EvaluationCalendarName", title: "Pregunta\u00a0Evaluación", width:'30%', className:"capitalized defaultText" },
                          { data: "CreationDate", title: "Registrado\u00a0En", width:'8%', className:"capitalized defaultText" }, 
                          { data: "EvaluationDateFrom", title: "Eval.\u00a0Desde", width:'10%', className:"capitalized defaultText" },
                          { data: "EvaluationDateTo", title: "Eval.\u00a0Hasta", width:'10%', className:"capitalized defaultText" },                                
                          { data: "DateEnabledFrom", title: "Habt.\u00a0Desde", width:'10%', className:"capitalized defaultText" },
                          { data: "DateEnabledTo", title: "Habt\u00a0Hasta", width:'10%', className:"capitalized defaultText" },
                          { data: "Quarter", title: "Trimestral", width:'10%', className:"capitalized defaultText" },  
                          { data: "Inactive", title: "Inactivo", width:'10%', className:"capitalized defaultText" },                        
                          { data: "itemBtn", title: "\u00a0Acciones\u00a0\u00a0\u00a0", width:'20%', className:"defaultText", orderable: false},
                      ]

                  });

              $("#TblEvaluationCalendar_filter input[type='search']").after("<span id='spParent'>&nbsp;&nbsp;<span class='capitalized' id='sp_totalRecords'></span></span></span>");
              $("#sp_totalRecords").text($('#TblEvaluationCalendar_info').text().split(',')[1].replace(' total de ','') + ' encontrados');
              $("#TblEvaluationCalendar_info").attr('hidden',true);
              $('.currentdrop-exist').attr("disabled", true);
              
        

      }
    })
    .catch(function (err) {
      console.error("Error de conexion " + err);
    });

}  
const SaveAddNewCalendar = (e, params)=>{ 
   API.postData("EvaluationCalendar/add", params)
   .then((res) => {
       if (res.status === 200) {
          fillCalendarData(e);
          ClearMessage('Registrado!', true);
       } 
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
}
const ClearMessage = (title, isNew)=>{
      $('#spResult').text(title);   
      if(isNew){
        $('#spResult').removeClass('red').addClass('green');  
      }else{
        $('#spResult').removeClass('green').addClass('red');
      }
       
      setTimeout(() => {
          $('#spResult').text('');   
      }, 10*1000);    
}
const DeleteCalendar = (e, id)=>{ 
   API.deleteData("EvaluationCalendar/delete?id=" + id)
   .then((res) => {
       if (res.status === 200) {
          fillCalendarData(e);
          ClearMessage('Registro Eliminado!');
       }          
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
}
const UpdateCalendar = (e, params)=>{ 
   API.putData("EvaluationCalendar/Update", params)
   .then((res) => {
       if (res.status === 200) {
          fillCalendarData(e);
          ClearMessage('Registro Actualizado!');
       }          
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
}






}//end Method


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
