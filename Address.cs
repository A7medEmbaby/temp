using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Address
{
    public int AddressId { get; set; }

    public string? NationalAddress { get; set; }

    public string? Country { get; set; }
  
    public string? City { get; set; }

    public string? District { get; set; }

    public string? State { get; set; }

    public string? Street { get; set; }

    public string? PostalCode { get; set; }

    public string? PropertyType { get; set; }

    public string? OwnershipType { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public virtual ICollection<Parent> Parents { get; set; } = new List<Parent>();

    public virtual ICollection<BusSupervisor> BusSupervisors { get; set; } = new List<BusSupervisor>();

    public virtual ICollection<Route> RouteEndPointNavigations { get; set; } = new List<Route>();

    public virtual ICollection<Route> RouteStartPointNavigations { get; set; } = new List<Route>();

    public virtual ICollection<RouteStop> RouteStops { get; set; } = new List<RouteStop>();

    public virtual ICollection<School> Schools { get; set; } = new List<School>();

    public virtual ICollection<ServiceProvider> ServiceProviders { get; set; } = new List<ServiceProvider>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
