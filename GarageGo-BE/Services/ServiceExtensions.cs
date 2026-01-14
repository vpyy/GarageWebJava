using System.Text.Json;

namespace GarageGo_BE.Services
{
    public static class ServiceExtensions
    {
        public static JsonSerializerOptions GetJsonOptions()
        {
            return new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
        }

        public static async Task<T?> DeserializeResponse<T>(this HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
                return default;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(content, GetJsonOptions());
        }

        public static bool IsSuccessful(this HttpResponseMessage response)
        {
            return response.IsSuccessStatusCode;
        }
    }
}
