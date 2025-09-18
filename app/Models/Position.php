<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'responsibility',
    ];

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_position_list');
    }
}
