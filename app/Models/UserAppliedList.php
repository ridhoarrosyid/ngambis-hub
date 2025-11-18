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
        'position_id',
        'status',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id');
    }
}
