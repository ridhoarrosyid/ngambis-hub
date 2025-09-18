<?php

namespace App\Models;

use App\Enum\AppliedStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAppliedList extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_position_id',
        'user_id',
        'status',
    ];

    protected $casts = [
        'status' => AppliedStatus::class,
    ];

    public function projectPosition()
    {
        return $this->belongsTo(ProjectPositionList::class, 'project_position_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
