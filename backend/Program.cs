using Microsoft.AspNetCore.Mvc;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.UseHttpsRedirection();

            var tasks = new List<TaskItem>();

            // GET all tasks
            app.MapGet("/api/tasks", () => Results.Ok(tasks));

            app.Run();
        }
    }

    public class TaskItem
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
    }
}