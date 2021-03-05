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

import Loading from "../../components/loading/loading";
import {ShowConfirmationMessage, MessageResults, ShowPopUp} from "../../utils/CommonFunctions";
import { DataTable } from 'datatables.net';
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

$(document).ready(()=>{
    $('body').on('click', '#TblEvaluation #btEdit', function(e){

        ShowPopUp({titleName: "Editar Evaluación", htmlBody: EditEvaluation(e), handlerEvent: OnClickSaveEdit, TextOk:"Guardar", isDisabled:true, EnabledDisabled:true});
        DefaulValuetEdit();
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
                let AswBtn = "<a href='#' id='btAsw'  class='fa fa-question custom-color size-effect-x2' title='Preguntas' ></a>&nbsp;";
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
                        itemBtn: "<span data-created='"+ Moment(item.creationDate).format("DD/MM/YYYY hh:mm A") +"'  data-item='"+ btoa(JSON.stringify([item])) +"'>"+ calendarBtn +  PossibleAswBtn + AswBtn + EditBtn + "</span>" 
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
            console.error("Error de conexion " + err);
          });
          setDataLoading(false);
     
    }
    
const GetEvaluationObject = ()=>{ 
      API.getData("EvaluationObject/get")
      .then((res) => {
          if (res.status === 200) {
               $("#TblEvaluation").attr('data-evaluation-Ojb', btoa(JSON.stringify(res.data)));
          } 
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
          return [];
      });     
}
const GetEvaluationHierarchy = ()=>{ 
      API.getData("EvaluationHierarchy/get")
      .then((res) => {
          if (res.status === 200) {
               $("#sp_AddEvaluation").attr('data-evaluation-Hierarchy', btoa(JSON.stringify(res.data)));
          } 
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
          return [];
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
              <span className="btn btn-success btn-sm" id="sp_AddEvaluation"><i className="fa fa-plus-circle"></i>&nbsp;Añadir Evaliaci&oacute;n</span>
                
            </div>
          </div>        
            <div className="row ">
                {!dataLoading ?
                    <>
                    <div className="container">    
                        <div className="">
                            {!dataLoading ?
                                <div className="scroll-table bordered" Style="min-height:600px">
                                    <table id="TblEvaluation"  className="table table-striped table-bordered display" Style="width:100% !important"></table>
                                </div>                 
                            :
                            <Loading />
                            }
                        
                        </div>            
                    </div>
                    </>
                    
                :
                <div className="container">
                <Loading />  
                </div>
                
                }
         </div>


        <br />
        <br />

        </div>
        <br />
        <br />
    </div>
           

 </>

  );
}
