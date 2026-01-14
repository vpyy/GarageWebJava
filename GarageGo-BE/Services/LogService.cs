using GarageGo_BE.Models;
namespace GarageGo_BE.Services
{
    public class LogService : ILogService
    {
        private readonly ILogger<LogService> _logger;

        public LogService(ILogger<LogService> logger)
        {
            _logger = logger;
        }

        public void LogInfo(string message)
        {
            _logger.LogInformation($"[INFO] {DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
        }

        public void LogError(string message, Exception? ex = null)
        {
            if (ex != null)
            {
                _logger.LogError(ex, $"[ERROR] {DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
            }
            else
            {
                _logger.LogError($"[ERROR] {DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
            }
        }

        public void LogWarning(string message)
        {
            _logger.LogWarning($"[WARNING] {DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
        }
    }
}
