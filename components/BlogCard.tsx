"use client";

type BlogCardProps = {
  tag: string;
  title: string;
  excerpt: string;
  meta: string;
  href: string;
};

export function BlogCard({ tag, title, excerpt, meta, href }: BlogCardProps) {
  return (
    <article className="group rounded-3xl bg-[#FBF3E7] border border-black/5
                        shadow-elev-1 p-6
                        transition-all duration-300 hover:shadow-elev-2">
      <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[12px] font-semibold
                       bg-white/85 text-neutral-900 ring-1 ring-black/10 backdrop-blur">
        {tag}
      </span>

      <h3 className="mt-4 text-[22px] leading-snug font-semibold text-neutral-900
                     group-hover:text-[#E44B22] transition-colors">
        {title}
      </h3>

      <p className="mt-2 text-neutral-700/90">{excerpt}</p>

      <div className="mt-5 flex items-center justify-between text-sm text-neutral-700/80">
        <span>{meta}</span>
        <a href={href} className="inline-flex items-center gap-1 font-medium text-neutral-800 hover:text-neutral-900 underline underline-offset-4 transition-colors">
          Read More →
        </a>
      </div>
    </article>
  );
}
