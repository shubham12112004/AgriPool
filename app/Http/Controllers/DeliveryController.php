<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DeliveryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_if($user->role !== 'farmer', 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'pickup_location' => ['required', 'string', 'max:255'],
            'dropoff_location' => ['required', 'string', 'max:255'],
        ]);

        Delivery::create([
            'farmer_id' => $user->id,
            'title' => $validated['title'],
            'pickup_location' => $validated['pickup_location'],
            'dropoff_location' => $validated['dropoff_location'],
            'status' => 'pending',
        ]);

        return redirect()->route('dashboard.farmer')->with('status', 'Delivery request created.');
    }

    public function claim(Request $request, Delivery $delivery): RedirectResponse
    {
        $user = $request->user();
        abort_if($user->role !== 'driver', 403);

        if ($delivery->driver_id !== null && $delivery->driver_id !== $user->id) {
            return back()->withErrors([
                'claim' => 'This delivery is already claimed by another driver.',
            ]);
        }

        if ($delivery->status === 'completed') {
            return back()->withErrors([
                'claim' => 'Completed deliveries cannot be claimed.',
            ]);
        }

        $delivery->driver_id = $user->id;
        $delivery->status = $delivery->status === 'pending' ? 'assigned' : $delivery->status;
        $delivery->save();

        return redirect()->route('dashboard.driver')->with('status', 'Delivery claimed.');
    }

    public function updateStatus(Request $request, Delivery $delivery): RedirectResponse
    {
        $user = $request->user();
        abort_if($user->role !== 'driver', 403);
        abort_if($delivery->driver_id !== $user->id, 403);

        $validated = $request->validate([
            'status' => ['required', Rule::in(['assigned', 'in_transit', 'completed'])],
        ]);

        $delivery->status = $validated['status'];
        $delivery->save();

        return redirect()->route('dashboard.driver')->with('status', 'Delivery status updated.');
    }

    public function destroy(Request $request, Delivery $delivery): RedirectResponse
    {
        $user = $request->user();

        $canDelete = ($user->role === 'farmer' && $delivery->farmer_id === $user->id)
            || ($user->role === 'driver' && $delivery->driver_id === $user->id);

        abort_if(! $canDelete, 403);

        $delivery->delete();

        return redirect()->route($user->role === 'farmer' ? 'dashboard.farmer' : 'dashboard.driver')
            ->with('status', 'Delivery deleted.');
    }
}
