import React, { useState } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function AddPolicy(props) {
  const [state, setState] = useState({
    content: EditorState.createEmpty(),
  });

  const { content } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      content: e,
    });
  };

  const addPolicy = () => {
    API.postData("policies/add", {
      title: title.value,
      content: getHtml(content),
      creationDate: creationDate.value,
      levelFrom: parseInt(levelFrom.value),
      isRequired: isRequired.value,
      readAfterLogin: readAfterLogin.value,
      inactive: "N",
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

  const [error, setError] = useState(null);
  const title = useFormInput("");
  const creationDate = useFormInput("");
  const isRequired = useFormInput("");
  const levelFrom = useFormInput("");
  const readAfterLogin = useFormInput("");

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">AGREGAR NUEVA POLITICA</h3>

            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Titulo</label>
                <input class="form-control" {...title} id="title" />
              </div>
            </div>
            <div className="row editor">
              <div class="form-group col-md-12">
                <label class="control-label">Contexto</label>
                <Editor
                  editorState={content}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Fecha creacion</label>
                <input
                  type="date"
                  class="form-control"
                  {...creationDate}
                  id="fecha"
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Es requerido</label>
                <select
                  id="requerido"
                  name="requerido"
                  {...isRequired}
                  class="form-control"
                >
                  <option value=" ">Seleccionar</option>
                  <option value="Y">Sí</option>
                  <option value="N">No</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nivel</label>
                <input
                  type="text"
                  class="form-control"
                  {...levelFrom}
                  id="nivel"
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Necesita estar logueado</label>
                <select
                  id="logueado"
                  name="logueado"
                  {...readAfterLogin}
                  class="form-control"
                >
                  <option value=" ">Seleccionar</option>
                  <option value="Y">Sí</option>
                  <option value="N">No</option>
                </select>
              </div>
            </div>
            <br />
            <center>
              <div class="form-group col-md-2 ">
                <button
                  type="button"
                  className="mybt btn btn-outline-danger text-wrap"
                  onClick={addPolicy}
                >
                  Guardar Politica
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
