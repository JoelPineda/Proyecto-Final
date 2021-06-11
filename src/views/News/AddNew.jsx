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

export default function AddNew(props) {
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

  const addNews = () => {
    API.postData("News/add", {
      title: title.value,
      publishingDate: publishingDate.value,
      content: getHtml(content),
      inactive: "N",
      companyId: getUser().companyId,
    })
      .then((response) => {
        MessageResults(response.status);
        props.history.push("/news");
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
  const publishingDate = useFormInput("");
  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">AGREGAR NUEVA NOTICIA</h3>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Titulo</label>
                <input class="form-control" {...title} />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Fecha Publicacion</label>
                <input
                  type="date"
                  class="form-control"
                  {...publishingDate}
                  id="fecha"
                />
              </div>
            </div>

            <div className="row editor">
              <div class="form-group col-md-12">
                <label class="control-label">Contenido </label>
                <Editor
                  editorState={content}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
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
              onClick={addNews}
            >
              Guardar Noticia
            </button>
          </div>
        </center>
      </div>
    </div>
  );
}
