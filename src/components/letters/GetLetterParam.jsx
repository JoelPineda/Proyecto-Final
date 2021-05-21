import react from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { getUser } from "../../utils/Common";
import { NumbersWithComma } from "../../utils/CommonFunctions";
import Moment from "moment";
import es from "date-fns/locale/es";
import "moment/locale/es";
import { GetCssByCompany } from "../../CssbyCompany/CommonCSS";
import { GetImagePatch } from "../../utils/CommonFunctions";

registerLocale("es", es);

export const GetLetterParam = (employee) => {
  let addressFooter = [];
  //TODO: Create new table to store this information.
  addressFooter.push({
    company_id: "04",
    companyName: "Alambres y Cables",
    address: "Calle F, Santo Domingo",
    companyLogo: "logo_dc.png",
    phones: "Tel.809-537-2977",
    email: "rossy.padilla@corripio.com.do",
    sello: 'hidden="true"',
    firma: "firma_isis_abreu.png",
    rnc: "",
  });
  addressFooter.push({
    company_id: "39",
    companyName: "Grupo Corvi S.A.S",
    companyLogo: "logo_dc.png",
    address: "Autopista Duarte Km. 24, Santo Domingo, Rep. Dom.",
    phones: "Tel.809-331-0771 y 1-809-200-8113",
    email: "corvi@corripio.com.do",
    sello: 'hidden="true"',
    firma: "firma_isis_abreu.png",
    rnc: "",
  });
  addressFooter.push({
    company_id: "01",
    companyName: "DISTRIBUIDORA CORRIPIO, S.A.S.",
    companyLogo: "logo_dc.png",
    address:
      "Núñez de Cáceres esq. calle 1era. San Gerónimo, Santo Domingo, Rep.Dom.",
    phones: "Tel.809 227 3000",
    email: "www.distribuidoracorripio.com.do",
    sello: "",
    firma: "firma_isis_abreu.png",
    rnc: "| RNC: 101003693",
  });

  let signData = [];
  if (sessionStorage.getItem("signData") !== null) {
    signData = JSON.parse(sessionStorage.getItem("signData"));
  }
  var addressFooterData = addressFooter.find(
    (x) => x.company_id == employee.companyId
  );
  return {
    rnc: addressFooterData.rnc,
    sello: addressFooterData.sello,
    companyName: addressFooterData.companyName,
    address: addressFooterData.address,
    phones: addressFooterData.phones,
    email: addressFooterData.email,
    companyLogo: GetImagePatch("/images/" + addressFooterData.companyLogo),
    header_date:
      Moment(Date.now())
        .format("LL")
        .substring(0, Moment(Date.now()).format("LL").length - 8) +
      ", " +
      Moment(Date.now()).format("YYYY"),
    employee_id_card: employee.employeeIdCard,
    employeeNumber: employee.employeeNumber,
    employee_name:
      (employee.firstName.toUpperCase().trim() ?? "") +
      " " +
      (employee.lastName.toUpperCase().trim() ?? ""),
    hiring_date:
      Moment(new Date(employee.hiringDate.toString()))
        .format("LL")
        .substring(
          0,
          Moment(new Date(employee.hiringDate.toString())).format("LL").length -
            8
        ) +
        " del " +
        Moment(new Date(employee.hiringDate.toString())).format("YYYY") ?? "",
    date:
      Moment(Date.now()).format("DD") +
      " días " +
      Moment(Date.now())
        .format("LL")
        .substring(3, Moment(Date.now()).format("LL").length - 8) +
      " del año " +
      Moment(Date.now()).format("YYYY"),
    prefix:
      employee.gender.toUpperCase().trim() === "M"
        ? " el Sr."
        : " la Sra. " ?? "",
    position_name: employee.positionName.toUpperCase().trim() ?? "",
    responsable_name: signData.staffLetterSignName ?? "",
    responsable_position: signData.employeePosition ?? "",
    urlImageSigned: GetImagePatch("/images/" + addressFooterData.firma),
    salary_frequency: "",
    salary: NumbersWithComma(
      parseInt(36000) > 1 ? employee.annualSalary : employee.salary
    ),
    bankName: "BANCO POPULAR",
    consulateName: "EMBAJADA DE LOS ESTADOS UNIDOS",
    OtherEntityName: "INFOTE",
    LetterToDisplay: "NI IDEA",
    cardTypeId: parseInt(sessionStorage.getItem("CardTypeValue") ?? 0),
    salaryFrequencyId: parseInt(sessionStorage.getItem("SalaryValue") ?? 0),
    statusCardId: 1 /*Pendiente*/,
    consulateId: parseInt(sessionStorage.getItem("ConsulateValue") ?? 0),
    bankId: parseInt(sessionStorage.getItem("BankValue") ?? 0),
    companyId: employee.companyId,
  };
};
