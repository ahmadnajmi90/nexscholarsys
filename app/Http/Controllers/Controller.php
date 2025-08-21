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
 * 
 * @OA\Schema(
 * schema="Post",
 * type="object",
 * title="Post Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="author_id", type="string", example="user123"),
 * @OA\Property(property="title", type="string", example="Research Article Title"),
 * @OA\Property(property="url", type="string", example="research-article-title"),
 * @OA\Property(property="content", type="string", example="This is the content of the research article..."),
 * @OA\Property(property="category", type="string", example="Research"),
 * @OA\Property(property="tags", type="array", @OA\Items(type="string"), example={"AI", "Machine Learning"}),
 * @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"post_images/image1.jpg"}),
 * @OA\Property(property="featured_image", type="string", example="post_featured_images/featured.jpg"),
 * @OA\Property(property="attachment", type="string", example="post_attachments/document.pdf"),
 * @OA\Property(property="status", type="string", enum={"draft","published"}, example="published"),
 * @OA\Property(property="total_views", type="integer", example=150),
 * @OA\Property(property="total_likes", type="integer", example=25),
 * @OA\Property(property="total_shares", type="integer", example=10),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="Event",
 * type="object",
 * title="Event Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="author_id", type="string", example="user123"),
 * @OA\Property(property="event_name", type="string", example="Research Conference 2024"),
 * @OA\Property(property="url", type="string", example="research-conference-2024"),
 * @OA\Property(property="description", type="string", example="Annual research conference"),
 * @OA\Property(property="event_type", type="string", example="Conference"),
 * @OA\Property(property="event_mode", type="string", example="Hybrid"),
 * @OA\Property(property="start_date", type="string", format="date", example="2024-12-01"),
 * @OA\Property(property="end_date", type="string", format="date", example="2024-12-03"),
 * @OA\Property(property="start_time", type="string", example="09:00"),
 * @OA\Property(property="end_time", type="string", example="17:00"),
 * @OA\Property(property="image", type="string", example="event_images/conference.jpg"),
 * @OA\Property(property="event_theme", type="string", example="AI and Machine Learning"),
 * @OA\Property(property="registration_url", type="string", example="https://conference.com/register"),
 * @OA\Property(property="registration_deadline", type="string", format="date", example="2024-11-15"),
 * @OA\Property(property="contact_email", type="string", format="email", example="contact@conference.com"),
 * @OA\Property(property="venue", type="string", example="Conference Center"),
 * @OA\Property(property="city", type="string", example="Kuala Lumpur"),
 * @OA\Property(property="country", type="string", example="Malaysia"),
 * @OA\Property(property="event_status", type="string", enum={"draft","published"}, example="published"),
 * @OA\Property(property="field_of_research", type="object"),
 * @OA\Property(property="total_views", type="integer", example=200),
 * @OA\Property(property="total_likes", type="integer", example=30),
 * @OA\Property(property="total_shares", type="integer", example=15),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="Grant",
 * type="object",
 * title="Grant Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="author_id", type="string", example="user123"),
 * @OA\Property(property="title", type="string", example="Research Grant 2024"),
 * @OA\Property(property="url", type="string", example="research-grant-2024"),
 * @OA\Property(property="description", type="string", example="Funding opportunity for research projects"),
 * @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
 * @OA\Property(property="end_date", type="string", format="date", example="2024-12-31"),
 * @OA\Property(property="application_deadline", type="string", format="date", example="2024-02-15"),
 * @OA\Property(property="grant_type", type="string", example="Research"),
 * @OA\Property(property="grant_theme", type="object"),
 * @OA\Property(property="cycle", type="string", example="Annual"),
 * @OA\Property(property="sponsored_by", type="string", example="National Research Foundation"),
 * @OA\Property(property="email", type="string", format="email", example="grants@nrf.gov.my"),
 * @OA\Property(property="website", type="string", example="https://nrf.gov.my/grants"),
 * @OA\Property(property="country", type="string", example="Malaysia"),
 * @OA\Property(property="image", type="string", example="grant_images/grant.jpg"),
 * @OA\Property(property="attachment", type="string", example="grant_attachments/guidelines.pdf"),
 * @OA\Property(property="status", type="string", enum={"draft","published"}, example="published"),
 * @OA\Property(property="total_views", type="integer", example=300),
 * @OA\Property(property="total_likes", type="integer", example=45),
 * @OA\Property(property="total_shares", type="integer", example=20),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 * 
 * @OA\Schema(
 * schema="Project",
 * type="object",
 * title="Project Resource",
 * properties={
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="author_id", type="string", example="user123"),
 * @OA\Property(property="title", type="string", example="AI Research Project"),
 * @OA\Property(property="url", type="string", example="ai-research-project"),
 * @OA\Property(property="description", type="string", example="Research project on artificial intelligence"),
 * @OA\Property(property="project_theme", type="string", example="Artificial Intelligence"),
 * @OA\Property(property="purpose", type="object"),
 * @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
 * @OA\Property(property="end_date", type="string", format="date", example="2024-12-31"),
 * @OA\Property(property="application_deadline", type="string", format="date", example="2024-02-15"),
 * @OA\Property(property="duration", type="string", example="12 months"),
 * @OA\Property(property="sponsored_by", type="string", example="University Research Fund"),
 * @OA\Property(property="category", type="string", example="Research"),
 * @OA\Property(property="field_of_research", type="object"),
 * @OA\Property(property="supervisor_category", type="string", example="Professor"),
 * @OA\Property(property="supervisor_name", type="string", example="Dr. John Doe"),
 * @OA\Property(property="university", type="integer", example=1),
 * @OA\Property(property="email", type="string", format="email", example="project@university.edu"),
 * @OA\Property(property="origin_country", type="string", example="Malaysia"),
 * @OA\Property(property="student_nationality", type="string", example="Malaysian"),
 * @OA\Property(property="student_level", type="object"),
 * @OA\Property(property="student_mode_study", type="object"),
 * @OA\Property(property="appointment_type", type="string", example="Full-time"),
 * @OA\Property(property="purpose_of_collaboration", type="string", example="Research collaboration"),
 * @OA\Property(property="image", type="string", example="project_images/project.jpg"),
 * @OA\Property(property="attachment", type="string", example="project_attachments/proposal.pdf"),
 * @OA\Property(property="application_url", type="string", example="https://university.edu/apply"),
 * @OA\Property(property="amount", type="number", format="float", example=50000.00),
 * @OA\Property(property="project_status", type="string", enum={"draft","published"}, example="published"),
 * @OA\Property(property="total_views", type="integer", example=250),
 * @OA\Property(property="total_likes", type="integer", example=35),
 * @OA\Property(property="total_shares", type="integer", example=12),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * }
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
