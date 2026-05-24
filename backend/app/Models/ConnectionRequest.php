<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConnectionRequest extends Model
{
    protected $fillable = ['sender_id', 'receiver_id', 'status'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id')->with(['student', 'alumni', 'skills']);
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id')->with(['student', 'alumni', 'skills']);
    }
}
