using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class EmergencyContact
{
    public int EmergencyContactId { get; set; }

    public int? StudentId { get; set; }

    public string Name { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string? Relationship { get; set; }

    public virtual Student? Student { get; set; }
}
