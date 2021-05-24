import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import { Editor } from "react-draft-wysiwyg";
import Moment from "moment";
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
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function EditPolicy(props) {
  const [policy, setPolicy] = useState([]);
  useEffect(() => {
    API.getData("policies/getbyid?Id=" + id)
      .then((response) => {
        if (response.status === 200) {
          setPolicy(response.data);
          setState({
            title: response.data.title,
            creationDate: response.data.creationDate,
            isRequired: response.data.isRequired,
            levelFrom: response.data.levelFrom,
            readAfterLogin: response.data.readAfterLogin,
            inactive: response.data.inactive,
            content: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.content)
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
    title: policy.titulo,
    creationDate: policy.creationDate,
    isRequired: policy.isRequired,
    levelFrom: policy.levelFrom,
    readAfterLogin: policy.readAfterLogin,
    content: policy.content,
    inactive: policy.inactive,
    a: policy.inactive,
  });
  const id = queryString.parse(props.location.search).id;
  const {
    content,
    title,
    creationDate,
    isRequired,
    levelFrom,
    readAfterLogin,
    inactive,
    a,
  } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      content: e,
    });
  };

  const handleChange = (e) => {
    setState({ title: e.target.value, content: content });
    setState({ isRequired: e.target.value, content: content });
    setState({ levelFrom: e.target.value, content: content });
    setState({ readAfterLogin: e.target.value, content: content });
    setState({ inactive: e.target.value, content: content });
    setState({ a: e.target.value, content: content });
  };
  const handleChangeDate = (e) => {
    setState({ creationDate: e.target.value, content: content });
  };

  const updatePolicy = () => {
    API.putData("policies/update", {
      id: parseInt(id),
      title: $("#titulo").val(),
      content: getHtml(content),
      creationDate: $("#creationDate").val(),
      isRequired: $("#isRequired").val(),
      levelFrom: parseInt($("#levelFrom").val()),
      readAfterLogin: $("#readAfterLogin").val(),
      inactive: $("#inactive").val(),
      companyId: getUser().companyId,
    })
      .then((response) => {
        MessageResults(response.status);
        props.history.push("/policies");
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

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">ACTUALIZAR POLITICA</h3>

            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Titulo</label>
                <input
                  id="titulo"
                  name="titulo"
                  class="form-control"
                  value={state.title}
                  onChange={handleChange}
                />
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
                  readonly
                  id="creationDate"
                  name="creationDate"
                  type="date"
                  class="form-control"
                  value={Moment(state.creationDate).format("YYYY-MM-DD")}
                  onChange={handleChangeDate}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Es requerido</label>
                <select
                  id="isRequired"
                  name="isRequired"
                  value={state.isRequired}
                  onChange={handleChange}
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
                  id="levelFrom"
                  name="levelFrom"
                  type="text"
                  class="form-control"
                  value={state.levelFrom}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Necesita estar logueado</label>
                <select
                  id="readAfterLogin"
                  name="readAfterLogin"
                  value={state.readAfterLogin}
                  onChange={handleChange}
                  class="form-control"
                >
                  <option value=" ">Seleccionar</option>
                  <option value="Y">Sí</option>
                  <option value="N">No</option>
                </select>
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
                  onClick={updatePolicy}
                >
                  Actualizar Politica
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
