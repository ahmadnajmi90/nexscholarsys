<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BoardListResource;
use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BoardListController extends Controller
{
    /**
     * Store a newly created list in the board.
     */
    public function store(Request $request, Board $board)
    {
        $this->authorize('create', [BoardList::class, $board]);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        // Calculate the next order value
        $order = $board->lists()->max('order') + 1;
        
        // Create the new board list
        $boardList = $board->lists()->create([
            'name' => $validated['name'],
            'order' => $order,
        ]);
        
        return back()->with('success', 'List created successfully.');
    }
    
    /**
     * Update the specified board list.
     */
    public function update(Request $request, BoardList $boardList)
    {
        $this->authorize('update', $boardList);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'sometimes|integer|min:1',
        ]);
        
        $boardList->update($validated);
        
        return new BoardListResource($boardList);
    }
    
    /**
     * Remove the specified board list.
     */
    public function destroy(BoardList $boardList)
    {
        $this->authorize('delete', $boardList);
        
        $boardList->delete();
        
        return back()->with('success', 'List deleted successfully.');
    }
} 