import React, { useState, useEffect } from "react";
import $ from "jquery";
import "moment/locale/es";
import { getUser } from "../../utils/Common";
import API from "../../utils/api";
import Loading from "../../components/loading/loading";
import {
  ShowConfirmationMessage,
  MessageResults,
  GetImagePatch,
  ShowPopUp,
  ShowAlertMessage,
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";

import { AddSlider } from "../Slider/AddSlider";
import { EditSlider } from "../Slider/EditSlider";

$(document).ready(() => {
  $("#sp_AddSlider").click(() => {
    ShowPopUp({
      titleName: "AGREGAR IMAGEN",
      htmlBody: AddSlider(),
      handlerEvent: SaveSlider,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });
  const SaveSlider = async () => {
    let img = "";

    let dataUpload = $("#inpBanner")[0];
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
      showOrder: parseInt($("#tbOrden").val()),
      inactive: "N",
      imageName: imagen,
      companyId: getUser().companyId,
    })
      .then((res) => {
        MessageResults(res.status);
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
  $("body").on("change", "#tbOrden", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    $(btnOk).removeAttr("disabled");
  });
  /////////////////////////////////////////////////////////
  $("body").on("click", "#TblSlider #btEdit", function (e) {
    ShowPopUp({
      titleName: "ACTUALIZAR IMAGEN",
      htmlBody: EditSlider(e),
      handlerEvent: ClickSave,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });

  $("body").on("change", "#tbDescriptionEdit", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    $(btnOk).removeAttr("disabled");
  });

  const ClickSave = async () => {
    let imagen = $("#logoName").val();

    let dataUpload = $("#tblogo")[0];
    let formData = new FormData();
    formData.append("postedFiles", dataUpload.files[0]);

    await API.postData("BenefitsCategory/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (res.data[0] != undefined) {
          imagen = res.data[0];
        }
      })
      .catch(function (err) {
        ShowAlertMessage(
          "Información",
          "Hubo un problema al cargar la imagen intente de nuevo",
          "error"
        );
        console.error("Error de conexion " + err);
      });
    OnClickSaveEditBank(imagen);
    setTimeout(() => {
      window.location.reload(true);
    }, 1200);
  };

  const OnClickSaveEditBank = (imagen) => {
    let inac = $("#tbinactive").val() !== "Y" ? "N" : "Y";

    API.putData("BenefitsCategory/update", {
      id: parseInt($("#tbSliderID").val()),
      showOrder: parseInt($("#EdittbOrden").val()),
      inactive: "N",
      imageName: imagen,
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

  //*//*/////////////////////////////////////////////

  $("body").on("click", "#TblSlider #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(SaveDisableChanges, "", param);
  });

  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("Slider/DisableRegister?id=" + id)
      .then((res) => {
        if (res.status === 200) {
          MessageResults(res.status);
          setTimeout(() => {
            window.location.reload(true);
          }, 1200);
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        MessageResults(400, err);
      });
  };
});

export default function Slider(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [slider, setSlider] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("Slider/get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setSlider(res.data);
          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Imagen' ></a>";
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Categoría De Beneficios' ></a>&nbsp;";

          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              imageName:
                '<img src="' +
                GetImagePatch("/images/Slider/" + item.imageName) +
                '"  class="img-fluid"  alt="Logo" />',
              showOrder:
                '<span class="capitalized defaultText">' +
                item.showOrder +
                "</span>",
              inactive:
                '<span class="capitalized defaultText">' +
                (item.inactive !== "N" ? "Si" : "No") +
                "</span>",
              companyId:
                '<span class="capitalized defaultText">' +
                item.companyId +
                "</span>",

              itemBtn:
                "<span data-created='" +
                item.id +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                EditBtn +
                DeleteBtn +
                "</span>",
            });
          });

          $("#TblSlider").DataTable({
            destroy: true,
            searching: true,
            language: LangSpanish,
            bLengthChange: false,
            lengthMenu: [10, 20, 40, 60, 80, 90, 100, 200],
            order: [[0, "desc"]],
            dom: "Bfrtip",
            buttons: ["copy", "excel", "pdf"],
            data:
              dataResult.length === 0
                ? [
                    {
                      imageName: "",
                      inactive: "",
                      showOrder: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "imageName",
                title: "Imagen",
                width: "30%",
                className: "capitalized",
              },
              {
                data: "showOrder",
                title: "Orden",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "inactive",
                title: "Inactivo",
                width: "15%",
                className: "capitalized",
              },

              {
                data: "itemBtn",
                title: "\u00a0Acciones\u00a0\u00a0\u00a0",
                width: "30%",
                orderable: false,
              },
            ],
          });
          $(".csHidden").attr("style", "display:none");
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
      });
    setDataLoading(false);
  };

  useEffect(() => {
    fillData();
  }, []);

  return (
    <>
      <div>
        <br />
        <div className=" htmlPayroll    container">
          <div className="row">
            <div className="lowcolor col-12">
              <br />
              <br />
              <h2 className="h2">Slider</h2>
              <span className="btn btn-success btn-sm" id="sp_AddSlider">
                <i className="fa fa-plus-circle"></i>&nbsp;Añadir Imagen
              </span>
            </div>
          </div>
          <div className="row ">
            {!dataLoading ? (
              <>
                <div className="container">
                  <div className="">
                    {!dataLoading ? (
                      <div
                        className="scroll-table bordered"
                        Style="min-height:600px"
                      >
                        <table
                          id="TblSlider"
                          className="table table-striped table-bordered display"
                          Style="width:100% !important"
                        ></table>
                      </div>
                    ) : (
                      <Loading />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="container">
                <Loading />
              </div>
            )}
          </div>

          <br />
          <br />
        </div>
        <br />
        <br />
      </div>
    </>
  );
}
