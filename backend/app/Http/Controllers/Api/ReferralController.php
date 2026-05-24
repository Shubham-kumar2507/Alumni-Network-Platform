<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    // Student OR Alumni: list referrals (based on role)
    public function myReferrals(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'student') {
            $referrals = Referral::where('student_id', $user->id)
                ->with(['alumni' => fn($q) => $q->with(['alumni'])])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $referrals = Referral::where('alumni_id', $user->id)
                ->with(['student' => fn($q) => $q->with(['student'])])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json(['data' => $referrals]);
    }

    // Student: send referral request (alumni_id from body)
    public function send(Request $request)
    {
        $data = $request->validate([
            'alumni_id' => 'required|integer|exists:users,id',
            'job_title' => 'required|string|max:255',
            'company'   => 'sometimes|string|max:255',
            'message'   => 'nullable|string|max:1000',
        ]);

        $referral = Referral::create([
            'student_id' => $request->user()->id,
            'alumni_id'  => $data['alumni_id'],
            'job_title'  => $data['job_title'],
            'company'    => $data['company'] ?? '',
            'message'    => $data['message'] ?? null,
            'status'     => 'pending',
        ]);

        return response()->json($referral->load(['student', 'alumni']), 201);
    }

    // Alumni: accept referral
    public function accept(Request $request, int $id)
    {
        $data = $request->validate(['comments' => 'nullable|string|max:1000']);

        $referral = Referral::where('id', $id)
            ->where('alumni_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $referral->update(['status' => 'accepted', 'comments' => $data['comments'] ?? null]);
        return response()->json($referral->load(['student', 'alumni']));
    }

    // Alumni: reject referral
    public function reject(Request $request, int $id)
    {
        $data = $request->validate(['comments' => 'nullable|string|max:500']);

        $referral = Referral::where('id', $id)
            ->where('alumni_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $referral->update(['status' => 'rejected', 'comments' => $data['comments'] ?? null]);
        return response()->json(['message' => 'Referral rejected.']);
    }
}
