/**
 * TracingModule has been removed.
 *
 * The duplicate TracingService that lived here (issue #827) has been deleted.
 * initTracing() is called once in main.ts before NestFactory.create(), which is
 * the correct and only place for OTel SDK initialization.
 *
 * The real, injectable TracingService lives in ./tracing.service.ts and is
 * provided/exported by MonitoringModule (@Global), which is the correct module
 * for it. Import TracingService from there — never from this file.
 *
 * This file is kept as a named re-export so any stale import of TracingModule
 * produces a clear compile-time error rather than a silent runtime undefined.
 */

export { TracingService } from './tracing.service';
