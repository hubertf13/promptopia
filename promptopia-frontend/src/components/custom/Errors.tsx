export function Errors({ error }: { readonly error: String }) {
    if (!error) return null;
    return <div className="font-medium text-destructive text-md italic pt-3 text-center">{error + "!"}</div>;
}