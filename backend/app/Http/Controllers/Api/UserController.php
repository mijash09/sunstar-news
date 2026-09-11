<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Users", description: "User & Staff Management Endpoints")]
class UserController extends Controller
{
    #[OA\Get(
        path: "/api/users",
        summary: "List all staff users",
        tags: ["Users"],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of users",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(type: "object"))
                    ]
                )
            )
        ]
    )]
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    #[OA\Post(
        path: "/api/users",
        summary: "Create new staff user",
        tags: ["Users"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "name", type: "string", example: "नयाँ कर्मचारी"),
                        new OA\Property(property: "email", type: "string", example: "staff@sunstar.com"),
                        new OA\Property(property: "password", type: "string", example: "password"),
                        new OA\Property(property: "role", type: "string", example: "EDITOR"),
                        new OA\Property(property: "avatarFiles", type: "array", items: new OA\Items(type: "string", format: "binary")),
                        new OA\Property(property: "avatar", type: "string", example: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100")
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "User created successfully")
        ]
    )]
    public function store(Request $request)
    {
        $email = strtolower(trim($request->input('email', '')));
        $name = trim($request->input('name', ''));
        $password = $request->input('password', 'password');
        $role = $request->input('role', 'EDITOR');
        $username = $request->input('username') ?: explode('@', $email)[0];

        if (empty($email) || empty($name)) {
            return response()->json(['success' => false, 'error' => 'नाम र इमेल आवश्यक छ'], 422);
        }

        if (User::where('email', $email)->exists()) {
            return response()->json(['success' => false, 'error' => 'यो इमेल पहिल्यै प्रयोगमा छ'], 422);
        }

        $avatar = $request->input('avatar') ?: '';

        if ($request->hasFile('avatarFiles')) {
            $files = $request->file('avatarFiles');
            $file = is_array($files) ? $files[0] : $files;
            if ($file && $file->isValid()) {
                $ext = $file->getClientOriginalExtension() ?: 'jpg';
                $cleanName = Str::random(24) . '.' . $ext;
                $path = $file->storeAs('uploads', $cleanName, 'public');
                $avatar = '/storage/' . $path;
            }
        } elseif ($request->hasFile('avatarFile') || $request->hasFile('file') || $request->hasFile('image')) {
            $file = $request->file('avatarFile') ?: ($request->file('file') ?: $request->file('image'));
            if ($file && $file->isValid()) {
                $ext = $file->getClientOriginalExtension() ?: 'jpg';
                $cleanName = Str::random(24) . '.' . $ext;
                $path = $file->storeAs('uploads', $cleanName, 'public');
                $avatar = '/storage/' . $path;
            }
        }

        if (empty($avatar)) {
            $avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
        }

        $user = User::create([
            'name' => $name,
            'username' => $username,
            'email' => $email,
            'password' => bcrypt($password),
            'role' => $role,
            'avatar' => $avatar,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'नयाँ कर्मचारी प्रयोगकर्ता सिर्जना गरियो!',
            'data' => $user,
        ], 201);
    }

    #[OA\Put(
        path: "/api/users/{id}",
        summary: "Update staff user role or profile",
        tags: ["Users"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "User ID", schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "role", type: "string", example: "ADMIN"),
                    new OA\Property(property: "avatar", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "User updated")
        ]
    )]
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'error' => 'प्रयोगकर्ता फेला परेन'], 404);
        }

        if ($request->filled('role')) $user->role = $request->input('role');
        if ($request->filled('name')) $user->name = $request->input('name');
        if ($request->filled('avatar')) $user->avatar = $request->input('avatar');

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'कर्मचारी विवरण अद्यावधिक भयो!',
            'data' => $user,
        ]);
    }

    #[OA\Delete(
        path: "/api/users/{id}",
        summary: "Delete staff user",
        tags: ["Users"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "User ID", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "User deleted")
        ]
    )]
    public function destroy($id)
    {
        $deleted = User::where('id', $id)->delete();
        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'कर्मचारी खाता हटाइयो!']);
        }
        return response()->json(['success' => false, 'error' => 'प्रयोगकर्ता भेटिएन'], 404);
    }
}
