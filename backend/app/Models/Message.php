<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['chat_id', 'sender_id', 'body', 'is_read'];

    protected $casts = ['is_read' => 'boolean'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }
}
