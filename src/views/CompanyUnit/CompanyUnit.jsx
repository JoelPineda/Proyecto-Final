import React, { useState, useEffect } from "react";
import $ from "jquery";
import "moment/locale/es";
import API from "../../utils/api";
import Loading from "../../components/loading/loading";
import { LangSpanish } from "../../tools/dataTables.Language";
import { getUser, removeUserSession } from "../../utils/Common";

export default function CompanyUnit(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [companyUnit, setCompanyUnit] = useState(true);

  const fillData = () => {
    API.getData("BusinessUnit/get?companyId=" + getUser().companyId)
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setCompanyUnit(res.data);

          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              name:
                '<span class="capitalized defaultText">' +
                item.name +
                "</span>",
              shortName:
                '<span class="capitalized defaultText">' +
                item.shortName +
                "</span>",
              logo:
                '<span class="capitalized defaultText">' +
                item.logo +
                "</span>",
              detail:
                '<span class="capitalized defaultText">' +
                item.detail +
                "</span>",
              companyUnitTypeId:
                '<span class="capitalized defaultText">' +
                item.companyUnitTypeId +
                "</span>",
              unitOrder:
                '<span class="capitalized defaultText">' +
                item.unitOrder +
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
                '<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Editar Unidad de Compañia" href="/editCompanyUnit?id=' +
                item.id +
                '"' +
                item.id +
                " ></a>",
            });
          });

          $("#TblCompanyUnit").DataTable({
            destroy: true,
            searching: false,
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
                      name: "",
                      shortName: "",
                      logo: "",
                      detail: "",
                      companyUnitTypeId: "",
                      unitOrder: "",
                      inactive: "",
                      companyId: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "name",
                title: "Nombre",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "shortName",
                title: "Nombre\u00a0corto",
                width: "25%",
                className: "capitalized",
              },
              {
                data: "detail",
                title: "Detalle",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "unitOrder",
                title: "Orden\u00a0Unidad",
                width: "20%",
                className: "capitalized",
              },
              {
                data: "inactive",
                title: "Inactivo",
                width: "20%",
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
              <h2 className="h2">Unidad de compañia</h2>
              <a href="/addCompanyUnit">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;Añadir Unidad de
                  compañia
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
                          id="TblCompanyUnit"
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
