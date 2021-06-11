import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import $ from "jquery";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function AddCompany(props) {
  const [state, setState] = useState({
    mottoPrimary: EditorState.createEmpty(),
    mottoSecundary: EditorState.createEmpty(),
    emergencyMessage: EditorState.createEmpty(),
    aboutUs: EditorState.createEmpty(),
    mision: EditorState.createEmpty(),
    vision: EditorState.createEmpty(),
    values: EditorState.createEmpty(),
    history: EditorState.createEmpty(),
    fundacionCorripio: EditorState.createEmpty(),
  });

  const {
    mottoPrimary,
    mottoSecundary,
    emergencyMessage,
    aboutUs,
    mision,
    vision,
    values,
    history,
    fundacionCorripio,
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

  const guardarCompany = async () => {
    let image = "";
    let imagen = "";
    let dataUpload = $("#logo")[0];
    let dataUpload1 = $("#logoTitulo")[0];
    let formData = new FormData();
    formData.append("postedFiles", dataUpload.files[0]);
    formData.append("postedFiles", dataUpload1.files[0]);
    await API.postData("Company/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        image = res.data[0];
        imagen = res.data[0];
        add(image, imagen);
        props.history.push("/settings");
        setTimeout(() => {
          window.location.reload(true);
        }, 1200);
      })
      .catch(function (err) {
        debugger;
        console.error("Error de conexion " + err);
        alert(400, err);
      });
  };

  const add = (img, imagen) => {
    API.postData("Company/add", {
      logo: img,
      primaryColor: primaryColor.value,
      accentColor: accentColor.value,
      name: name.value,
      showEmergencyMessage: "N",
      emergencyMessage: getHtml(emergencyMessage),
      aboutUs: getHtml(aboutUs),
      mision: getHtml(mision),
      vision: getHtml(vision),
      values: getHtml(values),
      history: getHtml(history),
      fundacionCorripio: getHtml(fundacionCorripio),
      suggestionEmail: suggestionEmail.value,
      emailCaseReport: emailCaseReport.value,
      emailSupport: emailSupport.value,
      companyId: companyid.value,
      companyLogoWithTitle: imagen,
      mottoPrimary: getHtml(mottoPrimary),
      mottoSecundary: getHtml(mottoSecundary),
    })
      .then((response) => {
        MessageResults(response.status);
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
  const [error, setError] = useState(null);
  const name = useFormInput("");
  const logo = useFormInput("");
  const primaryColor = useFormInput("");
  const accentColor = useFormInput("");
  const suggestionEmail = useFormInput("");
  const emailCaseReport = useFormInput("");
  const emailSupport = useFormInput("");
  const companyid = useFormInput("");

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">AGREGAR NUEVA COMPAÑIA</h3>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nombre</label>
                <input class="form-control" {...name} />
              </div>

              <div class="form-group col-md-6">
                <label class="control-label">Código Compañia</label>
                <input class="form-control" {...companyid} />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Logo</label>&nbsp;&nbsp;
                <input
                  type="file"
                  id="logo"
                  accept="image/png"
                  onChange={(e) => convertiraBase64(e)}
                  multiple
                />
                <br />
                <img id="output" width="150" height="100" />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Logo Titulo</label>&nbsp;&nbsp;
                <input
                  type="file"
                  id="logoTitulo"
                  accept="image/png"
                  onChange={(e) => convertiraBase641(e)}
                  multiple
                />
                <br />
                <img id="output1" width="150" height="100" />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Color primario</label>
                <input type="color" class="form-control" {...primaryColor} />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Accent color</label>
                <input type="color" class="form-control" {...accentColor} />
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
                <input class="form-control" {...suggestionEmail} />
                <span class="text-danger"></span>
              </div>
              <div class="form-group col-md-4">
                <label class="control-label">
                  Correo electrónico informe de caso
                </label>
                <input class="form-control" {...emailCaseReport} />
                <span class="text-danger"></span>
              </div>
              <div class="form-group col-md-4">
                <label class="control-label">Correo electrónico soporte</label>
                <input class="form-control" {...emailSupport} />
                <span class="text-danger"></span>
              </div>
            </div>
            <center>
              <div class="form-group col-md-2">
                <button
                  type="button"
                  className="mybt btn btn-outline-danger text-wrap"
                  onClick={guardarCompany}
                >
                  Guardar Compania
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
