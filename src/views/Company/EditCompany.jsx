import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getToken, setUserSession } from "../../utils/Common";
import { Editor } from "react-draft-wysiwyg";
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

export default function EditCompany(props) {
  const [company, setCompany] = useState([]);
  const [img, setImg] = useState("");
  useEffect(() => {
    API.getData("Company/getbyid?id=" + id)
      .then((response) => {
        if (response.status === 200) {
          setCompany(response.data);

          setState({
            name: response.data.name,
            primaryColor: response.data.primaryColor,
            accentColor: response.data.accentColor,
            suggestionEmail: response.data.suggestionEmail,
            emailCaseReport: response.data.emailCaseReport,
            emailSupport: response.data.emailSupport,
            mision: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.mision)
              )
            ),
            showEmergencyMessage: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.showEmergencyMessage)
              )
            ),
            emergencyMessage: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.emergencyMessage)
              )
            ),
            aboutUs: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.aboutUs)
              )
            ),
            vision: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.vision)
              )
            ),
            values: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.values)
              )
            ),
            history: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.history)
              )
            ),
            fundacionCorripio: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.fundacionCorripio)
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
    name: company.name,
    logo: company.logo,
    primaryColor: company.primaryColor,
    accentColor: company.accentColor,
    suggestionEmail: company.suggestionEmail,
    emailCaseReport: company.emailCaseReport,
    emailSupport: company.emailSupport,
  });
  const id = queryString.parse(props.location.search).id;

  const {
    showEmergencyMessage,
    emergencyMessage,
    aboutUs,
    mision,
    name,
    logo,
    primaryColor,
    accentColor,
    suggestionEmail,
    vision,
    values,
    history,
    fundacionCorripio,
    emailCaseReport,
    emailSupport,
  } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      showEmergencyMessage: e,
    });
  };

  const onEditorStateChange3 = (e) => {
    setState({
      ...state,
      aboutUs: e,
    });
  };

  const onEditorStateChange2 = (e) => {
    setState({
      ...state,
      emergencyMessage: e,
    });
  };

  const onEditorStateChange4 = (e) => {
    setState({
      ...state,
      mision: e,
    });
  };
  const onEditorStateChange5 = (e) => {
    setState({
      ...state,
      vision: e,
    });
  };

  const onEditorStateChange6 = (e) => {
    setState({
      ...state,
      values: e,
    });
  };

  const onEditorStateChange7 = (e) => {
    setState({
      ...state,
      history: e,
    });
  };
  const onEditorStateChange8 = (e) => {
    setState({
      ...state,
      fundacionCorripio: e,
    });
  };

  const handleChangeName = (e) => {
    setState({ name: e.target.value });
    setState({ primaryColor: e.target.value });
    setState({ accentColor: e.target.value });
    setState({ suggestionEmail: e.target.value });
    setState({ emailCaseReport: e.target.value });
    setState({ emailSupport: e.target.value });
    setState({
      emergencyMessage: emergencyMessage,
      showEmergencyMessage: showEmergencyMessage,
      aboutUs: aboutUs,
      mision: mision,
      vision: vision,
      history: history,
      fundacionCorripio: fundacionCorripio,
    });
  };

  const convertiraBase64 = (e) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  };

  const ActualizarCompany = () => {
    API.putData("Company/update", {
      id: id,
      logo: document.getElementById("logo").value,
      primaryColor: document.getElementById("primaryColor").value,
      accentColor: document.getElementById("accentColor").value,
      name: document.getElementById("name").value,
      showEmergencyMessage: getHtml(showEmergencyMessage),
      emergencyMessage: getHtml(emergencyMessage),
      aboutUs: getHtml(aboutUs),
      mision: getHtml(mision),
      vision: getHtml(vision),
      values: getHtml(values),
      history: getHtml(history),
      fundacionCorripio: getHtml(fundacionCorripio),
      suggestionEmail: document.getElementById("suggestionEmail").value,
      emailCaseReport: document.getElementById("emailCaseReport").value,
      emailSupport: document.getElementById("emailSupport").value,
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
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nombre</label>
                <input
                  class="form-control"
                  id="name"
                  value={state.name}
                  onChange={handleChangeName}
                />
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
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Color primario</label>
                <input
                  type="color"
                  class="form-control"
                  id="primaryColor"
                  value={state.primaryColor}
                  onChange={handleChangeName}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Accent color</label>
                <input
                  type="color"
                  class="form-control"
                  id="accentColor"
                  value={state.accentColor}
                  onChange={handleChangeName}
                />
              </div>
            </div>

            <div className="row editor">
              <div class="form-group col-md-6">
                <label class="control-label">
                  Mostrar mensaje de emergencia
                </label>
                <Editor
                  editorState={showEmergencyMessage}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Mensaje de emergencia</label>
                <Editor
                  editorState={emergencyMessage}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange2}
                />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Sobre nosotros</label>
                <Editor
                  editorState={aboutUs}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange3}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Mision</label>
                <Editor
                  editorState={mision}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange4}
                />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Valores</label>
                <Editor
                  editorState={vision}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange5}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Vision</label>
                <Editor
                  editorState={values}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange6}
                />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Historia</label>
                <Editor
                  editorState={history}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange7}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Fundacion Corripio</label>
                <Editor
                  editorState={fundacionCorripio}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange8}
                />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-4">
                <label class="control-label">
                  Correo electrónico de sugerencia
                </label>
                <input
                  class="form-control"
                  id="suggestionEmail"
                  value={state.suggestionEmail}
                  onChange={handleChangeName}
                />
                <span class="text-danger"></span>
              </div>
              <div class="form-group col-md-4">
                <label class="control-label">
                  Correo electrónico informe de caso
                </label>
                <input
                  class="form-control"
                  id="emailCaseReport"
                  value={state.emailCaseReport}
                  onChange={handleChangeName}
                />
                <span class="text-danger"></span>
              </div>
              <div class="form-group col-md-4">
                <label class="control-label">Correo electrónico soporte</label>
                <input
                  class="form-control"
                  id="emailSupport"
                  value={state.emailSupport}
                  onChange={handleChangeName}
                />
                <span class="text-danger"></span>
              </div>
            </div>

            <div class="form-group col-md-2">
              <button
                type="button"
                className="mybt btn btn-outline-danger text-wrap"
                onClick={ActualizarCompany}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
