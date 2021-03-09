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

export default function EditConsulate(props) {
  const [consulate, setConsulate] = useState([]);
  useEffect(() => {
    API.getData("Consulate/getbyid?Id=" + id)
      .then((response) => {
        if (response.status === 200) {
          setConsulate(response.data);
          setState({
            consulateName: response.data.bankName,
            inactive: response.data.inactive,
            creationDate: response.data.creationDate,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [state, setState] = useState({
    bankName: consulate.bankName,
    inactive: consulate.inactive,
    creationDate: consulate.creationDate,
  });
  const id = queryString.parse(props.location.search).id;
  const { consulateName, inactive, creationDate, answer } = state;

  const handleChange = (e) => {
    setState({ consulateName: e.target.value });
    setState({ inactive: e.target.value });
    setState({ answer: e.target.value });
  };

  const handleChangeDate = (e) => {
    setState({ creationDate: e.target.value });
  };

  const updateConsulate = () => {
    API.putData("Consulate/update", {
      id: parseInt(id),
      consulateName: document.getElementById("bankName").value,
      creationDate: document.getElementById("creationDate").value,
      inactive: document.getElementById("inactive").value,
    })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">ACTUALIZAR CONSULADO</h3>
            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Nombre Consulado</label>
                <input
                  id="bankName"
                  class="form-control"
                  value={state.consulateName}
                  onChange={handleChange}
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
                  onClick={updateConsulate}
                >
                  Actualizar Consulado
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
