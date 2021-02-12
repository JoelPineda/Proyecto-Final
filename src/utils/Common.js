import $ from 'jquery';
import {ShowInfoMessage} from "../utils/CommonFunctions";

// return the user data from the session storage
export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
  }
  
  // return the token from the session storage
  export const getToken = () => {
    return sessionStorage.getItem('token') || null;
  }
  
  // remove the token and user from the session storage
  export const removeUserSession = () => {
       sessionStorage.clear();
       console.clear();
  }
  
  // set the token and user from the session storage
  export const setUserSession = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  export const getMenu = () => {
     let  menuList = [];
     menuList.push("<ul class='side-menu-ul'>");
     let  backendOpc = JSON.parse(JSON.parse(sessionStorage.getItem('user')).backendOptionMenu);
     let  backendPermission = JSON.parse(JSON.parse(sessionStorage.getItem('user')).backendPermission);
     let showAll = false;
     for (let idx = 0; idx < backendPermission.length; idx++) {
          const element = backendPermission[idx];
          backendOpc.forEach(item => {
            if(item.OptionMenuId = element.OptionMenuId && item.Name === 'Todas'){
              showAll = true;
              idx = backendPermission.length;
            }
          });
     }
     if(showAll){
        backendOpc.forEach(item => {
          if(item.Name !== 'Todas'){
            menuList.push("<li class='m0' data-item='"+ item.OptionMenuId +"'><a href='"+ item.Path.replace('administrator/','/')  +"'><i class='fa "+ item.Icon+ " '></i><span>&nbsp;&nbsp;"+ item.Name +"</span></a>"+ "</li>");
          }
        });
     }else{
      backendPermission.forEach(element => {
          backendOpc.forEach(item => {
            if(item.OptionMenuId = element.OptionMenuId && item.Name !== 'Todas'){
              menuList.push("<li class='m0' data-item='"+ item.OptionMenuId +"'><a href='"+ item.Path.replace('administrator/','/')  +"'><i class='fa "+ item.Icon+ " '></i><span>&nbsp;&nbsp;"+ item.Name +"</span></a>"+ "</li>");
            }
          });         
       });
 
   }
  
   menuList.push("<li><a href='/logout'><i class='fa fa-sign-out '></i><span>&nbsp;Cerrar</span></a></li></ul>");   
    return menuList.join('');

  }
  export const ShowMenu = () => {
    $("body").addClass(' is-menu-visible');
  }
 
 
  