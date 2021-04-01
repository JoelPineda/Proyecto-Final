import Swal from "sweetalert2";
import SweetAlert from "sweetalert2-react";
import "animate.css/animate.min.css";
import "sweetalert2/dist/sweetalert2.css";

export const NumbersWithComma = (numberVal) => {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  return Number(numberVal).toLocaleString("en", options);
};

export const MessageResults = (status, error) => {
  Swal.fire({
    type: status === 200 || status === 201 ? "success" : "error",
    title:
      status === 200 || status === 201
        ? "Proceso realizado!"
        : "Proceso Fallido," + (error ?? "intente mas tarde!"),
    showConfirmButton: false,
    timer: 2000,
  });
};
export const ShowPopUp = (props) => {
  Swal.fire({
    title: "<strong>" + (props.titleName ?? "") + "</strong>",
    html: props.htmlBody ?? "<p></p>",
    showCloseButton: true,
    allowOutsideClick: false,
    showCancelButton: props.cancelBtn ?? true,
    onOpen: () => {
      if (props.EnabledDisabled !== undefined) {
        Swal.disableConfirmButton();
      } else {
        Swal.enableConfirmButton();
      }
    },
    showConfirmButton: props.isDisabled ?? false,
    focusConfirm: false,
    reverseButtons: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#dc3545",
    confirmButtonText:
      '<span class="white">' + (props.TextOk ?? "OK") + "</span>",
    confirmButtonAriaLabel: "Thumbs up, OK",
    cancelButtonText: '<span class="white">Cancelar</span>',
    cancelButtonAriaLabel: "Thumbs down",
  }).then((result) => {
    if (result.value) {
      props.handlerEvent !== undefined
        ? props.e !== undefined
          ? props.handlerEvent(props.e)
          : props.handlerEvent()
        : Swal.close();
    }
  });
};
export const ShowPopUpDataTable = (props) => {
  Swal.fire({
    title: "<strong>" + (props.titleName ?? "") + "</strong>",
    html: props.htmlBody ?? "<p></p>",
    showCloseButton: true,
    customClass: {
      container: 'showpopUp-datatable-container',
      popup: 'showpopUp-datatable-modal',
      content: 'showpopUp-datatable-content container text-left',
      // header: 'your-header-class',
      // title: 'your-title-class',
      // closeButton: 'your-close-button-class',
      // icon: 'your-icon-class',
      // image: 'your-image-class',
      // container: 'your-container-class',
      // input: 'your-input-class',
      // actions: 'your-actions-class',
      // confirmButton: 'your-confirm-button-class',
      // cancelButton: 'your-cancel-button-class',
      // footer: 'your-footer-class'
    },    
    allowOutsideClick: false,
    showCancelButton: props.cancelBtn ?? true,
    onOpen: () => {
      if (props.EnabledDisabled !== undefined) {
        Swal.disableConfirmButton();
      } else {
        Swal.enableConfirmButton();
      }
    },
    showConfirmButton: props.isDisabled ?? false,
    focusConfirm: false,
    reverseButtons: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#dc3545",
    confirmButtonText:
      '<span class="white">' + (props.TextOk ?? "OK") + "</span>",
    confirmButtonAriaLabel: "Thumbs up, OK",
    cancelButtonText: '<span class="white">Cancelar</span>',
    cancelButtonAriaLabel: "Thumbs down",
  }).then((result) => {
    if (result.value) {
      props.handlerEvent !== undefined
        ? props.e !== undefined
          ? props.handlerEvent(props.e)
          : props.handlerEvent()
        : Swal.close();
    }
  });
};
export const ShowAlertMessage = (textMessage, htmlBody, typeMessage) => {
  Swal.fire({
    type: typeMessage ?? "info",
    title: textMessage,
    html: htmlBody,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
};
export const ShowConfirmationMessage = (
  handlerEvent,
  withIcon,
  param = undefined
) => {
  Swal.fire({
    title: "Seguro?",
    text: "Desea continuar?",
    type: withIcon ?? "warning",
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value ?? false) {
      if (param !== undefined) {
        handlerEvent(param);
      } else {
        handlerEvent();
      }
    }
  });
};
export const ShowInfoMessage = (htmlBody) => {
  Swal.fire({
    position: "top-center",
    html: htmlBody,
    showConfirmButton: false,
    timer: 3000,
  });
};
export const GetImagePatch = (ulrPatch) => {
  let xhr = new XMLHttpRequest();
  let defaultUrl = "/images/yo.jpeg";
  xhr.open("HEAD", ulrPatch, false);
  xhr.send();

  if (xhr.status == "404") {
    return defaultUrl;
  } else {
    return ulrPatch;
  }
};

export const GetDateDiff = (first, second) => {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
};

export const GetdropDownListYesNo = (cssClass, selectedValue, dropName) => {
  let DefaultField = '<option value="0">--Seleccione--</option>';
  let dropDownList = [
    '<select class="form-control ' +
      cssClass +
      '" data-value="' +
      selectedValue +
      '" id="' +
      dropName +
      '">',
  ];
  let dropYesNo =
    DefaultField +
    '<option class="capitalized" value="Y">Si</option><option class="capitalized" value="N">No</option></select>';
  dropDownList.push(dropYesNo);

  return dropDownList.join("");
};
export const GetdropDownListYesNoClosed = (cssClass, selectedValue, dropName) => {
  let dropDownList = ['<select class="form-control ' +  cssClass + '" data-value="' + selectedValue +  '" id="' +  dropName + '">'];
  let noOpc = '<option class="capitalized" value="N">No</option>';
  let yesOpc = '<option class="capitalized" value="Y">Si</option>';
  let dropYesNo =  (selectedValue ==="N"?  noOpc + yesOpc: yesOpc + noOpc) + '</select>';
  dropDownList.push(dropYesNo);

  return dropDownList.join("");
};
export const GetdropDownListPositionMustFill = (cssClass, selectedValue, dropName)=>{
       let DefaultField = '<option value="0">--Seleccione--</option>';
       let dropDownList = ['<select class="form-control '+ cssClass +'" data-optional="'+ selectedValue +'" id="'+ dropName +'">'];
            dropDownList.push(DefaultField +'<option class="capitalized" value="DIRECTOR">Director</option>');
            dropDownList.push('<option class="capitalized" value="GERENTE">Gerente</option>');
            dropDownList.push('<option class="capitalized" value="SUPERVISOR">Supervisor</option>');
            dropDownList.push('<option class="capitalized" value="EMPLEADO">Empleado</option></select>'); 
             
       return dropDownList.join('');    
}
export const GetdropDownListEnabled = (cssClass, selectedValue, dropName)=>{
  let DefaultField = '<option value="0">--Seleccione--</option>';
  let dropDownList = [
    '<select class="form-control ' +
      cssClass +
      '" data-value="' +
      selectedValue +
      '" id="' +
      dropName +
      '">',
  ];
  let dropYesNo =
    DefaultField +
    '<option class="capitalized" value="N">Si</option><option class="capitalized" value="Y">No</option></select>';
  dropDownList.push(dropYesNo);

      return dropDownList.join('');
}
export const GetdropDownListEvaluationQuestion = (cssClass, selectedValue, dropName)=>{
  let dropDownList = ['<select class="form-control '+ cssClass +'" data-value="'+ selectedValue +'" id="'+ dropName +'">'];
  let yesNoOpc = '<option class="capitalized" value="SI_NO">Si / No</option>';
  let multp = '<option class="capitalized" value="MULTIPLE">Multiple</option>';
  let dropYesNo =  (selectedValue ==="SI_NO"?  yesNoOpc + multp: multp + yesNoOpc) + '</select>';
      dropDownList.push(dropYesNo);

      return dropDownList.join('');
}
export const GetGuiId = ()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export const  numberWithCommas = (strNumb) => {
  return strNumb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export const onlyUnique = (value, index, self)=> {
  return self.indexOf(value) === index;
}
export const onlyNumberFormmat = (evt) => {
  var keyCode = (evt.which) ? evt.which : evt.keyCode;
  if (keyCode > 31 && (keyCode < 48 || keyCode > 57))
      return false;
  return true;
};
export const getCurTimeAndAddtoDateStr = (dateStr)=>{
  if(dateStr.length !== 10){
    dateStr = new Date().toString("YYYY-MM-DD ");
  }else{
    let currentTime = new Date().toString().split(' ')[4];
    dateStr = dateStr + " " + currentTime;
  }
  return new Date(dateStr)
}
 
