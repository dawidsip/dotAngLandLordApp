namespace dotAngLandLord.DomainObjects;

public class Facility
{
    public int id { get; set; }
    public string Name { get; set; }
    public bool IsPresent { get; set; }
}

public class EstateFacility
{
    public int EstateId { get; set;}
    public int FacilityId { get; set;}
    public bool IsBasic { get; set; }
}