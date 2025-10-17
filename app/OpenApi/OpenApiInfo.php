<?php

namespace App\OpenApi;

/**
 * @OA\Info(
 *     title="Nexscholar API",
 *     version="1.0.0",
 *     description="REST API for Nexscholar platform data management. Provides endpoints for managing universities, faculties, research taxonomy, skills taxonomy, and postgraduate programs.",
 *     @OA\Contact(
 *         email="support@nexscholar.com",
 *         name="Nexscholar Support"
 *     ),
 *     @OA\License(
 *         name="Proprietary",
 *         url="https://nexscholar.com/license"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://127.0.0.1:8000",
 *     description="Local Development Server"
 * )
 * 
 * @OA\Server(
 *     url="https://nexscholar.com",
 *     description="Production Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Laravel Sanctum Bearer Token. Obtain from /api/login endpoint."
 * )
 */
class OpenApiInfo
{
    // This class only holds OpenAPI annotations
}

