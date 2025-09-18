<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_position_id',
        'description',
    ];

    public function projectPosition()
    {
        return $this->belongsTo(ProjectPositionList::class, 'project_position_id');
    }
}
