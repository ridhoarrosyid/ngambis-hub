<?php

namespace App\Enum;

enum ProjectStatus: string
{
    case DRAFT = 'draft';
    case PUBLISH = 'publish';
    public static function options(): array
    {
        return collect(self::cases())->map(fn($item) => [
            'label' => $item->name,
            'value' => $item->value
        ])->values()->toArray();
    }
}
