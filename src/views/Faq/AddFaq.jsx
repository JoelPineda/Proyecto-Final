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

export default function AddFaq(props) {
  const [state, setState] = useState({
    answer: EditorState.createEmpty(),
  });
  const [dropCompany, setDropCompany] = useState([]);
  const { answer } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      answer: e,
    });
  };

  const addFaq = () => {
    API.postData("faq/add", {
      question: question.value,
      faqOrder: parseInt(faqOrder.value),
      answer: getHtml(answer),
      inactive: "N",
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
  const question = useFormInput("");
  const faqOrder = useFormInput("");

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">AGREGAR NUEVA PREGUNTA FRECUENTE</h3>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Pregunta</label>
                <input class="form-control" {...question} />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Orden de la pregunta</label>
                <input class="form-control" {...faqOrder} />
              </div>
            </div>

            <div className="row editor">
              <div class="form-group col-md-12">
                <label class="control-label">Respuesta </label>
                <Editor
                  editorState={answer}
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
              onClick={addFaq}
            >
              Guardar Pregunta
            </button>
          </div>
        </center>
      </div>
    </div>
  );
}
