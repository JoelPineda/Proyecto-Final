import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getToken, setUserSession } from "../../utils/Common";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function AddConsulate(props) {
  const [state, setState] = useState({
    answer: EditorState.createEmpty(),
  });

  const { answer } = state;

  const guardarConsulate = () => {
    API.postData("consulate/add", {
      consulateName: consulateName.value,
      creationDate: creationDate.value,
      inactive: "N",
    })
      .then((response) => {})
      .catch((error) => {
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
  const consulateName = useFormInput("");
  const creationDate = useFormInput("");

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">AGREGAR NUEVO CONSULADO</h3>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nombre Consulado</label>
                <input class="form-control" {...consulateName} />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Fecha creacion</label>
                <input
                  type="date"
                  class="form-control"
                  {...creationDate}
                  id="fecha"
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
              onClick={guardarConsulate}
            >
              Guardar Consulado
            </button>
          </div>
        </center>
      </div>
    </div>
  );
}
