using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class LocationUpdate
{
    public int UpdateId { get; set; }

    public int TripId { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public decimal? Speed { get; set; }

    public int? Heading { get; set; }

    public DateTime Timestamp { get; set; }

    public int? BatteryLevel { get; set; }

    public decimal? Accuracy { get; set; }

    public virtual Trip Trip { get; set; } = null!;
}