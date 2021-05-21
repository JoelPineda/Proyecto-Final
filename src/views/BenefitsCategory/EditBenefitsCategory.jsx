import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import $ from "jquery";
import queryString from "query-string";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";

export default function EditBenefitsCategory(props) {
  const [benefitsCategory, setBenefitsCategory] = useState([]);
  useEffect(() => {
    API.getData("BenefitsCategory/getbyid?Id=" + id)
      .then((response) => {
        setBenefitsCategory(response.data);
        setState({
          logo: response.data.logo,
          inactive: response.data.inactive,
          orderCat: response.data.orderCat,
          description: response.data.description,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [state, setState] = useState({
    logo: benefitsCategory.imageName,
    inactive: benefitsCategory.inactive,
    orderCat: benefitsCategory.orderCat,
    description: benefitsCategory.description,
  });
  const id = queryString.parse(props.location.search).id;
  const { logo, inactive, orderCat, description } = state;

  const handleChange = (e) => {
    setState({ logo: logo });
    setState({ inactive: e.target.value, logo: logo });
    setState({ orderCat: e.target.value, logo: logo });
    setState({ description: e.target.value, logo: logo });
  };
  const SaveBenefitsCategory = async () => {
    let img = $("#img").val();

    let dataUpload = $("#logo")[0];
    let formData = new FormData();
    formData.append("postedFiles", dataUpload.files[0]);

    await API.postData("BenefitsCategory/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (res.data[0] !== undefined) {
          img = res.data[0];
        }
      })
      .catch(function (err) {
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
        console.error("Error de conexion " + err);
      });
    if (img != "") {
      updateBenefitsCategory(img);
    }
  };

  const updateBenefitsCategory = (imagen) => {
    API.putData("BenefitsCategory/update", {
      id: parseInt(id),
      logo: imagen,
      orderCat: parseInt($("#OrderCat").val()),
      description: $("#Description").val(),
      inactive: "N",
      companyId: getUser().companyId,
    })
      .then((response) => {
        MessageResults(response.status);

        props.history.push("/comment");
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

  const convertiraBase64 = (e) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);

    output.onload = function () {
      const url = URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output);
  };

  return (
    <div class="container">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <br />
            <h3 className="text-center">ACTUALIZAR CATEGORÍA</h3>
            <input
              type="hidden"
              id="img"
              name="img"
              class="form-control"
              value={state.logo}
            />
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Número de Orden</label>
                <input
                  id="OrderCat"
                  name="OrderCat"
                  class="form-control"
                  value={state.orderCat}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Descripción</label>
                <input
                  id="Description"
                  name="Description"
                  class="form-control"
                  value={state.description}
                  onChange={handleChange}
                />
              </div>

              <div class="form-group col-md-6">
                <label class="control-label">Imagén</label>&nbsp;&nbsp;
                <input
                  type="file"
                  id="logo"
                  onChange={(e) => convertiraBase64(e)}
                  multiple
                />
                <br />
                <img id="output" src={state.logo} width="250" height="200" />
              </div>
            </div>

            <br />
            <center>
              <div class="form-group col-md-2 ">
                <button
                  type="button"
                  className="mybt btn btn-outline-danger text-wrap"
                  onClick={SaveBenefitsCategory}
                >
                  Actualizar
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
