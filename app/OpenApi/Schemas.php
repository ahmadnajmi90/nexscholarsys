<?php

namespace App\OpenApi;

/**
 * @OA\Schema(
 *     schema="PaginatedResponse",
 *     type="object",
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="last_page", type="integer", example=10),
 *     @OA\Property(property="per_page", type="integer", example=15),
 *     @OA\Property(property="total", type="integer", example=150),
 *     @OA\Property(property="from", type="integer", example=1),
 *     @OA\Property(property="to", type="integer", example=15)
 * )
 * 
 * @OA\Schema(
 *     schema="Error",
 *     type="object",
 *     @OA\Property(property="error", type="string", example="An error occurred")
 * )
 * 
 * @OA\Schema(
 *     schema="Success",
 *     type="object",
 *     @OA\Property(property="message", type="string", example="Operation completed successfully")
 * )
 * 
 * @OA\Schema(
 *     schema="ValidationError",
 *     type="object",
 *     @OA\Property(property="message", type="string", example="The given data was invalid."),
 *     @OA\Property(
 *         property="errors",
 *         type="object",
 *         @OA\AdditionalProperties(
 *             type="array",
 *             @OA\Items(type="string", example="The field is required.")
 *         )
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="University",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="full_name", type="string", example="University of Malaya"),
 *     @OA\Property(property="short_name", type="string", example="UM"),
 *     @OA\Property(property="country", type="string", example="Malaysia"),
 *     @OA\Property(property="university_category", type="string", example="Research"),
 *     @OA\Property(property="university_type", type="string", example="Public"),
 *     @OA\Property(property="profile_picture", type="string", nullable=true),
 *     @OA\Property(property="background_image", type="string", nullable=true),
 *     @OA\Property(property="faculties_count", type="integer", example=15),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Faculty",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Faculty of Computer Science"),
 *     @OA\Property(property="university_id", type="integer", example=1),
 *     @OA\Property(property="university", ref="#/components/schemas/University", nullable=true),
 *     @OA\Property(property="academicians_count", type="integer", example=50),
 *     @OA\Property(property="postgraduates_count", type="integer", example=200),
 *     @OA\Property(property="undergraduates_count", type="integer", example=800),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="PostgraduateProgram",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Doctor of Philosophy in Computer Science"),
 *     @OA\Property(property="program_type", type="string", example="PhD"),
 *     @OA\Property(property="university_id", type="integer", example=1),
 *     @OA\Property(property="faculty_id", type="integer", nullable=true, example=1),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="duration_years", type="string", nullable=true, example="3-5 years"),
 *     @OA\Property(property="funding_info", type="string", nullable=true),
 *     @OA\Property(property="application_url", type="string", nullable=true),
 *     @OA\Property(property="country", type="string", nullable=true, example="Malaysia"),
 *     @OA\Property(property="university", ref="#/components/schemas/University"),
 *     @OA\Property(property="faculty", ref="#/components/schemas/Faculty", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="FieldOfResearch",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Computer Science"),
 *     @OA\Property(property="research_areas_count", type="integer", example=15),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="ResearchArea",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Machine Learning"),
 *     @OA\Property(property="field_of_research_id", type="integer", example=1),
 *     @OA\Property(property="field", ref="#/components/schemas/FieldOfResearch", nullable=true),
 *     @OA\Property(property="niche_domains_count", type="integer", example=8),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="NicheDomain",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Deep Learning"),
 *     @OA\Property(property="research_area_id", type="integer", example=1),
 *     @OA\Property(property="research_area", ref="#/components/schemas/ResearchArea", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="SkillsDomain",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Programming"),
 *     @OA\Property(property="subdomains_count", type="integer", example=10),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="SkillsSubdomain",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Web Development"),
 *     @OA\Property(property="skills_domain_id", type="integer", example=1),
 *     @OA\Property(property="domain", ref="#/components/schemas/SkillsDomain", nullable=true),
 *     @OA\Property(property="skills_count", type="integer", example=25),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Skill",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="React.js"),
 *     @OA\Property(property="description", type="string", nullable=true, example="JavaScript library for building user interfaces"),
 *     @OA\Property(property="skills_subdomain_id", type="integer", example=1),
 *     @OA\Property(property="subdomain", ref="#/components/schemas/SkillsSubdomain", nullable=true),
 *     @OA\Property(property="full_name", type="string", example="Programming > Web Development > React.js"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Post",
 *     type="object",
 *     description="Content Management - Post (minimal schema for reference)",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Research Opportunity"),
 *     @OA\Property(property="content", type="string", example="Full post content")
 * )
 * 
 * @OA\Schema(
 *     schema="Event",
 *     type="object",
 *     description="Content Management - Event (minimal schema for reference)",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Conference 2024"),
 *     @OA\Property(property="event_date", type="string", format="date")
 * )
 * 
 * @OA\Schema(
 *     schema="Grant",
 *     type="object",
 *     description="Content Management - Grant (minimal schema for reference)",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Research Grant"),
 *     @OA\Property(property="amount", type="string", example="$50,000")
 * )
 * 
 * @OA\Schema(
 *     schema="Scholarship",
 *     type="object",
 *     description="Content Management - Scholarship (minimal schema for reference)",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="PhD Scholarship"),
 *     @OA\Property(property="deadline", type="string", format="date")
 * )
 * 
 * @OA\Schema(
 *     schema="Project",
 *     type="object",
 *     description="Content Management - Project (minimal schema for reference)",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Research Project"),
 *     @OA\Property(property="description", type="string", example="Project description")
 * )
 */
class Schemas
{
    // This class only holds OpenAPI schema annotations
}

