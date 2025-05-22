using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Bus
{
    public int BusId { get; set; }

    public string BusNumber { get; set; } = null!;

    public string? LicensePlate { get; set; }

    public string? Manufacturer { get; set; }

    public int? Capacity { get; set; }

    public int? ModelYear { get; set; }

    public int? SchoolId { get; set; }

    public int? ServiceProviderId { get; set; }

    public string? Status { get; set; }

    public string? BusType { get; set; }

    public virtual School? School { get; set; }

    public virtual ServiceProvider? ServiceProvider { get; set; }

    public virtual ICollection<Driver> Drivers { get; set; } = new List<Driver>();

    public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();

    public virtual ICollection<TripTemplate> TripTemplates { get; set; } = new List<TripTemplate>();
}