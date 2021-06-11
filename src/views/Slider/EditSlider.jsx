import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";
import $ from "jquery";
import draftToHtml from "draftjs-to-html";
import queryString from "query-string";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

export default function EditSlider(props) {
  const [slider, setSlider] = useState([]);
  useEffect(() => {
    API.getData("Slider/getbyid?Id=" + id)
      .then((response) => {
        if (response.status === 200) {
          setSlider(response.data);
          setState({
            imageName: response.data.imageName,
            inactive: response.data.inactive,
            showOrder: response.data.showOrder,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [state, setState] = useState({
    imageName: slider.imageName,
    inactive: slider.inactive,
    showOrder: slider.showOrder,
  });
  const id = queryString.parse(props.location.search).id;
  const { imageName, inactive, showOrder } = state;

  const handleChange = (e) => {
    setState({ imageName: imageName });
    setState({ inactive: e.target.value, imageName: imageName });
    setState({ showOrder: e.target.value, imageName: imageName });
  };
  const SaveSlider = async () => {
    let img = $("#img").val();

    let dataUpload = $("#logo")[0];
    let formData = new FormData();
    formData.append("postedFiles", dataUpload.files[0]);

    await API.postData("Slider/UploadFiles", formData, {
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
      updateSlider(img);
    }
  };

  const updateSlider = (imagen) => {
    API.putData("Slider/update", {
      id: parseInt(id),
      imageName: imagen,
      showOrder: parseInt($("#question").val()),
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
            <h3 className="text-center">ACTUALIZAR IMAGÉN</h3>
            <input
              type="hidden"
              id="imageName"
              name="img"
              class="form-control"
              value={state.imageName}
            />

            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">Número de Orden</label>
                <input
                  id="question"
                  name="question"
                  class="form-control"
                  value={state.showOrder}
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
                <img
                  id="output"
                  src={state.imageName}
                  width="250"
                  height="200"
                />
              </div>
            </div>

            <br />
            <center>
              <div class="form-group col-md-2 ">
                <button
                  type="button"
                  className="mybt btn btn-outline-danger text-wrap"
                  onClick={SaveSlider}
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
