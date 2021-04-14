import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import { Editor } from "react-draft-wysiwyg";
import $ from "jquery";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import queryString from "query-string";
import {
  ShowAlertMessage,
  MessageResults,
  GetImagePatch,
} from "../../utils/CommonFunctions";

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
            logo: response.data.logo,
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
    logo: unitCompany.logo,
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
    logo,
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
    setState({ name: e.target.value, detail: detail, logo: logo });
    setState({ inactive: e.target.value, detail: detail, logo: logo });
    setState({ shortName: e.target.value, detail: detail, logo: logo });
    setState({ detail: detail, logo: logo });
    setState({
      companyUnitTypeId: companyUnitTypeId,
      detail: detail,
      logo: logo,
    });
    setState({ unitOrder: unitOrder, detail: detail, logo: logo });
  };

  const updateBusinessUnit = () => {
    let dataUpload = $("#logo")[0];
    let formData = new FormData();

    formData.append("postedFiles", dataUpload.files[0]);
    API.postData("BusinessUnit/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        bussinessunitUpdate(res);
      })
      .catch(function (err) {
        ShowAlertMessage(
          "Información",
          "Hubo un problema cargando la imagen intente de nuevo",
          "error"
        );
        console.error("Error de conexion " + err);
      });
  };

  const bussinessunitUpdate = (res) => {
    if (res.data[0] == undefined) {
      res.data[0] = logo;
    }

    API.putData("BusinessUnit/update", {
      id: parseInt(id),
      logo: res.data[0],
      name: $("#name").val(),
      shortName: $("#shortName").val(),
      unitOrder: parseInt($("#unitOrder").val()),
      detail: getHtml(detail),
      companyUnitTypeId: companyUnitTypeId,
      inactive: $("#inactive").val(),
      companyId: getUser().companyId,
    })
      .then((response) => {
        MessageResults(response.status);
        setTimeout(() => {
          window.location.reload(true);
        }, 1200);
      })
      .catch((error) => {
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
        console.log(error);
      });
  };

  const OnDropUnidChange = (e) => {
    setState({
      companyUnitTypeId: e.target.value,
      detail: detail,
      logo: logo,
    });
    sessionStorage.setItem("UnitTypeValue", e.value);
    setUnitTypeValor(e.value);
  };

  const convertiraBase64 = (e) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
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
                  id="name"
                  class="form-control"
                  value={state.name}
                  onChange={handleChange}
                />
              </div>{" "}
              <div class="form-group col-md-6">
                <label class="control-label">Nombre corto</label>
                <input
                  id="shortName"
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
              <div class="form-group col-md-6">
                <label class="control-label">Tipo de unidad</label>
                <select
                  id="unitType"
                  value={companyUnitTypeId}
                  onChange={OnDropUnidChange}
                  class="form-control"
                >
                  {dropUnitType.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div class="form-group col-md-6">
                <label class="control-label">Orden unidad </label>
                <input
                  id="unitOrder"
                  class="form-control"
                  value={state.unitOrder}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Logo</label>&nbsp;&nbsp;
                <input
                  type="file"
                  id="logo"
                  onChange={(e) => convertiraBase64(e)}
                  multiple
                />
                <br />
                <img
                  id="output"
                  src={GetImagePatch("/images/units/" + state.logo)}
                  width="150"
                  height="150"
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Activo</label>
                <select
                  id="inactive"
                  name="inactive"
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
                  onClick={updateBusinessUnit}
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
