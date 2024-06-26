using Newtonsoft.Json;

namespace dotAngLandLord.DomainObjects;

public class Estate
{
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("userId")]
    public string UserId { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("city")]
    public string City { get; set; }

    [JsonProperty("region")]
    public string Region { get; set; }

    [JsonProperty("country")]
    public string Country { get; set; }

    [JsonProperty("streetName")]

    public string StreetName { get; set; }

    [JsonProperty("streetNumber")]
    public string StreetNumber { get; set; }

    [JsonProperty("flatNumber")]
    public string? FlatNumber { get; set; }

    [JsonProperty("createdOn")]
    public DateTime CreatedOn { get; set; } = DateTime.Now;


    [JsonProperty("images")]
    public ICollection<Image> Images { get; set; } = new List<Image>();
    
    [JsonIgnore]
    [JsonProperty("estateFacilities")]
    public ICollection<EstateFacility> EstateFacilities { get; set; } = new List<EstateFacility>();
}