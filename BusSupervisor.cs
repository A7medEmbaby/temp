using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class BusSupervisor
{
    public int BusSupervisorId { get; set; }

    public string NationalId { get; set; } = null!;

    public string? IdentificationNumber { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public int SchoolId { get; set; }

    public int? AddressId { get; set; }

    public int? UserId { get; set; }

    public virtual Address? Address { get; set; }

    public virtual School School { get; set; } = null!;

    public virtual User? User { get; set; }

    public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();

    public virtual ICollection<TripTemplate> TripTemplates { get; set; } = new List<TripTemplate>();
}