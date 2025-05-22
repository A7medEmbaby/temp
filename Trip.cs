using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Trip
{
    public int TripId { get; set; }

    public int? TemplateId { get; set; }

    public int RouteId { get; set; }

    public int BusId { get; set; }

    public int DriverId { get; set; }

    public int SupervisorId { get; set; }

    public DateTime TripDate { get; set; }

    public DateTime ScheduledStartTime { get; set; }

    public DateTime? ScheduledEndTime { get; set; }

    public DateTime? ActualStartTime { get; set; }

    public DateTime? ActualEndTime { get; set; }

    public string Status { get; set; } = "Scheduled"; // Scheduled, InProgress, Completed, Cancelled

    public string? CancellationReason { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual TripTemplate? Template { get; set; }

    public virtual Route Route { get; set; } = null!;

    public virtual Bus Bus { get; set; } = null!;

    public virtual Driver Driver { get; set; } = null!;

    public virtual BusSupervisor BusSupervisor { get; set; } = null!;

    public virtual ICollection<TripStatus> TripStatuses { get; set; } = new List<TripStatus>();

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<LocationUpdate> LocationUpdates { get; set; } = new List<LocationUpdate>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}