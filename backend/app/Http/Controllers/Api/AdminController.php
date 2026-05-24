<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Event;
use App\Models\ConnectionRequest;
use App\Models\MentorRequest;
use App\Models\Referral;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users'       => User::count(),
            'students'    => User::where('role', 'student')->count(),
            'alumni'      => User::where('role', 'alumni')->count(),
            'connections' => ConnectionRequest::where('status', 'accepted')->count(),
            'mentors'     => MentorRequest::where('status', 'accepted')->count(),
            'referrals'   => Referral::count(),
            'events'      => Event::count(),
        ]);
    }

    public function users(Request $request)
    {
        $query = User::with(['student', 'alumni', 'skills']);
        if ($request->filled('role')) $query->where('role', $request->role);
        if ($request->filled('search')) {
            $query->where(fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"));
        }
        return response()->json($query->paginate(20));
    }

    public function toggleUser(int $id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);
        return response()->json(['message' => 'User status updated.', 'is_active' => $user->is_active]);
    }

    public function deleteUser(int $id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted.']);
    }

    public function events()
    {
        return response()->json(Event::with('organizer')->orderBy('event_date', 'desc')->paginate(20));
    }
}
