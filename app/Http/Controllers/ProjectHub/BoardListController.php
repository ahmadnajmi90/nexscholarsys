<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use App\Http\Resources\BoardListResource;
use App\Models\Board;
use App\Models\BoardList;
use App\Events\BoardListUpdated;
use App\Events\BoardListCreated;
use App\Events\BoardListDeleted;
use App\Events\BoardListReordered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BoardListController extends Controller
{
    /**
     * Store a newly created list in the board.
     */
    public function store(Request $request, Board $board)
    {
        $this->authorize('create', [BoardList::class, $board]);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255',
                      \Illuminate\Validation\Rule::unique('board_lists')
                          ->where('board_id', $board->id)],
        ]);
        
        // Calculate the next order value
        $order = $board->lists()->max('order') + 1;
        
        // Create the new board list
        $boardList = $board->lists()->create([
            'name' => $validated['name'],
            'order' => $order,
        ]);
        
        // Broadcast board list created event for real-time updates
        $boardList->load('board');
        broadcast(new BoardListCreated($boardList, $request->user()))->toOthers();
        
        return Redirect::back()->with('success', 'List created successfully.');
    }
    
    /**
     * Update the specified board list.
     */
    public function update(Request $request, BoardList $boardList)
    {
        $this->authorize('update', $boardList);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255',
                      \Illuminate\Validation\Rule::unique('board_lists')
                          ->where('board_id', $boardList->board_id)
                          ->ignore($boardList->id)],
            'order' => 'sometimes|integer|min:1',
        ]);
        
        $boardList->update($validated);

        // Broadcast the update event for real-time updates
        broadcast(new BoardListUpdated($boardList, $request->user(), 'renamed'))->toOthers();

        // Return JSON response for AJAX calls (Inertia)
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'List updated successfully.',
                'list' => $boardList
            ]);
        }

        return Redirect::back()->with('success', 'List updated successfully.');
    }
    
    /**
     * Remove the specified board list.
     */
    public function destroy(Request $request, BoardList $boardList)
    {
        $this->authorize('delete', $boardList);
        
        // Store IDs before deletion for broadcasting
        $boardId = $boardList->board_id;
        $listId = $boardList->id;
        
        $boardList->delete();
        
        // Broadcast board list deleted event for real-time updates
        broadcast(new BoardListDeleted($listId, $boardId, $request->user()))->toOthers();
        
        return Redirect::back()->with('success', 'List deleted successfully.');
    }
    
    /**
     * Update the order of multiple board lists.
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'lists' => 'required|array',
            'lists.*.id' => 'required|integer|exists:board_lists,id',
            'lists.*.order' => 'required|integer|min:0',
        ]);
        
        // Use a database transaction to ensure all updates succeed or fail together
        DB::beginTransaction();
        
        try {
            foreach ($validated['lists'] as $listData) {
                $boardList = BoardList::findOrFail($listData['id']);
                
                // Authorize the update for each list
                $this->authorize('update', $boardList);
                
                // Update the order
                $boardList->update(['order' => $listData['order']]);
            }
            
            DB::commit();
            
            // Broadcast board list reordered event for real-time updates
            $firstList = BoardList::find($validated['lists'][0]['id']);
            broadcast(new BoardListReordered($validated['lists'], $firstList->board_id, $request->user()))->toOthers();
            
            return Redirect::back()->with('success', 'List order updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return Redirect::back()->with('error', 'Failed to update list order: ' . $e->getMessage());
        }
    }
}