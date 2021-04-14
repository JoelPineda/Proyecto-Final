import {GetdropDownListYesNoClosed} from "../../utils/CommonFunctions";
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

export const AllFn_EvaluationPossibleAnswer = () =>{
  $('body').on('click', '#btPossibleAsw', (e) => {
    ShowPopUpDataTable({titleName: "Posibles Respuesta", htmlBody: AddEvaluationPossibleAnswer(e)});
    fillEvaluationPossibleAswData(e);
 
  })
  $('body').on('click', '#sp_AddEvaluationPossibleAnswer', function(e){

     if($('.current-td-master-posAsw').length > 0){
          alert('Debe procesar primero el registro que agregó!');
          setTimeout(() => {
              $("#inpPosAws").focus();
          }, 100);
     }else{
         let tbl =  $("#TblEvaluationPossibleAnswer").DataTable();  
         tbl.row.add({Id: '<div class="current-td-master-posAsw p-2 bd-highlight d-flex align-items-center justify-content-center"><i class="fa fa-arrow-right faa-passing animated green" ></i></div>',
                     PossibleAnswersName: '<div><input  id="inpPosAws"  autocomplete="off" type="text" class="current-td-psw-name current-td-line"  /><span id="sp_inpPosAws" class="fa faa-flash animated faa-fast red"></span></div>',                 
                     PossibleAnswersOrder: '<div><input id="inpPosOr-new"  autocomplete="off" type="number" min="1" class="current-td-order-order cs-disable  current-td-line defaultText" value="'+ getMaxGroupOrder() +'"  /></div>',
                     Points: '<div><input id="inpPoint-new"  autocomplete="off" type="number" min="1" class="current-td-order-point cs-disable  current-td-line defaultText" value="1"  /></div>',
                     CreationDate: '<span class="d-flex align-items-center justify-content-center defaultText">'+ Moment(new Date()).format("DD/MM/YYYY") +'</>',
                     Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line defaultText", "N", "dropInactivePAsw-new") +'</div>',  
                     itemBtn: '<div><span class="btn btn-success btn-sm  custom-color size-effect" id="btaddNewPosAsw" title="Agregar Calendario"  ><i class="fa fa-plus-circle"></i></span></div>' 
                     }).draw(false);
                     
         setTimeout(() => {
                 $("#inpPosAws").focus();
         }, 100);
     }
   })
   $('body').on('click', '#TblEvaluationPossibleAnswer #btDelPossibleAsw', function(e){
       let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
       let result = window.confirm("Seguro Desea continuar y eliminar el Registro?");
       if (result == true) {
         DeletePosAsw(e,dataItem[0].id);  
       }      
   })
   $('body').on('click', '#TblEvaluationPossibleAnswer #btEditPossibleAsw', function(e){
    let $controlRoot = $(e.currentTarget).parent().parent().parent();
    if($(e.currentTarget).parent().find('.fa-pencil-square-o').length){
        $(e.currentTarget).parent().find('.fa-pencil-square-o').removeClass('fa-pencil-square-o').addClass('fa-floppy-o temp-class green');
        
        $($controlRoot.find('.current-td-question-name')[0]).removeAttr('disabled');
        $($controlRoot.find('.current-td-order-order')[0]).removeAttr('disabled');
        $($controlRoot.find('.current-td-order-point')[0]).removeAttr('disabled');
        $($controlRoot.find('.currentdrop-question-exist')[0]).removeAttr('disabled');
        

    }else{
         
        let result = window.confirm("Seguro Desea continuar?");
        if (result == true) {
            let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
            if($controlRoot.find('.current-td-order-question').val() === ''){
                $controlRoot.find('.current-td-order-question').val(getMaxGroupOrder());
            }

              let evaluationPossibleAnswers = {
                Id: parseInt($controlRoot.find('.current-td-question-id').text()),
                PossibleAnswersName:   $controlRoot.find('.current-td-question-name').val(),
                EvaluationId: parseInt($("#TblEvaluationPossibleAnswer").attr('data-evaluation-id')),
                PossibleAnswersOrder:  parseInt($controlRoot.find('.current-td-order-order').val()),
                points: parseInt($(".current-td-order-point").val()),
                Inactive:$('#dropInactivePAsw').val()};              

        UpdatePossibleAsw(e,evaluationPossibleAnswers);  
          $(e.currentTarget).parent().find('.fa-floppy-o').removeClass('fa-floppy-o temp-class green').addClass('fa-pencil-square-o');
      }                       
        
    }
  })   
   $('body').on('click', '#btaddNewPosAsw', function(e){                    
    let  $PosAswName = $('#inpPosAws');
    let eventCalendarNameItem = $('#TblEvaluationPossibleAnswer').find('.current-td-question-name');
    let resultData = '';
  
    for (let index = 0; index < eventCalendarNameItem.length; index++) {
        const element = eventCalendarNameItem[index];
        if($(element).val().trim().toLowerCase() === $PosAswName.val().trim().toLowerCase()){
            resultData = 'Ya existe la respuesta!';
        }
        
    }
   
    if($PosAswName.val().trim().length < 1){
        resultData ='Requerido!';
    }
    if($("#inpPosOr-new").val() === ''){
        $("#inpPosOr-new").val(getMaxGroupOrder());
    }
    if($("#inpPoint-new").val() === ''){
        $("#inpPoint-new").val('1');
    }
    
    if(resultData !== ''){
        $('#sp_inpPosAws').text(resultData);
        $("#inpPosAws").focus(); 
    }else{
        $('#sp_inpPosAws').text('');
        let evaluationPossibleAnswers = {
                PossibleAnswersName:   $PosAswName.val().trim(),
                EvaluationId: parseInt($("#TblEvaluationPossibleAnswer").attr('data-evaluation-id')),
                PossibleAnswersOrder:  parseInt($("#inpPosOr-new").val()),
                points: parseInt($("#inpPoint-new").val()),
                Inactive: $('#dropInactivePAsw-new').val()
                };
  
        SaveAddNewPosAsw(e, evaluationPossibleAnswers);
        
    }
  })      

}
const  fillEvaluationPossibleAswData = (e) => { 
  let Record = [];
  let evaluationId = 0;
  let dataArr = [];

  
  if(e !== undefined){
      $('#hdEvaluationItem').val($(e.currentTarget).parent().attr('data-item'));
      dataArr = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
  }else{
      dataArr = JSON.parse(atob($('#hdEvaluationItem').val()));
  }
  let dataItem = dataArr[0];  

  if(e !== undefined){
    let EvaluationData = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')));
    evaluationId = EvaluationData[0].evaluationId;
  }else{
    evaluationId = parseInt($("#TblEvaluationPossibleAnswer").attr('data-evaluation-id'));    
  }
  $("#TblEvaluationPossibleAnswer").attr('data-evaluation-id', evaluationId);
  $('#sp_EvalName').text((dataItem !== undefined? dataItem.evaluationName:''));
     API.getData("/EvaluationPossibleAnswers/GetEvaluationPossibleAnswersDetails?companyId=" + getUser().companyId + "&evaluationId="+ evaluationId)
    .then((res) => {
      if (res.status === 200) {
          let dataResult = []; 
          let EditBtn = "<a href='#' id='btEditPossibleAsw'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar' ></a>&nbsp;";
          let DelBtn = "<a href='#' id='btDelPossibleAsw'  class='fa fa-trash-o red custom-color size-effect-x2' title='Eliminar' ></a>";

          res.data.forEach(item => {
              dataResult.push({ 
                  Id: '<span class="d-flex justify-content-start capitalized current-td-question-id defaultText" >' + item.id + '</span>',
                  PossibleAnswersName: '<div><input   autocomplete="off" type="text" class="current-td-question-name cs-disable defaultText" value="'+ item.possibleAnswersName +'"  /><span id="sp_current_inpQuestionName" class="fa faa-flash animated faa-fast red"></span><span class="cs-miniText">'+ item.possibleAnswersName +'</span></div>',                 
                  PossibleAnswersOrder: '<div><input   autocomplete="off" type="number" min="1" class="current-td-order-order cs-disable  current-td-line defaultText" value="'+ item.possibleAnswersOrder +'"  /></div>',
                  Points: '<div><input   autocomplete="off" type="number" min="1" class="current-td-order-point cs-disable  current-td-line defaultText" value="'+ item.points +'"  /></div>',
                  CreationDate: '<span class="d-flex align-items-center justify-content-center defaultText">' + Moment(item.creationDate).format("DD/MM/YYYY") + '</>',
                  Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line currentdrop-question-exist defaultText", item.inactive, "dropInactivePAsw") +'</div>',
                  itemBtn: "<span class='d-flex align-items-center justify-content-center'  data-item='"+ btoa(JSON.stringify([item])) +"'>"+ EditBtn + DelBtn + "</span>" 
              }); 
             
          });
          
          $("#TblEvaluationPossibleAnswer").DataTable({
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
                          { data: "Id", title: "Reg.\u00a0", width:'3%', className:"capitalized" }, 
                          { data: "PossibleAnswersName", title: "Posible\u00a0Pregunta", width:'50%', className:"capitalized defaultText" },
                          { data: "PossibleAnswersOrder", title: "Orden", width:'3%', className:"capitalized defaultText" },
                          { data: "Points", title: "Puntos", width:'20%', className:"capitalized defaultText" },
                          { data: "CreationDate", title: "Registrado\u00a0En", width:'5%', className:"capitalized defaultText" },  
                          { data: "Inactive", title: "Inactivo", width:'10%', className:"capitalized defaultText" },                        
                          { data: "itemBtn", title: "\u00a0Acciones\u00a0\u00a0\u00a0", width:'10%', className:"defaultText", orderable: false},
                      ]

                  });

              $("#TblEvaluationPossibleAnswer_filter input[type='search']").after("<span id='spParent'>&nbsp;&nbsp;<span class='capitalized' id='sp_totalRecords'></span></span></span>");
              $("#sp_totalRecords").text($('#TblEvaluationPossibleAnswer_info').text().split(',')[1].replace(' total de ','') + ' encontrados');
              $("#TblEvaluationPossibleAnswer_info").attr('hidden',true);
              $('.cs-disable').attr("disabled", true);
              $('.current-td-order-point').attr("disabled", true);
              $('.currentdrop-question-exist').attr("disabled", true);
              
              
 
      }

    })
    .catch(function (err) {
      console.error("Error de conexion " + err);
    });
}
const getMaxGroupOrder = ()=>{
  let dateItems = $(".current-td-order-order");
  let dataArray = [0];
  let newOrder =  0;
  for (let index = 0; index < dateItems.length; index++) {
      const element = dateItems[index];
     dataArray.push(($(element).val() !==""? parseInt($(element).val()) : 0));
      
  }
 newOrder = (parseInt(Math.max.apply(null, dataArray)) + 1);
 return newOrder;    
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
const DeletePosAsw = (e, id)=>{ 
   API.deleteData("EvaluationPossibleAnswers/delete?id=" + id)
   .then((res) => {
       if (res.status === 200) {
          fillEvaluationPossibleAswData();
          ClearMessage('Registro Eliminado!');
       }          
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
} 

const SaveAddNewPosAsw = (e, params)=>{ 
   API.postData("EvaluationPossibleAnswers/add", params)
   .then((res) => {
       if (res.status === 200) {
          fillEvaluationPossibleAswData();
          ClearMessage('Registrado!', true);
       } 
   })
   .catch(function (err) {
   console.error("Error de conexion " + err);
       alert(400, err);
   });     
}
const UpdatePossibleAsw = (e, params)=>{ 
  API.putData("EvaluationPossibleAnswers/Update", params)
  .then((res) => {
      if (res.status === 200) {
        fillEvaluationPossibleAswData(e);
         ClearMessage('Registro Actualizado!');
      }          
  })
  .catch(function (err) {
  console.error("Error de conexion " + err);
      alert(400, err);
  });     
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
