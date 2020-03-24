import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listado-noticias',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { 
    path: 'listado-noticias', 
    loadChildren: './listado-noticias/listado-noticias.module#ListadoNoticiasPageModule'
   },
  { path: 'noticia-detalle/:noticiaID', loadChildren: './noticia-detalle/noticia-detalle.module#NoticiaDetallePageModule' },
  { path: 'agregar', loadChildren: './agregar/agregar.module#AgregarPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
