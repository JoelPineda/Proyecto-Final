import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import $ from "jquery";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import queryString from "query-string";
import {
  ShowAlertMessage,
  MessageResults,
  GetImagePatch,
} from "../../utils/CommonFunctions";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function EditCompanyBenefits(props) {
  const [companyBenefits, setCompanyBenefits] = useState([]);
  const [benefitsCategory, setBenefitsCategory] = useState([]);
  const [benefitsCategoryValor, setBenefitsCategoryValor] = useState("");

  const [state, setState] = useState({
    company: companyBenefits.company,
    categoryId: companyBenefits.categoryId,
    saving: companyBenefits.saving,
    contactName: companyBenefits.contactName,
    contactPhone: companyBenefits.contactPhone,
    address: companyBenefits.address,
    note: companyBenefits.note,
    banner: companyBenefits.banner,
    imageMenu: companyBenefits.imageMenu,
    inactive: companyBenefits.inactive,
    webAddress: companyBenefits.webAddress,
    e: companyBenefits.inactive,
  });
  const id = queryString.parse(props.location.search).id;
  const {
    company,
    saving,
    categoryId,
    contactName,
    contactPhone,
    address,
    note,
    banner,
    imageMenu,
    inactive,
    webAddress,
    e,
  } = state;

  const handleChange = (e) => {
    setState({ company: e.target.value, banner: banner, imageMenu: imageMenu });
    setState({ saving: e.target.value, banner: banner, imageMenu: imageMenu });
    setState({
      contactName: e.target.value,
      banner: banner,
      imageMenu: imageMenu,
    });
    setState({
      contactPhone: e.target.value,
      banner: banner,
      imageMenu: imageMenu,
    });
    setState({ address: e.target.value, banner: banner, imageMenu: imageMenu });
    setState({ note: e.target.value, banner: banner, imageMenu: imageMenu });
    setState({
      inactive: e.target.value,
      banner: banner,
      imageMenu: imageMenu,
    });
    setState({
      webAddress: e.target.value,
      banner: banner,
      imageMenu: imageMenu,
    });
    setState({ e: e.target.value, banner: banner, imageMenu: imageMenu });
  };

  const updateCompanyBenefits = async () => {
    let img = "";
    let img1 = "";
    let dataUpload = $("#logo")[0];
    let menu = $("#imageMenu")[0];
    let formData = new FormData();

    formData.append("postedFiles", dataUpload.files[0]);
    formData.append("postedFiles", menu.files[0]);
    await API.postData("CompanyBenefits/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (res.data[0] == undefined) {
          img = banner;
        } else {
          img = res.data[0];
        }
        if (res.data[1] == undefined) {
          img1 = imageMenu;
        } else {
          img1 = res.data[1];
        }
      })
      .catch(function (err) {
        ShowAlertMessage(
          "Información",
          "Hubo un problema cargando la imagen intente de nuevo",
          "error"
        );
        console.error("Error de conexion " + err);
      });

    updateCompany(img, img1);
  };

  const updateCompany = (img, img1) => {
    API.putData("CompanyBenefits/update", {
      id: parseInt(id),
      company: $("#company").val(),
      categoryId: parseInt($("#unitType").val()),
      saving: $("#saving").val(),
      contactName: $("#contactName").val(),
      contactPhone: $("#contactPhone").val(),
      address: $("#address").val(),
      note: $("#note").val(),
      banner: img,
      imageMenu: img1,
      inactive: $("#inactive").val(),
      webAddress: $("#webAddress").val(),
      companyId: getUser().companyId,
    })
      .then((res) => {
        MessageResults(res.status);
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

  const GetBenefitsCategory = () => {
    API.getData("BenefitsCategory/get?companyId=" + getUser().companyId)
      .then((res) => {
        if (res.status === 200) {
          let dropData = [];
          res.data.forEach((item) => {
            dropData.push({ label: item.description, value: item.id });
          });
          setBenefitsCategoryValor();
          setBenefitsCategory(dropData);
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });
  };

  useEffect(() => {
    GetBenefitsCategory();
    API.getData("CompanyBenefits/getbyidUni?Id=" + id)
      .then((response) => {
        if (response.status === 200) {
          setCompanyBenefits(response.data);
          setState({
            company: response.data.company,
            categoryId: response.data.categoryId,
            saving: response.data.saving,
            contactName: response.data.contactName,
            contactPhone: response.data.contactPhone,
            address: response.data.address,
            note: response.data.note,
            banner: response.data.banner,
            imageMenu: response.data.imageMenu,
            inactive: response.data.inactive,
            webAddress: response.data.webAddress,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const OnDropUnidChange = (e) => {
    setState({
      categoryId: e.target.value,
      banner: banner,
      imageMenu: imageMenu,
    });
    sessionStorage.setItem("BenefitsCategoryValor", e.value);
    setBenefitsCategoryValor(e.value);
  };
  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">
              AGREGAR NUEVO BENEFICIOS DE LA EMPRESA
            </h3>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nombre Compañia</label>
                <input
                  id="company"
                  class="form-control"
                  value={state.company}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Dirección</label>
                <input
                  id="address"
                  class="form-control"
                  value={state.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nombre Contacto</label>
                <input
                  id="contactName"
                  class="form-control"
                  value={state.contactName}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Teléfono Contacto</label>
                <input
                  id="contactPhone"
                  class="form-control"
                  value={state.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Descuento</label>

                <textarea
                  value={state.saving}
                  onChange={handleChange}
                  id="saving"
                  rows="4"
                  cols="50"
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Note</label>
                <textarea
                  value={state.note}
                  onChange={handleChange}
                  id="note"
                  rows="4"
                  cols="50"
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Tipo de unidad</label>
                <select
                  id="unitType"
                  name="logueado"
                  value={state.categoryId}
                  onChange={OnDropUnidChange}
                  class="form-control"
                >
                  {benefitsCategory.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div class="form-group col-md-6">
                <label class="control-label">Activo</label>
                <select
                  id="inactive"
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
            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Página Web</label>
                <input
                  id="webAddress"
                  class="form-control"
                  value={state.webAddress}
                  onChange={handleChange}
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
                  src={GetImagePatch("/images/Pensando/" + state.banner)}
                  width="150"
                  height="100"
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Imagen Menú </label>&nbsp;&nbsp;
                <input
                  type="file"
                  id="imageMenu"
                  onChange={(e) => convertiraBase641(e)}
                  multiple
                />
                <br />
                <img
                  id="output1"
                  src={GetImagePatch("/images/Pensando/" + state.imageMenu)}
                  width="150"
                  height="100"
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
              onClick={updateCompanyBenefits}
            >
              Actualizar Beneficio
            </button>
          </div>
        </center>
      </div>
    </div>
  );
}
