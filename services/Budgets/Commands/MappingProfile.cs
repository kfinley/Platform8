using AutoMapper;
using Platform8.Budgets.Data;
using Platform8.Budgets.Models;

namespace Platform8.Budgets.Commands {
  public class MappingProfile : Profile {
    public MappingProfile() {

      CreateMap<Data.Budget, Models.Budget>();

      CreateMap<Data.Category, Models.Category>()
        .ForMember(c => c.Budget,
          opt => opt.MapFrom(c => new Models.Budget {
            Id = c.Budget.Id
          }));
    }
  }
}
