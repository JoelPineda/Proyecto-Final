import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import API from "../../utils/api";

import { getUser, removeUserSession } from "../../utils/Common";
import { AddBenefitsCategory } from "../BenefitsCategory/AddBenefitsCategory";
import { EditBenefitsCategory } from "../BenefitsCategory/EditBenefitsCategory";
import Loading from "../../components/loading/loading";
import {
  ShowPopUp,
  ShowAlertMessage,
  ShowConfirmationMessage,
  MessageResults,
  GetImagePatch,
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";

$(document).ready(() => {
  $("#sp_AddTIPO").click(() => {
    ShowPopUp({
      titleName: "AGREGAR CATEGORÍA DE BENEFICIOS",
      htmlBody: AddBenefitsCategory(),
      handlerEvent: SaveCategory,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
  });
  const SaveCategory = () => {
    let imagen = "";

    let dataUpload = $("#inplogo")[0];
    let formData = new FormData();
    formData.append("postedFiles", dataUpload.files[0]);

    API.postData("BenefitsCategory/UploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        imagen = res.data[0];
      })
      .catch(function (err) {
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
        console.error("Error de conexion " + err);
      });
    if (imagen != "") {
      OnClickSaveBenefitsCategory(imagen);
    }
  };

  const OnClickSaveBenefitsCategory = (imagen) => {
    API.postData("BenefitsCategory/add", {
      description: $("#tbDescriptionB").val(),
      inactive: "N",
      logo: imagen,
      orderCat: parseInt($("#tbcat").val()),
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

  $("body").on("change", "#tbDescriptionB", (e) => {
    let btnOk = $(".swal2-confirm.swal2-styled");

    if ($(e.currentTarget).val().length > 3) {
      API.getData(
        "BenefitsCategory/getDescription?description=" +
          $("#tbDescriptionB").val()
      )
        .then((response) => {
          if (response.status === 200) {
            if (response.data) {
              $("#sp_tbDescriptionB").text("CATEGORÍA DE BENEFICIOS EXISTE");

              $(btnOk).attr("disabled", true);
            } else {
              $(btnOk).removeAttr("disabled");
              $("#sp_tbDescriptionB").text("");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      $(btnOk).attr("disabled", true);
      $("#sp_tbDescriptionB").text(" Requerido!");
    }
  });

  $("body").on("click", "#TblBenefitsCategory #btEdit", function (e) {
    ShowPopUp({
      titleName: "ACTUALIZAR CATEGORÍA DE BENEFICIOS",
      htmlBody: EditBenefitsCategory(e),
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
      id: parseInt($("#tbTipoID").val()),
      description: $("#tbDescriptionEdit").val(),
      logo: imagen,
      orderCat: parseInt($("#tbcat").val()),
      companyId: getUser().companyId,
      inactive: inac,
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

  $("body").on("click", "#TblBenefitsCategory #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(SaveDisableChanges, "", param);
  });

  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("BenefitsCategory/DisableRegister?id=" + id)
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

export default function BenefitsCategory(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [benefitsCategory, setBenefitsCategory] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("BenefitsCategory/get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setBenefitsCategory(res.data);
          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Categoría De Beneficios' ></a>&nbsp;";

          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Categoría De Beneficios' ></a>";
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              description:
                '<span class="capitalized defaultText">' +
                item.description +
                "</span>",
              logo:
                '<img src="' +
                GetImagePatch("/images/" + item.logo) +
                '"  class="img-fluid"  alt="Logo" />',
              orderCat:
                '<span class="capitalized defaultText">' +
                item.orderCat +
                "</span>",

              itemBtn:
                "<span data-created='" +
                item.inactive +
                "'  data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                EditBtn +
                DeleteBtn +
                "</span>",
            });
          });

          $("#TblBenefitsCategory").DataTable({
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
                      description: "",
                      inactive: "",
                      orderCat: "",
                      logo: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "description",
                title: "Descripción",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "logo",
                title: "Logo",
                width: "10%",
                className: "capitalized",
              },

              {
                data: "orderCat",
                title: "Orden Categoría",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "itemBtn",
                title: "\u00a0Acciones\u00a0\u00a0\u00a0",
                width: "20%",
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
              <h2 className="h2">CATEGORÍA DE BENEFICIOS</h2>

              <span className="btn btn-success btn-sm" id="sp_AddTIPO">
                <i className="fa fa-plus-circle"></i>&nbsp;Añadir CATEGORÍA DE
                BENEFICIOS
              </span>
              <br />
              <br />
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
                          id="TblBenefitsCategory"
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
