using System.Text.Json.Serialization;

namespace dotAngLandLord.DomainObjects;

public class EstateFacility
{
    public int EstateId {get; set;}
    public int FacilityId {get; set;}
    public bool IsPresent {get; set;}

    [JsonIgnore]
    public Estate Estate {get; set;}

    public Facility Facility {get; set;}

    
}