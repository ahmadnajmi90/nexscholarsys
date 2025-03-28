<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CreatePost;
use App\Models\PostView;
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
    protected $description = 'Update post total_views based on post_views table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating post view counts...');
        
        // Get counts from post_views table
        $viewCounts = DB::table('post_views')
            ->select('post_id', DB::raw('COUNT(*) as view_count'))
            ->groupBy('post_id')
            ->get();
            
        $updatedCount = 0;
        
        foreach ($viewCounts as $viewCount) {
            $post = CreatePost::find($viewCount->post_id);
            
            if ($post) {
                $post->total_views = $viewCount->view_count;
                $post->save();
                $updatedCount++;
            }
        }
        
        $this->info("Updated view counts for {$updatedCount} posts.");
        
        return Command::SUCCESS;
    }
}
