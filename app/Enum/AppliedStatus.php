<?php

namespace App\Enum;

enum AppliedStatus: string
{
    case APPLIED = 'applied';
    case APPROVE = 'approve';

    public static function options(): array
    {
        return collect(self::cases())->map(fn($item) => [
            'value' => $item->value,
            'label' => $item->name
        ])->values()->toArray();
    }
}
