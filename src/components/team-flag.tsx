type TeamFlagProps = {
	src?: string | null;
	alt: string;
	className?: string;
};

export function TeamFlag({ src, alt, className = "" }: TeamFlagProps) {
	if (!src) {
		return (
			<span className={`flex size-8 items-center justify-center rounded-full bg-white/10 text-xs text-muted-foreground ${className}`}>
				?
			</span>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			className={`size-8 rounded-full object-cover ring-1 ring-white/15 sm:size-9 ${className}`}
			loading="lazy"/>
	);
}