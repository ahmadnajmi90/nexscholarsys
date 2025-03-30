<?php

namespace App\Console\Commands;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateProfileUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-profile-urls';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate SEO-friendly URL slugs for profiles';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating URL slugs for profiles...');

        // Generate URLs for Academicians
        $academicians = Academician::whereNull('url')->orWhere('url', '')->get();
        $this->info("Found {$academicians->count()} academicians without URLs");
        
        foreach ($academicians as $academician) {
            $slug = Str::slug($academician->full_name);
            $originalSlug = $slug;
            $count = 2;
            
            while (Academician::where('url', $slug)->where('id', '!=', $academician->id)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }
            
            $academician->url = $slug;
            $academician->save();
        }
        
        // Generate URLs for Postgraduates
        $postgraduates = Postgraduate::whereNull('url')->orWhere('url', '')->get();
        $this->info("Found {$postgraduates->count()} postgraduates without URLs");
        
        foreach ($postgraduates as $postgraduate) {
            $slug = Str::slug($postgraduate->full_name);
            $originalSlug = $slug;
            $count = 2;
            
            while (Postgraduate::where('url', $slug)->where('id', '!=', $postgraduate->id)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }
            
            $postgraduate->url = $slug;
            $postgraduate->save();
        }
        
        // Generate URLs for Undergraduates
        $undergraduates = Undergraduate::whereNull('url')->orWhere('url', '')->get();
        $this->info("Found {$undergraduates->count()} undergraduates without URLs");
        
        foreach ($undergraduates as $undergraduate) {
            $slug = Str::slug($undergraduate->full_name);
            $originalSlug = $slug;
            $count = 2;
            
            while (Undergraduate::where('url', $slug)->where('id', '!=', $undergraduate->id)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }
            
            $undergraduate->url = $slug;
            $undergraduate->save();
        }
        
        $this->info('URL generation completed successfully!');
    }
}
