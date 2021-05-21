import React, { useState } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";
import $ from "jquery";

export default function AddSlider(props) {
  const [state, setState] = useState({});

  const SaveSlider = async () => {
    let img = "";

    let dataUpload = $("#logo")[0];
    let formData = new FormData();
    formData.append("postedFiles", dataUpload.files[0]);

    await API.postData("Slider/UploadFiles", formData, {
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
      SaveSliderIMG(img);
    }
  };
  const SaveSliderIMG = (imagen) => {
    API.postData("Slider/add", {
      showOrder: parseInt(showOrder.value),
      inactive: "N",
      imageName: imagen,
      inactive: "N",
      companyId: getUser().companyId,
    })
      .then((response) => {
        MessageResults(response.status);
        props.history.push("/banners");
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

  const showOrder = useFormInput("");
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
            <h3 className="text-center">AGREGAR NUEVA IMAGEN</h3>

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Número de Orden</label>
                <input class="form-control" {...showOrder} />
              </div>
              <div class="form-group col-md-6">
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
              onClick={SaveSlider}
            >
              Guardar
            </button>
          </div>
        </center>
      </div>
    </div>
  );
}
