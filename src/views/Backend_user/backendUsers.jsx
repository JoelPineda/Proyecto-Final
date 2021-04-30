import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";

import $ from "jquery";
import Moment from "moment";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";
import { EditBackendUsers } from "../Backend_user/editBackendUsers";
import { AddBackendUsers } from "../Backend_user/addNewbackendUsers";

import Loading from "../../components/loading/loading";
import {
  ShowConfirmationMessage,
  MessageResults,
  ShowPopUp,
  GetImagePatch,
  ShowAlertMessage,
  GetGuiId,
} from "../../utils/CommonFunctions";
import { DataTable } from "datatables.net";
import { LangSpanish } from "../../tools/dataTables.Language";
registerLocale("es", es);

$(document).ready(() => {
  $("body").on("click", "#TblBackendUser #btEdit", function (e) {
    ShowPopUp({
      titleName: "EDITAR USUARIO",
      htmlBody: EditBackendUsers(e),
      handlerEvent: OnClickSaveEdit,
      TextOk: "Guardar",
      isDisabled: true,
    });
    setTimeout(() => {
      atob($(e.currentTarget).parent().attr("data-permission-text"))
        .split("|")
        .forEach((item) => {
          const dataElement = $("#dropPermission.chosen-select").find("option");
          for (let index = 0; index < dataElement.length; index++) {
            const element = dataElement[index];
            if ($(element).text() === item) {
              const selectedData = $(element).parent().find("option");
              for (let index = 0; index < selectedData.length; index++) {
                const element = selectedData[index];
                if ($(element).text() === item) {
                  $(element).attr("selected", "selected");
                }
              }
            }
          }
        });

      $(".chosen-select").trigger("chosen:updated");
      if ($("#dropInactive").attr("data-value") !== undefined) {
        $("#dropInactive").val($("#dropInactive").attr("data-value"));
      }
    }, 300);
  });

  $("#sp_AddUser").click(() => {
    ShowPopUp({
      titleName: "CREAR USUARIO",
      htmlBody: AddBackendUsers(),
      handlerEvent: OnClickSaveAdd,
      TextOk: "Guardar",
      isDisabled: true,
      EnabledDisabled: true,
    });
    setTimeout(() => {
      const dataElement = $("#dropPermission.chosen-select").find("option");
      const defText = "Inicio";
      for (let index = 0; index < dataElement.length; index++) {
        const element = dataElement[index];
        if ($(element).text() === defText) {
          const selectedData = $(element).parent().find("option");
          for (let index = 0; index < selectedData.length; index++) {
            const element = selectedData[index];
            if ($(element).text() === defText) {
              $(element).attr("selected", "selected");
            }
          }
        }
      }
    }, 300);
  });
  $("body").on("click", "#TblBackendUser #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(SaveDisableChanges, "", param);
  });
  $("body").on("change", "#TblBackendUser", function (e) {
    if ($(e.currentTarget).val().length < 2) {
      $(this).parent().find(".title-required").text("*");
      ValidationUserEditSelections();
    } else {
      $(e.currentTarget).parent().find(".title-required").text("");
      ValidationUserEditSelections();
    }
  });

  $("body").on("change", "#divEditBackendUser .validate-option", function (e) {
    if ($(e.currentTarget).val() === "0") {
      $(e.currentTarget).parent().find(".title-required").text("*");
    } else {
      $(e.currentTarget).parent().find(".title-required").text("");
    }
    setTimeout(() => {
      ValidationUserEditSelections();
    }, 200);
  });
  $("body").on("change", "#divEditBackendUser .validate-text", function (e) {
    if ($(e.currentTarget).val().length < 2) {
      $(this).parent().find(".title-required").text("*");
      ValidationUserEditSelections();
    } else {
      $(e.currentTarget).parent().find(".title-required").text("");
      ValidationUserEditSelections();
    }
  });

  $("body").on("change", ".cstbUserName", function (e) {
    let btnOk = $(".swal2-confirm.swal2-styled");
    let $labelUser = $("#tbUserName").parent().find(".title-required");
    API.getData("BackendUser/GetbyUser?user=" + $(e.currentTarget).val().trim())
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length !== 0) {
            $labelUser.text("Usuario ya existe!");
            $(btnOk).attr("disabled", true);
          } else {
            $labelUser.text("");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const ValidationUserEditSelections = () => {
    let dataSelect = $("#divEditBackendUser .validate-option");
    let dataPermission = $("#divEditBackendUser #dropPermission");
    let dataText = $("#divEditBackendUser .validate-text");
    let btnOk = $(".swal2-confirm.swal2-styled");
    let isValid = false;
    for (let idx = 0; idx < dataSelect.length; idx++) {
      const element = dataSelect[idx];
      if ($(element).val() === "0") {
        isValid = true;
      }
    }

    for (let index = 0; index < dataText.length; index++) {
      const element = dataText[index];
      if ($(element).val().length < 2) {
        $(element).parent().find(".title-required").text("*");
        isValid = true;
      } else {
        $(element).parent().find(".title-required").text("");
      }
    }
    let permissionVal = true;
    for (let index = 0; index < dataPermission.find("option").length; index++) {
      const element = dataPermission.find("option")[index];
      if ($(element).attr("selected") !== undefined) {
        permissionVal = false;
      }
    }
    if (permissionVal) {
      dataPermission.parent().find(".title-required").text("*");
      isValid = permissionVal;
    } else {
      dataPermission.parent().find(".title-required").text("");
    }

    $(btnOk).attr("disabled", isValid);
    if (!isValid) {
      $(dataSelect).find(".title-required").text("");
    }
  };

  const OnClickSaveEdit = () => {
    let dataRole = [];
    const dataSelected = $("#dropPermission").parent().find(".search-choice");
    const dataItem = $("#dropPermission.chosen-select").find("option");
    for (let index = 0; index < dataItem.length; index++) {
      const element = dataItem[index];
      let ToUsed = false;
      for (let idx = 0; idx < dataSelected.length; idx++) {
        const selectedElement = dataSelected[idx];
        if ($(selectedElement).text() === $(element).text()) {
          ToUsed = true;
        }
      }

      if (ToUsed) {
        dataRole.push($(element).val());
      }
    }

    let param = {
      userId: parseInt($("#divEditBackendUser #tbUserName").attr("data-id")),
      alias: $("#divEditBackendUser #tbAliasName").val(),
      user: $("#divEditBackendUser #tbUserName").val(),
      password: $("#divEditBackendUser #tbPsw").val(),
      isActive: $("#dropInactive").val(),
      companyId: getUser().companyId,
      backendPermission: dataRole.join(),
    };
    if (dataRole.length === 0) {
      ShowAlertMessage("Debe asignar al menos un rol!");
    } else {
      ShowConfirmationMessage(SaveEditChanges, "", param);
    }
  };
  const OnClickSaveAdd = () => {
    let dataRole = [];
    const dataSelected = $("#dropPermission").parent().find(".search-choice");
    const dataItem = $("#dropPermission.chosen-select").find("option");
    for (let index = 0; index < dataItem.length; index++) {
      const element = dataItem[index];
      let ToUsed = false;
      for (let idx = 0; idx < dataSelected.length; idx++) {
        const selectedElement = dataSelected[idx];
        if ($(selectedElement).text() === $(element).text()) {
          ToUsed = true;
        }
      }

      if (ToUsed) {
        dataRole.push($(element).val());
      }
    }

    let param = {
      userId: null,
      alias: $("#divEditBackendUser #tbAliasName").val(),
      user: $("#divEditBackendUser #tbUserName").val(),
      password: $("#divEditBackendUser #tbPsw").val(),
      isActive: $("#dropInactive").val(),
      companyId: getUser().companyId,
      backendPermission: dataRole.join(),
    };
    if (dataRole.length === 0) {
      ShowAlertMessage("Debe asignar al menos un rol!");
    } else {
      ShowConfirmationMessage(SaveAddChanges, "", param);
    }
  };
  const SaveEditChanges = (params) => {
    API.putData("BackendUser/UpdateBackendUserAndRole", params)
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
  const SaveAddChanges = (params) => {
    API.postData(
      "BackendUser/AddBackendUserAndRole?data=" +
        JSON.stringify({
          Alias: params.alias,
          User: params.user,
          Password: params.password,
          IsActive: params.isActive,
          CompanyId: params.companyId,
          BackendPermission: params.backendPermission,
        })
    )
      .then((res) => {
        if (res.status === 200) {
          MessageResults(res.status);
          setTimeout(() => {
            window.location.reload(true);
          }, 1200);
        }
      })
      .catch((err) => {
        console.error("Error de conexion " + err);
        MessageResults(400, err);
      });
  };
  const SaveDisableChanges = (params) => {
    let id = params.UserId;
    API.putData("BackendUser/DisableUser?id=" + id)
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

export default function BackendUser(props) {
  const [dataLoading, setDataLoading] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("/BackendUser/GetUserBackend?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];
          let backendPermissionData = [];
          let companyData = [];
          let backendOpMenuData = [];
          let backendUserData = [];

          let EditBtn =
            "&nbsp;<a href='#' id='btEdit'  class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar usuario, asignar Rol...' ></a>&nbsp;";
          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Usuario' ></a>";

          if (res.data.length > 0) {
            GetOptionMenuAndPermission(res.data[0]);
            JSON.parse(res.data[0].backendPermission).forEach((item) => {
              backendPermissionData.push({
                PermisionId: item.PermisionId,
                OptionMenuId: item.OptionMenuId,
                UserId: item.UserId,
              });
            });
            JSON.parse(res.data[0].backendCompany).forEach((item) => {
              companyData.push({
                CompanyId: item.CompanyId,
                Name: item.Name,
                CompanyLogo: item.Logo,
              });
            });
            JSON.parse(res.data[0].backendOptionMenu).forEach((item) => {
              backendOpMenuData.push({
                OptionMenuId: item.OptionMenuId,
                Name: item.Name,
                IsActive: item.IsActive,
              });
            });
            JSON.parse(res.data[0].backendUser).forEach((item) => {
              const PermissionTitleData = [];
              const permissionIdData = [];
              let companyName = "";
              let CompanyLogoName = "";
              backendPermissionData.forEach((element) => {
                if (element.UserId === item.UserId) {
                  backendOpMenuData.forEach((itemOpt) => {
                    if (itemOpt.OptionMenuId === element.OptionMenuId) {
                      PermissionTitleData.push(itemOpt.Name);
                      permissionIdData.push(element.PermisionId);
                    }
                  });
                }
              });
              companyData.forEach((itemComp) => {
                if (itemComp.CompanyId === item.CompanyId) {
                  companyName = itemComp.Name;
                  CompanyLogoName = itemComp.CompanyLogo;
                }
              });
              backendUserData.push({
                Alias: item.Alias,
                UserId: item.UserId,
                User: item.User,
                Psw: item.Password,
                CompanyId: item.CompanyId,
                CompanyName: companyName,
                CompanyLogoName: CompanyLogoName,
                IsActive: item.IsActive,
                PermissionTitle: PermissionTitleData.join(", "),
                PermissionTitleList: btoa(PermissionTitleData.join("|")),
                PermissionIdList: btoa(JSON.stringify(permissionIdData)),
              });
            });
          }

          backendUserData.forEach((item) => {
            dataResult.push({
              Alias:
                '<span class="capitalized defaultText">' + item.Alias + "</>",
              User:
                '<span class="capitalized defaultText" data-userid="' +
                item.UserId +
                '">' +
                item.User +
                "</span>",
              Psw:
                '<span class="defaultText" title="' +
                item.Psw +
                '">' +
                item.Psw.substr(0, 10) +
                "..." +
                "</span>",
              PermissionTitle:
                '<span class="capitalized defaultText"  title="' +
                item.PermissionTitle +
                '" >' +
                (item.PermissionTitle.length > 30
                  ? item.PermissionTitle.substr(0, 30) + "..."
                  : item.PermissionTitle) +
                "</span>",
              CompanyName:
                '<span class="d-flex align-items-center justify-content-center" data-companyid="' +
                item.CompanyId +
                '" title="' +
                item.CompanyName +
                '"><img src="' +
                GetImagePatch("/images/" + item.CompanyLogoName) +
                '"  class="img-user-grid"  alt="Logo" /></span>',
              IsActive:
                '<span class="capitalized defaultText d-flex align-items-center justify-content-center">' +
                (item.IsActive !== "N" ? "Si" : "No") +
                "</span>",
              itemBtn:
                "<span class='d-flex align-items-center justify-content-center' data-permission-text='" +
                item.PermissionTitleList +
                "' data-item='" +
                btoa(JSON.stringify([item])) +
                "'>" +
                EditBtn +
                DeleteBtn +
                "</span>",
            });
          });

          $("#TblBackendUser").DataTable({
            destroy: true,
            searching: true,
            language: LangSpanish,
            bLengthChange: false,
            lengthMenu: [10, 20, 40, 60, 80, 90, 100, 200],
            order: [[0, "desc"]],
            dom: "Bfrtip",
            buttons: [
              {
                extend: "excel",
                text:
                  '<i class="btn btn-success fa fa-file-excel-o white">&nbsp;Excel</i>',
                titleAttr: "Excel",
                exportOptions: {
                  columns: ":visible",
                },
                title: "excelBackEndUser_" + GetGuiId().substr(0, 8),
              },
              {
                extend: "csv",
                text:
                  '<i class="btn btn-primary fa fa-file-text-o white">&nbsp;CSV</i>',
                titleAttr: "csv",
                exportOptions: {
                  columns: ":visible",
                },
                title: "csvBackEndUser_" + GetGuiId().substr(0, 8),
              },
              {
                extend: "print",
                text:
                  '<i class="btn btn-danger fa fa-print white">&nbsp;Imprimir</i>',
                titleAttr: "print",
                exportOptions: {
                  columns: ":visible",
                },
                title: "printBackEndUser_" + GetGuiId().substr(0, 8),
              },
            ],
            data:
              dataResult.length === 0
                ? [
                    {
                      Alias: "",
                      User: "",
                      Psw: "",
                      PermissionTitle: "",
                      CompanyName: "",
                      IsActive: "",
                      itemBtn: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "Alias",
                title: "Alias",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "User",
                title: "Usuario",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "Psw",
                title: "Contraseña",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "PermissionTitle",
                title: "Permisos",
                width: "30%",
                className: "capitalized",
              },
              {
                data: "CompanyName",
                title: "Compañía\u00a0",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "IsActive",
                title: "Inactivo",
                width: "10%",
                className: "capitalized",
              },
              {
                data: "itemBtn",
                title: "\u00a0Acciones\u00a0\u00a0\u00a0",
                className: "capitalized",
                width: "30%",
                orderable: false,
              },
            ],
          });
          // $(".dt-buttons").prepend($("#TblBackendUser_filter"));
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        setDataLoading(false);
      });
  };
  const GetOptionMenuAndPermission = (dataItem) => {
    let backendOpMenuPermissionData = [];
    JSON.parse(dataItem.backendOptionMenu).forEach((element) => {
      if (
        element.IsActive === "N" &&
        typeof backendOpMenuPermissionData.find(
          (c) => c.OptionMenuId === element.OptionMenuId
        ) === "undefined"
      ) {
        backendOpMenuPermissionData.push({
          OptionMenuId: element.OptionMenuId,
          Name: element.Name,
        });
      }
    });
    $("#TblBackendUser").attr(
      "data-OpcMenuPermission",
      btoa(JSON.stringify(backendOpMenuPermissionData))
    );
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
              <h2 className="h2">Usuarios</h2>
              <span className="btn btn-success btn-sm" id="sp_AddUser">
                <i className="fa fa-plus-circle"></i>&nbsp;Crear Usuarios
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
                          id="TblBackendUser"
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
                <br />
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
