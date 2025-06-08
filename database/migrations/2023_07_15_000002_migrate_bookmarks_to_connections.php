<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Process bookmarks for academicians
        $this->migrateBookmarksForType('App\\Models\\Academician');
        
        // Process bookmarks for postgraduates
        $this->migrateBookmarksForType('App\\Models\\Postgraduate');
        
        // Process bookmarks for undergraduates
        $this->migrateBookmarksForType('App\\Models\\Undergraduate');
    }

    /**
     * Migrate bookmarks for a specific bookmarkable type
     * 
     * @param string $bookmarkableType
     * @return void
     */
    private function migrateBookmarksForType(string $bookmarkableType): void
    {
        // Get all bookmarks for this type
        $bookmarks = DB::table('bookmarks')
            ->where('bookmarkable_type', $bookmarkableType)
            ->get();
        
        foreach ($bookmarks as $bookmark) {
            // Get the user ID of the bookmarked entity
            $bookmarkedUser = DB::table(
                $this->getTableName($bookmarkableType)
            )
                ->where('id', $bookmark->bookmarkable_id)
                ->first();
            
            if (!$bookmarkedUser) {
                // Skip if the bookmarked entity doesn't exist anymore
                continue;
            }
            
            // Get the actual user ID based on the entity type
            $userIdField = $this->getUserIdField($bookmarkableType);
            $bookmarkedUserId = $bookmarkedUser->$userIdField;
            
            // Skip if the user ID is not found
            if (!$bookmarkedUserId) {
                continue;
            }
            
            // Create a new connection
            try {
                DB::table('connections')->insert([
                    'user_one_id' => $bookmark->user_id, // User who made the bookmark
                    'user_two_id' => $bookmarkedUserId, // User who was bookmarked
                    'type' => 'bookmark',
                    'status' => 'accepted',
                    'created_at' => $bookmark->created_at,
                    'updated_at' => $bookmark->updated_at,
                ]);
            } catch (\Exception $e) {
                // Skip duplicates or other errors
                continue;
            }
        }
    }
    
    /**
     * Get the table name for a bookmarkable type
     * 
     * @param string $bookmarkableType
     * @return string
     */
    private function getTableName(string $bookmarkableType): string
    {
        return match($bookmarkableType) {
            'App\\Models\\Academician' => 'academicians',
            'App\\Models\\Postgraduate' => 'postgraduates',
            'App\\Models\\Undergraduate' => 'undergraduates',
            default => throw new \InvalidArgumentException("Invalid bookmarkable type: $bookmarkableType"),
        };
    }
    
    /**
     * Get the user ID field for a bookmarkable type
     * 
     * @param string $bookmarkableType
     * @return string
     */
    private function getUserIdField(string $bookmarkableType): string
    {
        return match($bookmarkableType) {
            'App\\Models\\Academician' => 'academician_id',
            'App\\Models\\Postgraduate' => 'postgraduate_id',
            'App\\Models\\Undergraduate' => 'undergraduate_id',
            default => 'id',
        };
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This is a data migration, no need to reverse
        // If needed, connections of type 'bookmark' could be deleted here
    }
}; 