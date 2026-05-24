<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // Get student profile
    public function getStudent(Request $request)
    {
        $user = $request->user();
        return response()->json(['data' => $user->load(['student', 'skills'])]);
    }

    // Get alumni profile
    public function getAlumni(Request $request)
    {
        $user = $request->user();
        return response()->json(['data' => $user->load(['alumni', 'skills'])]);
    }

    // Student profile update
    public function updateStudent(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name'            => 'sometimes|string|max:255',
            'branch'          => 'sometimes|string|max:100',
            'college'         => 'sometimes|string|max:255',
            'graduation_year' => 'sometimes|nullable|digits:4|integer',
            'bio'             => 'sometimes|nullable|string|max:1000',
            'linkedin'        => 'sometimes|nullable|string|max:255',
            'github'          => 'sometimes|nullable|string|max:255',
            'phone'           => 'sometimes|nullable|string|max:20',
        ]);

        if (isset($data['name'])) {
            $user->update(['name' => $data['name']]);
            unset($data['name']);
        }

        $user->student()->updateOrCreate(
            ['user_id' => $user->id],
            array_filter($data, fn($v) => $v !== null && $v !== '')
        );

        return response()->json(['data' => $user->fresh()->load(['student', 'skills'])]);
    }

    // Alumni profile update
    public function updateAlumni(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'company'          => 'sometimes|nullable|string|max:255',
            'job_role'         => 'sometimes|nullable|string|max:255',
            'industry'         => 'sometimes|nullable|string|max:100',
            'experience_years' => 'sometimes|nullable|integer|min:0|max:50',
            'bio'              => 'sometimes|nullable|string|max:1000',
            'linkedin'         => 'sometimes|nullable|string|max:255',
            'github'           => 'sometimes|nullable|string|max:255',
            'is_mentor'        => 'sometimes|boolean',
            'graduation_year'  => 'sometimes|nullable|digits:4|integer',
            'college'          => 'sometimes|nullable|string|max:255',
            'branch'           => 'sometimes|nullable|string|max:100',
            'phone'            => 'sometimes|nullable|string|max:20',
        ]);

        if (isset($data['name'])) {
            $user->update(['name' => $data['name']]);
            unset($data['name']);
        }

        $user->alumni()->updateOrCreate(
            ['user_id' => $user->id],
            array_filter($data, fn($v) => $v !== null && $v !== '')
        );

        return response()->json(['data' => $user->fresh()->load(['alumni', 'skills'])]);
    }

    // Avatar upload
    public function uploadAvatar(Request $request)
    {
        $request->validate(['avatar' => 'required|image|max:2048']);

        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'avatar_url' => asset('storage/' . $path),
            'message'    => 'Avatar updated.',
        ]);
    }

    // Resume upload (students only)
    public function uploadResume(Request $request)
    {
        $request->validate(['resume' => 'required|mimes:pdf,doc,docx|max:5120']);

        $user = $request->user();

        if ($user->student && $user->student->resume_path) {
            Storage::disk('public')->delete($user->student->resume_path);
        }

        $path = $request->file('resume')->store('resumes', 'public');
        $user->student()->update(['resume_path' => $path]);

        return response()->json([
            'resume_url' => asset('storage/' . $path),
            'message'    => 'Resume uploaded.',
        ]);
    }

    // Sync skills
    public function syncSkills(Request $request)
    {
        $request->validate(['skills' => 'required|array', 'skills.*' => 'string|max:50']);

        $user = $request->user();
        $skillIds = collect($request->skills)->map(function ($name) {
            return Skill::firstOrCreate(['name' => trim($name)])->id;
        });

        $user->skills()->sync($skillIds);

        return response()->json($user->fresh()->load('skills'));
    }

    // Get all available skills (autocomplete)
    public function allSkills()
    {
        return response()->json(Skill::orderBy('name')->get());
    }
}
