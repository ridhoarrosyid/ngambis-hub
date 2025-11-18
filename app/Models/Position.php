<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'responsibility',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function userAppliedList()
    {
        return $this->hasMany(UserAppliedList::class, 'position_id');
    }

    public function currentApplication(): HasOne
    {
        return $this->hasOne(UserAppliedList::class)
            ->where('user_id', Auth::id());
    }
}
