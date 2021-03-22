import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser, setUserSession } from "../../utils/Common";
import { Editor } from "react-draft-wysiwyg";
import Moment from "moment";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import queryString from "query-string";
import { ShowAlertMessage } from "../../utils/CommonFunctions";
import DropdownList from "../../components/dropdown/dropdownList";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function EditUnitCompany(props) {
  const [unitCompany, setUnitCompany] = useState([]);
  const [dropUnitType, setUnitType] = useState([]);
  const [dropUnitTypeValor, setUnitTypeValor] = useState("");

  useEffect(() => {
    GetUniType();
    API.getData("BusinessUnit/getbyid?Id=" + id)
      .then((response) => {
        if (response.status === 200) {
          setUnitCompany(response.data);
          setState({
            name: response.data.name,
            inactive: response.data.inactive,
            shortName: response.data.shortName,
            companyUnitTypeId: response.data.companyUnitTypeId,
            unitOrder: response.data.unitOrder,
            detail: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.detail)
              )
            ),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [state, setState] = useState({
    name: unitCompany.name,
    inactive: unitCompany.inactive,
    shortName: unitCompany.shortName,
    detail: unitCompany.detail,
    companyUnitTypeId: unitCompany.companyUnitTypeId,
    unitOrder: unitCompany.companyUnitTypeId,
  });
  const id = queryString.parse(props.location.search).id;
  const {
    name,
    inactive,
    shortName,
    detail,
    companyUnitTypeId,
    unitOrder,
  } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      detail: e,
    });
  };

  const GetUniType = () => {
    API.getData("BusinessUnitType/get")
      .then((res) => {
        if (res.status === 200) {
          let dropData = [];
          let desc = "";
          res.data.forEach((item) => {
            if (item.inactive.toString().toUpperCase() === "N") {
              dropData.push({ label: item.description, value: item.id });
            }
          });

          setUnitType(dropData);
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });
  };

  const handleChange = (e) => {
    setState({ name: e.target.value });
    setState({ inactive: e.target.value });
    setState({ shortName: e.target.value });
    setState({ detail: detail });
    setState({ companyUnitTypeId: companyUnitTypeId });
    setState({ unitOrder: unitOrder });
  };

  const updateFaq = () => {
    alert(dropUnitTypeValor);
    /* API.putData("Faq/update", {
      id: parseInt(id),
      name: name.value,
      shortName: shortName.value,
      unitOrder: parseInt(unitOrder.value),
      detail: getHtml(detail),
      companyUnitTypeId: dropUnitTypeValor,
      inactive: "N",
      companyId: getUser().companyId,
    })
      .then((response) => {
        ShowAlertMessage("Información", "Actualizada correctamente");
      })
      .catch((error) => {
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
        console.log(error);
      });*/
  };

  const OnDropUnidChange = (selectedOption) => {
    sessionStorage.setItem("UnitTypeValue", selectedOption.value);
    setUnitTypeValor(selectedOption.value);
  };

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">ACTUALIZAR UNIDAD DE COMPAÑIA</h3>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nombre</label>
                <input
                  id="question"
                  class="form-control"
                  value={state.name}
                  onChange={handleChange}
                />
              </div>{" "}
              <div class="form-group col-md-6">
                <label class="control-label">Nombre corto</label>
                <input
                  id="question"
                  class="form-control"
                  value={state.shortName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row editor">
              <div class="form-group col-md-12">
                <label class="control-label">Detalle</label>
                <Editor
                  editorState={detail}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Tipo de unidad</label>
                <select
                  id="logueado"
                  name="logueado"
                  value={companyUnitTypeId}
                  class="form-control"
                >
                  {dropUnitType.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Orden unidad </label>
                <input
                  id="faqOrder"
                  class="form-control"
                  value={state.unitOrder}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Activo</label>
                <select
                  id="activo"
                  name="activo"
                  value={state.inactive}
                  onChange={handleChange}
                  class="form-control"
                >
                  <option value=" ">Seleccionar</option>
                  <option value="N">Sí</option>
                  <option value="Y">No</option>
                </select>
              </div>
            </div>
            <br />
            <center>
              <div class="form-group col-md-2 ">
                <button
                  type="button"
                  className="mybt btn btn-outline-danger text-wrap"
                  onClick={updateFaq}
                >
                  Actualizar Unidad
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
