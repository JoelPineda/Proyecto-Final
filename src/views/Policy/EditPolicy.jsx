import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getToken, setUserSession } from "../../utils/Common";
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
import { event } from "jquery";

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
    creationDate: Moment(policy.creationDate).format("YYYY-MM-DD"),
    isRequired: policy.isRequired,
    levelFrom: policy.levelFrom,
    readAfterLogin: policy.readAfterLogin,
    content: policy.content,
    inactive: policy.inactive,
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
  } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      content: e,
    });
  };

  const handleChange = (e) => {
    setState({ title: e.target.value });
    setState({ isRequired: e.target.value });
    setState({ levelFrom: e.target.value });
    setState({ readAfterLogin: e.target.value });
    setState({ inactive: e.target.value });
    setState({ content: content });
  };
  const handleChangeDate = (e) => {
    setState({ creationDate: e.target.value });
  };

  const updatePolicy = () => {
    API.putData("policies/update", {
      id: parseInt(id),
      title: document.getElementById("title").value,
      content: getHtml(content),
      creationDate: document.getElementById("creationDate").value,
      isRequired: document.getElementById("isRequired").value,
      levelFrom: parseInt(document.getElementById("levelFrom").value),
      readAfterLogin: document.getElementById("readAfterLogin").value,
      inactive: document.getElementById("inactive").value,
      companyId: "01",
    })
      .then((response) => {})
      .catch((error) => {
        debugger;
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
                  id="title"
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
                  id="creationDate"
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
