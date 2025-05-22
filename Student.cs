using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Student
{
    public int StudentId { get; set; }

    public string? NationalId { get; set; }

    public string? IdentificationNumber { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Gender { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? GradeLevel { get; set; }

    public string? Section { get; set; }

    public int? SchoolId { get; set; }

    public int? AddressId { get; set; }

    public string? ParentNationalId { get; set; }

    public virtual School? School { get; set; }

    public virtual Address? Address { get; set; }

    public virtual Parent? ParentNational { get; set; }

    public virtual ICollection<EmergencyContact> EmergencyContacts { get; set; } = new List<EmergencyContact>();

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<StudentRouteAssignment> StudentRouteAssignments { get; set; } = new List<StudentRouteAssignment>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}