import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import $ from "jquery";
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
import { ShowAlertMessage, GetImagePatch } from "../../utils/CommonFunctions";

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
            logo: response.data.logo,
            name: response.data.name,
            companyLogoWithTitle: response.data.companyLogoWithTitle,
            primaryColor: response.data.primaryColor,
            accentColor: response.data.accentColor,
            suggestionEmail: response.data.suggestionEmail,
            emailCaseReport: response.data.emailCaseReport,
            emailSupport: response.data.emailSupport,
            companyid: response.data.companyId,
            mision: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.mision)
              )
            ),
            mottoSecundary: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.mottoSecundary)
              )
            ),
            mottoPrimary: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response.data.mottoPrimary)
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
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
        console.log(error);
      });
  }, []);

  const [state, setState] = useState({
    name: company.name,
    logo: company.logo,
    companyLogoWithTitle: company.companyLogoWithTitle,
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
    companyid,
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
    mottoSecundary,
    mottoPrimary,
    companyLogoWithTitle,
  } = state;

  const onEditorStateChange = (e) => {
    setState({
      ...state,
      mottoPrimary: e,
    });
  };
  const onEditorStateChangeM = (e) => {
    setState({
      ...state,
      mottoSecundary: e,
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
    setState({ companyid: e.target.value });
    setState({
      emergencyMessage: emergencyMessage,
      showEmergencyMessage: showEmergencyMessage,
      aboutUs: aboutUs,
      mision: mision,
      vision: vision,
      history: history,
      fundacionCorripio: fundacionCorripio,
      mottoPrimary: mottoPrimary,
      mottoSecundary: mottoSecundary,
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

  const convertiraBase641 = (e) => {
    const output = document.getElementById("output1");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  };

  const ActualizarCompany = () => {
    let dataUpload = $("#logo")[0];
    let dataUpload1 = $("#logoTitulo")[0];
    let formData = new FormData();

    formData.append("postedFiles", dataUpload.files[0]);
    formData.append("postedFiles", dataUpload1.files[0]);
    API.postData("Company/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        companyUpdate(res);
      })
      .catch(function (err) {
        ShowAlertMessage(
          "Información",
          "Hubo un problema cargando la imagen intente de nuevo",
          "error"
        );
        console.error("Error de conexion " + err);
      });
  };

  const companyUpdate = (res) => {
    if (res.data[0] == undefined) {
      res.data[0] = logo;
    }
    if (res.data[1] == undefined) {
      res.data[1] = companyLogoWithTitle;
    }
    API.putData("Company/update", {
      id: parseInt(id),
      logo: res.data[0],
      primaryColor: $("#primaryColor").val(),
      accentColor: $("#accentColor").val(),
      name: $("#name").val(),
      showEmergencyMessage: getHtml(showEmergencyMessage),
      emergencyMessage: getHtml(emergencyMessage),
      aboutUs: getHtml(aboutUs),
      mision: getHtml(mision),
      vision: getHtml(vision),
      values: getHtml(values),
      history: getHtml(history),
      fundacionCorripio: getHtml(fundacionCorripio),
      suggestionEmail: "Y",
      emailCaseReport: $("#emailCaseReport").val(),
      emailSupport: $("#emailSupport").val(),
      companyId: companyid.value,
      companyLogoWithTitle: res.data[1],
      mottoPrimary: getHtml(mottoPrimary),
      mottoSecundary: getHtml(mottoSecundary),
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
                <label class="control-label">Código Compañia</label>
                <input
                  class="form-control"
                  id="companyId"
                  value={state.companyid}
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Logo</label>&nbsp;&nbsp;
                <input
                  type="file"
                  id="logo"
                  onChange={(e) => convertiraBase64(e)}
                  multiple
                />
                <br />
                <img
                  id="output"
                  src={GetImagePatch("/images/" + state.logo)}
                  width="150"
                  height="100"
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Logo Titulo</label>&nbsp;&nbsp;
                <input
                  type="file"
                  id="logoTitulo"
                  onChange={(e) => convertiraBase641(e)}
                  multiple
                />
                <br />
                <img
                  id="output1"
                  src={GetImagePatch("/images/" + state.logo)}
                  width="150"
                  height="100"
                />
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
                <label class="control-label">Lema Primario</label>
                <Editor
                  editorState={mottoPrimary}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Lema Secundario</label>
                <Editor
                  editorState={mottoSecundary}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="rich-editor demo-wrapper"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChangeM}
                />
              </div>
            </div>
            <div class="row">
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
