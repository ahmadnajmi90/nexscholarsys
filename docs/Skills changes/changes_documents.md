# Nexscholar Skills Taxonomy Documentation

## Overview

This document defines the new database structure, relationships, and frontend flow for implementing a multi-level taxonomy of skills. The purpose is to organize skills in a hierarchical way (Domain → Subdomain → Skill) to improve clarity and usability in user profiles, filtering, and AI matching.

## Table of Contents

- [Database Schema](#database-schema)
- [Model Relationships](#model-relationships)
- [Migration Files](#migration-files)
- [Eloquent Models](#eloquent-models)
- [API Endpoints](#api-endpoints)

## Database Schema

### Skills Domain Table (skills_domain)

Stores the highest-level grouping of skills.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(255) | Name of the domain (e.g., Computer Science, Engineering) |
| created_at | TIMESTAMP | Laravel default |
| updated_at | TIMESTAMP | Laravel default |

**Indexes:** Primary key on `id`

### Skills Subdomain Table (skills_subdomain)

Stores the middle-level grouping of skills within domains.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| skills_domain_id | BIGINT | Foreign key to skills_domain |
| name | VARCHAR(255) | Name of the subdomain (e.g., Machine Learning, Web Development) |
| created_at | TIMESTAMP | Laravel default |
| updated_at | TIMESTAMP | Laravel default |

**Indexes:** Primary key on `id`, Foreign key on `skills_domain_id`

### Skills Table (skills)

Stores the individual skills within subdomains.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| skills_subdomain_id | BIGINT | Foreign key to skills_subdomain |
| name | VARCHAR(255) | Name of the skill (e.g., TensorFlow, React.js) |
| created_at | TIMESTAMP | Laravel default |
| updated_at | TIMESTAMP | Laravel default |

**Indexes:** Primary key on `id`, Foreign key on `skills_subdomain_id`

### User Skills Pivot Table (profile_skills)

Links users to their skills with proficiency information.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| unique_id | BIGINT | Foreign key to users |
| skill_id | BIGINT | Foreign key to skills |
| created_at | TIMESTAMP | Laravel default |
| updated_at | TIMESTAMP | Laravel default |

**Indexes:** Unique on `(unique_id, skill_id)`

## Model Relationships

### SkillsDomain Model
- **hasMany** SkillsSubdomain
- **hasManyThrough** Skills (through SkillsSubdomain)

### SkillsSubdomain Model
- **belongsTo** SkillsDomain
- **hasMany** Skills

### Skills Model
- **belongsTo** SkillsSubdomain
- **belongsTo** SkillsDomain (through SkillsSubdomain)

### Profile Skill Relationships
- **User** belongsToMany Skills (pivot: profile_skills)
- **Academician** belongsToMany Skills (through User)
- **Postgraduate** belongsToMany Skills (through User)
- **Undergraduate** belongsToMany Skills (through User)

## Migration Files

### Skills Domain Migration

```php
// database/migrations/xxxx_xx_xx_create_skills_domain_table.php
Schema::create('skills_domain', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->timestamps();
});
```

### Skills Subdomain Migration

```php
// database/migrations/xxxx_xx_xx_create_skills_subdomain_table.php
Schema::create('skills_subdomain', function (Blueprint $table) {
    $table->id();
    $table->foreignId('skills_domain_id')->constrained('skills_domain')->onDelete('cascade');
    $table->string('name');
    $table->timestamps();
    
    $table->unique(['skills_domain_id', 'name']);
});
```

### Skills Migration

```php
// database/migrations/xxxx_xx_xx_create_skills_table.php
Schema::create('skills', function (Blueprint $table) {
    $table->id();
    $table->foreignId('skills_subdomain_id')->constrained('skills_subdomain')->onDelete('cascade');
    $table->string('name');
    $table->text('description')->nullable();
    $table->timestamps();
    
    $table->unique(['skills_subdomain_id', 'name']);
    $table->fullText('name');
});
```

### Profile Skills Pivot Migration

```php
// database/migrations/xxxx_xx_xx_create_user_skills_table.php
Schema::create('profile_skills', function (Blueprint $table) {
    $table->id();
    $table->foreignId('unique_id')->constrained('unique_id')->onDelete('cascade');
    $table->foreignId('skill_id')->constrained('skills')->onDelete('cascade');
    $table->timestamps();
    
    $table->unique(['unique_id', 'skill_id']);
});
```

## Eloquent Models

### SkillsDomain Model

```php
// app/Models/SkillsDomain.php
class SkillsDomain extends Model
{
    protected $table = 'skills_domain';
    
    protected $fillable = [
        'name'
    ];
    
    
    public function subdomains(): HasMany
    {
        return $this->hasMany(SkillsSubdomain::class)
            ->orderBy('name');
    }
    
    public function skills(): HasManyThrough
    {
        return $this->hasManyThrough(Skill::class, SkillsSubdomain::class)
            ->orderBy('skills.name');
    }
}
```

### SkillsSubdomain Model

```php
// app/Models/SkillsSubdomain.php
class SkillsSubdomain extends Model
{
    protected $table = 'skills_subdomain';
    
    protected $fillable = [
        'skills_domain_id', 'name'
    ];
    
    public function domain(): BelongsTo
    {
        return $this->belongsTo(SkillsDomain::class, 'skills_domain_id');
    }
    
    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class)
            ->orderBy('name');
    }
}
```

### Skill Model

```php
// app/Models/Skill.php
class Skill extends Model
{
    protected $fillable = [
        'skills_subdomain_id', 'name'
    ];
    
    protected $casts = [
        'proficiency_levels' => 'array',
    ];
    
    public function subdomain(): BelongsTo
    {
        return $this->belongsTo(SkillsSubdomain::class, 'skills_subdomain_id');
    }
    
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'profile_skills')
            ->withTimestamps();
    }
    
    public function getFullNameAttribute(): string
    {
        return $this->subdomain->domain->name . ' → ' . $this->subdomain->name . ' → ' . $this->name;
    }
}
```

## API Endpoints

### Skills API Routes

```php
// routes/api.php
Route::prefix('skills')->group(function () {
    Route::get('/taxonomy', [SkillsController::class, 'getTaxonomy']);
    Route::get('/search', [SkillsController::class, 'search']);
    Route::get('/domains', [SkillsController::class, 'getDomains']);
    Route::get('/domains/{domain}/subdomains', [SkillsController::class, 'getSubdomains']);
    Route::get('/subdomains/{subdomain}/skills', [SkillsController::class, 'getSkills']);
});
```

### Skills Controller

```php
// app/Http/Controllers/SkillsController.php
class SkillsController extends Controller
{
    public function getTaxonomy()
    {
        $domains = SkillsDomain::active()
            ->ordered()
            ->with(['subdomains.skills'])
            ->get();
            
        return response()->json(['domains' => $domains]);
    }
    
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        $skills = Skill::active()
            ->search($query)
            ->with(['subdomain.domain'])
            ->limit(50)
            ->get();
            
        return response()->json(['skills' => $skills]);
    }
}
```