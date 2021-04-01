import DropdownList from "../../components/dropdown/dropdownList";
import {GetdropDownListYesNoClosed, GetdropDownListEvaluationQuestion} from "../../utils/CommonFunctions";
import $ from "jquery";
import { registerLocale } from "react-datepicker";
import Moment from "moment";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { getUser } from "../../utils/Common";
import API from "../../utils/api";
import {ShowPopUpDataTable} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

export const AllFn_EvaluationQuestion = ()=>{
  $('body').on('click', '#btQuestn', function(e){

    ShowPopUpDataTable({titleName: "Preguntas de Evaluación ", htmlBody: AddEvaluationQuestion(e)});
    fillEvaluationQuestionData(e);
    getDataGroup();
})
$('body').on('click', '#TblEvaluationQuestion #btEditQuestion', function(e){
    let $controlRoot = $(e.currentTarget).parent().parent().parent();
    if($(e.currentTarget).parent().find('.fa-pencil-square-o').length){
        $(e.currentTarget).parent().find('.fa-pencil-square-o').removeClass('fa-pencil-square-o').addClass('fa-floppy-o temp-class green');
        
        $($controlRoot.find('.current-td-question-name')[0]).removeAttr('disabled');
        $($controlRoot.find('.current-td-order-question')[0]).removeAttr('disabled');
        $($controlRoot.find('.current-td-question-type')[0]).removeAttr('disabled');
        $($controlRoot.find('.current-td-question-group')[0]).removeAttr('disabled');
        $($controlRoot.find('.currentdrop-question-exist')[0]).removeAttr('disabled');
        

    }else{
         
        let result = window.confirm("Seguro Desea continuar?");
        if (result == true) {
            let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
            if($controlRoot.find('.current-td-order-question').val() === ''){
                $controlRoot.find('.current-td-order-question').val(getMaxGroupOrder());
            }

              let evaluationQuestion = {
                EvaluationQuestionId: parseInt($controlRoot.find('.current-td-question-id').text()),
                EvaluationQuestionName:   $controlRoot.find('.current-td-question-name').val(),
                EvaluationId: parseInt($("#TblEvaluationQuestion").attr('data-evaluation-id')),
                EvaluationQuestionType:  $controlRoot.find('.current-td-question-type').val(),
                QuestionGroupId:  ($('#dropQuestionGroup').val() !== '0'? parseInt($('#dropQuestionGroup').val()) : null),
                OrderQuestion:  parseInt($controlRoot.find('.current-td-order-question').val()),
                Inactive:$('#dropInactiveQ').val(),
                CompanyId: getUser().companyId};              

        UpdateQuestion(e,evaluationQuestion);  
        $(e.currentTarget).parent().find('.fa-floppy-o').removeClass('fa-floppy-o temp-class green').addClass('fa-pencil-square-o');
        }                       
        
    }

    
 
})    
$('body').on('click', '#TblEvaluationQuestion #btDelQuestion', function(e){
    let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
    let result = window.confirm("Seguro Desea continuar y eliminar el Registro?");
    if (result == true) {
      DeleteQuestionGroup(e,dataItem[0].evaluationQuestionId);  
    }      
})

$('body').on('click', '#AddEvaluationQuestion', function(e){
  if($('.current-td-master').length > 0){
       alert('Debe procesar primero el registro que agregó!');
       setTimeout(() => {
           $("#inpQuestionName").focus();
       }, 100);
  }else{
        let tbl =  $("#TblEvaluationQuestion").DataTable(); 
        let dataItem = JSON.parse(atob($("#TblEvaluationQuestion").attr('data-group')));
        let dropDownList = ['<select class="form-control validate-option current-td-line current-td-question-group cs-disable defaultText" data-value="" id="dropQuestionGroup-new"><option value="0">    </option>'];
        
        for (let index = 0; index < dataItem.length; index++) {
            const element = dataItem[index];
            dropDownList.push('<option class="capitalized" value="'+ element.questionGroupId +'">'+ element.questionGroupName +'</option>');
            
        }
            dropDownList.push("</select>");

      tbl.row.add({EvaluationQuestionId : '<div class="current-td-master p-2 bd-highlight d-flex align-items-center justify-content-center"><i class="fa fa-arrow-right faa-passing animated green" ></i></div>', 
                  EvaluationQuestionName:'<div><input id="inpQuestionName" autocomplete="off" type="text" class="current-td-line defaultText"  /><span id="sp_inpQuestionName" class="fa faa-flash animated faa-fast red"></span></div>',
                  EvaluationQuestionType:'<div>'+ GetdropDownListEvaluationQuestion("validate-option current-td-line current-td-question-type defaultText", "SI_NO", "dropInactiveQType-new") +'</div>',
                  QuestionGroup:'<div>'+  dropDownList.join('') + '</div>', 
                  OrderQuestion:'<div><input id="inpQuestionOrder-new" autocomplete="off" type="number" min="1" class="current-td-line current-group-order defaultText" value="'+ getMaxGroupOrder() +'"  /><span id="sp_inpQuestionOrder" class="fa faa-flash animated faa-fast red"></span></div>',
                  CreationDate:'<div><p><span class="defaultText">'+ Moment(new Date()).format("DD/MM/YYYY") +'</span></p></div>',
                  Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line defaultText", "N", "dropInactiveQ-new") +'</div>',
                  itemBtn: '<div><span class="btn btn-success btn-sm  custom-color size-effect" id="btaddNewQuestion" title="Agregar Calendario"  ><i class="fa fa-plus-circle"></i></span></div>' 
                  }).draw(false);
                  
      setTimeout(() => {
              $("#inpQuestionName").focus();
      }, 100);
  }
})
const getMaxGroupOrder = ()=>{
      let dateItems = $(".current-td-order-question");
      let dataArray = [0];
      let newOrder =  0;
      for (let index = 0; index < dateItems.length; index++) {
          const element = dateItems[index];
         dataArray.push(($(element).val() !==""? parseInt($(element).val()) : 0));
          
      }
     newOrder = (parseInt(Math.max.apply(null, dataArray)) + 1);
     return newOrder;    
}
$('body').on('click', '#btaddNewQuestion', function(e){                    
  let  $GroupName = $('#inpQuestionName');
  let eventCalendarNameItem = $('#TblEvaluationQuestion').find('.current-td-question-name');
  let resultData = '';

  for (let index = 0; index < eventCalendarNameItem.length; index++) {
      const element = eventCalendarNameItem[index];
      if($(element).val().trim().toLowerCase() === $GroupName.val().trim().toLowerCase()){
          resultData = 'Ya existe la pregunta!';
      }
      
  }
 
  if($GroupName.val().trim().length < 1){
      resultData ='Requerido!';
  }
  if($("#inpQuestionOrder-new").val() === ''){
      $("#inpQuestionOrder-new").val(getMaxGroupOrder());
  }
  if(resultData !== ''){
      $('#sp_inpQuestionName').text(resultData);
      $("#inpQuestionName").focus(); 
  }else{

      let evaluationQuestion = {
              EvaluationQuestionName:   $('#inpQuestionName').val(),
              EvaluationId: parseInt($("#TblEvaluationQuestion").attr('data-evaluation-id')),
              EvaluationQuestionType:  $('#dropInactiveQType-new').val(),
              QuestionGroupId:  ($('#dropQuestionGroup-new').val() !== '0'? parseInt($('#dropQuestionGroup-new').val()) : null),
              OrderQuestion:  parseInt($('#inpQuestionOrder-new').val()),
              Inactive:$('#dropInactiveQ-new').val(),
              CompanyId: getUser().companyId};

      SaveAddNewQuestion(e, evaluationQuestion);
      
  }
})
const getDataGroup = ()=>{
      API.getData("/EvaluationQuestionGroup/GetEvaluationQuestionGroupDetails?companyId=" + getUser().companyId)
      .then((res) => {
          if (res.status === 200) {
               $("#TblEvaluationQuestion").attr('data-group', btoa(JSON.stringify(res.data)));
          } 
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });    
} 
const  fillEvaluationQuestionData =(e) => { 
  let Record = [];
  let evaluationId = 0;

  if(e !== undefined){
    let EvaluationData = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
    evaluationId = EvaluationData[0].evaluationId;
  }else{
    evaluationId = parseInt($("#TblEvaluationQuestion").attr('data-evaluation-id'));    
  }
  $("#TblEvaluationQuestion").attr('data-evaluation-id', evaluationId);
 
     API.getData("/EvaluationQuestion/GetEvaluationQuestionDetails?companyId=" + getUser().companyId + "&evaluationId="+ evaluationId)
    .then((res) => {
      if (res.status === 200) {
          let dataResult = []; 
          let EditBtn = "<a href='#' id='btEditQuestion'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Calendario' ></a>&nbsp;";
          let DelBtn = "<a href='#' id='btDelQuestion'  class='fa fa-trash-o red custom-color size-effect-x2' title='Eliminar Calendario' ></a>";

          res.data.forEach(item => {
            let dataItem = JSON.parse(item.questionGroup);
            let dropDownList = ['<select class="form-control validate-option current-td-line current-td-question-group cs-disable defaultText" data-value="'+ item.questionGroupId +'" id="dropQuestionGroup"><option value="0">    </option>'];
            for (let index = 0; index < dataItem.length; index++) {
                const element = dataItem[index];
                dropDownList.push('<option class="capitalized" value="'+ element.QuestionGroupId +'">'+ element.QuestionGroupName +'</option>');
                
            }
             dropDownList.push("</select>");

              dataResult.push({ 
                  EvaluationQuestionId: '<span class="d-flex justify-content-start capitalized current-td-question-id defaultText" data-evaluationQuestionId-id="'+ item.evaluationQuestionId +'">' + item.evaluationQuestionId + '</span>',
                  EvaluationQuestionName: '<div><input   autocomplete="off" type="text" class="current-td-question-name cs-disable defaultText" value="'+ item.evaluationQuestionName +'"  /><span id="sp_current_inpQuestionName" class="fa faa-flash animated faa-fast red"></span><span class="cs-miniText">'+ item.evaluationQuestionName +'</span></div>', 
                  EvaluationQuestionType: '<div>'+ GetdropDownListEvaluationQuestion("validate-option current-td-line current-td-question-type defaultText", item.evaluationQuestionType, "dropInactiveQType") +'</div>',
                  QuestionGroup: '<div>'+  dropDownList.join('') + '</div>',                   
                  OrderQuestion: '<div><input   autocomplete="off" type="number" min="1" class="current-td-order-question cs-disable  current-td-line defaultText" value="'+ item.orderQuestion +'"  /></div>',
                  CreationDate: '<span class="d-flex align-items-center justify-content-center defaultText">' + Moment(item.creationDate).format("DD/MM/YYYY") + '</>',
                  Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line currentdrop-question-exist defaultText", item.inactive, "dropInactiveQ") +'</div>',
                  itemBtn: "<span class='d-flex align-items-center justify-content-center'  data-item='"+ btoa(JSON.stringify([item])) +"'>"+ EditBtn + DelBtn + "</span>" 
              }); 
             
          });
          
          $("#TblEvaluationQuestion").DataTable({
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
                          { data: "EvaluationQuestionId", title: "Reg.\u00a0", width:'3%', className:"capitalized" }, 
                          { data: "EvaluationQuestionName", title: "Pregunta\u00a0\u00a0", width:'50%', className:"capitalized defaultText" },
                          { data: "EvaluationQuestionType", title: "TIpo\u00a0", width:'13%', className:"capitalized defaultText" },
                          { data: "OrderQuestion", title: "Orden", width:'3%', className:"capitalized defaultText" },
                          { data: "QuestionGroup", title: "Grupo.\u00a0Pregunta", width:'20%', className:"capitalized defaultText" },
                          { data: "CreationDate", title: "Registrado\u00a0En", width:'5%', className:"capitalized defaultText" },  
                          { data: "Inactive", title: "Inactivo", width:'10%', className:"capitalized defaultText" },                        
                          { data: "itemBtn", title: "\u00a0Acciones\u00a0\u00a0\u00a0", width:'10%', className:"defaultText", orderable: false},
                      ]

                  });

              $("#TblEvaluationQuestion_filter input[type='search']").after("<span id='spParent'>&nbsp;&nbsp;<span class='capitalized' id='sp_totalRecords'></span></span></span>");
              $("#sp_totalRecords").text($('#TblEvaluationQuestion_info').text().split(',')[1].replace(' total de ','') + ' encontrados');
              $("#TblEvaluationQuestion_info").attr('hidden',true);
              $('.cs-disable').attr("disabled", true);
              $('.current-td-question-type').attr("disabled", true);
              $('.currentdrop-question-exist').attr("disabled", true);
              
              
 
      }

    let dataDropSelected = $('.current-td-question-group');
    for (let index = 0; index < dataDropSelected.length; index++) {
        const element = dataDropSelected[index];
        if($(element).attr('data-value') !== null){
            $(element).val($(element).attr('data-value'));
        }

    }

    })
    .catch(function (err) {
      console.error("Error de conexion " + err);
    });

}  
const SaveAddNewQuestion = (e, params)=>{ 
   API.postData("EvaluationQuestion/add", params)
   .then((res) => {
       if (res.status === 200) {
          fillEvaluationQuestionData();
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
   API.deleteData("EvaluationQuestion/delete?id=" + id)
   .then((res) => {
       if (res.status === 200) {
          fillEvaluationQuestionData(e);
          ClearMessage('Registro Eliminado!');
       }          
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
}
const UpdateQuestion = (e, params)=>{ 
   API.putData("EvaluationQuestion/Update", params)
   .then((res) => {
       if (res.status === 200) {
          fillEvaluationQuestionData(e);
          ClearMessage('Registro Actualizado!');
       }          
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
}



}

export const AddEvaluationQuestion = (e) => {
      let tableData =
    "<br /><div id='divEditEvaluationQuestion' class='container'><hr />" +
          "<div class='row'>" +
          "<h3 id='sp_EvalName'></h3>" +
            "<div class='lowcolor col-12 float-start'>" + 
              "<div class='d-flex justify-content-start'><span class='btn btn-success btn-sm' id='AddEvaluationQuestion'  ><i class='fa fa-plus-circle'></i>&nbsp;Añadir Preguntas</span>&nbsp;&nbsp;<span class='cs-mb'><span class='fa faa-flash animated faa-slow' id='spResult'></span></span></div>" +
            "</div>" +
          "</div>" +    
            "<div class='row '>" +
                "<div class='container'>" +    
                    "<div class=''>" +
                      "<div class='bordered table-responsive default-table-size' style='min-height:200px'>" +
                          "<table id='TblEvaluationQuestion'    class='table table-striped table-bordered display' style='width:100% !important'></table>" +
                      "</div>" +                 
                    "</div> " +           
                "</div>" + 
          "</div></div>" 

  return tableData;
};
