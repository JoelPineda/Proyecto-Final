import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser, removeUserSession } from "../../utils/Common";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ShowAlertMessage } from "../../utils/CommonFunctions";
import DropdownList from "../../components/dropdown/dropdownList";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function AddFaq(props) {
  const [state, setState] = useState({
    answer: EditorState.createEmpty(),
  });
  const [dropUnitType, setUnitType] = useState([]);
  const [dropUnitTypeValor, setUnitTypeValor] = useState("");
  const { detail } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      detail: e,
    });
  };

  const addUnitCompany = () => {
    API.postData("BusinessUnit/add", {
      name: name.value,
      shortName: shortName.value,
      unitOrder: parseInt(unitOrder.value),
      detail: getHtml(detail),
      companyUnitTypeId: dropUnitTypeValor,
      inactive: "N",
      companyId: getUser().companyId,
    })
      .then((response) => {
        ShowAlertMessage("Información", "Guardado correctamente");
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

  const GetUniType = () => {
    API.getData("BusinessUnitType/get")
      .then((res) => {
        if (res.status === 200) {
          let dropData = [];
          res.data.forEach((item) => {
            if (item.inactive.toString().toUpperCase() === "N") {
              dropData.push({ label: item.description, value: item.id });
            }
          });
          let Drop = (
            <DropdownList
              idControl="dropUniType"
              headerLabel="Tipo de unidad"
              data={dropData}
              handleChange={OnDropUnidChange}
            />
          );
          setUnitType(Drop);
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });
  };

  const OnDropUnidChange = (selectedOption) => {
    sessionStorage.setItem("UnitTypeValue", selectedOption.value);
    setUnitTypeValor(selectedOption.value);
  };

  const useFormInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
      setValue(e.target.value);
    };
    return {
      value,
      onChange: handleChange,
    };
  };

  useEffect(() => {
    GetUniType();
  }, []);

  const convertiraBase64 = (e) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  };
  const [error, setError] = useState(null);
  const shortName = useFormInput("");
  const name = useFormInput("");
  const unitOrder = useFormInput("");
  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">AGREGAR NUEVA UNIDAD DE COMPAÑIA</h3>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nombre</label>
                <input class="form-control" {...name} />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Nombre corto</label>
                <input class="form-control" {...shortName} />
              </div>
            </div>

            <div className="row editor">
              <div class="form-group col-md-12">
                <label class="control-label">Detalle </label>
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
                <div id="dropFields" className="row mb-2">
                  {dropUnitType}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Orden unidad </label>
                <input class="form-control" {...unitOrder} />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Logo </label>
                <br />
                <input
                  type="file"
                  id="logo"
                  multiple
                  accept="image/png, image/PNG"
                  onChange={(e) => convertiraBase64(e)}
                />
                <br />
                <img id="output" width="150" height="100" />
              </div>
            </div>
          </div>
          <br />
        </div>
        <center>
          <div class="form-group col-md-2 ">
            <button
              type="button"
              className="mybt btn btn-outline-danger text-wrap"
              onClick={addUnitCompany}
            >
              Guardar Unidad
            </button>
          </div>
        </center>
      </div>
    </div>
  );
}
