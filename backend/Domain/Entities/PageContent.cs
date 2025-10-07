
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Masal.Domain.Entities
{
    public class PageContent 
    {
        public int Id { get; set; }
        public int PageId { get; set; } // Fluent API ile UNIQUE olarak ayarlanmalı.
        public string TextContent { get; set; }
        public  Page Page { get; set; } = default!;
    }
}
