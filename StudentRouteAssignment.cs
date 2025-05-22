using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class StudentRouteAssignment
{
    public int AssignmentId { get; set; }

    public int StudentId { get; set; }

    public int RouteId { get; set; }

    public int? PickupStopId { get; set; }

    public int? DropoffStopId { get; set; }

    public bool ActiveStatus { get; set; } = true;

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual Route Route { get; set; } = null!;

    public virtual RouteStop? PickupStop { get; set; }

    public virtual RouteStop? DropoffStop { get; set; }
}