import React, { useState } from "react";
import API from "../../utils/api";
import Button from "../../components/Button/Button";
import BackButton from "../../components/Button/BackButton";
import {
  ShowAlertMessage,
} from "../../utils/CommonFunctions";
import { getUser } from "../../utils/Common";

export default function ChangePassword(props) {
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

  const [loading, setLoading] = useState(false);
  const currentPassword = useFormInput("");
  const newPassword = useFormInput("");
  const confirmPassword = useFormInput("");

  const change = () => {
    //setError(null);
    //setLoading(true);
    if (currentPassword.value === "") {
      ShowAlertMessage(
        "¡Mensaje de aviso!",
        " <p>La contraseña anterior no puede estar en blanco</p>"
      );
    }
    if (
      newPassword.value === confirmPassword.value &&
      newPassword.value !== "" &&
      confirmPassword.value !== ""
    ) {
      API.putData("User/change", {
        id: 0,
        employeeIdCard: getUser().EmployeeIdCard,
        password: currentPassword.value.toString(),
        changePassword: newPassword.value.toString(),
      })
        .then((response) => {
          // setLoading(false);
        })
        .catch((error) => {
          ShowAlertMessage(
            "¡Mensaje de aviso!",
            " <p>Contraseña actual no coincide</p>"
          );
          console.log(error);
        });
    } else {
      ShowAlertMessage(
        "¡Mensaje de aviso!",
        " <p>Contraseña no coincide por favor verificar la nueva contraseña</p>"
      );
    }
  };

  return (
    <section id="main" className="wrapper">
      <div className="inner">
        <BackButton To="/perfil" />
        <br />
        <br />

        <section>
          <center>
            <div id="myform" className="form_container">
              <div className="form_group">
                <label className="classspan text-left">Contraseña actual</label>

                <input
                  type="password"
                  className="txtbox"
                  {...currentPassword}
                />
              </div>
              <div className="form_group">
                <label className="classspan text-left">Nueva Contraseña</label>
                <input type="password" className="txtbox" {...newPassword} />
              </div>
              <div className="form_group">
                <label className="classspan text-left">
                  Confirme Contraseña
                </label>
                <input
                  type="password"
                  className="txtbox"
                  {...confirmPassword}
                />
              </div>

              <br />
              <Button
                type="btn-outline-danger"
                text="CAMBIAR CONTRASEÑA"
                clickHandler={change}
              />
            </div>
          </center>
        </section>
      </div>
    </section>
  );
}
