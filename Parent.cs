using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Parent
{
    public string NationalId { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? IdentificationNumber { get; set; }

    public string? PhoneNumber { get; set; }

    public int? AddressId { get; set; }

    public int? UserId { get; set; }

    public virtual Address? Address { get; set; }

    public virtual User? User { get; set; }

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}