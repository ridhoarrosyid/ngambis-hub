<?php

namespace App\Models;

use App\Enum\AppliedStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAppliedList extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'position_id',
        'status',
    ];

    protected $casts = [
        'status' => AppliedStatus::class
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }
}
