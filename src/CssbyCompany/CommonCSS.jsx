import { getUser } from "../utils/Common";
import API from "../utils/api";

export async function SetCssByCompany() {
  await API.getData("/Company/get?companyId=" + getUser().companyId)
    .then((res) => {
      if (res.status === 200) {
        if (res.data.length) {
    
          sessionStorage.setItem("cssByCompany", JSON.stringify(res.data));
          sessionStorage.setItem("configBaseURL", btoa(res.config.baseURL));
        }
      }
    })
    .catch(function (err) {
      console.error("Error de conexion " + err);
    });
}
export const GetCssByCompany = () => {
  let Css = { logo: "empty.png", PrimaryColor: "", AccentColor: "", name: "", CompanyLogoWithTitle: "", emailSupport: "" };
  let obj = JSON.parse(sessionStorage.getItem("cssByCompany"));

  if (obj !== null && obj.length > 0) {
    Css.logo = obj[0].logo ?? "";
    Css.CompanyLogoWithTitle = obj[0].companyLogoWithTitle ?? "";
    Css.PrimaryColor += obj[0].primaryColor ?? "#ed1c24";
    Css.AccentColor += obj[0].accentColor ?? "transparent";
    Css.name += Css.name + (obj[0].name ?? "");
    Css.emailSupport += Css.emailSupport + (obj[0].emailSupport ?? "");
  }

  return Css;
};

export const ChangeEnterBackground = (e) => {
  e.target.style.background =
    GetCssByCompany().AccentColor === "transparent"
      ? e.target.style.background
      : GetCssByCompany().AccentColor;
};
export const ChangeLeaveBackground = (e) => {
  e.target.style.background =
    GetCssByCompany().PrimaryColor === "transparent"
      ? e.target.style.background
      : GetCssByCompany().PrimaryColor;
};
/*Para usarlo: en los controles onMouseEnter={ChangeEnterBackground} onMouseLeave={ChangeLeaveBackground} */
