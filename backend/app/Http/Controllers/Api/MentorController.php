<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MentorRequest;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    // Send mentor request (student → alumni)
    public function send(Request $request)
    {
        $data = $request->validate([
            'alumni_id' => 'required|integer|exists:users,id',
            'message'   => 'nullable|string|max:500',
        ]);
        $alumniId = $data['alumni_id'];

        $existing = MentorRequest::where('student_id', $request->user()->id)
            ->where('alumni_id', $alumniId)
            ->whereIn('status', ['pending', 'accepted'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Request already exists.', 'status' => $existing->status], 409);
        }

        $mr = MentorRequest::create([
            'student_id' => $request->user()->id,
            'alumni_id'  => $alumniId,
            'message'    => $data['message'] ?? null,
            'status'     => 'pending',
        ]);

        return response()->json($mr->load(['student', 'alumni']), 201);
    }

    // Student: withdraw/cancel a pending mentor request
    public function withdraw(Request $request, int $id)
    {
        $mr = MentorRequest::where('id', $id)
            ->where('student_id', $request->user()->id)
            ->firstOrFail();

        $mr->delete();
        return response()->json(['message' => 'Mentor request withdrawn.']);
    }

    // Alumni: end/remove an active mentorship
    public function removeMentee(Request $request, int $id)
    {
        $mr = MentorRequest::where('id', $id)
            ->where('alumni_id', $request->user()->id)
            ->firstOrFail();

        $mr->delete();
        return response()->json(['message' => 'Mentorship ended.']);
    }

    // Accept (alumni)
    public function accept(Request $request, int $id)
    {
        $mr = MentorRequest::where('id', $id)
            ->where('alumni_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $mr->update(['status' => 'accepted']);
        return response()->json($mr->load(['student', 'alumni']));
    }

    // Reject (alumni)
    public function reject(Request $request, int $id)
    {
        $mr = MentorRequest::where('id', $id)
            ->where('alumni_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $mr->update(['status' => 'rejected']);
        return response()->json(['message' => 'Request rejected.']);
    }

    // Student: my mentor requests
    public function myRequests(Request $request)
    {
        $requests = MentorRequest::where('student_id', $request->user()->id)
            ->with(['alumni' => fn($q) => $q->with(['alumni', 'skills'])])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $requests]);
    }

    // Alumni: incoming requests
    public function incomingRequests(Request $request)
    {
        $requests = MentorRequest::where('alumni_id', $request->user()->id)
            ->with(['student'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    // Alumni: all mentee requests (pending + accepted)
    public function mentees(Request $request)
    {
        $requests = MentorRequest::where('alumni_id', $request->user()->id)
            ->with(['student' => fn($q) => $q->with(['student'])])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $requests]);
    }
}
