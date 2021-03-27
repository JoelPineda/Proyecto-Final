import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import $ from 'jquery';
import Moment from "moment";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";
import {EditEvaluation} from "../Evaluation/editEvaluation";
import {AddEvaluation} from "../Evaluation/addEvaliation";
import {AddEvaluationCalendar} from "../Evaluation/addEvaluationCalendar";
import {AddEvaluationPossibleAnswer} from "../Evaluation/addEvaluationPossibleAnswer";
import {AddEvaluationQuestion} from "../Evaluation/addEvaluationQuestion";
import {GetdropDownListYesNo, GetdropDownListYesNoClosed, getCurTimeAndAddtoDateStr} from "../../utils/CommonFunctions";
import Loading from "../../components/loading/loading";
import {ShowConfirmationMessage, MessageResults, ShowPopUp, ShowPopUpDataTable, ShowAlertMessage} from "../../utils/CommonFunctions";
import { DataTable } from 'datatables.net';
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

$(document).ready(()=>{
    $('body').on('click', '#TblEvaluation #btEdit', function(e){

        ShowPopUp({titleName: "Editar Evaluación", htmlBody: EditEvaluation(e), handlerEvent: OnClickSaveEdit, TextOk:"Guardar", isDisabled:true, EnabledDisabled:true});
        DefaulValuetEdit();
    })
    $('body').on('click', '#TblEvaluation #btCalendar', function(e){

        ShowPopUpDataTable({titleName: "Calendario de Evaluaci&oacute;n", htmlBody: AddEvaluationCalendar(e), handlerEvent: OnClickSaveEditCalendar, TextOk:"Guardar"});
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
                        Quarter: dataItem[0].quarter,
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

    
    $('body').on('click', '#TblEvaluation #btPossibleAsw', function(e){

        ShowPopUp({titleName: "Posibles Respuestas", htmlBody: AddEvaluationPossibleAnswer(e), handlerEvent: OnClickSaveEditPossibleAnswer, TextOk:"Guardar", isDisabled:true, EnabledDisabled:true});
         
    })
    $('body').on('click', '#TblEvaluation #btQuestn', function(e){

        ShowPopUp({titleName: "Preguntas", htmlBody: AddEvaluationQuestion(e), handlerEvent: OnClickSaveEditQuestion, TextOk:"Guardar", isDisabled:true, EnabledDisabled:true});
        
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
                        Quarter: 1,
                        Inactive:$('#dropInactive').val()};

                SaveAddNewCalendar(e, evaluationCalendar);
                
            }
    })    

    

    $('#sp_AddEvaluation').click(()=>{
        ShowPopUp({titleName: "Añadir Evaluación", htmlBody: AddEvaluation(), handlerEvent: OnClickSaveAdd, TextOk:"Guardar", isDisabled:true, EnabledDisabled:true});
    })
    $('body').on('change', '#tbEvaluationName', function(e){
        if($(e.currentTarget).val().length < 2 ){
            $(this).parent().find('.title-required').text('*');
             ValidationEditSelections();
             
        }else{
            $(e.currentTarget).parent().find('.title-required').text('');
             ValidationEditSelections();
        }
    })

    $('body').on('change', '#divEditEvaluation .validate-option', function(e){
        if($(e.currentTarget).val() === '0'){
            $(e.currentTarget).parent().find('.title-required').text('*');

 
        }else{
            $(e.currentTarget).parent().find('.title-required').text('');
        }
        setTimeout(() => {
            ValidationEditSelections();
        }, 200);
        
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
                        Quarter: '<span class="d-flex justify-content-start capitalized defaultText">' + item.quarter + '</span>',                       
                        CreationDate: '<span class="d-flex align-items-center justify-content-center">' + Moment(item.creationDate).format("DD/MM/YYYY hh:mm A") + '</>',
                        DateEnabledFrom: '<div><input type="date" class="form-control param-inpEnabFrom current-td-cal-line-exist defaultText" title="Dar click en el Calendario" value="'+ Moment(item.dateEnabledFrom).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'" readonly  /></div>',
                        DateEnabledTo: '<div><input type="date" class="form-control param-inpEnabTo current-td-cal-line-exist defaultText" title="Dar click en el Calendario" value="'+ Moment(item.dateEnabledTo).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'" readonly  /></div>',
                        EvaluationDateFrom: '<div><input type="date" class="form-control param-inpEvalFrom current-td-cal-line-exist defaultText" title="Dar click en el Calendario" value="'+ Moment(item.evaluationDateFrom).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'" readonly  /></div>',
                        EvaluationDateTo: '<div><input type="date" class="form-control param-inpEvalTo current-td-cal-line-exist defaultText" title="Dar click en el Calendario" value="'+ Moment(item.evaluationDateTo).format("YYYY-MM-DD") + '" min="'+ Moment(new Date()).format("YYYY-MM-DD") +'" readonly  /></div>',
                        Inactive: '<div>'+ GetdropDownListYesNoClosed("validate-option current-td-line currentdrop-exist defaultText", item.inactive, "dropInactive-exist") +'</div>',
                        itemBtn: "<span class='d-flex align-items-center justify-content-center'  data-item='"+ btoa(JSON.stringify([item])) +"'>"+ EditBtn + DelBtn + "</span>" 
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
                                { data: "CreationDate", title: "Registrado\u00a0En\u00a0\u00a0", width:'20%', className:"capitalized defaultText" }, 
                                { data: "EvaluationDateFrom", title: "Eval.\u00a0Desde", width:'10%', className:"capitalized defaultText" },
                                { data: "EvaluationDateTo", title: "Eval.\u00a0Hasta", width:'10%', className:"capitalized defaultText" },                                
                                { data: "DateEnabledFrom", title: "Habt.\u00a0Desde", width:'10%', className:"capitalized defaultText" },
                                { data: "DateEnabledTo", title: "Habt\u00a0Hasta", width:'10%', className:"capitalized defaultText" }, 
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

 const ValidationEditSelections = ()=>{
     let dataSelect = $('#divEditEvaluation .validate-option');
     let btnOk = $(".swal2-confirm.swal2-styled");
     let isValid = false;
     for (let idx = 0; idx < dataSelect.length; idx++) {
        const element = dataSelect[idx];
        if($(element).attr('data-optional') === undefined){
            if($(element).val() === '0'){
                isValid = true;     
            }
        }

     }
    if($('#tbEvaluationName').val().length < 2 ){
        $('#tbEvaluationName').parent().find('.title-required').text('*');
        isValid = true; 
    }else{
        $('#tbEvaluationName').parent().find('.title-required').text('');
    }
    $(btnOk).attr('disabled',isValid);
    if(!isValid){
        $(dataSelect).find('.title-required').text('');
    }

 } 
const DefaulValuetEdit = ()=>{
     let dataSelect = $('#divEditEvaluation .validate-option');
     let dataNoSelect = $('#divEditEvaluation .validate-no-option');
     for (let idx = 0; idx < dataSelect.length; idx++) {
        const element = dataSelect[idx];
        const curData = $(element).attr('data-value');
        
        if(curData !== undefined){
            if(curData !== 'null'){
                $(element).val(curData).change();
            }
        }
 
     }
     for (let index = 0; index < dataNoSelect.length; index++) {
         const element = dataNoSelect[index];
         const curTextData = $(element).attr('data-optional');
        if(curTextData !== undefined){
            if(curTextData !== 'null'){
                $(element).val(curTextData).change();
            }
        }          
         
     }

     
    ValidationEditSelections();
} 
const OnClickSaveEdit = ()=>{
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
    ShowConfirmationMessage(SaveEditChanges, '',param);
}
const OnClickSaveEditCalendar = ()=>{
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
    ShowConfirmationMessage(SaveEditCalendarChanges, '',param);
}
const OnClickSaveEditPossibleAnswer = ()=>{
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
    ShowConfirmationMessage(SaveEditCalendarChanges, '',param);
}
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
    ShowConfirmationMessage(SaveEditCalendarChanges, '',param);
}
const OnClickSaveAdd = ()=>{
 let param = {
                EvaluationName: $("#tbEvaluationName").val(),
                EvaluationObjectId: parseInt($("#dropObject").val()), 
                EvaluationHierarchyId: ($("#dropHierarchy").val() ==="0"? null: parseInt($("#dropHierarchy").val())),
                PositionMustFill: ($("#dropPositionMustFill").val() ==="0"? null: $("#dropPositionMustFill").val()),
                FillAfterLogin: $("#dropFillAfterLogin").val(),
                AfterHiringDate: $("#dropAfterHiringDate").val(),
                Inactive: $("#dropInactive").val()
            }; 
    ShowConfirmationMessage(SaveAddChanges, '',param);
}
const SaveEditChanges = (params)=>{ 
      API.putData("Evaluations/Update", params)
      .then((res) => {
          if (res.status === 200) {
              MessageResults(res.status);
              setTimeout(() => {
                  window.location.reload(true);
              }, 1200);
          } 
      })
      .catch(function (err) {
      console.error("Error de conexion " + err);
          MessageResults(400, err);
      });     
}
const SaveEditCalendarChanges = (params)=>{ 
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
const SaveEditPossibleAnswerChanges = (params)=>{ 
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
const SaveAddChanges = (params)=>{ 
      API.postData("Evaluations/Add", params)
      .then((res) => {
          if (res.status === 200) {
              MessageResults(res.status);
              setTimeout(() => {
                  window.location.reload(true);
              }, 1200);
          } 
      })
      .catch(function (err) {
      console.error("Error de conexion " + err);
          MessageResults(400, err);
      });     
}

});

export default function Evaluation(props) {
    const [dataLoading, setDataLoading] = useState(true); 
    const [evaluations, setEvaluations] = useState(true); 
 
    const  fillData =() => { 
        let Record = [];
           API.getData("/Evaluations/GetEvaluationDetails")
          .then((res) => {
            setDataLoading(false);
            if (res.status === 200) {
                let dataResult = []; 
                let evaluationHierarchyData = [];
                let calendarBtn = "<a href='#' id='btCalendar'  class='fa fa-calendar custom-color size-effect-x2' title='Calendario Evaluación' ></a>&nbsp;";
                let PossibleAswBtn = "<a href='#' id='btPossibleAsw'  class='fa fa-reply custom-color size-effect-x2' title='Posibles Respuestas' ></a>&nbsp;";
                let AswBtn = "<a href='#' id='btQuestn'  class='fa fa-question custom-color size-effect-x2' title='Preguntas' ></a>&nbsp;";
                let EditBtn = "<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Evaluación' ></a>";
                setEvaluations(res.data);
                
                if(res.data.length > 0){
                    JSON.parse(res.data[0].evaluationHierarchy).forEach(item => {
                        evaluationHierarchyData.push({EvaluationHierarchyId: item.EvaluationHierarchyId, EvaluationHierarchyName: item.EvaluationHierarchyName});
                    });
                };
                res.data.forEach(item => {
                    let eHierarchyName = '';
                    if(evaluationHierarchyData.length > 0){
                        evaluationHierarchyData.forEach(element => {
                            if(element.EvaluationHierarchyId === item.evaluationHierarchyId){
                                eHierarchyName = element.EvaluationHierarchyName;
                            } 
                        });
                    }

                    dataResult.push({ 
                        EvaluationId: '<span class="container d-flex align-items-center justify-content-center">' + item.evaluationId + '</>',
                        EvaluationName: '<span class="capitalized defaultText">' + item.evaluationName + '</span>',
                        EvaluationObjectName: '<span class="capitalized defaultText" data-object-id="'+ item.evaluationObjectId +'">' + item.evaluationObject.evaluationObjectName + '</span>',
                        EvaluationHierarchyName: '<span class="capitalized defaultText" data-hierarchy-id="'+ item.EvaluationHierarchyId +'" >' + eHierarchyName + '</span>',
                        PositionMustFill: '<span class="capitalized defaultText">' + (item.positionMustFill === null? "": item.positionMustFill.toLowerCase()) + '</span>',
                        FillAfterLogin: '<span class="capitalized defaultText">' + (item.fillAfterLogin !== 'N'? "Si":"No") + '</span>',
                        AfterHiringDate: '<span class="capitalized defaultText">' + (item.afterHiringDate !== 'N'? "Si":"No") + '</span>',
                        Inactive: '<span class="capitalized defaultText">' + (item.inactive !== 'N'? "Si":"No") + '</span>',
                        itemBtn: "<span class='d-flex align-items-center justify-content-center' data-created='"+ Moment(item.creationDate).format("DD/MM/YYYY hh:mm A") +"'  data-item='"+ btoa(JSON.stringify([item])) +"'>"+ calendarBtn +  PossibleAswBtn + AswBtn + EditBtn + "</span>" 
                    }); 
                  
                });
                
                $("#TblEvaluation").DataTable({
                            destroy: true,
                            searching: false,
                            language: LangSpanish,
                            bLengthChange: false,
                            lengthMenu: [10, 20, 40, 60, 80, 90, 100, 200],
                            "order": [[0, "desc"]],
                            dom: 'Bfrtip',
                                buttons: [ 
                                    'copy','excel','pdf'
                                ],                            
                            data:  (dataResult.length === 0? [{EvaluationName:'',EvaluationObjectName:'',EvaluationHierarchyName:'', PositionMustFill:'', FillAfterLogin:'', AfterHiringDate:'',Inactive:'',itemBtn: ''}] : dataResult),
                            columns: [  
                                { data: "EvaluationName", title: "Nombre\u00a0Evaluación", width:'25%', className:"capitalized" }, 
                                { data: "EvaluationObjectName", title: "Objeto\u00a0Evaluado", width:'20%', className:"capitalized" },
                                { data: "EvaluationHierarchyName", title: "Jerarquía\u00a0Evaluación", width:'15%', className:"capitalized" },
                                { data: "PositionMustFill", title: "Debe\u00a0Llenar", width:'15%', className:"capitalized" },  
                                { data: "FillAfterLogin", title: "Llenar\u00a0Inicio\u00a0Sesión", width:'10%', className:"capitalized" }, 
                                { data: "AfterHiringDate", title: "Llenar\u00a0Luego\u00a0Aniver.", width:'10%', className:"capitalized" }, 
                                { data: "Inactive", title: "Inactivo", width:'10%', className:"capitalized" },                        
                                { data: "itemBtn", title: "\u00a0Acciones\u00a0\u00a0\u00a0", width:'30%', orderable: false},
                            ]
    
                        });
                    $('.csHidden').attr('style', 'display:none');
              
    
            }
          })
          .catch(function (err) {
            setDataLoading(false);
            console.error("Error de conexion " + err);
          });
          
     
    }
const [evaluationObject, setEvaluationObject] = useState([]);
const [evaluationHierarchy, setEvaluationHierarchy] = useState([]);     
const GetEvaluationObject = ()=>{ 
      API.getData("EvaluationObject/get")
      .then((res) => {
          if (res.status === 200) {
              setEvaluationObject(btoa(JSON.stringify(res.data)))
          } 
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });     
}
const GetEvaluationHierarchy = ()=>{ 
      API.getData("EvaluationHierarchy/get")
      .then((res) => {
          if (res.status === 200) {
              setEvaluationHierarchy(btoa(JSON.stringify(res.data)));
          } 
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });     
}

  useEffect(() => {
    fillData();
    GetEvaluationObject();
    GetEvaluationHierarchy();

 }, []); 
  
  return (
    
    <>
    <div>
        <br />
        <div className=" htmlPayroll    container">
          <div className="row">
            <div className="lowcolor col-12">  
              <br />
              <br />
              <h2 className="h2">Evaluaci&oacute;n</h2>
              <span className="btn btn-success btn-sm" id="sp_AddEvaluation" data-evaluation-Hierarchy={evaluationHierarchy} ><i className="fa fa-plus-circle"></i>&nbsp;Añadir Evaliaci&oacute;n</span>
                
            </div>
          </div>        
            <div className="row ">
                {!dataLoading ?
                    <>
                    <div className="container">    
                        <div className="">
                            {!dataLoading ?
                                <div className="scroll-table bordered" Style="min-height:600px">
                                    <table id="TblEvaluation" data-evaluation-Ojb={evaluationObject}  className="table table-striped table-bordered display" Style="width:100% !important"></table>
                                </div>                 
                            :
                            <Loading />
                            }
                        
                        </div>            
                    </div>
                    </>
                    
                :
                <div className="container">
                    <br />
                    <Loading />  
                </div>
                
                }
         </div>


        <br />
        <br />

        </div>
        <br />
        <input type="hidden"  id="hdEvaluationItem"  />
        <br />
    </div>
           

 </>

  );
}
