import { cn } from '@/lib/utils';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
    className?: string;
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
    return (
        <div
            className={cn(
                'relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100',
                className
            )}
        >
            {src ? (
                <img
                    className="aspect-square h-full w-full object-cover"
                    src={src}
                    alt={alt || 'Avatar'}
                />
            ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-500">
                    {fallback}
                </span>
            )}
        </div>
    );
}
