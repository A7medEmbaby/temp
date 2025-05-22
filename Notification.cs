using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int? TripId { get; set; }

    public int? StudentId { get; set; }

    public string? ParentId { get; set; }

    public string NotificationType { get; set; } = null!; // Boarding, Arrival, Delay, Absence

    public string Message { get; set; } = null!;

    public string Status { get; set; } = "Sent"; // Sent, Delivered, Read

    public DateTime SentDateTime { get; set; }

    public DateTime? DeliveredAt { get; set; }

    public DateTime? ReadAt { get; set; }

    public int? UserId { get; set; }

    public virtual Trip? Trip { get; set; }

    public virtual Student? Student { get; set; }

    public virtual Parent? Parent { get; set; }

    public virtual User? User { get; set; }
}