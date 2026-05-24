<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function chats(Request $request)
    {
        $userId = $request->user()->id;
        $chats = Chat::where('user1_id', $userId)->orWhere('user2_id', $userId)
            ->with(['user1', 'user2', 'latestMessage'])->get()
            ->map(function ($chat) use ($userId) {
                $other = $chat->user1_id === $userId ? $chat->user2 : $chat->user1;
                return [
                    'id'             => $chat->id,
                    'other_user'     => $other,
                    'latest_message' => $chat->latestMessage,
                    'last_message'   => $chat->latestMessage, // alias for frontend
                    'unread_count'   => $chat->messages()->where('sender_id', '!=', $userId)->where('is_read', false)->count(),
                    'updated_at'     => $chat->updated_at,
                ];
            })->sortByDesc('updated_at')->values();

        return response()->json(['data' => $chats]);
    }

    // Start or get existing chat — accepts user_id from request body
    public function getOrCreateChat(Request $request)
    {
        $data  = $request->validate(['user_id' => 'required|integer|exists:users,id']);
        $myId  = $request->user()->id;
        $otherId = $data['user_id'];

        $chat = Chat::where(fn($q) => $q->where('user1_id', $myId)->where('user2_id', $otherId))
            ->orWhere(fn($q) => $q->where('user1_id', $otherId)->where('user2_id', $myId))->first();

        if (!$chat) {
            $chat = Chat::create(['user1_id' => $myId, 'user2_id' => $otherId]);
        }

        return response()->json(['data' => $chat->load(['user1', 'user2'])]);
    }

    public function messages(Request $request, int $chatId)
    {
        $userId = $request->user()->id;
        // Verify user belongs to this chat
        $chat = Chat::where(function ($q) use ($userId) {
            $q->where('user1_id', $userId)->orWhere('user2_id', $userId);
        })->findOrFail($chatId);

        // Mark messages as read
        Message::where('chat_id', $chatId)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::where('chat_id', $chatId)
            ->with('sender:id,name,avatar,role')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $messages]);
    }

    public function send(Request $request, int $chatId)
    {
        $data   = $request->validate(['body' => 'required|string|max:2000']);
        $userId = $request->user()->id;

        // Verify user belongs to this chat
        $chat = Chat::where(function ($q) use ($userId) {
            $q->where('user1_id', $userId)->orWhere('user2_id', $userId);
        })->findOrFail($chatId);

        $message = Message::create([
            'chat_id'   => $chatId,
            'sender_id' => $userId,
            'body'      => $data['body'],
            'is_read'   => false,
        ]);
        $chat->touch();

        return response()->json(['data' => $message->load('sender:id,name,avatar,role')], 201);
    }
}
