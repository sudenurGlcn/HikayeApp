using System.Net;

namespace Masal.Application.Exceptions
{
    /// <summary>
    /// 400 - Bad Request durumunu temsil eden özel exception.
    /// Kullanıcıdan gelen geçersiz girişleri veya iş kuralı ihlallerini ifade etmek için kullanılır.
    /// </summary>
    public class BadRequestException : Exception
    {
        /// <summary>
        /// HTTP durum kodu. Varsayılan olarak 400.
        /// </summary>
        public HttpStatusCode StatusCode { get; } = HttpStatusCode.BadRequest;

        /// <summary>
        /// Hata mesajı ile yeni bir BadRequestException oluşturur.
        /// </summary>
        /// <param name="message">Hata mesajı.</param>
        public BadRequestException(string message) : base(message)
        {
        }

        /// <summary>
        /// Hata mesajı ve iç hata ile yeni bir BadRequestException oluşturur.
        /// </summary>
        /// <param name="message">Hata mesajı.</param>
        /// <param name="innerException">İç hata.</param>
        public BadRequestException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
