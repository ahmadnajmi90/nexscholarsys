<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BoardResource;
use App\Models\Board;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BoardController extends Controller
{
    /**
     * Store a newly created board in the workspace.
     */
    public function store(Request $request, Workspace $workspace)
    {
        $this->authorize('create', [Board::class, $workspace]);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        $board = $workspace->boards()->create([
            'name' => $validated['name'],
        ]);
        
        return redirect()->route('project-hub.boards.show', $board)->with('success', 'Board created successfully.');
    }
    
    /**
     * Display the specified board.
     */
    public function show(Board $board)
    {
        $this->authorize('view', $board);
        
        // Eager load lists with their tasks
        $board->load('lists.tasks');
        
        return new BoardResource($board);
    }
    
    /**
     * Update the specified board.
     */
    public function update(Request $request, Board $board)
    {
        $this->authorize('update', $board);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        $board->update([
            'name' => $validated['name'],
        ]);
        
        return new BoardResource($board);
    }
    
    /**
     * Remove the specified board.
     */
    public function destroy(Board $board)
    {
        $this->authorize('delete', $board);
        
        $board->delete();
        
        return back()->with('success', 'Board deleted successfully.');
    }
} 