using AutoMapper;

namespace Platform8.Expenses.Commands {
  public class MappingProfile : Profile {
    public MappingProfile() {

      CreateMap<Data.Expense, Models.Expense>();

    }
  }
}
