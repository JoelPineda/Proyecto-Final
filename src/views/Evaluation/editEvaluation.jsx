import DropdownList from "../../components/dropdown/dropdownList";
import {GetdropDownListYesNo, GetdropDownListPositionMustFill} from "../../utils/CommonFunctions";
import $ from 'jquery';

export const  EditEvaluation = (e) => {
        let dataObj = $("#TblEvaluation").attr('data-evaluation-Ojb');
        let DefaultField = '<option value="0">--Seleccione--</option>';
        let evaluationObject =  (dataObj!== undefined? JSON.parse(atob(dataObj)) : []) ;
        let evaluationHierarchy = JSON.parse(JSON.parse(atob($(e.currentTarget).parent().attr('data-item')))[0].evaluationHierarchy);    
        let dataItem = JSON.parse(atob($(e.currentTarget).parent().attr('data-item')))[0];
        let dropObject = ['<select class="form-control validate-option" data-value="'+ dataItem.evaluationObjectId +'" id="dropObject">' + DefaultField];
        let dropHierarchy = ['<select class="form-control validate-no-option" data-optional="'+ dataItem.evaluationHierarchyId +'" id="dropHierarchy">' + DefaultField];

        evaluationObject.forEach(item => {
            if(item.inactive ==="N"){
                dropObject.push('<option class="capitalized" value="'+ item.evaluationObjectId +'">'+ item.evaluationObjectName  +'</option>');
            }
        });
        dropObject.push('</select>');

        evaluationHierarchy.forEach(item => {
            if(item.Inactive ==="N"){
                dropHierarchy.push('<option class="capitalized" value="'+ item.EvaluationHierarchyId +'">'+ item.EvaluationHierarchyName  +'</option>');
            }
        });
        dropHierarchy.push('</select>');        
        
        let tableData = "<br /><div id='divEditEvaluation' class='container d-flex flex-column'><hr />" +
                            "<div class='form-group'>" +
                                "<div class='divLeft'><label for='tbEvaluationName'>Nombre&nbsp;Evaluaci&oacute;n*:</label><span class='title-required fa faa-flash animated'></span></div>" +
                                "<input type='text' class='form-control capitalized' id='tbEvaluationName' title='Nombre de evaluación' data-id='"+ dataItem.evaluationId +"' value='"+ dataItem.evaluationName +"'   />" +
                            "</div>" +
                                "<div class='form-group'>" +
                                    "<div class='divLeft'><label for='dropObject'>Objeto&nbsp;Evaluado*:</label><span class='title-required fa faa-flash animated'></span></div>" + dropObject.join('')  +
                                "</div>" + 
                                "<div class='form-group'>" +
                                    "<div class='divLeft'><label for='dropHierarchy'>Jerarqu&iacute;a&nbsp;Evaluaci&oacute;n:</label><span class='span-optional-info'>(Opcional)</span></div>" + dropHierarchy.join('')  +
                                "</div>" +
                            "<div class='form-row'>" +
                                "<div class='form-group  col-md-6'>" +
                                    "<div class='divLeft'><label for='dropPositionMustFill'>Debe&nbsp;Llenar:</label><span class='span-optional-info'>(Opcional)</span></div>" + GetdropDownListPositionMustFill('validate-no-option',dataItem.positionMustFill, 'dropPositionMustFill')  +
                                "</div>" +                            
                                "<div class='form-group  col-md-6'>" +
                                    "<div class='divLeft'><label for='dropFillAfterLogin'>Llenar&nbsp;Inicio&nbsp;Sessi&oacute;n:</label><span class='title-required fa faa-flash animated'></span></div>" + GetdropDownListYesNo('validate-option', dataItem.fillAfterLogin,'dropFillAfterLogin')  +
                                "</div>" +
                                "<div class='form-group  col-md-6'>" +
                                    "<div class='divLeft'><label for='dropAfterHiringDate'>Llenar&nbsp;Luego&nbsp;aniversario:</label><span class='title-required fa faa-flash animated'></span></div>" + GetdropDownListYesNo('validate-option', dataItem.afterHiringDate,'dropAfterHiringDate') +
                                "</div>" + 
                                "<div class='form-group  col-md-6'>" +
                                    "<div class='divLeft'><label for='dropInactive'>Inactivo:</label><span class='title-required fa faa-flash animated'></span></div>" + GetdropDownListYesNo('validate-option', dataItem.inactive,'dropInactive')  +
                                "</div>" +
                             "</div>" +                                                                                                                                                                                                                                                                                                                    
                        "</div><hr />";


      return tableData;

 };

