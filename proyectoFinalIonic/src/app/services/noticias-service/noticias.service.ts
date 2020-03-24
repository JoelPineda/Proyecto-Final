import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Noticia } from 'src/app/models/noticia.models';
import { Autor } from 'src/app/models/autor.models';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  constructor(public http: HttpClient) { }


  verNoticias() : Observable<Noticia[]> {
    return this.http.get<Noticia[]>("http://joelbeltre-001-site1.etempurl.com/api/noticias/vernoticias");
  }

  porNoticiaID(noticiaID: number) : Observable<Noticia>{
    return this.http.get<Noticia>("http://joelbeltre-001-site1.etempurl.com/api/noticias/PorNoticiaID/" + noticiaID)
  }


  eliminarNoticia(noticiaID: number): Observable<boolean>
  {
    return this.http.get<boolean>("http://joelbeltre-001-site1.etempurl.com/api/noticias/eliminar/" + noticiaID)
  }


  listadoDeAutores(): Observable<Autor[]>
  {
    return this.http.get<Autor[]>("http://joelbeltre-001-site1.etempurl.com/api/noticias/listadoAutores/")
  }


  agregarNoticia(noticia: Noticia): Observable<boolean>
  {
    return this.http.post<boolean>("http://joelbeltre-001-site1.etempurl.com/api/noticias/agregar",noticia)
  }


  editarNoticia(noticia: Noticia): Observable<boolean>
  {
    return this.http.put<boolean>("http://joelbeltre-001-site1.etempurl.com/api/noticias/Editar",noticia)
  }
}
