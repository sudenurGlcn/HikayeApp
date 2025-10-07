using System.Net;

namespace Masal.Application.Exceptions
{
    public class UnauthorizedException : Exception
    {
        public HttpStatusCode StatusCode { get; } = HttpStatusCode.Unauthorized;

        public UnauthorizedException(string message)
            : base(message)
        {
        }

        public UnauthorizedException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
