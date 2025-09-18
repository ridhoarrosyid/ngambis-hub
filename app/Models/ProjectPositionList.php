<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectPositionList extends Pivot
{
    protected $table = 'project_position_list';
    public $timestamps = true;

    public function userAppliedLists()
    {
        return $this->hasMany(UserAppliedList::class, 'project_position_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_position_id');
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
