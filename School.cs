using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class School
{
    public int SchoolId { get; set; }

    public int? UserId { get; set; }

    //public string SchoolNumber { get; set; } = null!;

    public string? IdentificationNumber { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Email { get; set; }

    public string? SchoolGender { get; set; }

    public string? SchoolType { get; set; }

    public string? EducationLevel { get; set; }

    public int? AddressId { get; set; }

    public string? ContactNumber { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<Bus> Buses { get; set; } = new List<Bus>();

    public virtual ICollection<Route> Routes { get; set; } = new List<Route>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<Driver> Drivers { get; set; } = new List<Driver>();

    public virtual ICollection<BusSupervisor> BusSupervisors { get; set; } = new List<BusSupervisor>();

    public virtual User? User { get; set; }
}
