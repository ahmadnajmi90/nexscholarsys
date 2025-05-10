<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\ScrapingLog;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Exception;

class GoogleScholarPythonService
{
    /**
     * Path to the Python script
     *
     * @var string
     */
    protected $scriptPath;

    /**
     * Path to the Python executable
     *
     * @var string
     */
    protected $pythonPath;

    /**
     * Constructor
     */
    public function __construct()
    {
        // Set the path to the Python script relative to the project root
        $this->scriptPath = base_path('scripts/google_scholar_scraper.py');
        
        // Set Python executable path based on environment
        $this->setPythonPath();
    }

    /**
     * Set the Python executable path based on the current environment
     * 
     * @return void
     */
    protected function setPythonPath(): void
    {
        if (app()->environment('local')) {
            // Local Windows environment
            $this->pythonPath = 'C:\Users\kelvi\AppData\Local\Programs\Python\Python311\\python.EXE';
        } else {
            // Production/staging Linux environment
            $this->pythonPath = '/usr/bin/python3';
        }
        
        Log::info('Using Python executable: ' . $this->pythonPath);
    }

    /**
     * Run Google Scholar scraping using Python script
     *
     * @param Academician $academician
     * @return bool
     */
    public function scrapeProfile(Academician $academician): bool
    {
        if (empty($academician->google_scholar)) {
            $this->logScraping($academician, 'failure', 'Google Scholar URL not found');
            return false;
        }

        // Check if Python script exists
        if (!file_exists($this->scriptPath)) {
            Log::error('Google Scholar scraping error: Python script not found at ' . $this->scriptPath);
            $this->logScraping($academician, 'failure', 'Python script not found');
            return false;
        }

        try {
            // Prepare the command using environment-specific Python path
            $process = new Process([
                $this->pythonPath,
                $this->scriptPath,
                '--url', $academician->google_scholar,
                '--academician_id', $academician->academician_id
            ]);
            
            // Set timeout to 5 minutes
            $process->setTimeout(300);
            
            // Run the process
            Log::info('Starting Python Google Scholar scraper for academician ' . $academician->academician_id);
            $process->run();

            // Check if process was successful
            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            // Get output
            $output = $process->getOutput();
            Log::info('Python Google Scholar scraper output: ' . $output);
            
            // Check if the scraping was successful based on exit code
            return $process->getExitCode() === 0;
            
        } catch (Exception $e) {
            $message = $e->getMessage();
            Log::error('Google Scholar Python scraping error: ' . $message);
            $this->logScraping($academician, 'failure', 'Error: ' . $message);
            return false;
        }
    }

    /**
     * Log scraping operation
     *
     * @param Academician $academician
     * @param string $status
     * @param string $message
     * @return void
     */
    protected function logScraping(Academician $academician, string $status, string $message): void
    {
        ScrapingLog::create([
            'academician_id' => $academician->academician_id,
            'status' => $status,
            'message' => $message
        ]);
    }

    /**
     * Run the Python script directly (for debugging or CLI usage)
     *
     * @param string $url Google Scholar URL
     * @param string $academicianId Academician ID
     * @return array [bool success, string output]
     */
    public function runScriptDirectly(string $url, string $academicianId): array
    {
        try {
            $process = new Process([
                $this->pythonPath,
                $this->scriptPath,
                '--url', $url,
                '--academician_id', $academicianId
            ]);
            
            $process->setTimeout(300);
            $process->run();
            
            return [
                'success' => $process->isSuccessful(),
                'output' => $process->getOutput(),
                'error' => $process->getErrorOutput(),
                'exit_code' => $process->getExitCode()
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'output' => '',
                'error' => $e->getMessage(),
                'exit_code' => -1
            ];
        }
    }
} 