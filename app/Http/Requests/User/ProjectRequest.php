<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ubah ke true agar request diizinkan (biasanya auth sudah dihandle middleware)
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
            'name' => ['required', 'string', 'max:255'],

            // Validasi category_id: Wajib diisi, harus angka, dan harus ada di tabel categories kolom id
            'category_id' => ['required', 'integer', 'exists:categories,id'],

            'description' => ['nullable', 'string'],

            // Validasi image: Boleh kosong (nullable), harus berupa gambar, format tertentu, max 2MB
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    /**
     * Custom pesan error (Opsional, agar pesan lebih user friendly)
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama project wajib diisi.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'category_id.required' => 'Silakan pilih kategori project.',
            'description.required' => 'Deskripsi project wajib diisi.',
            'image.image' => 'File harus berupa gambar.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}
