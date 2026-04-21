using CRM.Worker;
using CRM.Worker.services;
using CRM.Worker.workers;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddSingleton<CermService>();
builder.Services.AddSingleton<CrmService>();
builder.Services.AddSingleton<SyncService>();

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
