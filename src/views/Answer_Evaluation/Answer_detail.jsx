import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getUser } from "../../utils/Common";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import $ from "jquery";
import draftToHtml from "draftjs-to-html";
import queryString from "query-string";
import { ShowAlertMessage, MessageResults } from "../../utils/CommonFunctions";

export default function AnserDetails(props) {
  const [faq, setFaq] = useState([]);
  useEffect(() => {
    API.getData("NewEvaluation/GetNewEvaluation?id= " + id)
      .then((response) => {
        if (response.status === 200) {
          setFaq(response.data);
          alert("Entro");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const id = queryString.parse(props.location.search).id;

  return (
    <section id="main" className="wrapper">
      <div className="inner">
        <h2 Style={"text-align:center"}>Respuesta</h2>
        <br />
        <section>
          <div className="content2">
            <header>
              <div>
                <h2 Style={"text-align:center"}>Respuesta</h2>
              </div>
              {faq.map((item) => (
                <div>
                  <h5>
                    <strong>{item.orden + "- " + item.pregunta}</strong>
                  </h5>
                  <p>{item.respuesta} </p>
                </div>
              ))}
            </header>
          </div>
        </section>
      </div>
    </section>
  );
}
