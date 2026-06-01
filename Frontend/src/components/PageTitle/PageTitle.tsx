export default function PageTitle({ title,  }: { title: string }) {
  return (
   <div className="flex justify-center md:justify-start">
        <h1 className="header font-semibold text-[40px] md:text-[58px] text-center tracking-[0.8px] align-middle uppercase">
            {title}
        </h1>
      </div>
  )
}
