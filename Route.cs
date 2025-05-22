using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Route
{
    public int RouteId { get; set; }

    public int SchoolId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string Direction { get; set; } = null!; // ToSchool or FromSchool

    public int? EstimatedDuration { get; set; }

    public int? TotalStops { get; set; }

    public bool ActiveStatus { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? StartPoint { get; set; }

    public int? EndPoint { get; set; }

    public virtual School School { get; set; } = null!;

    public virtual Address? StartPointNavigation { get; set; }

    public virtual Address? EndPointNavigation { get; set; }

    public virtual ICollection<RouteStop> RouteStops { get; set; } = new List<RouteStop>();

    public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();

    public virtual ICollection<TripTemplate> TripTemplates { get; set; } = new List<TripTemplate>();

    public virtual ICollection<StudentRouteAssignment> StudentRouteAssignments { get; set; } = new List<StudentRouteAssignment>();
}