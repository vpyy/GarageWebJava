namespace GarageGo_BE.Services
{
    public interface ILogService
    {
        void LogInfo(string message);
        void LogError(string message, Exception? ex = null);
        void LogWarning(string message);
    }
}
