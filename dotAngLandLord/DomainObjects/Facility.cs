using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace dotAngLandLord.DomainObjects;

public class Facility
{
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [NotMapped]
    // [System.Text.Json.Serialization.JsonIgnore]
    [JsonProperty("isPresent")]
    public bool IsPresent { get; set; }
    
    [JsonProperty("isBasic")]
    public bool IsBasic { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public ICollection<EstateFacility> EstateFacilities {get; set;}
}