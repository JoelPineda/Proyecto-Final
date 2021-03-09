import React, { useState, useEffect } from "react";
import $ from "jquery";
import Moment from "moment";
import "moment/locale/es";
import { getUser, removeUserSession } from "../../utils/Common";
import API from "../../utils/api";
import Loading from "../../components/loading/loading";
import { LangSpanish } from "../../tools/dataTables.Language";

export default function Bank(props) {
  const [dataLoading, setDataLoading] = useState(true);
  const [bank, setBank] = useState(true);

  const fillData = () => {
    let Record = [];
    API.getData("Bank/get")
      .then((res) => {
        setDataLoading(false);
        if (res.status === 200) {
          let dataResult = [];

          setBank(res.data);

          res.data.forEach((item) => {
            dataResult.push({
              id:
                '<span class="container d-flex align-items-center justify-content-center">' +
                item.id +
                "</>",
              bankName:
                '<span class="capitalized defaultText">' +
                item.bankName +
                "</span>",
              inactive:
                '<span class="capitalized defaultText">' +
                item.inactive +
                "</span>",
              creationDate:
                '<span class="capitalized defaultText">' +
                Moment(item.creationDate).format("DD/MM/YYYY  ") +
                "</span>",
              itemBtn:
                '<a class="fa fa-pencil-square-o custom-color size-effect-x2"   title="Editar Banco" href="/editbank?id=' +
                item.id +
                '"' +
                item.id +
                " ></a>",
            });
          });

          $("#TblBank").DataTable({
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
                      bankName: "",
                      inactive: "",
                      creationDate: "",
                    },
                  ]
                : dataResult,
            columns: [
              {
                data: "bankName",
                title: "Banco",
                width: "40%",
                className: "capitalized",
              },
              {
                data: "creationDate",
                title: "Fecha",
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
              <h2 className="h2">Bancos</h2>
              <a href="/addbank">
                <span className="btn btn-success btn-sm">
                  <i className="fa fa-plus-circle"></i>&nbsp;Añadir Banco
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
                          id="TblBank"
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
