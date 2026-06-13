export function TeamFlag({ src, alt }: { src?: string | null; alt: string }) {
	if (!src) {
		return (
			<span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-xs text-muted-foreground">
				?
			</span>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			className="size-8 rounded-full object-cover ring-1 ring-white/15 sm:size-9"
			loading="lazy"/>
	);
}