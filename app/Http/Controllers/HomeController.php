<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $projects = Project::query()
            ->select(['id', 'user_id', 'category_id', 'name', 'description', 'image',])
            ->with(['positions', 'user'])
            ->paginate(10);

        return Inertia::render('User/Home', [
            'projects' => $projects
        ]);
    }
}
