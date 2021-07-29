using AutoMapper;

using Platform8.Expenses.Data;
using Platform8.Expenses.Models;

namespace Platform8.Expenses.Commands {
  public class MappingProfile : Profile {
    public MappingProfile() {

      CreateMap<Data.Expense, Models.Expense>();

    }
  }
}
