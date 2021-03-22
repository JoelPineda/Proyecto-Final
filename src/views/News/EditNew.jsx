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

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function EditFaq(props) {
  const [news, setNews] = useState([]);
  useEffect(() => {
    API.getData("News/getbyid?Id=" + id)
      .then((response) => {
        if (response.status === 200) {
          setNews(response.data);
          setState({
            title: response.data.title,
            inactive: response.data.inactive,
            publishingDate: response.data.publishingDate,
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
    title: news.title,
    inactive: news.inactive,
    publishingDate: news.publishingDate,
    content: news.content,
    a: news.inactive,
  });
  const id = queryString.parse(props.location.search).id;
  const { title, inactive, publishingDate, content, a } = state;
  const handleChangeDate = (e) => {
    setState({ creationDate: e.target.value });
    setState({ content: content });
  };
  const onEditorStateChange = (e) => {
    setState({
      ...state,
      content: e,
    });
  };

  const handleChange = (e) => {
    setState({ title: e.target.value });
    setState({ inactive: e.target.value });
    setState({ content: content });
    setState({ a: e.target.value });
  };

  const updateNews = () => {
    API.putData("News/update", {
      id: parseInt(id),
      title: document.getElementById("title ").value,
      publishingDate: document.getElementById("publishingDate ").value,
      content: getHtml(content),
      inactive: document.getElementById("activo").value,
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
      });
  };

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">ACTUALIZAR NOTICIA</h3>

            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Titulo</label>
                <input
                  id="title "
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
                <label class="control-label">Fecha Publicacion</label>
                <input
                  id="publishingDate "
                  type="date"
                  class="form-control"
                  value={Moment(state.publishingDate).format("YYYY-MM-DD")}
                  onChange={handleChangeDate}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Activo</label>
                <select
                  id="inactive "
                  name="inactive "
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
                  onClick={updateNews}
                >
                  Actualizar Noticia
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
