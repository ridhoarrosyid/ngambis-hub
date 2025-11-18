<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class PositionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'name' => ['required', 'string', 'max:255'],
            'responsibility' => ['required', 'string', 'min:10'], // Minimal 10 karakter agar deskriptif
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => 'ID Project tidak ditemukan.',
            'project_id.exists' => 'Project yang dipilih tidak valid.',
            'name.required' => 'Nama posisi wajib diisi.',
            'responsibility.required' => 'Tanggung jawab wajib diisi.',
            'responsibility.min' => 'Deskripsi tanggung jawab terlalu pendek (min. 10 karakter).',
        ];
    }
}
