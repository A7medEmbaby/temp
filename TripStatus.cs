using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class TripStatus
{
    public int StatusId { get; set; }

    public int TripId { get; set; }

    public int? CurrentStopId { get; set; }

    public decimal? CurrentLatitude { get; set; }

    public decimal? CurrentLongitude { get; set; }

    public string Status { get; set; } = null!; // NotStarted, Started, AtStop, BetweenStops, Completed

    public DateTime Timestamp { get; set; }

    public string? Notes { get; set; }

    public virtual Trip Trip { get; set; } = null!;

    public virtual RouteStop? CurrentStop { get; set; }
}