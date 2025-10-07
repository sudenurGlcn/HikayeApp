using System.ComponentModel.DataAnnotations;

namespace Masal.Application.DTOs
{
    /// <summary>
    /// Bir çocuğun belirli bir kitaba başlaması için yapılan isteği temsil eder.
    /// </summary>
    public class StartReadingRequestDto
    {
        /// <summary>
        /// Kitaba başlayacak olan çocuğun kimlik numarası (ID).
        /// </summary>
        /// <example>12</example>
        [Required(ErrorMessage = "Çocuk ID'si boş olamaz.")]
        public int ChildId { get; set; }

        /// <summary>
        /// Başlanacak olan kitabın kimlik numarası (ID).
        /// </summary>
        /// <example>101</example>
        [Required(ErrorMessage = "Kitap ID'si boş olamaz.")]
        public int BookId { get; set; }
    }
}
