<?php

use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // CORS - allow frontend origin
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Register role alias
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);

        // We use Bearer token auth (not cookie/session),
        // so statefulApi() is NOT needed and causes CSRF errors.
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Return JSON for API errors
        $exceptions->shouldRenderJsonWhen(function (Request $request) {
            return $request->is('api/*');
        });
    })->create();
