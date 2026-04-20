using CRM.Worker;
using CRM.Worker.services;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();
builder.Services.AddSingleton<CermService>();
builder.Services.AddSingleton<CrmService>();
builder.Services.AddSingleton<SyncService>();
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
