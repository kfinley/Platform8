using System;

namespace Platform8.Core.Data {
  public interface IEntity {
    Guid Id { get; set; }
    EntityStatus Status { get; set; }
    DateTime DateCreated { get; set; }
  }
}
