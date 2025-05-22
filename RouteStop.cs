using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class RouteStop
{
    public int RouteStopId { get; set; }

    public int RouteId { get; set; }

    public string StopName { get; set; } = null!;

    public int? AddressId { get; set; }

    public int SequenceNumber { get; set; }

    public TimeSpan? ScheduledTime { get; set; }

    public int? EstimatedWaitingTime { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Route Route { get; set; } = null!;

    public virtual Address? Address { get; set; }

    public virtual ICollection<Attendance> PickupAttendances { get; set; } = new List<Attendance>();

    public virtual ICollection<Attendance> DropoffAttendances { get; set; } = new List<Attendance>();

    public virtual ICollection<TripStatus> TripStatuses { get; set; } = new List<TripStatus>();

    public virtual ICollection<StudentRouteAssignment> PickupStudentRouteAssignments { get; set; } = new List<StudentRouteAssignment>();

    public virtual ICollection<StudentRouteAssignment> DropoffStudentRouteAssignments { get; set; } = new List<StudentRouteAssignment>();
}