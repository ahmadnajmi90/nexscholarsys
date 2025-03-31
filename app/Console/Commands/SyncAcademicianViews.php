<?php

namespace App\Console\Commands;

use App\Models\Academician;
use App\Models\AcademicianView;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncAcademicianViews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-academician-views';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize total_views for academicians based on view counts in academician_views table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting synchronization of academician view counts...');
        
        // Get count of views for each academician
        $viewCounts = DB::table('academician_views')
            ->select('academician_id', DB::raw('count(*) as total_views'))
            ->groupBy('academician_id')
            ->get();
            
        $this->info('Found ' . count($viewCounts) . ' academicians with views.');
        
        // Update each academician's total_views
        $bar = $this->output->createProgressBar(count($viewCounts));
        $bar->start();
        
        foreach ($viewCounts as $viewCount) {
            Academician::where('id', $viewCount->academician_id)
                ->update(['total_views' => $viewCount->total_views]);
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine(2);
        
        // Reset to zero for academicians with no views
        $zeroedCount = Academician::whereNotIn('id', $viewCounts->pluck('academician_id'))
            ->where('total_views', '>', 0)
            ->update(['total_views' => 0]);
            
        $this->info("Reset {$zeroedCount} academicians with no views to zero.");
        $this->info('View count synchronization completed successfully!');
        
        return Command::SUCCESS;
    }
}
