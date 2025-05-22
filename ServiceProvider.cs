using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class ServiceProvider
{
    public int ServiceProviderId { get; set; }

    public int? UserId { get; set; }

    public string Name { get; set; } = null!;

    public string? IdentificationNumber { get; set; }

    public string? ContactInfo { get; set; }

    public int? AddressId { get; set; }

    public User? User { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<Bus> Buses { get; set; } = new List<Bus>();

    public virtual ICollection<Driver> Drivers { get; set; } = new List<Driver>();
}
