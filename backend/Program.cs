using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors.Infrastructure;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

            var app = builder.Build();
            app.UseCors("AllowAll");
            app.UseHttpsRedirection();

            var tasks = new List<TaskItem>();

            app.MapGet("/api/tasks", () => Results.Ok(tasks));

            app.MapPost("/api/tasks", ([FromBody] TaskItem newTask) =>
            {
                newTask.Id = Guid.NewGuid();
                tasks.Add(newTask);
                return Results.Created($"/api/tasks/{newTask.Id}", newTask);
            });

            app.MapPut("/api/tasks/{id}", (Guid id, [FromBody] TaskItem updatedTask) =>
            {
                var task = tasks.FirstOrDefault(t => t.Id == id);
                if (task is null)
                    return Results.NotFound();

                task.Description = updatedTask.Description;
                task.IsCompleted = updatedTask.IsCompleted;
                return Results.Ok(task);
            });

            app.MapDelete("/api/tasks/{id}", (Guid id) =>
            {
                var task = tasks.FirstOrDefault(t => t.Id == id);
                if (task is null)
                    return Results.NotFound();

                tasks.Remove(task);
                return Results.NoContent();
            });

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