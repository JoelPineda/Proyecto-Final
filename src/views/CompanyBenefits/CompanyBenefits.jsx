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
} from "../../utils/CommonFunctions";
import { LangSpanish } from "../../tools/dataTables.Language";

$(document).ready(() => {
  $("body").on("click", "#TblFaq #btDel", function (e) {
    let param = JSON.parse(
      atob($(e.currentTarget).parent().attr("data-item"))
    )[0];
    ShowConfirmationMessage(SaveDisableChanges, "", param);
  });

  const SaveDisableChanges = (params) => {
    let id = params.id;
    API.putData("Faq/DisableRegister?id=" + id)
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

export default function CompanyBenefits(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [companyBenefits, setCompanyBenefits] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("CompanyBenefits/get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setCompanyBenefits(res.data);
          let DeleteBtn =
            "<a href='#' id='btDel'  class='fa fa fa-trash custom-color size-effect-x2 red' title='Eliminar Pregunta' ></a>";
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              company:
                '<span class="capitalized defaultText">' +
                item.company +
                "</span>",
              saving:
                '<span class="capitalized defaultText">' +
                item.saving +
                "</span>",
              address:
                '<span class="capitalized defaultText">' +
                item.address +
                "</span>",
              note:
                '<span class="capitalized defaultText">' +
                item.note +
                "</span>",
              banner:
                '<img src="' +
                item.banner +
                '"  class="img-fluid"  alt="Banner" />',
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
                '&nbsp;<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Editar Pregunta" href="/editCompanyBenefits?id=' +
                item.id +
                '"' +
                " ></a>&nbsp;" +
                DeleteBtn +
                "</span>",
            });
          });

          $("#TblCompanyBenefits").DataTable({
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
                      company: "",
                      saving: "",
                      address: "",
                      inactive: "",
                      banner: "",
                      note: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "company",
                title: "Compañia",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "banner",
                title: "Logo",
                width: "10%",
                className: "capitalized",
              },

              {
                data: "saving",
                title: "Descuento",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "note",
                title: "Nota",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "address",
                title: "Dirección",
                width: "15%",
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
              <h2 className="h2">Beneficios De La Empresa</h2>
              <a href="/addCompanyBenefits">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;Añadir Beneficios
                  De La Empresa
                </span>
              </a>
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
                          id="TblCompanyBenefits"
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
