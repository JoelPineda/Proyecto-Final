import DropdownList from "../../components/dropdown/dropdownList";
import {GetdropDownListEnabled, GetdropDownListPositionMustFill} from "../../utils/CommonFunctions";
import $ from 'jquery';

export const  AddBackendUsers = (e) => {
        let dataObj = $("#TblBackendUser").attr('data-OpcMenuPermission');
        let DefaultField = '<option value="0">--Seleccione--</option>';
        let backendOpMenuPermissionData =  (dataObj!== undefined? JSON.parse(atob(dataObj)) : []) ;  
        let dropPermissionObject = ['<select class="form-control container chosen-select  validate-option" data-placeholder="--Seleccione--" id="dropPermission" multiple="true"  >'];
    
        backendOpMenuPermissionData.forEach(item => {
            dropPermissionObject.push('<option class="capitalized" value="'+ item.OptionMenuId +'">'+ item.Name  +'</option>');
        });
        dropPermissionObject.push('</select>');       
     
        let tableData = "<br /><div id='divEditBackendUser' class='container d-flex flex-column'><hr />" +
                            "<div class='form-row'>" +
                                "<div class='form-group  col-md-6'>" +
                                    "<div class='divLeft'><label for='tbAliasName'>Alias:<span class='red title-required fa faa-flash animated'></span></label></div>" + 
                                    "<input type='text' class='form-control validate-text' id='tbAliasName' title='Alias' autocomplete='off'   />" +
                                "</div>" +
                                "<div class='form-group  col-md-6'>" +
                                    "<div class='divLeft'><label for='tbUserName'>Usuario:<span class='red title-required fa faa-flash animated'></span></label></div>" + 
                                    "<input type='text' class='form-control validate-text cstbUserName' id='tbUserName' title='Usuario' autocomplete='off'   />" +
                                "</div>" +                                  
                            "</div>" +
                            "<div class='form-group'>" +
                                    "<div class='divLeft'><label for='tbPsw'>Contraseña<span class='red title-required fa faa-flash animated'></span>:</label></div>" + 
                                    "<input type='text' class='form-control validate-text' id='tbPsw' title='Contraseña'  autocomplete='off'   />" +
                            "</div>" +                             
                            "<div class='form-group'>" +
                                "<div class='divLeft'><label for='dropPermission'>Permisos:<span class='span-optional-info'>(Debe agregar al menos un permiso)</span></label><span class='title-required fa faa-flash animated'></span></div>" + dropPermissionObject.join('')  +
                            "</div>" + 
                            "<div class='form-group'>" +
                                "<div class='divLeft'><label for='dropInactive'>Habilitado:</label><span class='title-required fa faa-flash animated'></span></div>" + GetdropDownListEnabled('validate-option', null,'dropInactive')  +
                             "</div>" +                                                                                                                                                                                                                                                                                                                    
                        "</div><hr />";


      return tableData;

 };


