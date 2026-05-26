<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->with('user');

        if ($request->query('owner') || $request->query('my_listings')) {
            $query->where('user_id', $request->user()->id);
        }

        if ($q = $request->query('search')) {
            $query->where(function($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('farm_name', 'like', "%{$q}%");
            });
        }

        if ($tag = $request->query('tag')) {
            $query->where('tag', '=', $tag);
        }

        $products = $query->latest()->get()->map(fn(Product $p) => $this->presentProduct($p));

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'farm_name' => ['nullable', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
            'tag' => ['nullable', 'string', 'max:30'],
            'image_url' => ['nullable', 'string', 'url'],
        ]);

        $product = Product::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'farm_name' => $validated['farm_name'] ?? $user->name . ' Farm',
            'price' => (int) $validated['price'],
            'unit' => $validated['unit'],
            'description' => $validated['description'] ?? null,
            'tag' => $validated['tag'] ?? 'Fresh',
            'image_url' => $validated['image_url'] ?? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
        ]);

        return response()->json([
            'success' => true,
            'data' => $this->presentProduct($product)
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::with('user')->findOrFail($id);

        return response()->json($this->presentProduct($product));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        if ($product->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'farm_name' => ['nullable', 'string', 'max:100'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'unit' => ['sometimes', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
            'tag' => ['nullable', 'string', 'max:30'],
            'image_url' => ['nullable', 'string', 'url'],
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'data' => $this->presentProduct($product->fresh('user'))
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        if ($product->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $product->delete();

        return response()->json(['success' => true, 'deleted' => true]);
    }

    private function presentProduct(Product $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'farm' => $p->farm_name ?? ($p->user?->name ?? 'AgriPool Farm'),
            'price' => $p->price,
            'unit' => $p->unit,
            'tag' => $p->tag ?? 'Fresh',
            'desc' => $p->description ?? 'No description provided.',
            'image' => $p->image_url ?? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
            'farmer' => [
                'id' => $p->user_id,
                'name' => $p->user?->name ?? 'Farmer',
                'avatar' => $p->user?->avatar ? (str_starts_with($p->user->avatar, 'http') ? $p->user->avatar : asset('storage/' . $p->user->avatar)) : null,
            ]
        ];
    }
}
