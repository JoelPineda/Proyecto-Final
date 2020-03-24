import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../services/noticias-service/noticias.service';
import { Noticia } from '../models/noticia.models';
import { Router, Route } from '@angular/router';

@Component({
  selector: 'app-listado-noticias',
  templateUrl: './listado-noticias.page.html',
  styleUrls: ['./listado-noticias.page.scss'],
})
export class ListadoNoticiasPage implements OnInit {
  noticias: Noticia[];
  constructor(private noticiaServicio: NoticiasService, private route: Router) { }

  ngOnInit() {
    this.noticiaServicio.verNoticias().subscribe((noticias)=>{
      this.noticias = noticias;
    },(errorObtenido)=>{
      console.log(errorObtenido)
    })
  }


  eliminarNoticia(noticiaID: number, indice: number)
  {
      
    this.noticiaServicio.eliminarNoticia(noticiaID).subscribe(()=>{
      this.noticias.splice(indice,1)
    },
    error=>{
      console.log(error)
    }
    )
  }



  editar(noticia: Noticia)
  {
    this.route.navigate(['/agregar', {noticiaEditar: JSON.stringify( noticia)}])
  }
 
}
