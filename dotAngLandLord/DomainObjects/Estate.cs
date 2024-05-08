namespace dotAngLandLord.DomainObjects;

public class Estate
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public string Name { get; set; }
    public string City { get; set; }
    public string Region { get; set; }
    public string Country { get; set; }

    public string StreetName { get; set; }
    public string StreetNumber { get; set; }
    public string? FlatNumber { get; set; }
    public DateTime CreatedOn { get; set; }
}