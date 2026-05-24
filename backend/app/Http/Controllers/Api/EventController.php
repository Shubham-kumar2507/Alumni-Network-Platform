<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $events = Event::with('organizer')->orderBy('event_date', 'asc')
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->paginate(12);
        return response()->json($events);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'             => 'required|string|max:255',
            'description'       => 'nullable|string',
            'event_date'        => 'required|date',
            'location'          => 'nullable|string|max:255',
            'type'              => 'required|string|in:webinar,workshop,meetup,networking,job_fair,seminar,internship,job,other',
            'category'          => 'nullable|string|in:internship,full_time,part_time,contract,volunteer,other',
            'registration_link' => 'nullable|string|max:500',
        ]);
        $event = Event::create(array_merge($data, ['alumni_id' => $request->user()->id]));
        return response()->json(['data' => $event->load('organizer')], 201);
    }

    public function update(Request $request, int $id)
    {
        $event = Event::where('id', $id)->where('alumni_id', $request->user()->id)->firstOrFail();
        $data = $request->validate([
            'title'             => 'sometimes|string|max:255',
            'description'       => 'nullable|string',
            'event_date'        => 'sometimes|date',
            'location'          => 'nullable|string|max:255',
            'type'              => 'sometimes|string|in:webinar,workshop,meetup,networking,job_fair,seminar,internship,job,other',
            'category'          => 'nullable|string|in:internship,full_time,part_time,contract,volunteer,other',
            'registration_link' => 'nullable|string|max:500',
        ]);
        $event->update($data);
        return response()->json(['data' => $event->load('organizer')]);
    }

    public function destroy(Request $request, int $id)
    {
        Event::where('id', $id)->where('alumni_id', $request->user()->id)->firstOrFail()->delete();
        return response()->json(['message' => 'Event deleted.']);
    }

    public function show(int $id)
    {
        return response()->json(Event::with('organizer')->findOrFail($id));
    }
}
