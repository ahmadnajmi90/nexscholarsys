import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Edit({ postGrant }) {
    const { data, setData, put, processing, errors } = useForm({
        title: postGrant.title,
        description: postGrant.description,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('post-grants.update', postGrant.id));
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} />
                {errors.title && <div>{errors.title}</div>}
            </div>
            <div>
                <label>Description</label>
                <textarea value={data.description} onChange={e => setData('description', e.target.value)} />
                {errors.description && <div>{errors.description}</div>}
            </div>
            <button type="submit" disabled={processing}>Update Grant</button>
        </form>
    );
}
