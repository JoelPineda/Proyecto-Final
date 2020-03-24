using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Collections.Generic;


namespace NoticiasWebApi.Models
{
    public class Autor
    {
        public int AutorID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
       // public List<Noticia> Noticias { get; set; }

        public class Map
        {
            public Map(EntityTypeBuilder<Autor> ebAutor)
            {
                ebAutor.HasKey(x => x.AutorID);
                ebAutor.Property(x => x.Nombre).HasColumnName("Nombre").HasMaxLength(50);
                ebAutor.Property(x => x.Apellido).HasColumnName("Apellido").HasMaxLength(50);
            }
        }
    }
}
