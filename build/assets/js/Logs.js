
logOnload = () =>{  
    $('.most-visited-log').click((event)=>{
        SaveLog(event);
    })
}
var SaveLog = (e) => {
  if(sessionStorage.getItem("configBaseURL") !== null){  
        let url = atob(sessionStorage.getItem("configBaseURL"));
        let prefix = (e.currentTarget.attributes.getNamedItem('data-prefix')!== null ? e.currentTarget.attributes.getNamedItem('data-prefix').value: '');
        let postfix = (e.currentTarget.pathname ?? '');
        prefix = (prefix ===''? postfix.replace('/','') : prefix + postfix);
        if(sessionStorage.getItem("user") !== null){
            let dataResult =  JSON.parse(sessionStorage.getItem("user"));
            CallAjaxFn(url + "MostVisited/add", JSON.stringify({   employeeNumber: dataResult.employeeNumber,
                            companyId:  dataResult.companyId,
                            path: prefix 
                        }), "json", (data) => {}, "POST", true);
    
        }
    }

 }
var CallAjaxFn = function (vUrl, vParameter, vDataType, vSucess, RequestType, isAsync) {
    $.ajax({
        type: RequestType,
        url: vUrl,
        dataType: vDataType,
        data: vParameter !== undefined ? vParameter : {},
        contentType: "application/json; charset=utf-8",
        success: vSucess,
        async: isAsync !== undefined ? isAsync : true,
        error:  (data)=> {
            if (data.status === 0) {
                console.log("Se ha perdido la conexión con el servidor");
                return false;
            }
            if (data.status !== 200) {
                console.log(vParameter !== undefined ? {"Param": vParameter, "Url": vUrl }: {});
                if (data !== undefined && data.responseXML !== undefined){
                    console.log("<span>" + vUrl + "</span>" + data.responseXML);
                }else{
                    console.log("<span>" + vUrl + "</span>" + data.responseText);
                }
                   
            }
        }
    });
};