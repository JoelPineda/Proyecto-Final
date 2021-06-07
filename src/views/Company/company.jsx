import React, { useState, useEffect } from "react";
import $ from "jquery";
import "moment/locale/es";
import API from "../../utils/api";
import Loading from "../../components/loading/loading";
import { LangSpanish } from "../../tools/dataTables.Language";
import { ShowAlertMessage } from "../../utils/CommonFunctions";

export default function CompanyConf(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [company, setCompany] = useState(true);

  const fillData = () => {
    API.getData("/Company/getCompany")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          let EditBtn =
            "<a href='/addCompany'   class='fa fa-pencil-square-o custom-color size-effect-x2' title='Editar Evaluación' ></a>";
          setCompany(res.data);
          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              logo:
                '<img src="' +
                item.logo +
                '"  class="img-fluid "  alt="Logo" />',
              vision:
                '<span class="capitalized defaultText">' +
                item.vision +
                "</span>",
              values:
                '<span class="capitalized defaultText">' +
                item.values +
                "</span>",
              name:
                '<span class="capitalized defaultText">' +
                item.name +
                "</span>",
              mision:
                '<span class="capitalized defaultText">' +
                item.mision +
                "</span>",
              itemBtn:
                '<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Editar Compañia" href="/editCompany?id=' +
                item.id +
                '"' +
                item.id +
                " ></a>",
            });
          });

          $("#TblCompany").DataTable({
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
                      logo: "",
                      vision: "",
                      name: "",
                      mision: "",
                      values: "",
                      itemBtn: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "name",
                title: "Nombre ",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "logo",
                title: "Logo\u00a0Compañia",
                width: "15%",
                className: "capitalized",
              },
              {
                data: "vision",
                title: "Visión",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "values",
                title: "Valores",
                width: "20%",
                className: "capitalized",
              },

              {
                data: "mision",
                title: "Misión ",
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
        ShowAlertMessage(
          "Información",
          "Hubo un problema intente de nuevo",
          "error"
        );
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
              <h2 className="h2">CompaÑia</h2>
              <a href="/addCompany">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;Añadir Compania
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
                          id="TblCompany"
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