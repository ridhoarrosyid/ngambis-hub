<?php

namespace App\Models;

use App\Enum\ProjectStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'description',
        'image',
        'status'
    ];

    protected $casts = [
        'status' => ProjectStatus::class
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function userAppliedLists()
    {
        return $this->hasMany(UserAppliedList::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
