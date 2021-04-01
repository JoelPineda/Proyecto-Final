import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { getToken, setUserSession } from "../../utils/Common";

export default function Login(props) {
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    API.postData("AuthBackend/LoginBackend", {
      username: username.value,
      password: password.value,
    })
      .then((response) => {
        setLoading(false);
        setUserSession(response.data.token, response.data.user);
        sessionStorage.setItem("configBaseURL", btoa(response.config.baseURL));
        window.location.reload(false);

      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        if(error.response === undefined){
          setError("Error: Error de Conexión");
        }else{
          if (error.response.status === 401){
            setError('¡Verifique usuario y/o contraseña!');
            document.getElementById("tbUser").focus();
          } 
          else setError("Error: " + error.message);
        }

      });
  };

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
  const username = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  return (
    <div className="login_container black-background">
			<img src="/images/dc.png"  className="img-responsive login-image d-flex align-items-center justify-content-center"  alt="Logo" />    
      <strong><h4 className="text-center bold-font white">Administración Plataforma</h4></strong>
      <div id="myform" className="form_container">
        <hr />
        <div className="form_group">
          <label className="classspan white">Usuario</label>

          <input
            id="tbUser"
            type="text"
            {...username}
            className="txtbox"
            placeholder="ejemplo: admin"
          />
        </div>
        <div className="form_group">
          <label className="classspan white">Contraseña</label>
          <input
            type="password"
            {...password}
            className="txtbox"
            placeholder="********"
          />
        </div>
        {error && (
          <>
            <small style={{ color: "red" }}>{error}</small>
            <br />
          </>
        )}
        <br />
        <div className="form_group">
          <button
            type="button"
            className="mybt btn btn-outline-danger text-wrap"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Cargando..." : "ENTRAR"}
          </button>
        </div>
        <div className="">
          <hr />
        </div>
      </div>

   
    </div>
  );
}
