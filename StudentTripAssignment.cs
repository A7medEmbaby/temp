namespace RihlaAPI.Models.Entities
{
    public class StudentTripStatus
    {
        public int StudentId { get; set; }

        public int TripId { get; set; }

        public bool? IsParent { get; set; } = true;

        public DateTime? ConfirmedAt { get; set; }

        public virtual Student Student { get; set; } = null!;

        public virtual Trip Trip { get; set; } = null!;

    }
}
