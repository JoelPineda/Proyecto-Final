import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiasService } from '../services/noticias-service/noticias.service';
import { Noticia } from '../models/noticia.models';

@Component({
  selector: 'app-noticia-detalle',
  templateUrl: './noticia-detalle.page.html',
  styleUrls: ['./noticia-detalle.page.scss'],
})
export class NoticiaDetallePage implements OnInit {
  noticia: Noticia;
  cargo: boolean = false;
  constructor(private router: ActivatedRoute, private NoticiaServicio: NoticiasService) { }

  ngOnInit() {
    this.router.params.subscribe((id)=>{
      console.log(id)
      this.NoticiaServicio.porNoticiaID(id.noticiaID).subscribe((noticia)=>{

   
          this.noticia = noticia;
          this.cargo = true;
     
       
        console.log(noticia)
      })


    })
  }

}
