<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'alumni_id', 'title', 'description', 'event_date',
        'location', 'type', 'category', 'image', 'registration_link'
    ];

    protected $casts = ['event_date' => 'datetime'];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'alumni_id')->with('alumni');
    }
}
