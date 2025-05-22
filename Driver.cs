using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Driver
{
    public int DriverId { get; set; }

    public string NationalId { get; set; } = null!;

    public string? IdentificationNumber { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? LicenseNumber { get; set; }

    public DateTime? LicenseExpiryDate { get; set; }

    public int? ServiceProviderId { get; set; }

    public int? AssignedBusId { get; set; }

    public int? UserId { get; set; }

    public int? SchoolId { get; set; }

    public virtual Bus? AssignedBus { get; set; }

    public virtual ServiceProvider? ServiceProvider { get; set; }

    public virtual User? User { get; set; }

    public virtual School? School { get; set; }

    public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();

    public virtual ICollection<TripTemplate> TripTemplates { get; set; } = new List<TripTemplate>();
}