using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
  public record RegisterDto(string UserName, string Password);
  public record LoginDto(string UserName, string Password);
}
