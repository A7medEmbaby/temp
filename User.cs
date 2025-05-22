using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiryTime { get; set; }

    //public int? SchoolId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastLogin { get; set; }

    public virtual Driver? Driver { get; set; }

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual Parent? Parent { get; set; }

    public virtual BusSupervisor? BusSupervisor { get; set; }

    public virtual School? School { get; set; }

    public virtual Models.Entities.ServiceProvider? ServiceProvider { get; set; }
}