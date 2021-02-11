import { getUser, removeUserSession } from "../../utils/Common"; 
import API from "../../utils/api";

export const GetMenuList = ()=>{
    const [menuList, setMenuList] = useState([]);
    const GetMenu = ()=>{
      if(sessionStorage.getItem('BackendUser') === null){
          API.getData("/BackendUser/GetbyUser?user=pchevalier")
          .then((res) => {
            if (res.status === 200) { 
                sessionStorage.setItem('BackendUser', btoa(JSON.stringify({res.data})));     
            }
          })
          .catch(function (err) {
            console.error("Error de conexion " + err);
          }); 
    
      }
       
      return  JSON.parse(atob(sessionStorage.getItem('BackendUser'))); 

    }
 
}