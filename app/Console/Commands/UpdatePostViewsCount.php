<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CreatePost;
use App\Models\PostView;
use App\Models\PostEvent;
use App\Models\EventView;
use App\Models\PostProject;
use App\Models\ProjectView;
use App\Models\PostGrant;
use App\Models\GrantView;
use Illuminate\Support\Facades\DB;

class UpdatePostViewsCount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-post-views-count';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update content total_views based on view tables';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating view counts...');
        
        // Update posts view counts
        $this->updateViewCounts('post_views', 'post_id', CreatePost::class);
        
        // Update events view counts
        $this->updateViewCounts('event_views', 'event_id', PostEvent::class);
        
        // Update projects view counts
        $this->updateViewCounts('project_views', 'project_id', PostProject::class);
        
        // Update grants view counts
        $this->updateViewCounts('grant_views', 'grant_id', PostGrant::class);
        
        return Command::SUCCESS;
    }
    
    /**
     * Update the view counts for a specific content type
     * 
     * @param string $viewTable The view tracking table name
     * @param string $foreignKey The foreign key column name in the view table
     * @param string $modelClass The model class to update
     */
    private function updateViewCounts($viewTable, $foreignKey, $modelClass)
    {
        try {
            // Get counts from the view table
            $viewCounts = DB::table($viewTable)
                ->select($foreignKey, DB::raw('COUNT(*) as view_count'))
                ->groupBy($foreignKey)
                ->get();
                
            $updatedCount = 0;
            
            foreach ($viewCounts as $viewCount) {
                $contentId = $viewCount->$foreignKey;
                $content = $modelClass::find($contentId);
                
                if ($content) {
                    $content->total_views = $viewCount->view_count;
                    $content->save();
                    $updatedCount++;
                }
            }
            
            $contentType = strtolower(class_basename($modelClass));
            $this->info("Updated view counts for {$updatedCount} {$contentType}s.");
        } catch (\Exception $e) {
            $this->error("Error updating view counts for " . class_basename($modelClass) . ": " . $e->getMessage());
        }
    }
}
