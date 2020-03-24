using Microsoft.EntityFrameworkCore;
using NoticiasWebApi.Models;

namespace NoticiasWebApi
{
    public class NoticiasDBContext : DbContext
    {
        public NoticiasDBContext(DbContextOptions opciones): base(opciones)
        {
            
        }
         
        public virtual DbSet<Noticia> Noticia { get; set; }
        public virtual DbSet<Autor> Autor { get; set;}
        public virtual DbSet<Nombres> Nombres { get; set; }


        protected override void OnModelCreating(ModelBuilder modelB)
        {
            new Noticia.Map(modelB.Entity<Noticia>());
            new Autor.Map(modelB.Entity<Autor>());
            base.OnModelCreating(modelB);
        }
    }
}
