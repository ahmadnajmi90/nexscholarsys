<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class QdrantToggleCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'qdrant:toggle 
                          {action=status : Action to perform (enable, disable, status, rollout)}
                          {--percentage=100 : Percentage of traffic to route to Qdrant (for rollout action)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Toggle Qdrant vector database usage for semantic search';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');
        
        switch ($action) {
            case 'enable':
                $this->enableQdrant();
                break;
                
            case 'disable':
                $this->disableQdrant();
                break;
                
            case 'status':
                $this->showStatus();
                break;
                
            case 'rollout':
                $percentage = (int) $this->option('percentage');
                $this->setRolloutPercentage($percentage);
                break;
                
            default:
                $this->error("Invalid action: {$action}");
                $this->info("Valid actions are: enable, disable, status, rollout");
                return Command::FAILURE;
        }
        
        return Command::SUCCESS;
    }
    
    /**
     * Enable Qdrant for all traffic
     */
    protected function enableQdrant(): void
    {
        $this->updateEnvFile('QDRANT_ENABLED', 'true');
        $this->updateEnvFile('QDRANT_ROLLOUT_PERCENTAGE', '100');
        
        $this->info('✓ Qdrant is now enabled for all traffic');
        $this->info('✓ Rollout percentage set to 100%');
        
        // Remind about cache
        $this->warn('Remember to clear application cache:');
        $this->line('  php artisan cache:clear');
        $this->line('  php artisan config:clear');
    }
    
    /**
     * Disable Qdrant for all traffic
     */
    protected function disableQdrant(): void
    {
        $this->updateEnvFile('QDRANT_ENABLED', 'false');
        $this->updateEnvFile('QDRANT_ROLLOUT_PERCENTAGE', '0');
        
        $this->info('✓ Qdrant is now disabled for all traffic');
        $this->info('✓ Rollout percentage set to 0%');
        
        // Remind about cache
        $this->warn('Remember to clear application cache:');
        $this->line('  php artisan cache:clear');
        $this->line('  php artisan config:clear');
    }
    
    /**
     * Set rollout percentage
     */
    protected function setRolloutPercentage(int $percentage): void
    {
        if ($percentage < 0 || $percentage > 100) {
            $this->error('Percentage must be between 0 and 100');
            return;
        }
        
        // Enable Qdrant if percentage > 0
        if ($percentage > 0) {
            $this->updateEnvFile('QDRANT_ENABLED', 'true');
        }
        
        // Update percentage
        $this->updateEnvFile('QDRANT_ROLLOUT_PERCENTAGE', (string) $percentage);
        
        $this->info("✓ Qdrant rollout percentage set to {$percentage}%");
        
        // Remind about cache
        $this->warn('Remember to clear application cache:');
        $this->line('  php artisan cache:clear');
        $this->line('  php artisan config:clear');
    }
    
    /**
     * Show current Qdrant configuration status
     */
    protected function showStatus(): void
    {
        $enabled = config('services.qdrant.enabled', false);
        $percentage = config('services.qdrant.percentage', 0);
        $url = config('services.qdrant.url', 'not_configured');
        
        $this->line('');
        $this->line('Qdrant Configuration Status:');
        $this->line('-------------------------');
        $this->line('Enabled:   ' . ($enabled ? '<fg=green>Yes</>' : '<fg=red>No</>'));
        $this->line('Rollout:   ' . "<fg=yellow>{$percentage}%</>");
        $this->line('URL:       ' . ($url === 'your_qdrant_cloud_cluster_url' ? '<fg=red>Not Configured</>' : '<fg=green>Configured</>'));
        
        // If enabled, check Qdrant connectivity
        if ($enabled) {
            $this->line('');
            $this->line('Testing Qdrant connectivity...');
            
            // Execute the setup command but only to verify connections
            $this->call('qdrant:setup');
        }
    }
    
    /**
     * Update .env file
     */
    protected function updateEnvFile(string $key, string $value): void
    {
        $path = base_path('.env');
        
        if (file_exists($path)) {
            // Read .env file
            $env = file_get_contents($path);
            
            // Check if key exists
            $pattern = "/^{$key}=.*/m";
            
            if (preg_match($pattern, $env)) {
                // Replace existing value
                $env = preg_replace($pattern, "{$key}={$value}", $env);
            } else {
                // Add new value
                $env .= "\n{$key}={$value}\n";
            }
            
            // Write updated contents back to .env
            file_put_contents($path, $env);
            
            Log::info("Updated environment variable: {$key}={$value}");
        } else {
            $this->error('.env file does not exist!');
        }
    }
} 