import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import $ from "jquery";
import draftToHtml from "draftjs-to-html";
import queryString from "query-string";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function EditFaq(props) {
  const [faq, setFaq] = useState([]);
  useEffect(() => {
    API.getData("Faq/getbyid?Id=" + id)
      .then((response) => {
        if (response.status === 200) {
          setFaq(response.data);
          setState({
            question: response.data.question,
            inactive: response.data.inactive,
            faqOrder: response.data.faqOrder,
            answer: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.answer)
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
    question: faq.question,
    inactive: faq.inactive,
    faqOrder: faq.faqOrder,
    answer: faq.answer,
  });
  const id = queryString.parse(props.location.search).id;
  const { question, inactive, faqOrder, answer } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      answer: e,
    });
  };

  const handleChange = (e) => {
    setState({ question: e.target.value });
    setState({ inactive: e.target.value });
    setState({ faqOrder: e.target.value });
    setState({ answer: answer });
  };

  const updateFaq = () => {
    API.putData("Faq/update", {
      id: parseInt(id),
      question: $("question").val(),
      faqOrder: parseInt($("faqOrder").val()),
      answer: getHtml(answer),
      inactive: $("activo").val(),
      companyId: getUser().companyId,
    })
      .then((response) => {
        MessageResults(response.status);

        props.history.push("/faq");
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
            <h3 className="text-center">ACTUALIZAR PREGUNTA FRECUENTE</h3>

            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">PREGUNTA</label>
                <input
                  id="question"
                  class="form-control"
                  value={state.question}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row editor">
              <div class="form-group col-md-12">
                <label class="control-label">Contexto</label>
                <Editor
                  editorState={answer}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Orden de la pregunta </label>
                <input
                  id="faqOrder"
                  class="form-control"
                  value={state.faqOrder}
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
                  Actualizar Pregunta
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
