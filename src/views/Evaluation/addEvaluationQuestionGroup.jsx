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

export const AllFn_EvaluationQuestionGroup = ()=>{

  $('body').on('click', '#sp_AddEvaluationQuestionGroup', function(e){

    ShowPopUpDataTable({titleName: "Grupo de Preguntas", htmlBody: AddEvaluationQuestionGroup(e)});
    fillQuestionGroupData(e);
})
$('body').on('click', '#TblEvaluationQuestionGroup #btEditQuestionGroup', function(e){
    let $controlRoot = $(e.currentTarget).parent().parent().parent();
    if($(e.currentTarget).parent().find('.fa-pencil-square-o').length){
        $(e.currentTarget).parent().find('.fa-pencil-square-o').removeClass('fa-pencil-square-o').addClass('fa-floppy-o temp-class green');
        
        $($controlRoot.find('.current-td-groupname')[0]).removeAttr('disabled');
        $($controlRoot.find('.current-td-groupOr')[0]).removeAttr('disabled');
        $($controlRoot.find('.currentdrop-exist')[0]).removeAttr('disabled');

    }else{
         
        let result = window.confirm("Seguro Desea continuar?");
        if (result == true) {
            let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
            if($controlRoot.find('.current-td-groupOr').val() === ''){
                $controlRoot.find('.current-td-groupOr').val(getMaxGroupOrder());
            }

            let questionGroup = {
              QuestionGroupId:dataItem[0].questionGroupId,
              QuestionGroupName:  $controlRoot.find('.current-td-groupname').val(),
              QuestionGroupOrder: $controlRoot.find('.current-td-groupOr').val(),
              Inactive:  $controlRoot.find('#dropInactiveQg-exist').val(),
              CompanyId: getUser().companyId};

        UpdateQuestionGroup(e,questionGroup);  
        $(e.currentTarget).parent().find('.fa-floppy-o').removeClass('fa-floppy-o temp-class green').addClass('fa-pencil-square-o');
        }                       
        
    }

    
 
})    
$('body').on('click', '#TblEvaluationQuestionGroup #btDelQuestionGroup', function(e){
    let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
    let result = window.confirm("Seguro Desea continuar y eliminar el Registro?");
    if (result == true) {
      DeleteQuestionGroup(e,dataItem[0].questionGroupId);  
    }      
})

$('body').on('click', '#AddEvaluationQuestionGroup', function(e){
  if($('.current-td-master').length > 0){
       alert('Debe procesar primero el registro que agregó!');
       setTimeout(() => {
           $("#inpGroupName").focus();
       }, 100);
  }else{
      let tbl =  $("#TblEvaluationQuestionGroup").DataTable();  
      tbl.row.add({QuestionGroupId : '<div class="current-td-master p-2 bd-highlight d-flex align-items-center justify-content-center"><i class="fa fa-arrow-right faa-passing animated green" ></i></div>', 
                  QuestionGroupName:'<div><input id="inpGroupName" autocomplete="off" type="text" class="current-td-line defaultText"  /><span id="sp_inpGroupName" class="fa faa-flash animated faa-fast red"></span></div>',
                  QuestionGroupOrder:'<div><input id="inpGroupOrder" autocomplete="off" type="number" min="1" class="current-td-line current-group-order defaultText" value="'+ getMaxGroupOrder() +'"  /><span id="sp_inpGroupOrder" class="fa faa-flash animated faa-fast red"></span></div>',
                  CreationDate:'<div><p><span class="defaultText">'+ Moment(new Date()).format("DD/MM/YYYY") +'</span></p></div>',
                  Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line defaultText", "N", "dropInactiveQG") +'</div>',
                  itemBtn: '<div><span class="btn btn-success btn-sm  custom-color size-effect" id="btaddNewQuestionGroup" title="Agregar Calendario"  ><i class="fa fa-plus-circle"></i></span></div>' 
                  }).draw(false);
                  
      setTimeout(() => {
              $("#inpGroupName").focus();
      }, 100);
  }
})
const getMaxGroupOrder = ()=>{
      let dateItems = $(".current-td-groupOr");
      let dataArray = [0];
      let newOrder =  0;
      for (let index = 0; index < dateItems.length; index++) {
          const element = dateItems[index];
         dataArray.push(($(element).val() !==""? parseInt($(element).val()) : 0));
          
      }
     newOrder = (parseInt(Math.max.apply(null, dataArray)) + 1);
     return newOrder;    
}
$('body').on('click', '#btaddNewQuestionGroup', function(e){                    
  let  $GroupName = $('#inpGroupName');
  let eventCalendarNameItem = $('#TblEvaluationQuestionGroup').find('.current-td-groupname');
  let resultData = '';

  for (let index = 0; index < eventCalendarNameItem.length; index++) {
      const element = eventCalendarNameItem[index];
      if($(element).val().trim().toLowerCase() === $GroupName.val().trim().toLowerCase()){
          resultData = 'Ya existe el grupo!';
      }
      
  }
 
  if($GroupName.val().trim().length < 1){
      resultData ='Requerido!';
  }
  if($("#inpGroupOrder").val() === ''){
      $("#inpGroupOrder").val(getMaxGroupOrder());
  }
  if(resultData !== ''){
      $('#sp_inpGroupName').text(resultData);
      $("#inpGroupName").focus(); 
  }else{

      let questionGroup = {
              QuestionGroupName:   $('#inpGroupName').val(),
              QuestionGroupOrder:  $('#inpGroupOrder').val(),
              Inactive:$('#dropInactiveQG').val(),
              CompanyId: getUser().companyId};

      SaveAddNewQuestionGroup(e, questionGroup);
      
  }
}) 
const  fillQuestionGroupData =(e) => { 
  let Record = [];
     API.getData("/EvaluationQuestionGroup/GetEvaluationQuestionGroupDetails?companyId=" + getUser().companyId)
    .then((res) => {
      if (res.status === 200) {
          let dataResult = []; 
          let EditBtn = "<a href='#' id='btEditQuestionGroup'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Calendario' ></a>&nbsp;";
          let DelBtn = "<a href='#' id='btDelQuestionGroup'  class='fa fa-trash-o red custom-color size-effect-x2' title='Eliminar Calendario' ></a>";

          res.data.forEach(item => {
              dataResult.push({ 
                  QuestionGroupId: '<span class="d-flex justify-content-start capitalized" data-evaluationQuestionId-id="'+ item.questionGroupId +'">' + item.questionGroupId + '</span>',
                  QuestionGroupName: '<div><input   autocomplete="off" type="text" class="current-td-groupname defaultText" value="'+ item.questionGroupName +'"  /><span id="sp_current_inpGroupName" class="fa faa-flash animated faa-fast red"></span><span class="cs-miniText">'+ item.questionGroupName +'</span></div>', 
                  QuestionGroupOrder: '<div><input   autocomplete="off" type="number" min="1" class="current-td-groupOr  current-td-line defaultText" value="'+ item.questionGroupOrder +'"  /></div>',
                  CreationDate: '<span class="d-flex align-items-center justify-content-center defaultText">' + Moment(item.creationDate).format("DD/MM/YYYY") + '</>',
                  Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line currentdrop-exist defaultText", item.inactive, "dropInactiveQg-exist") +'</div>',
                  itemBtn: "<span class='d-flex align-items-center justify-content-center'  data-item='"+ btoa(JSON.stringify([item])) +"'>"+ EditBtn + DelBtn + "</span>" 
              }); 
            
          });
          
          $("#TblEvaluationQuestionGroup").DataTable({
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
                          { data: "QuestionGroupId", title: "Reg.\u00a0", width:'4%', className:"capitalized" }, 
                          { data: "QuestionGroupName", title: "Nombre\u00a0Grupo", width:'40%', className:"capitalized defaultText" },
                          { data: "QuestionGroupOrder", title: "Orden.\u00a0Grupo", width:'10%', className:"capitalized defaultText" },
                          { data: "CreationDate", title: "Registrado\u00a0En", width:'8%', className:"capitalized defaultText" },  
                          { data: "Inactive", title: "Inactivo", width:'10%', className:"capitalized defaultText" },                        
                          { data: "itemBtn", title: "\u00a0Acciones\u00a0\u00a0\u00a0", width:'10%', className:"defaultText", orderable: false},
                      ]

                  });

              $("#TblEvaluationQuestionGroup_filter input[type='search']").after("<span id='spParent'>&nbsp;&nbsp;<span class='capitalized' id='sp_totalRecords'></span></span></span>");
              $("#sp_totalRecords").text($('#TblEvaluationQuestionGroup_info').text().split(',')[1].replace(' total de ','') + ' encontrados');
              $("#TblEvaluationQuestionGroup_info").attr('hidden',true);
              $('.current-td-groupname').attr("disabled", true);
              $('.current-td-groupOr').attr("disabled", true);
              $('.currentdrop-exist').attr("disabled", true);
              
 
      }
    })
    .catch(function (err) {
      console.error("Error de conexion " + err);
    });

}  
const SaveAddNewQuestionGroup = (e, params)=>{ 
   API.postData("EvaluationQuestionGroup/add", params)
   .then((res) => {
       if (res.status === 200) {
          fillQuestionGroupData(e);
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
const DeleteQuestionGroup = (e, id)=>{ 
   API.deleteData("EvaluationQuestionGroup/delete?id=" + id)
   .then((res) => {
       if (res.status === 200) {
          fillQuestionGroupData(e);
          ClearMessage('Registro Eliminado!');
       }          
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
}
const UpdateQuestionGroup = (e, params)=>{ 
   API.putData("EvaluationQuestionGroup/Update", params)
   .then((res) => {
       if (res.status === 200) {
          fillQuestionGroupData(e);
          ClearMessage('Registro Actualizado!');
       }          
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
}






}//end Method


export const AddEvaluationQuestionGroup = (e) => {
  let tableData =
    "<br /><div id='divEditEvaluationCalendar' class='container'><hr />" +
          "<div class='row'>" +
          "<h3 id='sp_EvalName'></h3>" +
            "<div class='lowcolor col-12 float-start'>" + 
              "<div class='d-flex justify-content-start'><span class='btn btn-success btn-sm' id='AddEvaluationQuestionGroup'  ><i class='fa fa-plus-circle'></i>&nbsp;Añadir Grupo</span>&nbsp;&nbsp;<span class='cs-mb'><span class='fa faa-flash animated faa-slow' id='spResult'></span></span></div>" +
            "</div>" +
          "</div>" +    
            "<div class='row '>" +
                "<div class='container'>" +    
                    "<div class=''>" +
                      "<div class='bordered table-responsive default-table-size' style='min-height:200px'>" +
                          "<table id='TblEvaluationQuestionGroup'    class='table table-striped table-bordered display' style='width:100% !important'></table>" +
                      "</div>" +                 
                    "</div> " +           
                "</div>" + 
          "</div></div>" 


     

  return tableData;
};
