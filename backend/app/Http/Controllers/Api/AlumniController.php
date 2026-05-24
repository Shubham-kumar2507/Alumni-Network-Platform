<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AlumniController extends Controller
{
    // List alumni with search & filter
    public function index(Request $request)
    {
        $query = User::where('role', 'alumni')
            ->where('is_active', true)
            ->with(['alumni', 'skills']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('alumni', fn($q2) => $q2
                      ->where('company', 'like', "%{$search}%")
                      ->orWhere('job_role', 'like', "%{$search}%")
                  );
            });
        }

        if ($request->filled('company')) {
            $query->whereHas('alumni', fn($q) => $q->where('company', 'like', "%{$request->company}%"));
        }

        if ($request->filled('job_role')) {
            $query->whereHas('alumni', fn($q) => $q->where('job_role', 'like', "%{$request->job_role}%"));
        }

        if ($request->filled('industry')) {
            $query->whereHas('alumni', fn($q) => $q->where('industry', $request->industry));
        }

        if ($request->filled('graduation_year')) {
            $query->whereHas('alumni', fn($q) => $q->where('graduation_year', $request->graduation_year));
        }

        if ($request->filled('skill')) {
            $query->whereHas('skills', fn($q) => $q->where('name', 'like', "%{$request->skill}%"));
        }

        if ($request->boolean('mentor_only')) {
            $query->whereHas('alumni', fn($q) => $q->where('is_mentor', true));
        }

        $alumni = $query->paginate(12);

        return response()->json($alumni);
    }

    // View a single alumni profile
    public function show(int $id)
    {
        $alumni = User::where('role', 'alumni')
            ->with(['alumni', 'skills'])
            ->findOrFail($id);

        return response()->json(['data' => $alumni]);
    }

    // Recommend mentors for a student (skill-matched)
    public function recommendMentors(Request $request)
    {
        $user = $request->user();
        $skillIds = $user->skills->pluck('id');

        $mentors = User::where('role', 'alumni')
            ->where('is_active', true)
            ->whereHas('alumni', fn($q) => $q->where('is_mentor', true))
            ->when($skillIds->isNotEmpty(), fn($q) =>
                $q->whereHas('skills', fn($sq) => $sq->whereIn('skill_id', $skillIds))
            )
            ->with(['alumni', 'skills'])
            ->limit(6)
            ->get();

        return response()->json($mentors);
    }
}
