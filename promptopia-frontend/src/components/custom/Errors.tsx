export function Errors({ error }: { readonly error: String }) {
    if (!error) return null;
    return <div className="text-pink-500 text-md italic py-2">{error}</div>;
}