import React, { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import Moment from "moment";
import "moment/locale/es";
import es from "date-fns/locale/es";
import Button from "../../components/Button/Button";
import "react-datepicker/dist/react-datepicker.css";
import "../../components/payroll/payroll.css";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import ReactExport from 'react-data-export';
import Swal from "sweetalert2";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

registerLocale("es", es);

export const Survey = () => {
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      );
      const [endDate, setEndDate] = useState(new Date());
      const [dataEx, setDataEx] = useState([{}]);
    
      const clickSearch = () => {
          
        Swal.fire(
            'Espere...',
            'Espere hasta que se termine de hacer la busqueda y aparezca el boton de descarga.',
            'question'
          )
          API.getData("/NewEvaluation/GetEcuesta?companyId=" + getUser().companyId +
          "&startDate="+
          Moment(startDate).format("YYYY-MM-DD") +
          "&endDate=" +
          Moment(endDate).format("YYYY-MM-DD") )
          .then((res) => {
              
            const DataSet = [
                {
                  columns: [
                    {
                      title: "Empleado",
                      style: { font: { sz: "18", bold: true } },
                      width: { wpx: 125 },
                    }, // width in pixels
                    {
                      title: "Nombre",
                      style: { font: { sz: "18", bold: true } },
                      width: { wch: 30 },
                    }, // width in characters
                    {
                      title: "Fecha",
                      style: { font: { sz: "18", bold: true } },
                      width: { wpx: 100 },
                    }, // width in pixels
                    {
                      title: "Categoria",
                      style: { font: { sz: "18", bold: true } },
                      width: { wpx: 125 },
                    }, // width in pixels
                    {
                      title: "Pregunta",
                      style: { font: { sz: "18", bold: true } },
                      width: { wpx: 100 },
                    }, // width in pixels
                    {
                      title: "Respuesta",
                      style: { font: { sz: "18", bold: true } },
                      width: { wpx: 125 },
                    }, // width in pixels
                    {
                      title: "Puntos",
                      style: { font: { sz: "18", bold: true } },
                      width: { wch: 30 },
                    }, // width in characters
                    {
                      title: "Nivel",
                      style: { font: { sz: "18", bold: true } },
                      width: { wpx: 125 },
                    }, // width in pixels
                    {
                      title: "Sucursal",
                      style: { font: { sz: "18", bold: true } },
                      width: { wpx: 125 },
                    }, // width in pixels
                    {
                      title: "Departamento",
                      style: { font: { sz: "18", bold: true } },
                      width: { wpx: 110 },
                    }, // width in pixels
                    {
                        title: "Division",
                        style: { font: { sz: "18", bold: true } },
                        width: { wpx: 110 },
                      }, // width in pixels
                  ],
                  data: res.data.map((data) => [
                    { value: data.employeeNumber, style: { font: { sz: "14" } } },
                    { value: data.employeeName, style: { font: { sz: "14" } } },
                    { value: (Moment(data.creationDate).format("DD/MM/YYYY  ")), style: { font: { sz: "14" } } },
                    { value: data.category, style: { font: { sz: "14" } } },
                    { value: data.question, style: { font: { sz: "14" } } },
                    { value: data.answers, style: { font: { sz: "14" } } },
                    { value: data.points, style: { font: { sz: "14" } } },
                    { value: data.level, style: { font: { sz: "14" } } },
                    { value: data.branchOffice, style: { font: { sz: "14" } } },
                    { value: data.department, style: { font: { sz: "14" } } },
                    { value: data.divisionName, style: { font: { sz: "14" } } },
                    
                  ]),
                },
              ];
              setDataEx(DataSet);
          })}
          
       /* API.getData(
          "/Gym/GetbyGYMDateRange?dateTimeFrom=" +
            Moment(startDate).format("YYYY-MM-DD") +
            "&dateTimeTo=" +
            Moment(endDate).format("YYYY-MM-DD")
        )}*/
    return (
        <>
            <br />
      <div className=" htmlPayroll  table-responsive container">
        <div className="row">
          <div className="lowcolor col-12">
            <h2 className="h2" Style={"text-align:center"}>
              ENCUESTA PERIODO
            </h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="input-group-prepend">
              <div className="input-group-text mb-2">
                Seleccione&nbsp;el&nbsp;rango&nbsp;de&nbsp;fecha&nbsp;que&nbsp;desea&nbsp;visualizar
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Desde:</div>
              </div>
              <DatePicker
                id="dtFrom"
                className=" reactCalendar"
                relativeSize={true}
                popperPlacement="auto-right"
                selected={startDate}
                locale="es"
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setStartDate(date)}
              />
              <div className="input-group-prepend calendarCs">
                <div className="notAllowed">
                  <span
                    class="iconify"
                    data-icon="fa:calendar"
                    data-inline="false"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Hasta:&nbsp;</div>
              </div>
              <DatePicker
                className=" reactCalendar"
                relativeSize={true}
                popperPlacement="auto-right"
                id="dtTo"
                selected={endDate}
                minDate={startDate}
                locale="es"
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setEndDate(date)}
              />
              <div className="input-group-prepend calendarCs">
                <div className="notAllowed">
                  <span
                    className="iconify"
                    data-icon="fa:calendar"
                    data-inline="false"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-12 col-sm-12">
            <div className="input-group mb-2">
              <Button
                type="btn-outline-danger"
                text="BUSCAR"
                clickHandler={clickSearch}
              />
            </div>
            <div>
            {dataEx[0].columns ? (
                         <ExcelFile filename="Escuestados"  element={<button class="btn btn-success btn-lg btn-block">Descagar</button>}>
                         <ExcelSheet dataSet={dataEx} name="Encuesta Reporte"/>
                     </ExcelFile>
                    ): null} 
            </div>
          </div>
          
        </div>
        
        </div>
        </>
    )
}