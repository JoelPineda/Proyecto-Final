import React, { useState } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";
import $ from "jquery";

export default function AddBenefitsCategory(props) {
  const [state, setState] = useState({});

  const SaveBenefitsCategory = async () => {
    let img = "";

    let dataUpload = $("#logo")[0];
    let formData = new FormData();
    formData.append("postedFiles", dataUpload.files[0]);

    await API.postData("BenefitsCategory/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        img = res.data[0];
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
      SaveBenefitsCategoryIMG(img);
    }
  };
  const SaveBenefitsCategoryIMG = (imagen) => {
    API.postData("BenefitsCategory/add", {
      orderCat: parseInt(orderCat.value),
      description: description.value,
      logo: imagen,
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

  const orderCat = useFormInput("");
  const description = useFormInput("");

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
            <h3 className="text-center">AGREGAR NUEVA CATEGORÍA</h3>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Orden Categoría</label>
                <input class="form-control" {...orderCat} />
              </div>

              <div class="form-group col-md-6">
                <label class="control-label">Descripción</label>
                <input class="form-control" {...description} />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Imagén</label>&nbsp;&nbsp;
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
            </div>
          </div>
          <br />
        </div>
        <center>
          <div class="form-group col-md-2 ">
            <button
              type="button"
              className="mybt btn btn-outline-danger text-wrap"
              onClick={SaveBenefitsCategory}
            >
              Guardar
            </button>
          </div>
        </center>
      </div>
    </div>
  );
}
