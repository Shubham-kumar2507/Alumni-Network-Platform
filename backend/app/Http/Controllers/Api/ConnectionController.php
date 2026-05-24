<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConnectionRequest;
use Illuminate\Http\Request;

class ConnectionController extends Controller
{
    // Send connection request
    public function send(Request $request)
    {
        $data = $request->validate(['receiver_id' => 'required|integer|exists:users,id']);
        $user = $request->user();
        $receiverId = $data['receiver_id'];

        if ($user->id === $receiverId) {
            return response()->json(['message' => 'Cannot connect to yourself.'], 422);
        }

        $existing = ConnectionRequest::where(function ($q) use ($user, $receiverId) {
            $q->where('sender_id', $user->id)->where('receiver_id', $receiverId);
        })->orWhere(function ($q) use ($user, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $user->id);
        })->first();

        if ($existing) {
            return response()->json(['message' => 'Request already exists.', 'status' => $existing->status], 409);
        }

        $conn = ConnectionRequest::create([
            'sender_id'   => $user->id,
            'receiver_id' => $receiverId,
            'status'      => 'pending',
        ]);

        return response()->json($conn->load(['sender', 'receiver']), 201);
    }

    // Cancel sent request (pending only)
    public function cancel(Request $request, int $id)
    {
        $conn = ConnectionRequest::where('id', $id)
            ->where('sender_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $conn->delete();
        return response()->json(['message' => 'Request cancelled.']);
    }

    // Disconnect — remove an accepted connection (either party can do this)
    public function disconnect(Request $request, int $id)
    {
        $userId = $request->user()->id;
        $conn = ConnectionRequest::where('id', $id)
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            })
            ->firstOrFail();

        $conn->delete();
        return response()->json(['message' => 'Disconnected successfully.']);
    }

    // Accept request
    public function accept(Request $request, int $id)
    {
        $conn = ConnectionRequest::where('id', $id)
            ->where('receiver_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $conn->update(['status' => 'accepted']);
        return response()->json($conn->load(['sender', 'receiver']));
    }

    // Reject request
    public function reject(Request $request, int $id)
    {
        $conn = ConnectionRequest::where('id', $id)
            ->where('receiver_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $conn->update(['status' => 'rejected']);
        return response()->json(['message' => 'Request rejected.']);
    }

    // My connections (all pending + accepted, with other_user & is_received)
    public function myConnections(Request $request)
    {
        $userId = $request->user()->id;

        $connections = ConnectionRequest::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with([
                'sender' => fn($q) => $q->with(['student', 'alumni', 'skills']),
                'receiver' => fn($q) => $q->with(['student', 'alumni', 'skills']),
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($conn) use ($userId) {
                $isReceived = $conn->receiver_id === $userId;
                $other = $isReceived ? $conn->sender : $conn->receiver;
                return array_merge($conn->toArray(), [
                    'is_received' => $isReceived,
                    'other_user'  => $other,
                ]);
            });

        return response()->json(['data' => $connections]);
    }

    // Pending incoming requests
    public function pending(Request $request)
    {
        $requests = ConnectionRequest::where('receiver_id', $request->user()->id)
            ->where('status', 'pending')
            ->with(['sender'])
            ->get();

        return response()->json($requests);
    }

    // Sent requests
    public function sent(Request $request)
    {
        $requests = ConnectionRequest::where('sender_id', $request->user()->id)
            ->where('status', 'pending')
            ->with(['receiver'])
            ->get();

        return response()->json($requests);
    }

    // Connection status with a specific user
    public function status(Request $request, int $userId)
    {
        $myId = $request->user()->id;

        $conn = ConnectionRequest::where(function ($q) use ($myId, $userId) {
            $q->where('sender_id', $myId)->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($myId, $userId) {
            $q->where('sender_id', $userId)->where('receiver_id', $myId);
        })->first();

        return response()->json([
            'status'     => $conn?->status ?? 'none',
            'is_sender'  => $conn?->sender_id === $myId,
            'request_id' => $conn?->id,
        ]);
    }
}
