using System.ComponentModel.DataAnnotations.Schema;
using dotAngLandLord.DomainObjects;
using Newtonsoft.Json;

namespace dotAngLandLord.DomainObjects;
public class Image
{
    [JsonProperty("id")]
    public int Id { get; set;}

    [JsonProperty("estateId")]
    public int EstateId { get; set;}
    
    [JsonProperty("fileName")]
    public string FileName { get; set;}

    [JsonProperty("isMain")]

    public bool IsMain { get; set;}

    [JsonProperty("data")]
    [NotMapped]

    public byte[] Data { get; set;}

    // public Estate Estate { get; set;}
}