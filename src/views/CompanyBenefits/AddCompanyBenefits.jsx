import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import $ from "jquery";
import { getUser } from "../../utils/Common";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DropdownList from "../../components/dropdown/dropdownList";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";

export default function AddCompanyBenefits(props) {
  const [benefitsCategory, setBenefitsCategory] = useState([]);
  const [benefitsCategoryValor, setBenefitsCategoryValor] = useState("");

  const addCompanyBenefits = () => {
    let dataUpload = $("#logo")[0];
    let menu = $("#imageMenu")[0];
    let formData = new FormData();
    formData.append("postedFiles", dataUpload.files[0]);
    formData.append("postedFiles", menu.files[0]);
    let imagen = "";
    let imagen1 = "";

    API.postData("CompanyBenefits/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        imagen = res.data[0];
        imagen1 = res.data[1];
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });

    if (imagen != "" || imagen1 != "") {
      addCompany(imagen, imagen);
    }
  };

  const addCompany = (imagen, imagen1) => {
    API.postData("CompanyBenefits/add", {
      company: company.value,
      categoryId: benefitsCategoryValor,
      saving: saving.value,
      contactName: contactName.value,
      contactPhone: contactPhone.value,
      address: address.value,
      note: note.value,
      banner: imagen,
      imageMenu: imagen1,
      Inactive: "N",
      webAddress: webAddress.value,
      companyId: getUser().companyId,
    })
      .then((res) => {
        MessageResults(res.status);
        props.history.push("/company_benefits");
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
          let Drop = (
            <DropdownList
              idControl="benefitsCategory"
              headerLabel="Categoria"
              data={dropData}
              handleChange={OnDropUnidChange}
            />
          );
          setBenefitsCategory(Drop);
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });
  };

  const OnDropUnidChange = (selectedOption) => {
    sessionStorage.setItem("BenefitsCategoryValue", selectedOption.value);
    setBenefitsCategoryValor(selectedOption.value);
  };
  useEffect(() => {
    GetBenefitsCategory();
  }, []);

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
      const url = URL.revokeObjectURL(output.src);
    };
  };
  const convertiraBase641 = (e) => {
    const output = document.getElementById("output1");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  };
  const company = useFormInput("");
  const saving = useFormInput("");
  const contactName = useFormInput("");
  const contactPhone = useFormInput("");
  const address = useFormInput("");
  const note = useFormInput("");
  const banner = useFormInput("");
  const imageMenu = useFormInput("");
  const webAddress = useFormInput("");

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
                <input class="form-control" {...company} />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Dirección</label>
                <input class="form-control" {...address} />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Nombre Contacto</label>
                <input class="form-control" {...contactName} />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Teléfono Contacto</label>
                <input class="form-control" {...contactPhone} />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Descuento</label>

                <textarea
                  {...saving}
                  id="w3review"
                  name="w3review"
                  rows="4"
                  cols="50"
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Note</label>
                <textarea
                  {...note}
                  id="w3review"
                  name="w3review"
                  rows="4"
                  cols="50"
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <div id="dropFields" className="row mb-2">
                  {benefitsCategory}
                </div>
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Página Web</label>
                <input class="form-control" {...webAddress} />
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
                <img id="output" width="250" height="200" />
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
                <img id="output1" width="250" height="200" />
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
              onClick={addCompanyBenefits}
            >
              Guardar Beneficio
            </button>
          </div>
        </center>
      </div>
    </div>
  );
}
