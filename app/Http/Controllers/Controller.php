<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 * version="1.0.0",
 * title="Nexscholar API Documentation",
 * description="This is the official API documentation for the Nexscholar platform, covering data management, user interactions, and more."
 * )
 * 
 * @OA\Server(
 * url=L5_SWAGGER_CONST_HOST,
 * description="Nexscholar API Server"
 * )
 * 
 * @OA\SecurityScheme(
 * securityScheme="bearerAuth",
 * type="http",
 * scheme="bearer",
 * bearerFormat="JWT"
 * )
 * 
 * @OA\Schema(
 * schema="University",
 * type="object",
 * title="University Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="full_name", type="string", example="Universiti Malaya"),
 * @OA\Property(property="short_name", type="string", example="UM"),
 * @OA\Property(property="country", type="string", example="Malaysia"),
 * @OA\Property(property="university_category", type="string", example="Research"),
 * @OA\Property(property="university_type", type="string", example="Public"),
 * @OA\Property(property="profile_picture", type="string", nullable=true, example="https://example.com/profile.jpg"),
 * @OA\Property(property="background_image", type="string", nullable=true, example="https://example.com/background.jpg"),
 * @OA\Property(property="faculties_count", type="integer", example=12),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="Faculty",
 * type="object",
 * title="Faculty Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="name", type="string", example="Faculty of Computer Science and Information Technology"),
 * @OA\Property(property="university_id", type="integer", example=1),
 * @OA\Property(property="academicians_count", type="integer", example=45),
 * @OA\Property(property="postgraduates_count", type="integer", example=120),
 * @OA\Property(property="undergraduates_count", type="integer", example=350),
 * @OA\Property(property="university", ref="#/components/schemas/University"),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="FieldOfResearch",
 * type="object",
 * title="Field of Research Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="name", type="string", example="Information and Computing Sciences"),
 * @OA\Property(property="research_areas_count", type="integer", example=8),
 * @OA\Property(property="research_areas", type="array", @OA\Items(ref="#/components/schemas/ResearchArea")),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="ResearchArea",
 * type="object",
 * title="Research Area Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="name", type="string", example="Artificial Intelligence and Image Processing"),
 * @OA\Property(property="field_of_research_id", type="integer", example=1),
 * @OA\Property(property="niche_domains_count", type="integer", example=5),
 * @OA\Property(property="field_of_research", ref="#/components/schemas/FieldOfResearch"),
 * @OA\Property(property="niche_domains", type="array", @OA\Items(ref="#/components/schemas/NicheDomain")),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="NicheDomain",
 * type="object",
 * title="Niche Domain Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="name", type="string", example="Machine Learning"),
 * @OA\Property(property="research_area_id", type="integer", example=1),
 * @OA\Property(property="research_area", ref="#/components/schemas/ResearchArea"),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="PostgraduateProgram",
 * type="object",
 * title="Postgraduate Program Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="name", type="string", example="Master of Computer Science"),
 * @OA\Property(property="program_type", type="string", enum={"Master", "PhD"}, example="Master"),
 * @OA\Property(property="university_id", type="integer", example=1),
 * @OA\Property(property="faculty_id", type="integer", nullable=true, example=1),
 * @OA\Property(property="description", type="string", nullable=true, example="A comprehensive program in computer science"),
 * @OA\Property(property="duration_years", type="string", nullable=true, example="2"),
 * @OA\Property(property="funding_info", type="string", nullable=true, example="Scholarships available"),
 * @OA\Property(property="application_url", type="string", nullable=true, example="https://example.com/apply"),
 * @OA\Property(property="country", type="string", nullable=true, example="Malaysia"),
 * @OA\Property(property="university", ref="#/components/schemas/University"),
 * @OA\Property(property="faculty", ref="#/components/schemas/Faculty"),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="Error",
 * type="object",
 * title="Error Response",
 * properties={
 * @OA\Property(property="error", type="string", example="An error occurred while processing the request.")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="Success",
 * type="object",
 * title="Success Response",
 * properties={
 * @OA\Property(property="message", type="string", example="Operation completed successfully.")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="PaginatedResponse",
 * type="object",
 * title="Paginated Response",
 * properties={
 * @OA\Property(property="data", type="array", @OA\Items()),
 * @OA\Property(property="current_page", type="integer", example=1),
 * @OA\Property(property="last_page", type="integer", example=5),
 * @OA\Property(property="per_page", type="integer", example=15),
 * @OA\Property(property="total", type="integer", example=75),
 * @OA\Property(property="from", type="integer", example=1),
 * @OA\Property(property="to", type="integer", example=15)
 * }
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
