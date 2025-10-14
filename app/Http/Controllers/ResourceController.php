<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ResourceController extends Controller
{
    private function getResourcesData()
    {
        return [
            'mastering-profile' => [
                'title' => 'Mastering Your Profile & Onboarding',
                'guides' => [
                    ['slug' => 'crafting-academic-cv', 'title' => 'Crafting the Perfect Academic CV for Our AI Profile Generator'],
                    ['slug' => 'writing-research-statement', 'title' => 'Beyond Keywords: How to Write a Research Interest Statement for Our Semantic Search AI'],
                    ['slug' => 'profile-health-checklist', 'title' => 'Your Nexscholar Profile Health Checklist'],
                ]
            ],
            'finding-match' => [
                'title' => 'Finding Your Match',
                'guides' => [
                    ['slug' => 'decoding-match-insights', 'title' => 'Decoding Your AI Match Insights: A Look at Our GPT-4o Powered Recommendations'],
                    // ['slug' => 'finding-supervisor-guide', 'title' => 'From Search to Connection: A 5-Minute Guide to Finding Your Perfect Supervisor'],
                    ['slug' => 'finding-collaborators', 'title' => 'A Researcher\'s Guide to Finding Collaborators with AI Matching'],
                ]
            ],
            'managing-research' => [
                'title' => 'Managing Your Research',
                'guides' => [
                    ['slug' => 'paper-writing-template', 'title' => 'The Ultimate Paper Writing Project Template'],
                    ['slug' => 'agile-for-academics', 'title' => 'Agile for Academics: Managing Your PhD Using NexLab\'s Kanban Board'],
                    ['slug' => 'choosing-your-view', 'title' => 'Choosing Your View: When to Use a Board, List, Table, Calendar, or Timeline for Your Research Project'],
                ]
            ],
        ];
    }

    public function showCategory($category)
    {
        $resources = $this->getResourcesData();

        // Check if category exists
        if (!isset($resources[$category])) {
            abort(404, 'Category not found');
        }

        // Get the first guide of the category as default
        $firstGuide = $resources[$category]['guides'][0] ?? null;

        return Inertia::render('Resources/Show', [
            'resources' => $resources,
            'currentCategory' => $category,
            'currentSlug' => $firstGuide ? $firstGuide['slug'] : null,
        ]);
    }

    public function showGuide($category, $slug)
    {
        $resources = $this->getResourcesData();

        // Check if category exists
        if (!isset($resources[$category])) {
            abort(404, 'Category not found');
        }

        // Check if guide exists in the category
        $guideExists = false;
        foreach ($resources[$category]['guides'] as $guide) {
            if ($guide['slug'] === $slug) {
                $guideExists = true;
                break;
            }
        }

        if (!$guideExists) {
            abort(404, 'Guide not found');
        }

        return Inertia::render('Resources/Show', [
            'resources' => $resources,
            'currentCategory' => $category,
            'currentSlug' => $slug,
        ]);
    }
}
